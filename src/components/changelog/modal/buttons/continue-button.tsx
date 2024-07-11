import { ChevronRight } from "lucide-react";
import Button from "@/src/components/reusable/new-button";
import useChangelogStore from "../../zustand";

export const ContinueButton = () => {
  const { pagination, setPagination } = useChangelogStore();
  return (
    <>
      <Button
        palette="default"
        title=""
        icon={<ChevronRight />}
        onClick={() => {
          setPagination({ ...pagination, page: pagination.page + 1 });
        }}
        enabled={pagination.page < pagination.total}
      />
    </>
  );
};
