import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./shadcn-ui/accordion";

type AdvancedOptionRevealProps = {
  alternateText?: string;
  className?: string;
  children: React.ReactNode;
};

export default function AdvancedOptionReveal(props: AdvancedOptionRevealProps) {
  const { t } = useTranslation("page");

  return (
    <Accordion
      type="single"
      collapsible
      className={classNames("mt-2", props.className)}
    >
      <AccordionItem
        value="item-1"
        className="border-transparent text-muted-contrast"
      >
        <AccordionTrigger>
          <div className="">{t(props.alternateText ?? "advanced_options")}</div>
        </AccordionTrigger>
        <AccordionContent>{props.children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
