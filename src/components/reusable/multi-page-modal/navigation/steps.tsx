import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ModalPage } from "..";
import { useModal } from "../zustand";

export default function StepNavigator({ steps }: { steps: ModalPage[] }) {
  const { step: current } = useModal();
  const { t } = useTranslation("page");

  return (
    <ol className="flex flex-1 flex-col items-start justify-between gap-3 px-4">
      {steps.map((step, index) => (
        <li key={step.title}>
          {index + 1 < current ? (
            <div className="group">
              <span className="flex items-start">
                <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                  <Check
                    className="h-full w-full text-primary group-hover:text-primary"
                    aria-hidden="true"
                  />
                </span>
                <span className="ml-3 text-sm text-muted-contrast">
                  {t(step.tabTitle!)}
                </span>
              </span>
            </div>
          ) : index + 1 === current ? (
            <div className="flex items-start" aria-current="step">
              <span
                className="relative flex h-5 w-5 shrink-0 items-center justify-center"
                aria-hidden="true"
              >
                <span className="absolute h-4 w-4 rounded-full bg-primary/20" />
                <span className="relative block h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="ml-3 text-sm text-contrast">
                {t(step.tabTitle!)}
              </span>
            </div>
          ) : (
            <div className="group">
              <div className="flex items-start">
                <div
                  className="relative flex h-5 w-5 shrink-0 items-center justify-center"
                  aria-hidden="true"
                >
                  <div className="h-2 w-2 rounded-full bg-muted" />
                </div>
                <p className="ml-3 text-sm text-muted-contrast">
                  {t(step.tabTitle!)}
                </p>
              </div>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
