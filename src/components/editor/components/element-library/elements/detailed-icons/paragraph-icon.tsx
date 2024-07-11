export const ParagraphIcon = (): JSX.Element => {
  return (
    <div className="h-full w-full ">
      <div className="relative flex h-full w-full flex-col items-start justify-center gap-1.5 px-1">
        <div className="h-[1px] w-full bg-muted-contrast"></div>
        <div className="h-[1px] w-full bg-muted-contrast"></div>
        <div className="h-[1px] w-[50%] bg-muted-contrast"></div>
      </div>
    </div>
  );
};
