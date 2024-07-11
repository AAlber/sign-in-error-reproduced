import clsx from "clsx";
import { LinkIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSlateStatic } from "slate-react";
import { isUrl, normalizeLink } from "@/src/client-functions/client-utils";
import { Button } from "../../reusable/shadcn-ui/button";
import { Input } from "../../reusable/shadcn-ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../reusable/shadcn-ui/popover";
import { toolbar, toolsIcon, toolsIconContainerStyle } from "../styles";

type Fields = {
  name: string;
  url: string;
};

const InsertLink = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("page");

  const editor = useSlateStatic();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Fields>({
    defaultValues: {
      name: "",
      url: "",
    },
  });

  const handleConfirm = (val: Fields) => {
    editor.insertNode({
      type: "link",
      href: normalizeLink(val.url),
      children: [
        {
          text: val.name,
        },
      ],
    });

    reset();
    setOpen(false);
  };

  const hasErrors = !!errors.url;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={clsx(toolsIconContainerStyle, toolbar)}>
        <LinkIcon size={14} className={clsx(toolsIcon)} />
      </PopoverTrigger>
      <PopoverContent className="space-y-3">
        <p>{t("chat.toolbar.link.add_link")}</p>
        <div className="space-y-2">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                placeholder={t("chat.toolbar.link.enter_name")}
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name="url"
            rules={{
              validate: (url) => isUrl(url),
            }}
            render={({ field }) => (
              <Input
                placeholder={t("chat.toolbar.link.enter_url")}
                {...field}
              />
            )}
          />
          <span className={clsx("text-[10px]", hasErrors && "text-red-500")}>
            {hasErrors
              ? t("chat.toolbar.link.invalid_url_message")
              : "ex.: fuxam.app, www.fuxam.app, https://fuxam.app"}
          </span>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            onClick={() => {
              setOpen(false);
              reset();
            }}
          >
            {t("general.cancel")}
          </Button>
          <Button variant={"positive"} onClick={handleSubmit(handleConfirm)}>
            {t("general.confirm")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default InsertLink;
