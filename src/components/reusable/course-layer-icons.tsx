import { FolderIcon } from "@heroicons/react/20/solid";
import type { CourseIconType } from "@prisma/client";
import Image from "next/image";
import { isStringAnEmoji } from "@/src/utils/utils";
import { icons3Dpath } from "./icon-selector/3d-icons";

type CourseIconProps = {
  className?: string;
  icon: string | null;
  iconType?: CourseIconType;
  height?: number;
  width?: number;
};

export function CourseIcon({
  className = "",
  icon,
  iconType,
  height = 200,
  width = 200,
}: CourseIconProps) {
  const isEmoji = iconType === "emoji" || !!(icon && isStringAnEmoji(icon));

  if (
    !isEmoji ||
    (icon &&
      (icon.includes(icons3Dpath) ||
        icon.startsWith(process.env.NEXT_PUBLIC_WORKER_URL!)))
  ) {
    return (
      <Image
        className={`${className} object-contain`}
        src={
          icon
            ? icon.startsWith(process.env.NEXT_PUBLIC_WORKER_URL!) ||
              icon.startsWith("/")
              ? icon
              : "/" + icon
            : "./logo.svg"
        }
        alt={icon ?? "no icon"}
        width={width}
        height={height}
      />
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {icon ?? "📚"}
    </div>
  );
}

export function LayerIcon({ className }: { className?: string }) {
  return <FolderIcon className={className} />;
}

export function AutoLayerCourseIconDisplay({
  course,
  height = 25,
  width = 25,
  className,
}: {
  course: { icon: any } | null;
  className?: string;
  height?: number;
  width?: number;
}) {
  return (
    <div className={className}>
      {course ? (
        <CourseIcon
          icon={course.icon}
          className={className}
          height={height}
          width={width}
        />
      ) : (
        <LayerIcon className={className} />
      )}
    </div>
  );
}
