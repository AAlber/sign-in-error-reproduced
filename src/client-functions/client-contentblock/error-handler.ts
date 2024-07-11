import * as Sentry from "@sentry/browser";
import { toast } from "@/src/components/reusable/toaster/toast";
import { log } from "@/src/utils/logger/logger";

export class ErrorHandler {
  static handleAPIError(response: Response, userMessage: string) {
    toast.responseError({ title: userMessage, response });
    Sentry.captureMessage(
      `CB API request failed: ${response.url} ${response.status}`,
      {
        level: "error",
      },
    );
  }

  static handleException(error: any, userMessage: string) {
    console.log(error);
    if (error.message === "no-capture") return;
    toast.error("Error", {
      description: userMessage,
    });
    Sentry.captureException(error);
  }

  static setContext(data: any, message: string) {
    log.context("Content block operation data", data);
    log.info(message);
  }
}

export default ErrorHandler;
