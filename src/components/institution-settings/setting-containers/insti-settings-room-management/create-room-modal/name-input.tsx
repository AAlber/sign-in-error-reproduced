import Input from "@/src/components/reusable/input";
import { useCreateRoomModal } from "./zustand";

export default function RoomNameInput() {
  const { name, setName } = useCreateRoomModal();
  return <Input text={name} setText={setName} maxLength={100} />;
}
