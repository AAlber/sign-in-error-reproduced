import type { INode } from "react-accessible-treeview";
import { useDrive } from "@/src/client-functions/client-cloudflare/hooks";
import TruncateHover from "../../reusable/truncate-hover";

const DirectoryInfo = function DirectoryInfo({
  element,
}: {
  element: INode<any>;
}) {
  const drive = useDrive();
  const directoryInfo = drive.client.get.directory(element);
  if (!directoryInfo) return <></>;
  const { lastModifiedText, sizeText, typeText } = directoryInfo;
  return (
    <div
      className={
        "flex w-[287px] items-center justify-between text-sm text-muted-contrast"
      }
    >
      <div className="flex">
        <div className={"w-[70px] border-r border-border"}>{sizeText}</div>
        <div className={"w-[120px] border-r border-border pl-2"}>
          <TruncateHover truncateAt={15} text={typeText} />
        </div>
      </div>
      <div className="w-[90px]">{lastModifiedText}</div>
    </div>
  );
};
export default DirectoryInfo;
