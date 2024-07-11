import Image from "next/image";
import { useTranslation } from "react-i18next";

export const NoNotification = () => {
  const { t } = useTranslation("page");

  return (
    <section className="flex h-full w-full flex-col items-center justify-center pb-5 text-center">
      <Image
        src="/illustrations/nonotifications.webp"
        className="mb-2 mr-3 h-20 w-20"
        width={256}
        height={256}
        priority
        alt=""
      />
      <div className="flex flex-col text-center">
        <h2 className="text-lg font-bold text-contrast">Woo-hoo!</h2>
        <p className="text-sm text-muted-contrast">
          {t("notifications.no_notification")}
        </p>
      </div>
    </section>
  );
};
