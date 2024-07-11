import type { HasRoleWithAccess } from "./user-management.types";

export type LearnMenuItemBase = { icon: React.ReactNode; title: string };
// this is the new type for the menu items
export type LearnMenuItem = LearnMenuItemBase &
  (
    | {
        type: "article";
        minRead: number;
        articleId: number;
      }
    | {
        type: "link";
        href: string;
        target?: "_blank";
      }
    | {
        type: "video";
        url: string;
        // in seconds
        length?: string;
      }
    | {
        type: "action";
        header?: string;
        action: () => void;
      }
  );

export type LearnMenuSection =
  | {
      title?: string;
      type: "role-based";
      // display this section only for these roles use any AccessGate
      requiredAccess: HasRoleWithAccess;
      items: LearnMenuItem[];
    }
  | {
      title?: string;
      type: "same-for-all";
      items: LearnMenuItem[];
    };

export type LearnMenuProps = {
  id: string;
  title: string;
  description: string;
  sections: LearnMenuSection[];
  // this will be the dialog trigger
  children?: React.ReactNode;
};

// used for the standard button to open learn menus
// if focusVideo is set, the video player will be shown automatically.
export type LearnMenuTriggerProps = {
  focusVideo?: string;
};
