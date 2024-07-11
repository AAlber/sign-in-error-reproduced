import { useEffect } from "react";
import { useIntercom } from "react-use-intercom";
import useUser from "../zustand/user";
import useDynamicHelpButtonStore from "./reusable/dynamic-help-button/zustand";

export default function Intercom() {
  const { boot } = useIntercom();
  const { user } = useUser();
  const { left } = useDynamicHelpButtonStore();

  const supportPackage = user?.institution
    ? user.institution.stripeAccountInfo
      ? user.institution.stripeAccountInfo.supportPackage
      : "Has no stripe data"
    : "Has no institution";
  const maxUsers =
    user?.institution?.stripeAccountInfo?.subscription?.quantity?.toString() ??
    "Has no stripe data";

  useEffect(() => {
    if (!user) return;
    boot({
      avatar: {
        type: "avatar",
        imageUrl: user.image || "",
      },
      name: user.name,
      email: user.email,
      languageOverride: user.language,
      hideDefaultLauncher: true,
      userId: user.id,
      customAttributes: {
        supportPackage: supportPackage,
        maxUsers: maxUsers,
        institutionId: user.currentInstitutionId,
        institution: user.institution?.name,
        role: user.institution?.hasAdminRole ? "admin" : "user",
        isActive: user.institution?.isUserInactive,
      },
      verticalPadding: 100,
      alignment: "left",
    });
  }, [user, left]);

  return <></>;
}
