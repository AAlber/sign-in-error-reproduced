import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import StepThree from "@/src/components/institution-onboarding/steps/step-3";
import FuxamBotLayoutWithBox from "@/src/components/reusable/fuxam-bot-layout-box";
import { Button } from "@/src/components/reusable/shadcn-ui/button";

/*
  This is the initial phase of the onboarding process.
  After the user clicks on the "Get Started" button, the user will be redirected 
  to the next phase. (@see src/pages/signin/institution-onboarding/onboarding.tsx)
*/

export default function InstitutionOnboarding() {
  const { t } = useTranslation("page");
  const router = useRouter();
  if (!router.isReady) return <></>;
  return router.query.institutionId ||
    router.query.name ||
    router.query.paymentSettings ? (
    <>
      <Head>
        <title>Fuxam | Onboarding</title>
      </Head>
      <div className="h-screen w-screen">
        <FuxamBotLayoutWithBox state={"welcome"}>
          <StepThree />
        </FuxamBotLayoutWithBox>
      </div>
    </>
  ) : (
    <>
      <Head>
        <title>Fuxam | Onboarding</title>
      </Head>
      <div className="h-screen">
        <FuxamBotLayoutWithBox state={"welcome"} size="md">
          <FuxamBotLayoutWithBox.Heading>
            {t("organization_onboarding_main_page.title1")}
          </FuxamBotLayoutWithBox.Heading>
          <FuxamBotLayoutWithBox.Description>
            {t("organization_onboarding_main_page.subtitle1")}
          </FuxamBotLayoutWithBox.Description>
          <FuxamBotLayoutWithBox.Children>
            {/* <Link href={}> */}
            <Button
              onClick={() => {
                const trial =
                  router.query.trial === "true" ? "?trial=true" : "";
                window.location.assign("/onboarding/process" + trial);
              }}
              size={"lg"}
              variant={"cta"}
            >
              {t("organization_onboarding_main_page.get_started")}{" "}
              <span className="ml-2 text-contrast" aria-hidden="true">
                &rarr;
              </span>
            </Button>
          </FuxamBotLayoutWithBox.Children>
        </FuxamBotLayoutWithBox>
      </div>
    </>
  );
}
