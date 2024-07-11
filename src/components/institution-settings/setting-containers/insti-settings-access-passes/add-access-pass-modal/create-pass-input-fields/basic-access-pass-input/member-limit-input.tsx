import { useTranslation } from "react-i18next";
import { Input } from "@/src/components/reusable/shadcn-ui/input";

export default function MemberLimitInput({
  maxUsers,
  setMaxUsers,
}: {
  maxUsers?: number;
  setMaxUsers: (value?: number) => void;
}) {
  const { t } = useTranslation("page");
  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      <div className="mb-1 w-[36%] whitespace-nowrap py-1 text-sm">
        {t("manage_access_pass.total_members")}
      </div>
      <div className="h-4">
        <Input
          type="number"
          onChange={(e) => {
            const val = e.target.value;
            if (!val || !parseInt(val)) setMaxUsers(undefined);
            const num = Number(e.target.value);
            if (num >= 0) {
              setMaxUsers(num);
            }
          }}
          value={maxUsers || ""}
        />
      </div>
    </div>
  );
}
