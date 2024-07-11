import { useTranslation } from "react-i18next";
import { useAccessPasses } from "../../zustand";
import { useAccessPassCreator } from "../zustand";
import BasicAccessPassInput from "./basic-access-pass-input";
import MaxMemberSelection from "./max-member-selection";
import PaidAccessPassInput from "./paid-access-pass-input";
import RecipientAccountRequirement from "./recipient-account-requirement";

export default function CreatePassInputFields() {
  const { accountInfo } = useAccessPasses();
  const {
    withMemberLimit,
    setWithMemberLimit,
    taxRate,
    setTaxRate,
    priceForUser,
    setPriceForUser,
    description,
    setDescription,
    currency,
    setCurrency,
    isPaid,
    setIsPaid,
    maxUsers,
    setMaxUsers,
    name,
    setName,
  } = useAccessPassCreator();
  const { t } = useTranslation("page");
  return (
    <div className="flex w-2/3 flex-col gap-2">
      <p className="text-m w-full font-semibold text-contrast">
        {t("access_passes.add_title")}
      </p>
      <p className="mb-2 w-full text-sm text-muted-contrast ">
        {t("access_passes.add_description")}
      </p>
      <BasicAccessPassInput />
      {accountInfo && accountInfo.id ? (
        <PaidAccessPassInput
          setName={setName}
          name={name}
          setTaxRate={setTaxRate}
          taxRate={taxRate}
          setPriceForUser={setPriceForUser}
          priceForUser={priceForUser}
          currency={currency}
          setCurrency={setCurrency}
          description={description}
          setDescription={setDescription}
          isPaid={isPaid}
          setIsPaid={setIsPaid}
        />
      ) : (
        <RecipientAccountRequirement />
      )}
      <MaxMemberSelection
        maxUsers={maxUsers}
        setMaxUsers={setMaxUsers}
        withMemberLimit={withMemberLimit}
        setWithMemberLimit={setWithMemberLimit}
      />
    </div>
  );
}
