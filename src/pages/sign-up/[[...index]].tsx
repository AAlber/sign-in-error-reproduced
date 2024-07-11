import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { SpellCheck } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { setCSSClasses } from "@/src/client-functions/client-institution-theme";
import useThemeStore from "@/src/components/dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";
import usePersistInvite from "@/src/components/invitation/persist-invite-zustand";
import useInvitation from "@/src/components/invitation/zustand";
import FuxamBotLayout from "@/src/components/reusable/fuxam-bot-layout";
import InfoCard from "@/src/components/reusable/infocard";

function SignInPage() {
  const { setTheme, resolvedTheme } = useTheme();
  const { setInstiTheme, theme } = useThemeStore();
  const isDark = resolvedTheme === "dark";
  const { persistedInvite, setPersistedInvite } = usePersistInvite();

  useEffect(() => {
    setInstiTheme("blue");
    setCSSClasses("blue");
    setTheme(theme);
  }, [resolvedTheme]);

  const { t } = useTranslation("page");
  const { setInvite } = useInvitation();
  const [isHovering, setIsHovering] = useState(false);
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Sign Up | Fuxam</title>
      </Head>
      <div className="h-screen w-screen">
        <FuxamBotLayout state="neutral">
          {persistedInvite?.email && (
            <div
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => {
                setInvite(undefined);
                setPersistedInvite(undefined);
                router
                  .push(
                    {
                      pathname: router.pathname,
                    },
                    undefined,
                    { shallow: true },
                  )
                  .then(() => router.reload());
              }}
              style={{ cursor: isHovering ? "pointer" : "default" }}
            >
              <InfoCard className="mb-4 max-w-[525px]" icon={<SpellCheck />}>
                <div>
                  {t("please_use_correct_email", {
                    email: persistedInvite.email,
                  })}
                  <span className="inline underline">
                    {t("please_click_here")}
                  </span>
                </div>
              </InfoCard>
            </div>
          )}
          <SignUp
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            appearance={{
              baseTheme: isDark ? dark : undefined,
              elements: {
                formButtonPrimary:
                  "bg-contrast dark:bg-contrast dark:text-black hover:bg-transparent hover:text-contrast text-white font-bold py-2 hover:bg-offblack-2 dark:hover:bg-background h-9 rounded-md transition-all duration-200 ease-in-out",
                footerActionLink:
                  "flex justify-center text-sm dark:text-white text-black",
                footerActionText: "text-contrast",
                card: "flex shadow-xl rounded-xl shadow-none bg-foreground border border-border",
                headerTitle: "text-2xl tracking-wide text-contrast",
                headerSubtitle: "mt-1 text-sm text-muted-contrast",
                formFieldLabel: "text-contrast",
                formFieldInput__phoneNumber:
                  "rounded-l-none h-full border-none",
                formFieldInput:
                  "rounded-md h-8 border-border bg-background focus:outline-none focus:ring-transparent",
                footer: "flex justify-center lg:mx-20",
                identityPreview: "lg:mx-20",
                identityPreviewEditButtonIcon:
                  "text-fuxam-pink hover:text-fuxam-orange",
                otpCodeFieldInput:
                  "rounded-md h-9 border-foreground bg-offwhite-1 dark:bg-offblack-2 focus:outline-none focus:ring-transparent dark:text-white border-offwhite-3 dark:border-offblack-5",
                formFieldAction__password:
                  "text-fuxam-pink hover:text-fuxam-orange",
                backLink:
                  "text-fuxam-pink no-underline hover:text-fuxam-orange ",
                // headerBackIcon: "text-fuxam-pink",
                dividerLine: "bg-muted-contrast",
                dividerText: "text-muted-contrast",
                providerIcon__apple: "dark:invert",
                socialButtonsBlockButton__google:
                  "dark:border-offblack-3 border-offwhite-2 border text-contrast",
                socialButtonsBlockButton__apple:
                  "dark:border-offblack-3 border-offwhite-2 border text-contrast",
              },
              layout: {
                socialButtonsPlacement: "bottom",
              },
              variables: {
                colorText: isDark ? "white" : "black",
                // had to be removed for core-2
                // colorAlphaShade: isDark ? "white" : "black",
                colorInputText: isDark ? "white" : "black",
              },
            }}
          />
        </FuxamBotLayout>
      </div>
    </>
  );
}

export default SignInPage;
