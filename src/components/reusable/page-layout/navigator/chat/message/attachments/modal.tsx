import { DownloadIcon } from "lucide-react";
import React, { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/src/components/reusable/shadcn-ui/dialog";

/**
 * normally we only use this component with the photo attachment
 * to render something like a lightbox component
 *  */
const Modal = ({ children, download = false, url = "" }) => {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="!min-h-[45vh] !min-w-[55vw] p-2 [&>div]:!h-auto [&>div]:!w-auto [&_img]:!object-contain">
        <>
          {children}
          {download && url && (
            <>
              <DownloadIcon
                size={18}
                className="absolute bottom-2 right-3 cursor-pointer text-muted-contrast hover:text-contrast"
                onClick={() => {
                  anchorRef.current?.click();
                }}
              />
              <a
                href={url}
                target="_blank"
                className="hidden"
                rel="noreferrer"
                download={true}
                ref={anchorRef}
              />
            </>
          )}
        </>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
