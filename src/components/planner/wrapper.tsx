import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/reusable/shadcn-ui/card";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../reusable/shadcn-ui/accordion";
import WithToolTip from "../reusable/with-tooltip";

const PlannerWrapper = ({
  id,
  title,
  description,
  disabled,
  disabledHint,
  children,
}: {
  id: string;
  title: string;
  description: string;
  disabled?: boolean;
  disabledHint?: string;
  children: React.ReactNode;
}) => {
  const { t } = useTranslation("page");
  return (
    <AccordionItem value={id} key={title}>
      <WithToolTip text={disabledHint ?? ""} disabled={!disabled}>
        <AccordionTrigger
          disabled={disabled}
          className={classNames(
            disabled && "cursor-not-allowed opacity-60 hover:no-underline",
            "items-start space-y-2 pr-4 pt-4 font-normal hover:no-underline hover:opacity-60",
          )}
        >
          <CardHeader className="px-4 py-0 text-start">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
        </AccordionTrigger>
      </WithToolTip>
      <AccordionContent>
        <div className="flex flex-wrap gap-2">{children}</div>
      </AccordionContent>
    </AccordionItem>
  );
};
PlannerWrapper.displayName = "PlannerWrapper";

export { PlannerWrapper };
