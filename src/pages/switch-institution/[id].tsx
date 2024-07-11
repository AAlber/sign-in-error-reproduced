import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { updateUserCurrentInstitution } from "@/src/client-functions/client-user";
import FuxamBotLayoutWithBox from "@/src/components/reusable/fuxam-bot-layout-box";
import Spinner from "@/src/components/spinner";
import useUser from "@/src/zustand/user";

export default function Invitation() {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { setUser } = useUser();

  useEffect(() => {
    if (!id) return;
    updateUserCurrentInstitution(id).then((userData) => {
      if (userData) setUser(userData);
      window.location.assign("/");
    });
  }, [id]);

  const loadingSteps = [
    "loading_text_1",
    "loading_text_2",
    "loading_text_3",
    "loading_text_4",
    "loading_text_5",
    "loading_text_6",
    "loading_text_7",
    "loading_text_8",
    "loading_text_9",
    "loading_text_10",
    "loading_text_11",
    "loading_text_12",
    "loading_text_13",
    "loading_text_14",
    "loading_text_15",
    "loading_text_16",
    "loading_text_17",
    "loading_text_18",
    "loading_text_19",
    "loading_text_20",
  ];

  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(Math.floor(Math.random() * loadingSteps.length));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const { t } = useTranslation("page");

  return (
    <>
      <Head>
        <title>{t("switching_organization_page.title")}</title>
        <meta
          name="description"
          content={t("switching_organization_page.title")}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen w-screen">
        <FuxamBotLayoutWithBox state="welcome">
          <FuxamBotLayoutWithBox.Heading>
            <div className="flex items-center gap-2">
              {t("switching_organization_page.title")}{" "}
              <Spinner size="w-6 md:w-7" />
            </div>
          </FuxamBotLayoutWithBox.Heading>
          <FuxamBotLayoutWithBox.Description>
            {t(loadingSteps[step]!)}
          </FuxamBotLayoutWithBox.Description>
        </FuxamBotLayoutWithBox>
      </div>
    </>
  );
}
