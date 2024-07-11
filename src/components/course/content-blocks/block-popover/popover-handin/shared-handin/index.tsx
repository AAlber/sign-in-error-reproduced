import Modal from "@/src/components/reusable/modal";
import type { ContentBlock } from "@/src/types/course.types";
import { SharedHandInsTable } from "./shared-handins-table";

export const SharedHandInModal = ({
  block,
  open,
  setOpen,
}: {
  block: ContentBlock;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <Modal open={open} setOpen={setOpen} size="lg">
      <div className="relative flex flex-col gap-4 ">
        <div className="relative text-center sm:text-left">
          <h3 className="t-primary text-lg font-medium leading-6">
            {block.name}
          </h3>
          <p className="text-sm text-muted-contrast">{block.description}</p>
        </div>
        <SharedHandInsTable block={block} />
      </div>
    </Modal>
  );
};
