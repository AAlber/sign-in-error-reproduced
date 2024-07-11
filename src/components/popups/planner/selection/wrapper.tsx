import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/reusable/shadcn-ui/card";

const SelectionWrapper = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="space-y-2 pt-4">
      <CardHeader className="p-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
};
SelectionWrapper.displayName = "SelectionWrapper";

export default SelectionWrapper;
