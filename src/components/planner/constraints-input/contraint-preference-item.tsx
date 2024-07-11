import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/reusable/shadcn-ui/card";
import Form from "../../reusable/formlayout";

const ContraintPreferenceItem = ({
  title,
  description,
  children,
  fullWidth = false,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}) => {
  return (
    <>
      {fullWidth ? (
        <Form.FullWidthItem>
          <div className="w-full">
            <div className="space-y-2 pt-4">
              <CardHeader className="space-y-0 p-0">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              {children}
            </div>
          </div>
        </Form.FullWidthItem>
      ) : (
        <Form.Item align="top" label={title} description={description}>
          {children}
        </Form.Item>
      )}
    </>
  );
};
ContraintPreferenceItem.displayName = "ContraintPreferenceItem";

export { ContraintPreferenceItem };
