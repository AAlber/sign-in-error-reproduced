import type { NextApiResponse } from "next";

export type AdminDashCreateInstitutionData = {
  adminDashPassword: string;
  userId: string;
};

export const canAccessAdminDashboard = (
  userId: string,
  adminDashPassword: string,
  res: NextApiResponse,
) => {
  if (adminDashPassword !== process.env.ADMIN_DASH_PASSWORD) {
    res.status(401).json({ message: "Unauthorized" });
    res.end();
  }

  if (!(process.env.ADMIN_DASH_IDS as string).split(",").includes(userId)) {
    res.status(401).json({ message: "Unauthorized" });
    res.end();
  }
};
