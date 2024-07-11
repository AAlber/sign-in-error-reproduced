import { CogIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";

export default function BlockOptionSettings({ block }: any) {
  const { t } = useTranslation("page");

  return (
    <DropdownMenuItem
      data-testid="button-option-create-invite"
      className="flex w-full px-2 "
      onClick={() =>
        toast.warning("toast.content_block_warning_in_development", {
          icon: "🚧",
          description: "toast.content_block_warning_in_development_description",
        })
      }
    >
      <CogIcon className="mr-3 mt-0.5 h-4 w-4 text-contrast" />
      <span className="text-sm text-contrast">
        {t("course_main_content_block_settings_title")}
      </span>
    </DropdownMenuItem>
  );
}
