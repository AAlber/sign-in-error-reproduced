import { rest } from "msw";
import type { RatingSchemaWithValues } from "@/src/types/rating-schema.types";
import api from "../../src/pages/api/api";

export const handlers = [
  rest.get(api.getRatingSchemas, (_req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json<RatingSchemaWithValues[]>([
        {
          default: true,
          id: "id",
          institutionId: "instiId",
          name: "test_name",
          passPercentage: 1,
          values: [],
        },
      ]),
    ),
  ),
  rest.post("https://dev.fuxam.app/api/*", (_req, res, ctx) =>
    res(ctx.status(200)),
  ),
  rest.all("https://fuxam-r2-worker.alber.workers.dev/*", (_req, res, ctx) =>
    res(ctx.status(200)),
  ),
  rest.all("https://api.pinecone.io/*", (_req, res, ctx) =>
    res(ctx.status(200), ctx.json({})),
  ),
];
