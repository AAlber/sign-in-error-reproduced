import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/reusable/shadcn-ui/card";

const ResourceWrapper = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="space-y-2 px-4 pt-4">
      <CardHeader className="p-0">
        <CardTitle className="text-sm font-normal">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
};
ResourceWrapper.displayName = "ResourceWrapper";

export { ResourceWrapper };
