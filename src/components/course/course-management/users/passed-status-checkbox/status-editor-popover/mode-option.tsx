import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import type { UserStatusCheckboxMode } from "../zustand";
import useUserStatusCheckbox from "../zustand";

export default function StatusEditorModeOption({
  mode,
}: {
  mode: UserStatusCheckboxMode;
}) {
  const { mode: currentMode, setMode } = useUserStatusCheckbox();
  const { t } = useTranslation("page");

  return (
    <button
      key={mode.name}
      onClick={() => {
        setMode(mode.name);
      }}
      className={classNames(
        mode.name === currentMode && "cursor-default bg-accent/50",
        "-mx-2 flex items-start space-x-4 rounded-md p-2 text-left transition-all hover:bg-accent/50",
      )}
    >
      {mode.icon}
      <div className="space-y-1">
        <p className="text-sm font-medium capitalize leading-none">
          {t(mode.name)}
        </p>
        <p className="text-xs text-muted-contrast">{t(mode.description)}</p>
      </div>
    </button>
  );
}
