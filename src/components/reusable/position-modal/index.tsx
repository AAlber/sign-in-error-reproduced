import ModalWrapper from "./modal-wrapper";

export type PositionalModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  positionY?: "top" | "bottom" | "center";
  positionX?: "left" | "right" | "center";
  children: React.ReactNode;
};

export default function PositionalModal(props: PositionalModalProps) {
  return <ModalWrapper {...props}>{props.children}</ModalWrapper>;
}
