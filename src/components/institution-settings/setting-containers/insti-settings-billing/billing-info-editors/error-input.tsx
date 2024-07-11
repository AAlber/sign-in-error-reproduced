import { useTranslation } from "react-i18next";
import { Input } from "@/src/components/reusable/shadcn-ui/input";

export default function ErrorInput(props: {
  item?: string;
  setItem: (a: string) => void;
  invalidItem?: boolean;
  setInvalidItem?: (b: boolean) => void;
  unfilledErrorText?: string;
  invalidText?: string;
  placeHolder: string;
  onChange?: (e: any) => void;
  isFilled?: boolean;
  setIsFilled?: (b: boolean) => void; // Add setIsFilled property to the type
}) {
  const {
    item,
    setItem,
    invalidItem,
    setInvalidItem,
    invalidText,
    placeHolder,
    unfilledErrorText,
    onChange,
    setIsFilled,
    isFilled,
  } = props;
  const { t } = useTranslation("page");
  return (
    <>
      <div className=" w-full">
        <Input
          placeholder={t(placeHolder)}
          id="text"
          name="text"
          type="text"
          value={item}
          onChange={(e) => {
            setIsFilled && setIsFilled(true);
            setInvalidItem && setInvalidItem(false);
            setItem(e.target.value);
            if (e.target.value === "") setIsFilled && setIsFilled(false);
            onChange && onChange(e);
          }}
        />
      </div>
      {((!isFilled && unfilledErrorText) || invalidItem) && (
        <p className="mb-2 text-sm text-destructive">
          {!isFilled && unfilledErrorText
            ? t(unfilledErrorText)
            : t(invalidText!)}
        </p>
      )}
    </>
  );
}
