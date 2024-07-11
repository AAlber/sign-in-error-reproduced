import { useTranslation } from "react-i18next";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/reusable/shadcn-ui/accordion";

export function FoldableGridSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { t } = useTranslation("page");
  return (
    <AccordionItem value={title}>
      <AccordionTrigger>
        <div className="px-4">{t(title)}</div>
      </AccordionTrigger>
      <AccordionContent
        asChild
        className="grid gap-2 pl-2 pr-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3
        "
      >
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}
