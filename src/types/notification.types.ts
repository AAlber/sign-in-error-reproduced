export type NotificationIcon =
  | {
      type: "info" | "warning" | "confirm-action" | "error" | "success";
    }
  | {
      type: "user";
      src: string;
    }
  | {
      type: "course";
      iconType: "emojiIcon" | "image";
      src: string;
    };

export type Notification = {
  icon: NotificationIcon;
  title: string;
  message: string;
  messageValues: { [key: string]: string };
};

type NotificationAsyncDataKey = "course" | "block" | "user" | "appointment";

export type NotificationSendRequest = {
  icon: NotificationIcon;
  messageTitle: string; // still the translation key is passed here
  messageText: string; // still the translation key is passed here
  recipients:
    | {
        // If he has at least one of the roles in one of the layers, he will receive the notification
        defineBy: "role";
        roles: Role[];
        layerIds: string[];
      }
    | {
        defineBy: "userIds";
        ids: string[];
      };
  // async data to include in the notification, with typesafe keys since we
  // need to build the fetching functionality for it, we need to ensure the key
  // is supported
  asyncData: {
    [key in NotificationAsyncDataKey]?: string;
  };
  // other variables to incude in the notification, which can be whatever, since
  // there is no exta functionality needed to fetch this.
  data: { [key: string]: any };
};
