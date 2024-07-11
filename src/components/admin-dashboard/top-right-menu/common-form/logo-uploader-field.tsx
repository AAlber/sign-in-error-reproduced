// LogoUploaderField.tsx
import LogoUploader from "../../../institution-onboarding/steps/step-1/logo-uploader";

interface LogoUploaderFieldProps {
  setLogoLink: (value: string | undefined) => void;
}

export default function LogoUploaderField({
  setLogoLink,
}: LogoUploaderFieldProps) {
  return (
    <div className="grid grid-cols-3">
      <label className="block text-sm font-medium text-contrast">Logo</label>
      <div className="col-span-2 flex flex-row items-end justify-end">
        <div>
          <LogoUploader
            setLogoLink={setLogoLink}
            uploadPathData={{
              type: "logo",
            }}
          />
        </div>
      </div>
    </div>
  );
}
