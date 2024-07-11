import { getAccessPassDetails } from "@/src/client-functions/client-access-pass/utils";
import Modal from "@/src/components/reusable/modal";
import { useAccessPasses } from "../zustand";
import CreateAccessPassButton from "./create-access-pass-button";
import CreatePassInputFields from "./create-pass-input-fields";
import PriceDisplays from "./price-displays";
import { useAccessPassCreator } from "./zustand";

export default function AddAccessPassModal() {
  const { setOpenAddAccessPassModal, openAddAccessPassModal } =
    useAccessPasses();
  const { priceId } = useAccessPassCreator();
  const details = getAccessPassDetails(priceId);
  return (
    <>
      <Modal
        open={openAddAccessPassModal}
        setOpen={setOpenAddAccessPassModal}
        size="lg"
      >
        <div className="flex w-full gap-4">
          <CreatePassInputFields />
          <div className="flex w-1/3 flex-col items-end justify-between">
            <PriceDisplays />
            <CreateAccessPassButton />
          </div>
        </div>
      </Modal>
    </>
  );
}
