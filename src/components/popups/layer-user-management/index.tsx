import { useTranslation } from "react-i18next";
import Modal from "../../reusable/modal";
import UsersContainer from "./users-container";
import useUserLayerManagement from "./zustand";

export default function UserManagmentModal() {
  const { open, title, layerId, setOpen } = useUserLayerManagement();
  const { t } = useTranslation("page");

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="flex flex-col gap-2">
        <h2 className="py-2 text-2xl font-semibold text-contrast">{title}</h2>
        <UsersContainer />
      </div>
    </Modal>
  );
}
