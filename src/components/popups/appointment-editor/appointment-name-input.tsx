import Input from "../../reusable/input";
import useAppointmentEditor from "./zustand";

export default function AppointmentNameInput() {
  const { title, setTitle } = useAppointmentEditor();

  return (
    <Input
      text={title}
      setText={setTitle}
      placeholder="appointment_modal.name_input_placeholder"
      maxLength={200}
    />
  );
}
