import clsx from "clsx";
import type { ImageProps } from "next/image";
import Image from "next/image";

type Props = Partial<{ size: string } & ImageProps>;

export default function Spinner({ size = "h-5 w-5", className }: Props) {
  return (
    <Image
      priority
      alt="loading.."
      src="/spinner.svg"
      width={30}
      height={30}
      className={clsx(
        className,
        size,
        "pr-0.5 opacity-60 dark:opacity-90 dark:invert",
      )}
    />
  );
}
