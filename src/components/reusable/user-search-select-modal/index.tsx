import { PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { useSetChannel } from "@/src/client-functions/client-chat/useSetChannel";
import { log } from "@/src/utils/logger/logger";
import UserDefaultImage from "../../user-default-image";
import { Button } from "../shadcn-ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../shadcn-ui/dialog";
import Search from "./search";
import type { BaseUser, UserSearchSelectModalProps } from "./types";

const SLICE_AT = 5;

/**
 * a modal/dialog component that accepts user input.
 * the input is sent to an api for searching and filtering and requests are throttled,
 * it can accept a `customFetcher` or a `layerId` as props.
 * If `layerId` is supplied, the component will query against `getUsersByLayerId` api route with paginated response.
 * The component is configured for infinite scroll pagination
 */

export default function UserSearchSelectModal<T extends BaseUser>({
  confirmLabel,
  onConfirm,
  subtitle,
  title,
  children,
  ...props
}: UserSearchSelectModalProps<T>) {
  const [open, setOpen] = useState(false);
  const [selectedResults, setSelectedResults] = useState<T[]>([]);
  const { setActiveChannel } = useSetChannel();

  const handleSelectResult = (value: T) => {
    if (value.email?.startsWith("course")) {
      setActiveChannel({ isChannel: true, id: value.id, type: "course" });
      setOpen(false);
      return;
    }

    const resultIds = selectedResults.map((result) => result.id);
    setSelectedResults((prev) => {
      const isAlreadySelected = resultIds.includes(value.id);
      if (!isAlreadySelected) {
        log.click("User selected", { userId: value.id });
      }
      return isAlreadySelected
        ? selectedResults.filter((r) => r.id !== value.id)
        : [...prev, value];
    });
  };

  /**
   * aside from typescript prop checks, we also make sure customFetcher
   * and layerId props are not defined at the same time during runtime
   */
  const p = props as any;
  if (typeof p.customFetcher === "function" && typeof p.layerId === "string") {
    throw new Error("Cannot define customFetcher and layerId at the same time");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        setSelectedResults([]);
        setOpen(state);
        if (state) {
          log.click("Chat user search modal opened");
        }
      }}
    >
      <DialogTrigger className="w-full">
        {children ?? (
          <Button variant={"ghost"}>
            {<PlusCircle className="size-4 text-contrast transition-colors" />}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex h-[24vh] min-h-[500px] flex-col gap-0 p-0 outline-none">
        <DialogHeader className="px-4 pb-4 pt-5">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-muted-contrast">
            {subtitle}
          </DialogDescription>
        </DialogHeader>
        <Search
          selectedResults={selectedResults}
          onSelectResult={handleSelectResult}
          {...props}
        />

        <DialogFooter className="flex items-center !justify-between border-t border-border p-4">
          <div className="flex -space-x-1.5">
            {selectedResults
              .slice(0, SLICE_AT)
              .map(({ email: _email, name: _name, ...r }) => (
                <UserDefaultImage
                  user={{ id: r.id, image: r.image }}
                  dimensions="h-7 w-7"
                  key={r.id}
                />
              ))}
            {selectedResults.length > SLICE_AT && (
              <div className="flex size-7 items-center justify-center rounded-full border border-muted-contrast bg-secondary text-sm font-bold text-contrast">
                +{selectedResults.length - SLICE_AT}
              </div>
            )}
          </div>
          <Button
            variant="cta"
            disabled={!selectedResults.length}
            onClick={() => {
              log.click("Confirm chat user selection");
              onConfirm(selectedResults);
              setOpen(false);
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
