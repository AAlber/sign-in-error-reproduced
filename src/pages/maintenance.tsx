import Head from "next/head";
import { useTranslation } from "react-i18next";
import FuxamBotLayoutWithBox from "../components/reusable/fuxam-bot-layout-box";
import { Button } from "../components/reusable/shadcn-ui/button";

export default function Construction() {
  const { t } = useTranslation("page");

  return (
    <>
      <Head>
        <title>{t("")}</title>
        <meta name="description" content="Maintenance..." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen w-screen">
        <FuxamBotLayoutWithBox state="construction">
          <FuxamBotLayoutWithBox.Heading>
            <div className="flex items-center gap-2">
              {t("maintenance_page.title")}
            </div>
          </FuxamBotLayoutWithBox.Heading>
          <FuxamBotLayoutWithBox.Description>
            {t("maintenance_page.subtitle1")}
            <br />
            {t("maintenance_page.subtitle2")}
          </FuxamBotLayoutWithBox.Description>
          <FuxamBotLayoutWithBox.Children>
            <Button onClick={() => window.location.assign("/")}>
              {t("refresh")}
            </Button>
          </FuxamBotLayoutWithBox.Children>
        </FuxamBotLayoutWithBox>
      </div>
    </>
  );
}
