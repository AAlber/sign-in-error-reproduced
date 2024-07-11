import cuid from "cuid";
import { AISymbol, Message } from "fuxam-ui";
import { useTranslation } from "react-i18next";

const RenderMessage = ({ message, user }) => {
  const pattern = /【[^】]+†source】/g;
  const cleanedText = message.content.replace(pattern, "");
  const { t } = useTranslation("page");

  return (
    <Message key={cuid()}>
      {message.role === "assistant" ? (
        <AISymbol state="idle" />
      ) : (
        <Message.Picture className="object-cover" imageUrl={user.image ?? ""} />
      )}
      <Message.Content>
        <Message.Title
          name={
            message.role === "assistant"
              ? t("artificial-intelligence")
              : user.name
          }
        />
        <Message.Text text={cleanedText} />
      </Message.Content>
    </Message>
  );
};

export default RenderMessage;
