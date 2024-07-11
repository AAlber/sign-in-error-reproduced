import Skeleton from "../../skeleton";
import { BaseListItem, ImageHolder } from "./list-item";

export default function UserListItemSkeleton() {
  return (
    <BaseListItem>
      <ImageHolder>
        <div className="h-7 w-7 overflow-hidden rounded-full border border-border">
          <Skeleton />
        </div>
      </ImageHolder>
      <div className="flex w-full flex-col items-start justify-center gap-2 overflow-hidden">
        <span className="h-3 w-28 overflow-hidden rounded-full">
          <Skeleton />
        </span>
        <span className="h-3 w-48 overflow-hidden rounded-full">
          <Skeleton />
        </span>
      </div>
    </BaseListItem>
  );
}
