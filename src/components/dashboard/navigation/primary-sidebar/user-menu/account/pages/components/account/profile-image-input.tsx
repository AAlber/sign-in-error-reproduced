import type {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
} from "react";
import { useTranslation } from "react-i18next";

type Props = {
  imageUploading: boolean;
  imageDeleting: boolean;
  instructionText?: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  showDeleteButton: boolean;
  handleDelete: () => void;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export default function ProfileImageInput({
  imageUploading,
  imageDeleting,
  instructionText,
  handleChange,
  showDeleteButton,
  handleDelete,
  ...props
}: Props) {
  const { t } = useTranslation("page");
  return (
    <div className="flex gap-2">
      <div className="ml-1 rounded-md ">
        <div className="group relative flex h-8 items-center justify-center rounded-md border border-border px-3 py-2">
          <label
            htmlFor="mobile-user-photo"
            className="pointer-events-none relative flex-col text-sm font-medium leading-4 text-contrast"
          >
            <span>
              {imageUploading
                ? t("organization_settings.name_logo_uploading")
                : t("organization_settings.name_logo_change")}
            </span>
            <span className="sr-only">user photo</span>
          </label>
          <input
            {...props}
            type="file"
            disabled={imageDeleting || imageUploading}
            onChange={handleChange}
            className="institution-settings-image absolute h-full w-full cursor-pointer rounded-md border-border opacity-0 "
          />
        </div>
      </div>
    </div>
  );
}
