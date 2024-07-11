import type { ContentBlockRating } from "@prisma/client";
import { toast } from "../components/reusable/toaster/toast";
import api from "../pages/api/api";
import type {
  CreateContentBlockRating,
  DeleteContentBlockRating,
  GetContentBlockRating,
  UpdateContentBlockRating,
} from "../types/content-block-rating.types";
import { log } from "../utils/logger/logger";

export async function createContentBlockRating(data: CreateContentBlockRating) {
  return log.timespan("Create Content Block Rating", async () => {
    try {
      log.info("Creating a content block rating...");
      const response = await fetch(api.createContentBlockRating, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        log.response(response);
        toast.responseError({ response });
        return null;
      }

      const responseData = await response.json();
      log.info("Content block rating created successfully.");

      return responseData as Readonly<ContentBlockRating>;
    } catch (error) {
      log.error(error);
    }
  });
}

export async function updateContentBlockRating(data: UpdateContentBlockRating) {
  return log.timespan("Update Content Block Rating", async () => {
    try {
      log.info("Updating a content block rating...");
      const response = await fetch(api.updateContentBlockRating, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        log.response(response);
        toast.responseError({ response });
        return null;
      }

      const responseData = await response.json();
      log.info("Content block rating updated successfully.");
      return responseData as Readonly<ContentBlockRating>;
    } catch (error) {
      log.error(error);
    }
  });
}

export async function deleteContentBlockRating(data: DeleteContentBlockRating) {
  log.timespan("Delete Content Block Rating", async () => {
    try {
      log.info("Deleting a content block rating...");
      const response = await fetch(api.deleteContentBlockRating, {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        log.response(response);
        throw new Error(response.statusText);
      }
      log.info("Content block rating deleted successfully.");
      return await response.json();
    } catch (error) {
      log.error(error);
    }
  });
}

export async function getContentBlockRating(
  data: GetContentBlockRating,
): Promise<ContentBlockRating | null> {
  log.info("Get Content Block Rating", data);
  try {
    log.info("Getting a content block rating...");
    const response = await fetch(api.getContentBlockRating + `?id=${data.id}`, {
      method: "GET",
    });

    if (!response.ok) {
      log.response(response);
      throw new Error(response.statusText);
    }
    log.info("Content block rating retrieved successfully.");
    return await response.json();
  } catch (error) {
    log.error(error);
    return null;
  }
}
