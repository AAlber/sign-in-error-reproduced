export type Slide = {
  image: string;
  title: string;
  description: string;
  children: JSX.Element;
};

export type InfoSliderProps = {
  slides: Slide[];
};
