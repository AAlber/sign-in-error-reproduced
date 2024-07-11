import { GripVertical } from "lucide-react";
import classNames from "@/src/client-functions/client-utils";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useAdministration from "../../../zustand";

const Handle = (props) => {
  const { isDraggingDisabled, filter } = useAdministration();
  const disabled = isDraggingDisabled || !!filter;

  return (
    <Button
      size={"icon"}
      variant={"ghost"}
      {...(!disabled && props)}
      className={classNames(
        "outline-none ring-0 transition-opacity",
        disabled ? "opacity-40 hover:bg-transparent" : "opacity-100",
      )}
    >
      <GripVertical
        size={18}
        className={classNames(
          "text-muted-contrast",
          disabled
            ? "cursor-not-allowed"
            : "cursor-grab active:cursor-grabbing",
        )}
      />
    </Button>
  );
};

export default Handle;
