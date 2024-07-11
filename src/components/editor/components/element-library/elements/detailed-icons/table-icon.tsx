export const TableIcon = (): JSX.Element => {
  return (
    <div className="flex h-full w-full justify-center px-2">
      <div className="relative h-full w-full rounded-t-sm border border-muted-contrast bg-foreground p-5">
        <div className="absolute left-3 top-0 h-full w-[1px] bg-muted-contrast"></div>
        <div className="absolute left-0 top-2 h-[1px] w-full bg-muted-contrast"></div>
      </div>
    </div>
  );
};
