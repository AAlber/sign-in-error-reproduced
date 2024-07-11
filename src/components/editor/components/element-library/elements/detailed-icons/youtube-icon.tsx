import { Youtube } from "lucide-react";

export const YoutubeIcon = (): JSX.Element => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Youtube className=" h-10 w-10 text-muted-contrast" strokeWidth={1} />
    </div>
  );
};
