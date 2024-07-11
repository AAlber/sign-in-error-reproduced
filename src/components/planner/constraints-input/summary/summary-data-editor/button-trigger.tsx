import { Button } from "@/src/components/reusable/shadcn-ui/button";

export const buttonTrigger = ({ children }: { children: React.ReactNode }) => {
  return (
    <Button
      variant={"link"}
      size={"iconSm"}
      className="h-auto w-auto text-xs text-muted-contrast hover:text-primary"
    >
      {children}
    </Button>
  );
};
