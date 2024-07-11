import Image from "next/image";
import { useTranslation } from "react-i18next";
import Spinner from "../../../../spinner";

export const NotificationPlaceholder = () => {
  const { t } = useTranslation("page");

  return (
    <section className="my-auto flex items-center px-14 py-5">
      <Image
        src="/illustrations/nonotifications.webp"
        className="mb-2 mr-5 h-20 w-20"
        width={256}
        height={256}
        priority
        alt=""
      />
      <div className="flex flex-col items-start">
        <h2 className="text-xl font-bold text-contrast">
          {t("notifications.no_notifications_woo-hoo")}
        </h2>
        <p className="text-sm text-muted-contrast">
          {t("notifications.no_notifications_text")}
        </p>
      </div>
    </section>
  );
};

export const Loading = () => (
  <div className="flex justify-center py-10">
    <Spinner />
  </div>
);
