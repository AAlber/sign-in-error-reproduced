import Divider from "@/src/components/reusable/divider";
import Modal from "@/src/components/reusable/modal";
import OverviewContent from "./block-overview-content";
import PreviewHeader from "./block-overview-header";
import useContentBlockOverview from "./zustand";

export default function ContentBlockPreview() {
  const { open, block, setOpen } = useContentBlockOverview();

  if (!block) return null;

  return (
    <Modal open={open} setOpen={setOpen} size="xl">
      <div className="flex flex-col gap-5">
        <PreviewHeader block={block} />
        <Divider />
        <OverviewContent block={block} />
      </div>
    </Modal>
  );
}
