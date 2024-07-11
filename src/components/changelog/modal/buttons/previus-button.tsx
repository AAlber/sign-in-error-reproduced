import { ChevronLeft } from "lucide-react";
import Button from "@/src/components/reusable/new-button";
import useChangelogStore from "../../zustand";

export const PreviousButton = () => {
  const { pagination, setPagination } = useChangelogStore();

  return (
    <>
      <Button
        palette="default"
        title=""
        onClick={() => {
          setPagination({ ...pagination, page: pagination.page - 1 });
        }}
        enabled={pagination.page > 1}
        icon={<ChevronLeft />}
      />
    </>
  );
};
