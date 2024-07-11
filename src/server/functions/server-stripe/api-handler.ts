import { getAuth } from "@clerk/nextjs/server";
import type { InstitutionStripeAccount } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { isEmptyObject } from "@/src/client-functions/client-utils";
import type { IncludeType } from "@/src/utils/stripe-types";
import { getCurrentInstitutionId } from "../server-user";
import { getStripeAccountIfAuthorized } from "./utils";

export type RequiredVars = (
  | "customerId"
  | "subscriptionId"
  | "institutionId"
)[];
export type APIHandlerProps<T> = {
  req: NextApiRequest;
  res: NextApiResponse;
  addBackendVars?: ("userId" | "institutionId")[];
  functionToRun: (stripeAccount: any, data?: T) => any;
  requiredVars: ("customerId" | "subscriptionId" | "institutionId")[];
  method: "POST" | "GET";
  include?: IncludeType;
  requiresStripeAccount?: boolean;
  canCreateNewStripeAccount?: boolean;
  errorMessage?: string;
};

export const stripeApiHandler = async <T>({
  req,
  res,
  functionToRun,
  requiredVars,
  method,
  errorMessage,
  addBackendVars = [],
  canCreateNewStripeAccount = false,
  requiresStripeAccount = true,
  include = [],
}: APIHandlerProps<T>) => {
  if (req.method === method) {
    const { userId } = getAuth(req);
    addGetMethodQueryParamsToBody(req, method);
    await addBackendVarsToReqBody(addBackendVars, req, userId as string);

    const data: T | undefined = req.body
      ? (JSON.parse(req.body) as T)
      : undefined;
    const { status, message, stripeAccount } =
      await getStripeAccountIfAuthorized({
        userId: userId as string,
        createNewStripeAccount: canCreateNewStripeAccount,
        include,
        req,
        res,
      });
    if (status || message) return res.status(status).json({ message });
    if (
      checkStripeAccountVarsExist(
        res,
        requiredVars,
        stripeAccount,
        requiresStripeAccount,
      ) === "all_passed"
    ) {
      await runMethod<T>({
        data,
        res,
        functionToRun,
        requiresStripeAccount,
        stripeAccount,
      });
    }
  } else return res.status(405).json({ error: "Method not allowed" });
};

export const runMethod = async <T>({
  data,
  res,
  functionToRun,
  requiresStripeAccount,
  stripeAccount,
}: {
  data: T | undefined;
  res: NextApiResponse;
  functionToRun: (stripeAccount: any, data?: T) => any;
  requiresStripeAccount: boolean;
  stripeAccount?: InstitutionStripeAccount | null;
}) => {
  try {
    return res.json(
      await runFunctionWithCorrectParams<T>({
        data,
        functionToRun,
        requiresStripeAccount,
        stripeAccount,
      }),
    );
  } catch (e) {
    const { message, status } = handleStripeError(e);
    return res.status(status).json({ message });
  }
};

export const runFunctionWithCorrectParams = async <T>({
  data,
  functionToRun,
  requiresStripeAccount,
  stripeAccount,
}: {
  data: T | undefined;
  functionToRun: (stripeAccount: any, data?: T) => any;
  requiresStripeAccount: boolean;
  stripeAccount?: InstitutionStripeAccount | null;
}) => {
  if (!stripeAccount && requiresStripeAccount)
    throw new Error("Stripe account not found but required");
  if (!requiresStripeAccount && data) return await functionToRun(data);
  if (stripeAccount && data) return await functionToRun(stripeAccount, data);
  if (stripeAccount && !data) return await functionToRun(stripeAccount);
};

export const addGetMethodQueryParamsToBody = (
  req: NextApiRequest,
  method: "POST" | "GET",
) => {
  if (method !== "GET" || isEmptyObject(req.query)) return;
  req.body = JSON.stringify(req.query);
};

export const addBackendVarsToReqBody = async (
  addBackendVars: ("userId" | "institutionId")[],
  req: NextApiRequest,
  userId: string,
) => {
  const reqBody =
    typeof req.body === "string" && !!req.body ? JSON.parse(req.body) : {};

  const updatedBody = {
    ...reqBody,
    ...(addBackendVars.includes("userId") && { userId }),
    ...(addBackendVars.includes("institutionId") && {
      institutionId: await getCurrentInstitutionId(userId),
    }),
  };
  req.body = JSON.stringify(updatedBody);
};

export const checkStripeAccountVarsExist = (
  res: NextApiResponse,
  requiredVars: RequiredVars,
  stripeAccount?: InstitutionStripeAccount | null,
  requiresStripeAccount?: boolean,
) => {
  if (!stripeAccount && requiresStripeAccount)
    return res.status(400).json({ message: "No stripe account." });
  if (!stripeAccount?.customerId && requiredVars.includes("customerId"))
    return res
      .status(400)
      .json({ message: "Required customer account not found." });
  if (!stripeAccount?.subscriptionId && requiredVars.includes("subscriptionId"))
    return res
      .status(400)
      .json({ message: "Required subscription not found." });
  if (!stripeAccount?.institutionId && requiredVars.includes("institutionId"))
    return res.status(400).json({
      message: "Required institutionId not found for payment provider.",
    });
  return "all_passed";
};

export const handleStripeError = (e: any) => {
  let statusText = "";
  let status = 500;
  switch (e.type) {
    case "StripeCardError":
      if (e.payment_intent.charges.data[0].outcome.type === "blocked") {
        statusText = "Payment blocked for suspected fraud.";
        status = 400;
      }
      break;
    case "StripeInvalidRequestError":
      status = 400;
      statusText = (e as Error).message;
      break;
    case "StripeRateLimitError":
      status = 429;
      statusText =
        "Too many requests were made to the Payment Provider too quickly. Please try again later.";
      break;
    case "StripeConnectionError":
      statusText =
        "There was an error connecting to the payment provider. If this issue persists, please contact support@fuxam.de";
      break;
    case "StripeAPIError":
      statusText =
        "There was an error connecting to the payment provider. If this issue persists, please contact support@fuxam.de";
      break;
    default:
      statusText = (e as Error).message;
      break;
  }
  return { message: statusText, status: status };
};
