import { CardHeader } from "../shadcn-ui/card";
import SwitchLanguage from "../shadcn-ui/switch-language";

export const Header = ({ children }: { children: React.ReactNode }) => {
  return (
    <CardHeader className="px-4 pb-0 pt-4">
      <div className="absolute right-10 top-3">
        <SwitchLanguage />
      </div>
      {children}
    </CardHeader>
  );
};
Header.displayName = "Header";
