import type * as React from "react";

export type EmailInfo = {
  userId?: string; // Make userId optional
  language?: "en" | "de"; // Add optional language property
  from: string;
  to: string[];
  subject: TranslateEmailText;
  content?: React.ReactElement | React.ReactNode | JSX.Element; // Updated content type
};

export type ContentType = React.ReactElement | React.ReactNode | JSX.Element;

export type TranslateEmailText = Record<Language, string>;

export type InviteEmailParams = {
  email: string;
  layerId: string;
  token: string;
  institutionId: string;
} & (
  | { userId: string; language?: never }
  | { userId?: never; language: "en" | "de" }
);
