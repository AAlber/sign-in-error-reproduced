import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { updateCourseTheme } from "@/src/client-functions/client-course";
import { searchUnsplashImages } from "@/src/client-functions/client-unsplash";
import { useDebounce } from "@/src/client-functions/client-utils/hooks";
import { silentlyRefreshDynamicTabs } from "@/src/components/dashboard/functions";
import Input from "@/src/components/reusable/input";
import Skeleton from "@/src/components/skeleton";
import useCourse from "../../zustand";

export default function UnsplashSelection() {
  const { course, updateCourse } = useCourse();
  const [search, setSearch] = useState("");
  const [loadedImages, setLoadedImages] = useState(false);
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const { t } = useTranslation("page");

  useDebounce(
    () => {
      setLoadedImages(false);
      searchUnsplashImages(search || "education").then((res) => {
        setImages(res);
        setLoadedImages(true);
      });
    },
    [search],
    250,
  );

  return (
    <div className="flex flex-col gap-2">
      <Input
        placeholder={t("general.search")}
        text={search}
        setText={(e) => setSearch(e)}
      />
      <div className="grid w-full grid-cols-3 gap-3 gap-y-2">
        {!loadedImages &&
          Array(15)
            .fill(0)
            .map((_, idx) => (
              <div
                key={idx}
                className="dark:border--5 h-14 w-28 overflow-hidden rounded-md border border-offwhite-3"
              >
                <Skeleton />
              </div>
            ))}
        {loadedImages &&
          course &&
          images.map((image, idx) => (
            <button
              key={idx}
              onClick={async () => {
                updateCourse({ ...course, bannerImage: image.regular });
                await updateCourseTheme({
                  course: {
                    id: course.id,
                    icon: course.icon,
                    iconType: course.iconType,
                    bannerImage: image.regular,
                  },
                });
                silentlyRefreshDynamicTabs();
              }}
              className={`h-14 w-28 rounded-md transition-all duration-200 ease-in-out hover:scale-110`}
            >
              <Image
                src={image.thumb}
                className="size-full rounded-md object-cover"
                alt="Unsplash Image"
                height={40}
                width={80}
              />
            </button>
          ))}
      </div>
    </div>
  );
}
