import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";

export default function CommentPopover({
  children,
  comment,
}: {
  children: React.ReactNode;
  comment: string;
}) {
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent>
        <p className="text-contrast">{comment}</p>
      </PopoverContent>
    </Popover>
  );
}
