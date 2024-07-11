import type { ReactNode } from "react";
import { InfoSlider } from "./info-slider";
import { Content } from "./screen-content";

const ProgressScreen = ({ children }: { children: ReactNode }) => {
  return <div className="flex h-screen w-screen bg-white">{children}</div>;
};

ProgressScreen.InfoSlider = InfoSlider;
ProgressScreen.Content = Content;

export default ProgressScreen;
