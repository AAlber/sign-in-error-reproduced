import PayMethodInfoItem from "./pay-method-info-item";

export default function Sepa(props: {
  last4: string;
  bank_code: string;
  country: string;
}) {
  return (
    <div className="flex justify-between gap-x-4 pt-4">
      <PayMethodInfoItem
        title={"billing_page.payment_methods.sepa_text1"}
        infoItem={props.last4}
      />
      <PayMethodInfoItem
        title={"billing_page.payment_methods.sepa_text2"}
        infoItem={props.bank_code}
      />
      <PayMethodInfoItem
        title={"billing_page.payment_methods.sepa_text3"}
        infoItem={props.country}
      />
    </div>
  );
}
