import {
  Body,
  Button,
  Column,
  Container,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { createContext, useContext } from "react";
import type { TranslateEmailText } from "@/src/types/email.types";

const EmailContext = createContext<Language>("en");

export const useEmailContext = () => useContext(EmailContext);

const baseUrl = process.env.SERVER_URL
  ? process.env.SERVER_URL
  : "https://dev.fuxam.app/logo.png";

export const splitByNewLine = (str: string, additionalLineBreak: boolean) => {
  return str.split("/n").map((s, i) => (
    <span key={i}>
      {s}
      <br />
      {additionalLineBreak && <br />}
    </span>
  ));
};

const Email = ({
  children,
  language,
}: {
  children: React.ReactNode;
  language: Language;
}) => {
  return (
    <EmailProvider language={language}>
      <Tailwind>
        <Html>
          <Body className="m-auto">
            <Container className="mx-auto px-2">
              {children}
              <Hr className="!mt-24" />
              <Footer />
            </Container>
          </Body>
        </Html>
      </Tailwind>
    </EmailProvider>
  );
};

const EmailProvider = ({
  children,
  language,
}: {
  children: React.ReactNode;
  language: Language;
}) => {
  return (
    <EmailContext.Provider value={language}>{children}</EmailContext.Provider>
  );
};

Email.Provider = EmailProvider;

const Footer = () => {
  const language = useEmailContext();

  return (
    <Section className="mx-auto mt-[24px]">
      <Row>
        <Column align="center">
          <Text className="text-center text-lg font-normal text-[#FF5675]">
            WEBSITE
          </Text>
          <Link
            href="https://fuxam.com"
            target="_blank"
            rel="noopener noreferrer"
            className="relative bottom-4 text-center text-[#4d4f50] no-underline"
          >
            www.fuxam.com
          </Link>
        </Column>
      </Row>
      <Row>
        <Column align="center">
          <Text className="text-center text-lg font-normal text-[#FF5675]">
            PHONE
          </Text>
          <Link
            href="tel:+4930754398071"
            target="_blank"
            rel="noopener noreferrer"
            className="relative bottom-4 text-center text-[#4d4f50] no-underline"
          >
            +49 30 754398071
          </Link>
        </Column>
      </Row>
      <Row align="center">
        <Column align="center">
          <Text className="text-center text-lg font-normal text-[#FF5675]">
            EMAIL
          </Text>
          <Link
            href="mailto:info@fuxam.de"
            target="_blank"
            rel="noopener noreferrer"
            className="relative bottom-4 text-center text-[#4d4f50] no-underline"
          >
            info@fuxam.de
          </Link>
        </Column>
      </Row>
      <Row align="center">
        <Column align="center">
          <Text className="text-center text-lg font-normal text-[#FF5675]">
            ADDRESS
          </Text>
          <Link
            href="https://maps.app.goo.gl/6Crc1mTC7CS8ryhv7"
            target="_blank"
            rel="noopener noreferrer"
            className="relative bottom-4 text-center text-[#4d4f50] no-underline"
          >
            {splitByNewLine(
              "Fuxam GmbH, Hilda-Geiringer-Weg 7 /n c/o Leo van den Brandt, 10557 Berlin",
              false,
            )}
          </Link>
        </Column>
      </Row>
      <Row className="mx-auto mt-8">
        <Column>
          <Img
            src={baseUrl + "/logo.png"}
            alt="Logo"
            width="30"
            height="30"
            className=""
          />
        </Column>
        <Column>
          <Text className="ml-4 font-normal text-[#86898e]">
            {language === "en"
              ? "This is an automated message sent by Fuxam. If you believe you should not have received this email, please contact us at support@fuxam.de"
              : "Dies ist eine automatische Nachricht, die von Fuxam gesendet wurde. Wenn Sie der Meinung sind, dass Sie diese E-Mail nicht erhalten haben sollten, kontaktieren Sie uns bitte unter support@fuxam.de"}
          </Text>
        </Column>
      </Row>
    </Section>
  );
};
const Header = ({
  title,
  logo,
}: {
  title: TranslateEmailText;
  logo?: string;
}) => {
  const language = useEmailContext();

  return (
    <>
      <Section className="mt-[32px]">
        <Img
          src={logo || baseUrl + "/logo.png"}
          alt="Logo"
          width="60"
          height="60"
          className="mx-auto my-0"
        />
      </Section>
      <Heading className="text-center text-4xl font-bold text-[#271f32]">
        {title[language]}
      </Heading>
    </>
  );
};

const Content = ({ text }: { text: TranslateEmailText }) => {
  const language = useEmailContext();

  return (
    <Text className="text-justify text-xl font-light text-[#4d4f50]">
      {splitByNewLine(text[language], true)}
    </Text>
  );
};

const EmailButton = ({
  text,
  link,
}: {
  text: TranslateEmailText;
  link: string;
}) => {
  const language = useEmailContext();

  return (
    <>
      <Row>
        <Column align="center">
          <Button
            href={link}
            className="mt-4 rounded bg-[#FF5675] px-6 py-3 text-center text-2xl font-semibold text-[#f2eded]"
          >
            {text[language]}
          </Button>
        </Column>
      </Row>
      <Row className="mt-4">
        <Column align="center">
          <Text className="font-light text-[#4d4f50]">
            {language === "en"
              ? "Or copy and paste the link below into your browser"
              : "Oder kopieren und fügen Sie den Link unten in Ihren Browser ein"}
          </Text>
          <Text className="font-light">{link}</Text>
        </Column>
      </Row>
    </>
  );
};

Email.Header = Header;
Email.Content = Content;
Email.Button = EmailButton;

export default Email;
