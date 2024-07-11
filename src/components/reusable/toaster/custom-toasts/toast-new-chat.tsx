import React from "react";
import UserDefaultImage from "../../../user-default-image";
import { dismissToast } from "../functions";
import { TranslatedToast } from "../toast";

type Props = {
  toastId: string | number;
  title: string;
  description: string;
  onClick: () => void;
  user?: {
    id: string;
    image: string;
  };
};

export default function ToastNewChat({
  toastId,
  title,
  onClick,
  description,
  user,
}: Props) {
  return (
    <div
      className="min-w-[340px] cursor-pointer rounded-lg border border-muted p-4"
      onClick={() => {
        onClick();
        dismissToast(toastId);
      }}
    >
      <TranslatedToast
        title={title}
        settings={{
          duration: 120000,
          description,
          icon: user ? (
            <UserDefaultImage dimensions="h-10 w-10" user={user} />
          ) : (
            "📩"
          ),
        }}
        type="info"
      />
    </div>
  );
}
