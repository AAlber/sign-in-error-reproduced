import { PlusCircledIcon } from "@radix-ui/react-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import { Badge } from "@/src/components/reusable/shadcn-ui/badge";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Separator } from "@/src/components/reusable/shadcn-ui/separator";

type Props = {
  selectedValues: Set<string>;
} & React.ComponentPropsWithoutRef<"button">;

const FilterTrigger = React.forwardRef<HTMLButtonElement, Props>(
  ({ selectedValues, className: _className, ...props }, ref) => {
    const { t } = useTranslation("page");
    return (
      <Button
        ref={ref}
        variant="outline"
        className={classNames(
          "h-8 border-dashed text-muted-contrast",
          selectedValues.size > 0 && "!pr-1",
        )}
        {...props}
      >
        <PlusCircledIcon className="mr-0 h-4 w-4 xl:mr-2" />
        <span className="hidden xl:block">
          {t("course_main_content_block_toolbar_filter")}
        </span>
        {selectedValues?.size > 0 && (
          <>
            <Separator orientation="vertical" className="mx-2 h-4" />
            <Badge className="ml-0 rounded-sm px-1 font-normal 2xl:ml-0 2xl:hidden">
              {selectedValues.size}
            </Badge>
            <div className="hidden space-x-1 2xl:flex">
              {selectedValues.size > 2 ? (
                <Badge className="rounded-sm px-1">
                  {selectedValues.size}{" "}
                  {t("course_main_content_block_toolbar_filter_selected")}
                </Badge>
              ) : (
                Array.from(selectedValues).map((option) => (
                  <Badge key={option} className="rounded-sm px-1">
                    {t(option)}
                  </Badge>
                ))
              )}
            </div>
          </>
        )}
      </Button>
    );
  },
);

FilterTrigger.displayName = "Filter Trigger";
export default FilterTrigger;
