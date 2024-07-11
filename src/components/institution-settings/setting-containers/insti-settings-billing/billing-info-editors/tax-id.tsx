import ErrorInput from "./error-input";
import { useCompanyInfoEditor } from "./zustand";

export default function TaxIdEditor() {
  const { taxId, setTaxId, taxIdInvalid, setTaxIdInvalid } =
    useCompanyInfoEditor();
  return (
    <ErrorInput
      item={taxId}
      setItem={setTaxId}
      invalidItem={taxIdInvalid}
      setInvalidItem={setTaxIdInvalid}
      invalidText={"billing_page.upgrade_modal.step_details_tax_id_error"}
      placeHolder={"billing_page.upgrade_modal.step_details_tax_id_placeholder"}
    />
  );
}
