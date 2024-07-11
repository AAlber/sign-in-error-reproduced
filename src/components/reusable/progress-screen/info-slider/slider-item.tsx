import clsx from "clsx";
import { useTranslation } from "react-i18next";
import type { Slide } from "@/src/types/progress-screen";
import { CarouselItem } from "../../shadcn-ui/carousel";

export const SliderItem = ({
  slide,
  index,
  mousePosition,
}: {
  slide: Slide;
  index: number;
  mousePosition: {
    x: null;
    y: null;
  };
}) => {
  const { t } = useTranslation("page");

  const bgColors = [
    "bg-fuxam-pink",
    "bg-fuxam-orange",
    "bg-fuxam-yellow",
    "bg-fuxam-green",
    "bg-fuxam-blue",
  ];

  const splitStringByNewLine = (str: string) => {
    return str.split("\n").map((s, i) => (
      <span key={i}>
        {s}
        <br />
      </span>
    ));
  };

  return (
    <CarouselItem
      key={index}
      className={clsx(
        "flex h-screen w-full flex-col items-center justify-center pl-0 pr-6",
        bgColors[index % bgColors.length],
      )}
    >
      <img
        src={slide.image}
        alt=""
        className="absolute z-20 mx-auto mb-28 aspect-square w-2/3 transform-gpu will-change-auto"
        style={{
          transform: `translateX(${
            mousePosition.x
              ? `${mousePosition.x / 30 - mousePosition.x / 30 / 2}`
              : 0
          }px) translateY(${
            mousePosition.y
              ? `${mousePosition.y / 30 - mousePosition.y / 30 / 2}`
              : 0
          }px)`,
        }}
      />
      <div
        className="absolute z-10 mx-auto mb-28 aspect-square w-2/3 transform-gpu rounded-full bg-white opacity-10 will-change-transform"
        style={{
          transform: `translateX(${
            mousePosition.x
              ? `${mousePosition.x / 70 - mousePosition.x / 70 / 2}`
              : 0
          }px) translateY(${
            mousePosition.y
              ? `${mousePosition.y / 70 - mousePosition.y / 70 / 2}`
              : 0
          }px)`,
        }}
      ></div>

      <div className="mb-16 mt-auto flex h-auto w-full flex-col items-center">
        <h1 className="sm: mt-10 text-center text-2xl font-semibold tracking-tight text-white lg:text-4xl">
          {t(slide.title)}
        </h1>
        <p className="mt-1 px-8 text-center text-lg tracking-tight text-white">
          {splitStringByNewLine(t(slide.description))}
        </p>
        {slide.children}
      </div>
    </CarouselItem>
  );
};
