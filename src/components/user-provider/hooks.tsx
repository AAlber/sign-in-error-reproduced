import { useUser as useClerkUser } from "@clerk/nextjs";
import * as Sentry from "@sentry/nextjs";
import { TextQuote } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
// import { getInitialDrive } from "@/src/client-functions/client-cloud";
// import {
//   removeCustomCSSVars,
//   setCSSClasses,
//   setCustomCSSVars,
// } from "@/src/client-functions/client-institution-theme";
// import {
//   getUnfilledUserDataFieldsOfUser,
//   updateEmptyUserDataFields,
// } from "@/src/client-functions/client-institution-user-data-field";
// import { getUserData } from "@/src/client-functions/client-user";
// import { useAsyncData } from "@/src/client-functions/client-utils/hooks";
import type { UserData } from "@/src/types/user-data.types";
// import { log } from "@/src/utils/logger/logger";
// import useUser from "@/src/zustand/user";
// import useCloudOverlay from "../cloud-overlay/zustand";
// import useThemeStore from "../dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";
// import { useBilling } from "../institution-settings/setting-containers/insti-settings-billing/zustand-billing";
// import useInvitation from "../invitation/zustand";
// import { EmptyState } from "../reusable/empty-state";
// import useNavigationOverlay from "../reusable/page-layout/navigator/zustand";
// import { initSurvey } from "../reusable/survey-dialog/init-function";
// import { StartSurveyButton } from "../reusable/survey-dialog/start-survey-button";

export const useInitializeUser = () => {
  // const { setDriveObject } = useCloudOverlay();
  // const { setInstitutionSettings } = useNavigationOverlay();
  // const {
  //   user: clerkUser,
  //   isSignedIn,
  //   isLoaded: isClerkLoaded,
  // } = useClerkUser();
  // const { setSubscription } = useBilling();
  // const { refresh, setUser } = useUser();
  // const { inviteResponse } = useInvitation();

  // const { data: user, loading } = useAsyncData(
  //   () => getUserData(clerkUser!.id),
  //   JSON.stringify([refresh, inviteResponse]),
  //   0,
  //   !!clerkUser,
  // );

  // useEffect(() => {
  //   if (!user) return;
  //   setUser({
  //     ...user,
  //     image: clerkUser?.imageUrl ? clerkUser.imageUrl : user.image,
  //   });
  //   // Drive Update: get rid of this
  //   setDriveObject(getInitialDrive(user.id));
  //   if (!user.institution) return;
  //   setInstitutionSettings(user.institution.institutionSettings);
  //   if (!user.institution.stripeAccountInfo) return;
  //   setSubscription(user.institution.stripeAccountInfo.subscription);
  // }, [user, setUser, setDriveObject, setInstitutionSettings, setSubscription]);

  return { user: {}, loading: false, isSignedIn: false, isClerkLoaded: false };
};

export const useInitializeAppTheme = (user: UserData | null) => { }
//   const { resolvedTheme } = useTheme();
//   const { instiTheme, setInstiTheme, customTheme, setCustomTheme } =
//     useThemeStore();
//   const isDark = resolvedTheme === "dark";

//   useEffect(() => {
//     if (!user || !user.institution) return;
//     if (!user.institution.customThemeHEX) return setCustomTheme("#000000");
//     const defaultTheme = user.institution.theme || "blue";
//     setInstiTheme(defaultTheme);
//     if (instiTheme === "custom") {
//       setCustomTheme(user.institution.customThemeHEX);
//       setCustomCSSVars(user.institution.customThemeHEX, isDark);
//     }
//   }, [user]);

//   useEffect(() => {
//     if (user?.id && user.email)
//       Sentry.setUser({ id: user.id, email: user.email });
//     else Sentry.setUser(null);
//   }, [user?.id]);

//   useEffect(() => {
//     setCSSClasses(instiTheme);
//     if (instiTheme === "custom") {
//       setCustomCSSVars(customTheme, isDark);
//     } else {
//       removeCustomCSSVars();
//     }
//   }, [instiTheme, resolvedTheme]);
// };

// export const useCheckIfUserNeedsToFilloutOrganizationData = (user, loading) => {
//   const { t } = useTranslation("page");
//   function checkIfUserNeedsToFilloutOrganizationData() {
//     if (!user) return;
//     log.info("Checking if user needs to fill out organization data");
//     getUnfilledUserDataFieldsOfUser().then((fields) => {
//       log.info("Unfilled user data fields fetched successfully", {
//         fields,
//       });
//       if (fields.length === 0) return;
//       initSurvey({
//         data: {
//           questions: fields.map((field) => ({
//             type: "text",
//             question: field.name,
//             placeholder: field.name,
//             id: field.id,
//           })),
//           onFinish: (answers) => {
//             updateEmptyUserDataFields({
//               data: {
//                 values: answers.map((answer) => ({
//                   fieldId: answer.questionId,
//                   value: answer.type === "text" ? answer.answer : "",
//                   userId: user.id,
//                 })),
//               },
//             });
//             log.info("User filled out organization data", { answers });
//           },
//           confirmationText: "user_data_survey_confirmation_text",
//           mode: "edit",
//           introPage: (
//             <EmptyState
//               title={t("user_data_survey.title", {
//                 organization: user?.institution?.name || "Organisation",
//               })}
//               description="user_data_survey.description"
//               icon={TextQuote}
//             >
//               <StartSurveyButton text="user_data_survey.start" />
//             </EmptyState>
//           ),
//           textInput: "input",
//         },
//       });
//     });
//   }

//   useEffect(() => {
//     if (!user) return;
//     checkIfUserNeedsToFilloutOrganizationData();
//   }, [loading === false, user]);
// };
