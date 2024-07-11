import ErrorInput from "./error-input";
import { useCompanyInfoEditor } from "./zustand";

export default function CompanyNameEditor() {
  const {
    companyName,
    setCompanyName,
    setCompanyNameFilled,
    companyNameFilled,
  } = useCompanyInfoEditor();
  return (
    <ErrorInput
      item={companyName}
      setItem={setCompanyName}
      setIsFilled={setCompanyNameFilled}
      unfilledErrorText={
        "billing_page.upgrade_modal.step_details_company_name_error"
      }
      isFilled={companyNameFilled}
      placeHolder={
        "billing_page.upgrade_modal.step_details_company_name_placeholder"
      }
    />
  );
}
