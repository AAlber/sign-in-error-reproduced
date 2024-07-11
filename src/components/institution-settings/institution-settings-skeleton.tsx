import classNames from "@/src/client-functions/client-utils";
import Skeleton from "../skeleton";

export default function SettingsSkeleton() {
  return (
    <>
      <SkeletonTypeOne />
      <SkeletonTypeTwo />
    </>
  );
}

function SkeletonTypeOne() {
  return (
    <div
      className={classNames(
        "grid grid-cols-1 gap-x-10 gap-y-4 border-b border-border bg-foreground p-6 lg:grid-cols-3",
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex h-4 w-52 items-center gap-2 overflow-hidden rounded-full text-lg font-semibold leading-7 text-contrast">
          <Skeleton />
        </div>
        <div className="flex h-4 w-80 items-center gap-2 overflow-hidden rounded-full text-lg font-semibold leading-7 text-contrast">
          <Skeleton />
        </div>
        <div className="flex h-4 w-36 items-center gap-2 overflow-hidden rounded-full text-lg font-semibold leading-7 text-contrast">
          <Skeleton />
        </div>
      </div>
      <form className="flex flex-col justify-between gap-4 md:col-span-2">
        <div className="grid w-full grid-cols-2 gap-2">
          <div className="flex h-4 w-52 items-center gap-2 overflow-hidden rounded-full text-lg font-semibold leading-7 text-contrast">
            <Skeleton />
          </div>
          <div className="flex h-4 w-52 items-center gap-2 overflow-hidden rounded-full text-lg font-semibold leading-7 text-contrast">
            <Skeleton />
          </div>
          <div className="flex h-10 w-80 items-center gap-2 overflow-hidden rounded-md text-lg font-semibold leading-7 text-contrast">
            <Skeleton />
          </div>
          <div className="flex h-10 w-80 items-center gap-2 overflow-hidden rounded-md text-lg font-semibold leading-7 text-contrast">
            <Skeleton />
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-2">
          <div className="flex h-4 w-52 items-center gap-2 overflow-hidden rounded-full text-lg font-semibold leading-7 text-contrast">
            <Skeleton />
          </div>
          <div className="flex h-4 w-52 items-center gap-2 overflow-hidden rounded-full text-lg font-semibold leading-7 text-contrast">
            <Skeleton />
          </div>
          <div className="flex h-10 w-80 items-center gap-2 overflow-hidden rounded-md text-lg font-semibold leading-7 text-contrast">
            <Skeleton />
          </div>
          <div className="flex h-10 w-80 items-center gap-2 overflow-hidden rounded-md text-lg font-semibold leading-7 text-contrast">
            <Skeleton />
          </div>
        </div>
      </form>
    </div>
  );
}

function SkeletonTypeTwo() {
  return (
    <div
      className={classNames(
        "grid grid-cols-1 gap-x-10 gap-y-4 border-b border-border bg-foreground p-6 lg:grid-cols-3",
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex h-4 w-52 items-center gap-2 overflow-hidden rounded-full text-lg font-semibold leading-7 text-contrast">
          <Skeleton />
        </div>
        <div className="flex h-4 w-80 items-center gap-2 overflow-hidden rounded-full text-lg font-semibold leading-7 text-contrast">
          <Skeleton />
        </div>
        <div className="flex h-4 w-36 items-center gap-2 overflow-hidden rounded-full text-lg font-semibold leading-7 text-contrast">
          <Skeleton />
        </div>
      </div>
      <form className="flex flex-col justify-between gap-4 md:col-span-2">
        <div className="flex h-52 w-full items-center gap-2 overflow-hidden rounded-lg text-lg font-semibold leading-7 text-contrast">
          <Skeleton />
        </div>
      </form>
    </div>
  );
}
