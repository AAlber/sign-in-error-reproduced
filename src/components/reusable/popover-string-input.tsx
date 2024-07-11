import { useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import { log } from "@/src/utils/logger/logger";
import { Button } from "./shadcn-ui/button";
import { Input } from "./shadcn-ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./shadcn-ui/popover";
import { Textarea } from "./shadcn-ui/text-area";

type PopoverStringInput =
  | {
      children?: React.ReactNode;
      actionName: string;
      onSubmit: (value: string) => Promise<void> | void;
      side?: "left" | "right" | "top" | "bottom";
      withDescription?: false;
      className?: string;
    }
  | {
      children?: React.ReactNode;
      actionName: string;
      onSubmit: (value: string, description: string) => Promise<void> | void;
      side?: "left" | "right" | "top" | "bottom";
      withDescription?: true;
      className?: string;
    };

export function PopoverStringInput({
  children,
  actionName,
  onSubmit,
  className,
  side = "bottom",
  withDescription = false,
}: PopoverStringInput) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("page");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    log.info("handleSubmit - PopoverStringInput", {
      value,
      description,
      withDescription,
    });
    event.preventDefault();
    setLoading(true);
    if (withDescription) {
      await onSubmit(value, description);
    } else {
      await onSubmit(value, "");
    }
    setLoading(false);
    setValue("");
    setDescription("");
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className={className}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="w-96"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <form
          className={classNames(
            withDescription
              ? "flex w-full flex-col gap-2"
              : "flex w-full items-center gap-2",
          )}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          {withDescription && (
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          )}
          <Button type="submit">
            {loading ? t("general.loading") : t(actionName)}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
