type SliderProps = {
  open: boolean;
  noHeader?: boolean;
  fullScreen?: boolean;
  monitorMode?: boolean;
  setFullScreen?: (fullScreen: boolean) => void;
  fullScreenAvailable?: boolean;
  halfScreen?: boolean;
  setHalfScreen?: (halfScreen: boolean) => void;
  halfScreenAvailable?: boolean;
  setOpen: (open: boolean) => void;
  children: JSX.Element;
  position?: "bottom";
};
