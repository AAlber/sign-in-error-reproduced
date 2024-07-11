import { clerkClient } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const user = await clerkClient.users.createUser({
      emailAddress: [data.email],
      password: data.password,
    });

    res.send(user);
  }
}
