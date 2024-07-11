import { DialogContent } from "../shadcn-ui/dialog";

export const Content = ({ children }: { children: React.ReactNode }) => {
  return (
    <DialogContent className="flex h-auto max-h-[90%] w-full max-w-[980px] flex-col gap-4 p-0 pb-4">
      {children}
    </DialogContent>
  );
};
Content.displayName = "Content";
