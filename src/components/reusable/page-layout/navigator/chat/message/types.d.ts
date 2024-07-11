import type * as React from "react";

/**
 * Lets typescript know about the <em-emoji /> tag,
 * we use this html tag to render emoji mart emojis
 */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "em-emoji": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        id?: string;
        shortcodes?: string;
        native?: string;
        size?: string | number;
        fallback?: string;
        set?: "native" | "apple" | "facebook" | "google" | "twitter";
        skin?: string | number;
      };
    }
  }
}
