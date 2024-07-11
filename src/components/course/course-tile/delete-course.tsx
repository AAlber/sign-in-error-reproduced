import { Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { deleteCourse } from "@/src/client-functions/client-course";
import confirmAction from "@/src/client-functions/client-options-modal";
import { ContextMenuItem } from "@/src/components/reusable/shadcn-ui/context-menu";

type Props = {
  layerId: string;
};

export default function DeleteCourse({ layerId }: Props) {
  const { t } = useTranslation("page");

  const handleOnClick = () => {
    confirmAction(
      async () => {
        await deleteCourse(layerId);
        close();
      },
      {
        title: "delete_course",
        description: "delete_course_description",
        actionName: "general.delete",
        requiredConfirmationCode: true,
        dangerousAction: true,
      },
    );
  };
  return (
    <ContextMenuItem
      data-testid="button-option-create-invite"
      className="flex w-full px-2"
      onClick={handleOnClick}
    >
      <Trash className="h-4 w-4 text-destructive" />
      <span className="text-sm text-destructive">{t("general.delete")}</span>
    </ContextMenuItem>
  );
}
