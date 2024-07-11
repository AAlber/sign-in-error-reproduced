export const BlockquoteFigureIcon = (): JSX.Element => {
  return (
    <div className="flex w-full flex-col gap-1 px-2">
      <div className="relative top-0.5 flex gap-0.5">
        <div>
          <div className="relative z-20 h-2.5 w-2.5 rounded-sm border border-muted-contrast bg-background"></div>
          <div className="relative -top-[2.5px]  left-[4px] z-10 h-2.5 w-px -rotate-[45deg] bg-muted-contrast"></div>
        </div>
        <div>
          <div className="relative z-20 h-2.5 w-2.5 rounded-sm border border-muted-contrast bg-background"></div>
          <div className="relative -top-[2.5px]  left-[4px] z-10 h-2.5 w-px -rotate-[45deg] bg-muted-contrast"></div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="h-[1px] w-full bg-muted-contrast"></div>
        <div className="h-[1px] w-[50%] bg-muted-contrast"></div>
      </div>
    </div>
  );
};
