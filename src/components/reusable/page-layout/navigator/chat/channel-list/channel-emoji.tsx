import React from "react";

const ChannelEmoji = (props: {
  image: string | undefined;
  mode?: "list" | "search" | "start-chat";
  border?: boolean;
}) => {
  const { image, mode = "search", border = true } = props;

  const icon = image?.startsWith("emoji:")
    ? String.fromCodePoint(parseInt(image.replace("emoji:", ""), 16))
    : typeof image === "string"
    ? image.includes("/illustrations")
      ? `path:${image}`
      : image
    : "👥";

  if (mode === "search") {
    return <span className="w-10 text-center text-[21px]">{icon}</span>;
  }
  const imageSrc = icon?.startsWith("path:") ? icon.split("path:")[1] : icon;
  const startsWithWorkerOrPath =
    icon.startsWith("path:") ||
    icon.startsWith(process.env.NEXT_PUBLIC_WORKER_URL!);
  if (mode === "list") {
    return (
      <span className="w-8 text-center text-[21px]">
        {startsWithWorkerOrPath ? (
          <img
            alt="course-image"
            src={imageSrc}
            className="h-8 w-8 object-contain"
          />
        ) : (
          <span className="object-contain text-center text-[30px]">{icon}</span>
        )}
      </span>
    );
  }

  if (mode === "start-chat") {
    return (
      <div
        className={`relative flex !h-14 !w-14 items-center justify-center overflow-hidden ${
          border ? "rounded-full border border-border" : ""
        }`}
      >
        {startsWithWorkerOrPath ? (
          <img
            alt="course-image"
            src={imageSrc}
            className="!h-14 !w-14 object-contain"
          />
        ) : (
          <span className="object-contain text-center !text-[56px]">
            {icon}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center ">
      {startsWithWorkerOrPath ? (
        <img
          alt="course-image"
          src={imageSrc}
          className="h-8 w-8 object-contain"
        />
      ) : (
        <span className="object-contain text-center text-xs">{icon}</span>
      )}
    </div>
  );
};

export default ChannelEmoji;
