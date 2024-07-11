import dayjs from "dayjs";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import useUser from "@/src/zustand/user";
import useChangelogStore from "../zustand";

export default function ModalData(props: Changelog) {
  const { user } = useUser();
  dayjs.locale(user.language);
  const formattedDate = dayjs(props.date).format("MMMM DD, YYYY");
  const { addToViewedIds, viewedIds } = useChangelogStore();
  const { t } = useTranslation("page");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    addToViewedIds(props.id);
  }, [props.id, addToViewedIds, viewedIds]);

  return (
    <div className="flex flex-col justify-center p-4" key={props.id}>
      <div className="">
        <Image
          src={!isDark ? props.imageURLWhite : props.imageURL}
          alt=""
          width={500}
          height={250}
          className="mx-auto max-h-[230px] rounded-lg border border-border object-cover"
          priority
        />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex flex-col pt-6 text-left">
          <div className="flex">
            <h1 className="text- font-medium text-contrast">
              {t(props.title)}
            </h1>
          </div>
          <div className="pt- !mt-0 pb-2">
            <p className=" bg-blue-10 rounded-lg text-sm text-muted-contrast ">
              {formattedDate}
            </p>
          </div>
          <p className="max-w-[450px] text-sm text-muted-contrast">
            {t(props.description)}
          </p>
        </div>
      </div>
    </div>
  );
}
