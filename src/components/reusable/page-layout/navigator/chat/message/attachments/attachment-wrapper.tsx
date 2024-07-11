import classNames from "@/src/client-functions/client-utils";
import Modal from "./modal";

type Props = React.PropsWithChildren<{
  url: string;
  indent?: boolean;
  openInModal?: boolean;
}>;

export function AttachmentWrapper({
  indent = true,
  openInModal = false,
  children,
  url,
}: Props) {
  return (
    <div
      className={classNames(
        !openInModal && "mr-2 mt-2 flex min-w-[120px] rounded-lg",
      )}
    >
      {indent && <div className="mr-4 min-w-[6px] rounded-full bg-secondary" />}
      {openInModal ? (
        <Modal download url={url}>
          {children}
        </Modal>
      ) : (
        <a href={url} target="_blank" rel="noreferrer" download={true}>
          {children}
        </a>
      )}
    </div>
  );
}
