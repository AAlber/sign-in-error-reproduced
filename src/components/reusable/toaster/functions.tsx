import * as Sentry from "@sentry/nextjs";
import { toast as sonnerLib } from "sonner";
import useUser from "@/src/zustand/user";
import ToastResponseError from "./custom-toasts/toast-response-error";
import { toast } from "./toast";

export function toastResponseError({
  response,
  title = "unexpected_error",
}: ToastResponseError) {
  const { user } = useUser.getState();
  Sentry.captureMessage(
    "Response error: " + response.status + " " + response.statusText,
    { extra: { response }, level: "error" },
  );

  const interComMessage =
    response.status +
    " " +
    response.statusText +
    " " +
    response.url +
    "\n\n" +
    (user.language === "en"
      ? "Hello Fuxam Team, an error occurred and I would like to report it. 🥲"
      : "Hallo Fuxam Team, ein Fehler ist aufgetreten und ich würde ihn gerne melden. 🥲");

  toast.custom((props) => (
    <ToastResponseError
      title={title}
      intercomMessage={interComMessage}
      {...props}
    />
  ));
}

export async function toastTransaction(data: ToastTransactionData) {
  let response: Response = new Response(null);
  let loadingId;
  try {
    loadingId = toast.loading("general.loading", {
      description: data.processMessage,
    });
    response = await data.transaction();
    sonnerLib.dismiss(loadingId);

    if (!response.ok) throw new Error("");
    toast.success("general.success", {
      description: data.successMessage,
    });
    data.onSuccess?.(response);
  } catch (e) {
    loadingId && sonnerLib.dismiss(loadingId);
    toast.responseError({ response });
    response && data.errorCallback?.(response);
  }

  return response;
}

export function dismissToast(id?: string | number) {
  return sonnerLib.dismiss(id);
}

export type ToastTransactionData = {
  errorMessage: string;
  processMessage?: string;
  successMessage?: string;
  onSuccess?: (response: Response) => void;
  errorCallback?: (response: Response) => void;
  transaction: () => Promise<Response>;
};

export type ToastResponseError = {
  response: Response;
  title?: string;
};
