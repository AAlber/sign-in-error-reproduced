import Skeleton from "@/src/components/skeleton";

export default function TitleSkeleton() {
  return (
    <>
      <div className="h-5 w-full overflow-hidden rounded-full">
        <Skeleton />
      </div>
      <div className="h-5 w-1/2 overflow-hidden rounded-full">
        <Skeleton />
      </div>
    </>
  );
}
