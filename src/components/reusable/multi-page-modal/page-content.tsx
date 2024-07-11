import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import type { ModalPage } from ".";
import { useModal } from "./zustand";

export default function PageContent(props: { steps: ModalPage[] }) {
  const { step } = useModal();
  const { t } = useTranslation("page");

  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-medium text-contrast">
        {t(props.steps[step - 1]?.title ?? "")}
      </h2>
      <p className="text-sm text-muted-contrast">
        {t(props.steps[step - 1]?.description ?? "")}
      </p>
      {
        <div className={classNames("pt-6")}>
          {props.steps[step - 1]?.children || null}
        </div>
      }
    </div>
  );
}
