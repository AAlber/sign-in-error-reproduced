import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { createUser } from "@/src/client-functions/client-user-management/create-user";
import { useInstitutionUserManagement } from "@/src/components/institution-user-management/zustand";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/reusable/shadcn-ui/dialog";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import { UserDataFields } from "./data-fields";
import {
  type CreateUserWithDataFieldsSchema,
  createUserWithDataFieldsSchema,
} from "./schema";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Content({ open, setOpen }: Props & { open: boolean }) {
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("page");

  const dataFields = useInstitutionUserManagement((state) => state.dataFields);
  const queryClient = useQueryClient();

  const { control, formState, setValue, setFocus, handleSubmit, reset } =
    useForm<CreateUserWithDataFieldsSchema>({
      resolver: zodResolver(createUserWithDataFieldsSchema),
    });

  useEffect(() => {
    if (!open) handleReset();
    else
      setValue(
        "fields",
        dataFields.map((i) => ({ fieldId: i.id, values: "" })),
      );
  }, [open]);

  useEffect(() => {
    if (loading) setAlreadyExists(false);
  }, [loading]);

  const handleCreateUser = async (val: CreateUserWithDataFieldsSchema) => {
    await createUser({
      ...val,
      setAlreadyExists,
      setFocus,
      setLoading,
      setOpen,
    });

    await queryClient.invalidateQueries({
      queryKey: ["getAllUsersOfInstitution"],
    });
  };

  const handleReset = () => {
    reset();
    setLoading(false);
    setAlreadyExists(false);
  };

  return (
    <DialogContent className="flex !h-auto max-h-[500px] min-h-min flex-col gap-4 sm:max-w-[500px]">
      <DialogHeader className="gap-1">
        <DialogTitle>{t("create.user")}</DialogTitle>
        <DialogDescription className="text-muted-contrast">
          {t("create.user.description")}
        </DialogDescription>
      </DialogHeader>
      <div className="flex h-full flex-col gap-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name">{t("name")}</Label>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input id="name" className="col-span-3" {...field} />
            )}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email">{t("email")}</Label>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input id="email" className="col-span-3" {...field} />
            )}
          />
        </div>
        {!!dataFields.length && (
          <UserDataFields control={control} fields={dataFields} />
        )}
      </div>
      <DialogFooter className="flex w-full items-center justify-between">
        {alreadyExists && (
          <p className="text-sm text-destructive">{t("user_already_exists")}</p>
        )}
        {!!formState.errors.email && (
          <p className="text-sm text-destructive">{t("invalid_email")}</p>
        )}
        <Button
          disabled={loading}
          onClick={handleSubmit(handleCreateUser)}
          className="mt-auto"
        >
          {t(loading ? "general.loading" : "general.create")}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export function Trigger({ setOpen }: Props) {
  const { t } = useTranslation("page");

  return (
    <DropdownMenuItem
      onClick={() => {
        setOpen(true);
      }}
    >
      <User className="h-4 w-4" />
      <span>{t("organization_settings.user_management.trigger.user")}</span>
    </DropdownMenuItem>
  );
}
