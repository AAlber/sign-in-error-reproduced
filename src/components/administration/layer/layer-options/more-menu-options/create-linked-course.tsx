import { Link } from "lucide-react";
import { useTranslation } from "react-i18next";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import useUser from "@/src/zustand/user";
import type { Layer } from "../../../types";

export default function CreateLinkedCourse({ layer }: { layer: Layer }) {
  const {
    user: { currentInstitutionId },
  } = useUser();

  const { t } = useTranslation("page");

  const handleCreateLink = async () => {
    await structureHandler.create.layer({
      isCourse: true,
      institution_id: currentInstitutionId,
      linkedCourseLayerId: String(layer.id),
      parent_id: layer.parent_id ?? layer["parentId"], // TODO: fix typings
      isLinkedCourse: true,
      name: `${layer.name}`,
    });
  };

  return (
    <DropdownMenuItem className="flex w-full px-2" onClick={handleCreateLink}>
      <Link className="h-4 w-4 text-contrast" />
      <span className="text-sm text-contrast">{t("mirror_course")}</span>
    </DropdownMenuItem>
  );
}
