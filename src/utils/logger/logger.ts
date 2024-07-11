import * as Sentry from "@sentry/nextjs";

/**
 * A client for logging various types of events and operations using Sentry with optional console logging.
 */
export class Logger {
  private lastMessage: string | null = null;

  /**
   * Higher-order function for handling errors in method executions.
   */
  private handleErrors(fn) {
    return (...args) => {
      try {
        return fn.apply(this, args);
      } catch (e) {
        console.error(`Failed during ${fn.name}:`, e);
        return this; // Maintain chainability by returning the Logger instance on error
      }
    };
  }

  constructor() {
    this.cli = this.handleErrors(this.cli);
    this.saveMessageForCli = this.handleErrors(this.saveMessageForCli);
    this.timespan = this.handleErrors(this.timespan);
    this.context = this.handleErrors(this.context);
    this.click = this.handleErrors(this.click);
    this.response = this.handleErrors(this.response);
    this.info = this.handleErrors(this.info);
    this.warn = this.handleErrors(this.warn);
    this.error = this.handleErrors(this.error);
  }

  /**
   * Logs a message to the console if a message is available.
   */
  cli(): Logger {
    if (this.lastMessage) {
      console.log(this.lastMessage);
      this.lastMessage = null; // Reset the last message after logging it.
    }
    return this;
  }

  /**
   * Saves the message for potential console output via .cli().
   */
  private saveMessageForCli(message: string): Logger {
    this.lastMessage = message;
    return this;
  }

  timespan<T>(name: string, operation: () => T): T {
    Sentry.addBreadcrumb({
      message: name,
      level: "info",
    });
    return operation();
  }

  context(name: string, data: { [key: string]: any } | null): Logger {
    Sentry.setContext(name, data);
    const loggedData = this.getLoggedData(data);
    return this.saveMessageForCli(`Context set: ${name}, Data: ${loggedData}`);
  }

  click(message: string, data?: any): Logger {
    Sentry.addBreadcrumb({
      category: "ui.click",
      message,
      level: "info",
      data,
    });
    const loggedData = this.getLoggedData(data);
    return this.saveMessageForCli(
      `Click event: ${message}, Data: ${loggedData}`,
    );
  }

  response(response: Response): Logger {
    Sentry.addBreadcrumb({
      category: "network.response",
      message: "Received network response",
      level: "info",
      data: {
        status: response.status,
        url: response.url,
        text: response.statusText,
      },
    });
    return this.saveMessageForCli(
      `Network response: Status: ${response.status}, URL: ${response.url}, Text: ${response.statusText}`,
    );
  }

  info(message: string, data?: any): Logger {
    Sentry.addBreadcrumb({
      message,
      level: "info",
      data,
    });
    const loggedData = this.getLoggedData(data);
    return this.saveMessageForCli(`Info: ${message}, Data: ${loggedData}`);
  }

  warn(message: string, data?: any): Logger {
    Sentry.addBreadcrumb({
      category: "warn",
      message,
      level: "warning",
      data,
    });
    const loggedData = this.getLoggedData(data);
    return this.saveMessageForCli(
      `Warning: ${message}, Data: ${JSON.stringify(loggedData)}`,
    );
  }

  error(error: any, additionalMessage?: string): Logger {
    Sentry.captureException(error, {
      originalException: additionalMessage,
    });
    if (error instanceof Error) {
      return this.saveMessageForCli(
        `Error: ${error.message}, Additional Message: ${additionalMessage}`,
      );
    }
    return this.saveMessageForCli(
      `Error: ${error.toString()}, Additional Message: ${additionalMessage}`,
    );
  }

  getLoggedData(data: any) {
    if (data) {
      try {
        return JSON.stringify(data);
      } catch (e) {
        return "";
      }
    }
    return data?.toString();
  }
}

const log = new Logger();
export { log };
