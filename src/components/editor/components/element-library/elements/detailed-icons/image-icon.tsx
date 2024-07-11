import { Image } from "lucide-react";

export const ImageIcon = (): JSX.Element => {
  return (
    <div className="flex h-full w-full items-center justify-center px-2">
      <Image
        size={28}
        className="fill-none text-muted-contrast"
        strokeWidth={1}
      />
    </div>
  );
};
