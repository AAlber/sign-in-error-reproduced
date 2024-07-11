import { forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { RegisteredElement } from "./registry";

interface Props extends React.ComponentProps<typeof Button> {
  element: RegisteredElement;
  onHelpClick?: (element: RegisteredElement) => void;
}

export const Element = forwardRef<HTMLButtonElement, Props>(
  ({ element, onHelpClick, ...props }, ref) => {
    const [showHelpButton, setShowHelpButton] = useState<boolean>(false);

    const { t } = useTranslation("page");
    return (
      <div
        className="relative m-1 flex "
        onMouseEnter={() => setShowHelpButton(true)}
        onMouseLeave={() => setShowHelpButton(false)}
      >
        {onHelpClick && showHelpButton && (
          <Button
            size={"iconSm"}
            variant={"ghost"}
            className="absolute right-0 top-0 z-10 mr-0.5 mt-1 h-5 w-5 text-xs text-muted-contrast"
            onClick={() => onHelpClick(element)}
          >
            ?
          </Button>
        )}
        <Button
          className="flex h-20 w-full min-w-20 flex-col items-center justify-end gap-2 rounded-md text-xs font-normal text-muted-contrast"
          variant={"ghost"}
          {...props}
          ref={ref}
        >
          <div className="flex h-full w-full items-center justify-center pb-6 text-contrast">
            {/* <element.icon className="h-6 w-6" /> */}
            {element.detailedIcon}
          </div>
          <span className="!absolute w-max">{t(element.name)}</span>
        </Button>
      </div>
    );
  },
);

Element.displayName = "Element";
