import { useTranslation } from "react-i18next";
import administrationOperations from "@/src/client-functions/client-administration/administration-operations";
import confirmAction from "@/src/client-functions/client-options-modal";
import type { Layer } from "@/src/components/administration/types";
import { Button } from "@/src/components/reusable/shadcn-ui/button";

export const LayerRecoverButton = ({
  layer,
  refresh,
  setRefresh,
}: {
  layer: Layer;
  refresh: boolean;
  setRefresh: (value: boolean) => void;
}) => {
  const { t } = useTranslation("page");

  const handleRecover = () => {
    confirmAction(
      async () => {
        await administrationOperations.recoverDeletedLayer(layer.id.toString());
        setRefresh(!refresh);
      },
      {
        actionName: t("general.recover"),
        description: t("confirm_action.recover-layer.description"),
        title: t("confirm_action.recover-layer.title"),
        allowCancel: true,
      },
    );
  };

  return (
    <div className="flex w-full justify-end">
      <Button variant={"link"} size={"small"} onClick={handleRecover}>
        {t("general.recover")}
      </Button>
    </div>
  );
};
