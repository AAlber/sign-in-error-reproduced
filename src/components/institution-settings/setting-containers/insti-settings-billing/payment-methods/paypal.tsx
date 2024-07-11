import PayMethodInfoItem from "./pay-method-info-item";

export default function Paypal(props: { payerEmail: string }) {
  return (
    <div className="pt-3">
      {/* TODO: Add Paypal Email here */}
      <PayMethodInfoItem
        title={"billing_page.payment_methods.paypal_text"}
        infoItem={props.payerEmail}
      />
    </div>
  );
}
