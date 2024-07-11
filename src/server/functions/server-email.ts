import axios from "axios";
import { renderToString } from "react-dom/server";
import { env } from "@/src/env/server.mjs";
import type {
  ContentType,
  EmailInfo,
  TranslateEmailText,
} from "@/src/types/email.types";
import { log } from "@/src/utils/logger/logger";

const axiosInstance = axios.create({
  baseURL: env.SERVER_URL,
  headers: {
    Authorization: `Bearer ${env.FUXAM_SECRET}`,
  },
});

/**
 * Interface for handling email sending
 */
interface EmailService {
  /**
   * Creates a new instance of the EmailService
   *
   */
  create(): EmailService;

  /**
   * Sets the userId of the sender of the email
   *
   * @param userId The userId of the sender of the email
   *
   */
  userId(userId: string): EmailService;
  /**
   * Sets the language of the email
   *
   * @param lang The language of the email
   */
  language(lang: "en" | "de"): EmailService;

  /**
   * Sets the sender of the email
   *
   * @param sender The sender of the email
   */
  from(sender: string): EmailService;
  /**
   * Sets the recipient of the email, is a array of strings
   *
   * @param recipient The recipient of the email
   */
  to(recipient: string[]): EmailService;
  /**
   * Sets the subject of the email
   *
   * The subject is a object with the language as key and the subject as value
   *
   * Example:
   *
   * ```ts
   * {
   *  en: "Hello",
   *  de: "Hallo"
   * }
   * ```
   * @see TranslateEmailText
   * @see Language
   * @param subject The subject of the email
   */
  subject(subject: TranslateEmailText): EmailService;
  /**
   * Sets the content of the email
   *
   * To use this function you need to pass the Email component
   * 
   * Example:
   * 
   * ```tsx
   * import Email from "@/src/components/reusable/email";
   * 
   *  .content(
          <Email language="de">
            <Email.Header title={{ en: "Hello", de: "Hallo" }} />
            <Email.Content text={{ en: "Hello", de: "Hallo" }} />
            <Email.Button
              link="https://fuxam.com"
              text={{
                en: "Hello",
                de: "Hallo",
              }}
            />
          </Email>
   * 
    * ``` 

   * 
   * @param content The content of the email
   */
  content(content: ContentType): EmailService;
  /**
   * Sends the email in a async way
   *
   */
  send(): Promise<boolean>;
}

class EmailService implements EmailService {
  private emailData: EmailInfo = {
    userId: "",
    from: "",
    to: [],
    subject: {
      en: "",
      de: "",
    },
    language: "en",
    content: null,
  };

  create() {
    return this;
  }

  userId(userId: string) {
    if (!userId) {
      throw new Error("userId not provided");
    }

    this.emailData.userId = userId;
    return this;
  }

  language(lang: "en" | "de") {
    if (!lang) {
      throw new Error("Language not provided");
    }

    this.emailData.language = lang;
    return this;
  }

  from(sender: string) {
    if (!sender) {
      throw new Error("Sender not provided");
    }

    this.emailData.from = sender;
    return this;
  }

  to(recipient: string[]) {
    if (!recipient || recipient.length === 0) {
      throw new Error("Recipient(s) not provided");
    }

    this.emailData.to = recipient;
    return this;
  }

  subject(subject: TranslateEmailText) {
    if (!subject) {
      throw new Error("Subject not provided");
    }

    this.emailData.subject = subject;
    return this;
  }

  content(content: ContentType) {
    log.info("EmailService generating content", { content });

    if (!content) {
      throw new Error("Content not provided");
    }

    const contentString = renderToString(content as React.ReactElement);

    this.emailData.content = contentString;

    return this;
  }

  async send() {
    try {
      if (
        !this.emailData.from ||
        !this.emailData.to ||
        !this.emailData.subject ||
        !this.emailData.content ||
        (!this.emailData.userId && !this.emailData.language)
      ) {
        throw new Error(
          "Sender, recipient, subject, content, and either userId or language are required",
        );
      }

      const response = await axiosInstance.post(
        "/api/email/send-email",
        this.emailData,
      );

      if (response.status !== 200) {
        console.error("Error sending email: Response not OK");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
}

const emailService = new EmailService();
export default emailService;
