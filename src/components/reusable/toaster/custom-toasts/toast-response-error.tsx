import { useIntercom } from "react-use-intercom";
import { dismissToast } from "../functions";
import { TranslatedToast } from "../toast";

type Props = {
  toastId: string | number;
  title: string;
  intercomMessage: string;
};

export default function ToastResponseError({
  toastId,
  title,
  intercomMessage,
}: Props) {
  const { showNewMessage } = useIntercom();
  return (
    <div className="rounded-lg border border-muted p-4">
      <TranslatedToast
        settings={{
          actionCTA: {
            label: "Report",
            onClick: () => {
              dismissToast(toastId);
              showNewMessage(intercomMessage);
            },
          },
          description: "unexpected_error_description",
        }}
        title={title}
        type="error"
      />
    </div>
  );
}
