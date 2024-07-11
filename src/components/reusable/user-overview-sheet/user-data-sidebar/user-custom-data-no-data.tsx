import { useTranslation } from "react-i18next";
import { useIntercom } from "react-use-intercom";
import { useInstitutionUserManagement } from "@/src/components/institution-user-management/zustand";
import { Button } from "../../shadcn-ui/button";

export const UserNoCustomData = () => {
  const { t } = useTranslation("page");
  const { dataFields } = useInstitutionUserManagement();
  const { showArticle } = useIntercom();

  return (
    <>
      {dataFields.length === 0 && (
        <div className="mx-10 mt-20 flex flex-col items-center justify-center gap-1 text-center">
          <p className="font-medium text-contrast">
            {t("user_overview.no_custom_data")}
          </p>
          <p className="text-sm text-muted-contrast">
            {t("user_overview.no_custom_data_description")}
          </p>
          <Button
            variant={"link"}
            onClick={() => {
              showArticle(8684060);
            }}
          >
            {t("user_overview.custom_data_learn_more")}
          </Button>
        </div>
      )}
    </>
  );
};
