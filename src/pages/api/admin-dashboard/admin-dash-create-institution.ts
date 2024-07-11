import { getAuth } from "@clerk/nextjs/server";
import cuid from "cuid";
import type { NextApiRequest, NextApiResponse } from "next";
import createInstitution from "@/prisma/create-institution";
import { canAccessAdminDashboard } from "@/src/server/functions/server-admin-dashboard";
import { createSingleEmailInvite } from "@/src/server/functions/server-invite";
import type { CouponCreateData } from "@/src/utils/stripe-types";

export type AdminDashCreateInstitutionData = {
  adminDashPassword: string;
  email: string;
  name: string;
  amountOfSubscriptionMonths?: number;
  language: "en" | "de";
  aiCredits: number;
  gbPerUser: number;
  baseStorageGb: number;
  accessPassDiscount?: number;
  logoLink?: string;
  instiTheme?: string;
  mainSubCouponData?: CouponCreateData;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { userId } = getAuth(req);
      const {
        name,
        amountOfSubscriptionMonths,
        language,
        adminDashPassword,
        email,
        aiCredits,
        gbPerUser,
        baseStorageGb,
        accessPassDiscount,
        logoLink,
        instiTheme,
        mainSubCouponData,
      }: AdminDashCreateInstitutionData = JSON.parse(req.body);
      canAccessAdminDashboard(userId!, adminDashPassword, res);
      const result = await createInstitution({
        environment:
          process.env.SERVER_URL === "https://fuxam.app" ? "prod" : "dev",
        name,
        language,
        amountOfSubscriptionMonths,
        firstAdminEmail: email,
        aiCredits,
        gbPerUser,
        baseStorageGb,
        accessPassDiscount,
        logo: logoLink,
        theme: instiTheme,
        mainSubCouponData,
      });

      await createSingleEmailInvite({
        email: email,
        institutionId: result.institution.id,
        layerId: result.institution.id,
        role: "admin",
        token: cuid(),
        language,
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Failed to create Institution:" + (error as Error)?.message,
      });
    }
  }
}
