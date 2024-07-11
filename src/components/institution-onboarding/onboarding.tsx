import { useTranslation } from "react-i18next";
import FuxamBotLayoutWithBox from "../reusable/fuxam-bot-layout-box";

const Onboarding = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex h-screen flex-1 overflow-hidden bg-background">
      <FuxamBotLayoutWithBox state="welcome" size={"md"}>
        {children}
      </FuxamBotLayoutWithBox>
    </main>
  );
};

const Step = ({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) => {
  const { t } = useTranslation("page");

  return (
    <>
      <FuxamBotLayoutWithBox.Heading>{t(title)}</FuxamBotLayoutWithBox.Heading>
      <FuxamBotLayoutWithBox.Description>
        {t(description)}
      </FuxamBotLayoutWithBox.Description>
      <FuxamBotLayoutWithBox.Children>
        {children}
      </FuxamBotLayoutWithBox.Children>
    </>
  );
};

Step.displayName = "Step";

const Footer = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex w-full items-center justify-end">{children}</div>;
};

Footer.displayName = "Footer";

Onboarding.Footer = Footer;
Onboarding.Step = Step;
export default Onboarding;
