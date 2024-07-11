import PayMethodInfoItem from "./pay-method-info-item";

export default function Card(props: {
  last4: string;
  expMonth: number;
  expYear: number;
}) {
  return (
    <div className="flex w-full justify-between pt-3">
      <PayMethodInfoItem
        title={"billing_page.payment_methods.card_text1"}
        infoItem={`**** **** **** ${props.last4}`}
      />
      <PayMethodInfoItem
        title={"expiry_date"}
        infoItem={props.expMonth + " / " + props.expYear}
      />
    </div>
  );
}
