import InputWithWarning from "./error-input";
import { useCompanyInfoEditor } from "./zustand";

export default function PromoCodeEditor() {
  const { promoCode, setPromoCode, promoCodeInvalid, setPromoCodeInvalid } =
    useCompanyInfoEditor();

  return (
    <InputWithWarning
      item={promoCode}
      setItem={setPromoCode}
      invalidItem={promoCodeInvalid}
      setInvalidItem={setPromoCodeInvalid}
      invalidText={"billing_page.upgrade_modal.step_details_promocode_error"}
      placeHolder={
        "billing_page.upgrade_modal.step_details_promocode_placeholder"
      }
    />
  );
}
