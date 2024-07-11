import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  isUnregistered: boolean;
  hasPendingInvites: boolean;
  hasNoCoursesJoined: boolean;
  inline?: boolean;
};

export default function ExtraInfo({
  hasNoCoursesJoined,
  hasPendingInvites,
  isUnregistered,
  inline = true,
}: Props) {
  const { t } = useTranslation("page");

  const infos = useMemo(() => {
    const texts: string[] = [];
    if (hasPendingInvites) texts.push(t("pending-invite"));
    if (isUnregistered) texts.push(t("general.unregistered"));
    if (hasNoCoursesJoined) texts.push(t("no_courses_joined"));
    return texts;
  }, []);

  return inline ? (
    <span className="text-sm text-muted-contrast">{infos.join(", ")}</span>
  ) : (
    <div className="p-1 text-left text-sm text-muted-contrast">
      {infos.map((info) => (
        <p key={info}>{info}</p>
      ))}
    </div>
  );
}
