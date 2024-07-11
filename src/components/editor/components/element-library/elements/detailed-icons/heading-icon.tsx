import classNames from "@/src/client-functions/client-utils";

export const HeadingIcon = ({
  headingNumber,
}: {
  headingNumber: number;
}): JSX.Element => {
  const getWidthForLine = (lineIndex: number): string => {
    if (lineIndex + 1 === headingNumber) {
      return "80%";
    } else if (lineIndex < headingNumber) {
      return `${100 - (headingNumber - lineIndex) * 25}%`;
    }
    return `${60 - (lineIndex - headingNumber) * 25}%`;
  };

  const getBorderClass = (lineIndex: number): string => {
    if (lineIndex + 1 === headingNumber) {
      return "!bg-muted-contrast";
    }
    return "bg-muted-contrast";
  };

  return (
    <div className="flex w-full flex-col gap-0.5 p-1">
      <p className="text-start text-2xl font-extralight">
        H<span className="ml-0.5 text-lg">{headingNumber}</span>
      </p>
      <div className="flex flex-col gap-1">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={classNames("h-[1px]  ", getBorderClass(index))}
            style={{ width: getWidthForLine(index) }}
          ></div>
        ))}
      </div>
    </div>
  );
};
