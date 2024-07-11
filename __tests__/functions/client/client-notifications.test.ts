import type { Notification } from "@prisma/client";
import { rest } from "msw";
import { server } from "@/__tests__/msw/server";
import type { CountNotificationsResponse } from "@/src/client-functions/client-notifications";
import {
  countNotifications,
  getNotifications,
} from "@/src/client-functions/client-notifications";
import api from "@/src/pages/api/api";

describe("countNotifications", () => {
  it("Returns undefined", async () => {
    server.use(
      rest.get(api.countNotifications, (_, res, ctx) => {
        return res.once(ctx.status(500));
      }),
    );

    const data = await countNotifications();
    expect(data).toBeUndefined();
  });

  it("Returns correct data", async () => {
    const mockResponse: CountNotificationsResponse = {
      notifications: 1,
      unreadNotifications: 2,
    };

    server.use(
      rest.get(api.countNotifications, (_, res, ctx) => {
        return res.once(ctx.json<CountNotificationsResponse>(mockResponse));
      }),
    );

    const data = await countNotifications();
    expect(data).toBeDefined();
    expect(data).toMatchObject(mockResponse);
  });
});

describe("getNotifications", () => {
  it("Returns undefined", async () => {
    server.use(
      rest.get(api.getNotifications, (req, res, ctx) => {
        return res.once(ctx.status(500));
      }),
    );

    const data = await getNotifications();
    expect(data).toBeUndefined();
  });

  it("Returns successfully", async () => {
    const mockResponse = {
      userId: "randomId",
      createdAt: new Date(),
      data: {},
      id: "",
      read: false,
    };
    server.use(
      rest.get(api.getNotifications, (_, res, ctx) => {
        return res.once(ctx.json<Notification[]>([mockResponse]));
      }),
    );

    const data = await getNotifications();
    expect(data).toBeDefined();
    expect(data).toMatchObject([JSON.parse(JSON.stringify(mockResponse))]);
  });
});
