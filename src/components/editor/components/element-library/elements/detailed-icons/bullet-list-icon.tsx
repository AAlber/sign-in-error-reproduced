import { Dot } from "lucide-react";

export const BulletListIcon = (): JSX.Element => {
  return (
    <div className="flex h-full w-full ">
      <div className="relative flex h-full w-full flex-col items-start justify-center  px-1">
        <div className="flex w-full items-center ">
          <Dot size={10} className="p-0" />
          <div className="h-[1px] w-full bg-muted-contrast"></div>
        </div>
        <div className="flex w-full items-center">
          <Dot size={10} />
          <div className="h-[1px] w-full bg-muted-contrast"></div>
        </div>
        <div className="flex w-full items-center">
          <Dot size={10} />
          <div className="h-[1px] w-full bg-muted-contrast"></div>
        </div>
      </div>
    </div>
  );
};
