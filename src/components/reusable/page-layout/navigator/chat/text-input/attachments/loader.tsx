import type { ImageProps } from "next/image";
import classNames from "@/src/client-functions/client-utils";
import Spinner from "@/src/components/spinner";

const CustomLoader = ({
  className,
  ...imageProps
}: Omit<ImageProps, "alt" | "src">) => {
  return (
    <div className="flex h-full w-full items-center justify-center text-primary">
      <Spinner
        size="h-7 w-7"
        className={classNames("!p-0 !opacity-50", className)}
        {...imageProps}
      />
    </div>
  );
};

export default CustomLoader;
