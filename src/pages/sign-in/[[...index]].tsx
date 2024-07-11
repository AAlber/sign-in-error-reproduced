// import { SignIn } from "@clerk/nextjs";
// import { dark } from "@clerk/themes";
// import Head from "next/head";
// import { useTheme } from "next-themes";
// import { useEffect } from "react";
// import { setCSSClasses } from "@/src/client-functions/client-institution-theme";
// import useThemeStore from "@/src/components/dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";
// import FuxamBotLayout from "@/src/components/reusable/fuxam-bot-layout";

// function SignInPage() {
//   const { setTheme, resolvedTheme } = useTheme();
//   const { setInstiTheme, theme } = useThemeStore();
//   const isDark = resolvedTheme === "dark";

//   useEffect(() => {
//     setInstiTheme("blue");
//     setCSSClasses("blue");
//     setTheme(theme);
//   }, [resolvedTheme]);

//   return (
//     <>
//       <Head>
//         <title>Sign In | Fuxam</title>
//       </Head>
//       <div className="h-screen w-screen">
//         <FuxamBotLayout state="neutral">
//           <p className="text-warning"></p>
//           <SignIn
//             path="/sign-in"
//             routing="path"
//             signUpUrl="/sign-up"
//             appearance={{
//               baseTheme: isDark ? dark : undefined,
//               elements: {
//                 formButtonPrimary:
//                   "bg-contrast dark:bg-contrast dark:text-black hover:bg-transparent hover:text-contrast text-white font-bold py-2 hover:bg-offblack-2 dark:hover:bg-background h-9 rounded-md transition-all duration-200 ease-in-out",
//                 footerActionLink:
//                   "flex justify-center text-sm dark:text-white text-black",
//                 footerActionText: "text-contrast",
//                 card: "flex shadow-xl rounded-xl shadow-none bg-foreground border border-border !w-[440px] max-md:w-auto !justify-center",
//                 headerTitle: "text-2xl tracking-wide text-contrast",
//                 headerSubtitle: "mt-1 text-sm text-muted-contrast",
//                 formFieldLabel: "text-contrast",
//                 formFieldInput__phoneNumber:
//                   "rounded-l-none h-full border-none",
//                 formFieldInput:
//                   "rounded-md h-8 border-border bg-background focus:outline-none focus:ring-transparent",
//                 footer: "flex justify-center items-center lg:mx-20",
//                 footerAction: "flex justify-center items-center",
//                 identityPreview: "lg:mx-20",
//                 identityPreviewEditButtonIcon:
//                   "text-fuxam-pink hover:text-fuxam-orange",
//                 otpCodeFieldInput:
//                   "rounded-md h-9 border-foreground bg-foreground focus:outline-none focus:ring-transparent dark:text-white border-border",
//                 formFieldAction__password:
//                   "text-fuxam-pink hover:text-fuxam-orange",
//                 backLink:
//                   "text-fuxam-pink no-underline hover:text-fuxam-orange ",
//                 // headerBackIcon: "text-fuxam-pink",
//                 dividerLine: "bg-muted-contrast",
//                 dividerText: "text-muted-contrast",
//                 providerIcon__apple: "dark:invert",
//                 socialButtonsBlockButton__google:
//                   "border-border border text-contrast",
//                 socialButtonsBlockButton__apple:
//                   "border-border border text-contrast",
//               },
//               layout: {
//                 socialButtonsPlacement: "bottom",
//               },
//               variables: {
//                 colorText: isDark ? "white" : "black",
//                 // Had to be removed for core-2
//                 // colorAlphaShade: isDark ? "white" : "black",
//                 colorInputText: isDark ? "white" : "black",
//               },
//             }}
//           />
//         </FuxamBotLayout>
//       </div>
//     </>
//   );
// }

// export default SignInPage;

"use client";

import * as SignIn from "@clerk/elements/sign-in";
import Head from "next/head";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { setCSSClasses } from "@/src/client-functions/client-institution-theme";
import useThemeStore from "@/src/components/dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";
import ProgressScreen from "@/src/components/reusable/progress-screen";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { Slide } from "@/src/types/progress-screen";

function SignInPage() {
  const { setTheme, resolvedTheme } = useTheme();
  const { setInstiTheme, theme } = useThemeStore();

  useEffect(() => {
    setInstiTheme("blue");
    setCSSClasses("blue");
    setTheme(theme);
  }, [resolvedTheme]);

  const createSlide = (index: number): Slide => ({
    title: `sign-in_slide${index + 1}.title`,
    description: `sign-in_slide${index + 1}.description`,
    image: `/images/login/login_${index}.webp`,
    children: <LearnMoreButton />,
  });

  const defaultSlides = Array.from({ length: 5 }, (_, index) =>
    createSlide(index),
  );

  console.log(defaultSlides);

  return (
    <>
      <Head>
        <title>Sign In | Fuxam</title>
      </Head>
      <ProgressScreen>
        <ProgressScreen.InfoSlider slides={defaultSlides} />
        <ProgressScreen.Content>
          <div className="grid w-full grow items-center px-4 sm:justify-center">
            <SignIn.Root path="/sign-in">children</SignIn.Root>
          </div>
        </ProgressScreen.Content>
      </ProgressScreen>
    </>
  );
}

const LearnMoreButton = () => {
  const { t } = useTranslation("page");
  return (
    <Button
      onClick={() => window.open("https://fuxam.com", "_blank")}
      variant={"link"}
      className="text-white"
    >
      {t("learn_more")}
    </Button>
  );
};

export default SignInPage;
