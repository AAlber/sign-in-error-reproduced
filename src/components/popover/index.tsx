/* eslint-disable react/no-children-prop */
import { useRef } from "react";
import { Popover } from "react-tiny-popover";

type PropTypes = {
  ref?: any;
  open: boolean;
  children: any;
  position: Array<any>;
  align: "start" | "end" | "center";
  className?: string;
  content: any;
  setOpen: any;
};

/**
 *
 * @param {open}
 * @returns
 */

const PopoverComponent: React.FC<PropTypes> = ({
  open,
  align,
  setOpen,
  content,
  position,
  children,
  className,
  ...rest
}) => {
  const createRef: any = useRef();

  return (
    <Popover
      ref={createRef}
      align={align}
      clickOutsideCapture={true}
      isOpen={open}
      reposition={false}
      content={content}
      positions={position}
      containerClassName={className}
      onClickOutside={() => setOpen(false)}
      {...rest}
    >
      {children}
    </Popover>
  );
};

export default PopoverComponent;
