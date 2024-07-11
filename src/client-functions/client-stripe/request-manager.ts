import { toast } from "@/src/components/reusable/toaster/toast";

export const stripeReq = async <T>({
  data,
  route,
  errorMessage,
  method,
  alertError = false,
}: {
  data: T;
  route: string;
  errorMessage: string;
  alertError?: boolean;
  method: "GET" | "POST";
}) => {
  const body: T = { ...data };
  const response = await fetch(route, {
    method,
    ...(method === "POST" && { body: JSON.stringify(body) }),
  });

  const result = await response.json();
  return respondToStripeErrorOrReturnResult({
    response,
    result,
    errorTitle: errorMessage,
    alertError,
  });
};

export const respondToStripeErrorOrReturnResult = ({
  response,
  result,
  errorTitle,
  alertError,
}: {
  response: Response;
  result: any;
  errorTitle: string;
  alertError?: boolean;
}) => {
  if (!response.ok) {
    if (alertError) {
      toastStripeError({ errorMessage: result.message, title: errorTitle });
    }
    return;
  }
  return result;
};

export async function toastStripeError({
  icon,
  errorMessage,
  title,
}: {
  icon?: string;
  errorMessage: string;
  title: string;
}) {
  toast.error(title, {
    icon,
    description: errorMessage,
  });
}
