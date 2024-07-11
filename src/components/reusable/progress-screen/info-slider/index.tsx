import Autoplay from "embla-carousel-autoplay";
import React, { useEffect } from "react";
import type { InfoSliderProps } from "@/src/types/progress-screen";
import { log } from "@/src/utils/logger/logger";
import { Carousel, CarouselContent } from "../../shadcn-ui/carousel";
import { useMousePosition } from "../hooks";
import { useProgressScreenStore } from "../zustand";
import { SliderItem } from "./slider-item";
import { SliderPagination } from "./slider-pagination";

export const InfoSlider = (props: InfoSliderProps) => {
  const mousePosition = useMousePosition();
  const { carouselApi, setCarouselApi, setCurrentScreen, setCount } =
    useProgressScreenStore();

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnFocusIn: false, startPaused: false }),
  );

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const onSelect = () => {
      log.info(
        "Process screen slide changes to",
        carouselApi.selectedScrollSnap(),
      );
      setCount(carouselApi.scrollSnapList().length);
      setCurrentScreen(carouselApi.selectedScrollSnap() + 1);
    };

    onSelect();
    carouselApi.on("reInit", onSelect).on("select", onSelect);
  }, [carouselApi]);

  return (
    <div className="relative hidden h-full w-[52%] flex-col md:flex">
      <Carousel
        className="h-full"
        opts={{
          watchDrag: false,
          loop: true,
        }}
        plugins={[plugin.current]}
        setApi={setCarouselApi}
      >
        <CarouselContent className="">
          {props.slides.map((slide, index) => (
            <SliderItem
              key={index}
              slide={slide}
              index={index}
              mousePosition={mousePosition}
            />
          ))}
        </CarouselContent>
      </Carousel>

      <SliderPagination />
    </div>
  );
};
