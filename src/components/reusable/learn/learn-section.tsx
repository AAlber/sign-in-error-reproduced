import { useTranslation } from "react-i18next";
import type { LearnMenuSection } from "@/src/types/learn.types";
import Skeleton from "../../skeleton";
import AccessGate from "../access-gate";

export const Section = ({
  section,
  children,
  cols = 1,
}: {
  section: LearnMenuSection;
  children: React.ReactNode;
  cols?: number;
}) => {
  if (section.type === "same-for-all")
    return (
      <SectionBase cols={cols} section={section}>
        {children}
      </SectionBase>
    );

  return (
    <AccessGate
      rolesWithAccess={section.requiredAccess.rolesWithAccess}
      layerIds={section.requiredAccess.layerIds}
      loaderElement={
        <div className="pb-4">
          <SectionBase cols={cols}>
            {new Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-14 w-full overflow-hidden rounded-md">
                <Skeleton />
              </div>
            ))}
          </SectionBase>
        </div>
      }
    >
      <SectionBase section={section}>{children}</SectionBase>
    </AccessGate>
  );
};
Section.displayName = "Section";

const SectionBase = ({
  section,
  children,
  cols = 1,
}: {
  section?: LearnMenuSection;
  children: React.ReactNode;
  cols?: number;
}) => {
  const { t } = useTranslation("page");
  return (
    <div className="flex h-full w-full flex-col gap-2 px-4">
      {section?.title && (
        <h3 className="text-sm text-contrast">{t(section.title)}</h3>
      )}
      <div
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        className="grid w-full gap-4"
      >
        {children}
      </div>
    </div>
  );
};
