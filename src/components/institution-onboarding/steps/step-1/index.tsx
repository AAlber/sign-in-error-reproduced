import * as Sentry from "@sentry/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { refillOnboardingData } from "@/src/client-functions/client-institution";
import { updateUser } from "@/src/client-functions/client-user";
import LanguageSelector from "@/src/components/admin-dashboard/top-right-menu/common-form/language-selector";
import Form from "@/src/components/reusable/formlayout";
import useUser from "@/src/zustand/user";
import ThemeSelectorMain from "../../../institution-settings/setting-containers/insti-settings-name-logo-update/theme-selector/theme-selector-main";
import { Button } from "../../../reusable/shadcn-ui/button";
import Onboarding from "../../onboarding";
import useInstitutionOnboarding from "../../zustand";
import LogoUploader from "./logo-uploader";

export default function StepOne() {
  const { name, setStep, language, setLanguage, setName, setLogoLink } =
    useInstitutionOnboarding();
  const { setUser } = useUser();
  const { i18n, t } = useTranslation("page");

  const router = useRouter();
  useEffect(() => {
    if (!router.query.previousConfig) return;
    refillOnboardingData(router);
  }, []);
  return (
    <Onboarding.Step
      title="organization_onboarding_step1.title"
      description="organization_onboarding_step1.subtitle"
    >
      <Form>
        <Form.Item label="organization_onboarding_step1.organization_name">
          <input
            maxLength={50}
            type="text"
            name="first-name"
            id="first-name"
            autoComplete="given-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={
              "block w-full max-w-lg rounded-md border-border bg-foreground text-contrast shadow-sm focus:border-contrast focus:ring-transparent sm:max-w-xs sm:text-sm"
            }
          />
        </Form.Item>
        <Form.Item label="language">
          <LanguageSelector.SelectSection
            language={language}
            setLanguage={(lang) => {
              setUser({ language: lang });
              updateUser({ language: lang });
              i18n.changeLanguage(lang);
              setLanguage(lang);
            }}
          />
        </Form.Item>
        <Form.Item label="color">
          <div className="col-span-2 flex flex-row items-center justify-center">
            <ThemeSelectorMain />
          </div>
        </Form.Item>

        <Form.Item label="Logo">
          <div className="col-span-2 flex flex-row items-center justify-center">
            <LogoUploader
              setLogoLink={setLogoLink}
              uploadPathData={{
                type: "logo",
              }}
            />
          </div>
        </Form.Item>
        <Form.ButtonSection>
          <Button
            disabled={name ? false : true}
            onClick={() => {
              Sentry.addBreadcrumb({ message: "onboarding - set step 2" });
              setStep(2);
            }}
            variant="cta"
          >
            {t("organization_onboarding_step1.continue_button")}
          </Button>
        </Form.ButtonSection>
      </Form>
    </Onboarding.Step>
  );
}
