import PositionalModal from "../reusable/position-modal";
import ModalChangelog from "./modal";
import useChangelogStore from "./zustand";

// deprecated
export default function Changelog() {
  const { setOpen, open, noNewChangelog } = useChangelogStore();

  return (
    <>
      {!noNewChangelog && (
        <PositionalModal open={open} setOpen={setOpen}>
          <div className="max-w-[400px]">
            <ModalChangelog />
          </div>
        </PositionalModal>
      )}
    </>
  );
}
