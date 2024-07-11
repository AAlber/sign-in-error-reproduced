import Image from "next/image";
import React from "react";
import classNames from "@/src/client-functions/client-utils";
import Box from "./box";
import FuxamBotLayout from "./fuxam-bot-layout";

const FuxamBotLayoutWithBox = ({
  children,
  state,
  size = "md",
}: {
  children: React.ReactNode;
  state: "welcome" | "error" | "neutral" | "not-found" | "construction";
  size?: "md" | "lg";
}) => {
  return (
    <FuxamBotLayout state={state}>
      <Box
        hugePadding
        className={classNames(
          size === "md" ? "w-[480px]" : "w-[650px]",
          "flex min-h-[400px] flex-col items-center justify-center sm:items-start",
        )}
      >
        <Image
          src="/logo.svg"
          width={50}
          height={50}
          alt="logo"
          className="mb-8"
        />
        {children}
      </Box>
    </FuxamBotLayout>
  );
};

const Heading = ({ children }) => {
  return (
    <h1 className="text-center text-xl font-bold text-contrast sm:text-left">
      {children}
    </h1>
  );
};
Heading.displayName = "InvitationLayout.Heading";

const Description = ({ children }) => {
  return (
    <p className="my-2 text-center text-sm text-muted-contrast sm:text-left">
      {children}
    </p>
  );
};
Description.displayName = "InvitationLayout.Description";

const Children = ({ children }) => {
  return <div className="mt-4">{children}</div>;
};
Children.displayName = "InvitationLayout.Children";

FuxamBotLayoutWithBox.Heading = Heading;
FuxamBotLayoutWithBox.Description = Description;
FuxamBotLayoutWithBox.Children = Children;

export default FuxamBotLayoutWithBox;
