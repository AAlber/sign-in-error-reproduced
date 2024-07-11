export const CodeIcon = (): JSX.Element => {
  return (
    <div className=" h-full w-full px-1.5">
      <div className="relative -top-1.5 flex h-12 w-full rounded-sm border border-muted-contrast">
        <div className="ml-2 h-full w-px bg-border"></div>
        <div className="relative flex h-full flex-col">
          <div className="absolute left-1 top-1.5 h-px w-4 rounded-md bg-muted-contrast"></div>
          <div className="absolute left-3 top-3 h-px w-3 rounded-md bg-muted-contrast"></div>
          <div className="absolute left-[26px] top-3 h-px w-1 rounded-md bg-muted-contrast"></div>
          <div className="absolute left-[18px] top-5 h-px w-3 rounded-md bg-muted-contrast"></div>
          <div className="absolute left-3 top-5 h-px w-1 rounded-md bg-muted-contrast"></div>
          <div className="absolute left-1 top-7 h-px w-4 rounded-md bg-muted-contrast"></div>
        </div>
      </div>
    </div>
  );
};
