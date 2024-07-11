import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type Stripe from "stripe";
import classNames from "@/src/client-functions/client-utils";
import { useBilling } from "../zustand-billing";
import Card from "./card";
import UpdateToDefaultMethodButton from "./default-button";
import Paypal from "./paypal";
import Sepa from "./sepa";

export default function PaymentInformation(props: {
  payMethod: Stripe.PaymentMethod;
  showDefaultButton?: boolean;
}) {
  const { subscription } = useBilling();
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (subscription?.default_payment_method === props.payMethod.id) {
      setIsDefault(true);
    } else {
      setIsDefault(false);
    }
  }, [subscription?.default_payment_method, props.payMethod.id]);

  const brand = props.payMethod.card?.brand;
  const cardImageSrc =
    brand === "visa"
      ? "/cards/visa.svg"
      : brand === "mastercard"
      ? "/cards/mastercard.svg"
      : "";
  const imageSrc =
    props.payMethod.type === "card"
      ? cardImageSrc
      : props.payMethod.type === "sepa_debit"
      ? "/cards/sepa.svg"
      : "/cards/paypal-card.svg";
  return (
    <>
      <div
        className={classNames(
          "flex w-full max-w-[300px] flex-col  gap-2 rounded-md border border-border bg-foreground  text-sm text-contrast shadow-sm  ",
          isDefault ? "border border-primary" : "border-border",
        )}
      >
        {isDefault && (
          <div className="relative flex h-full w-full justify-end">
            <CheckCircle2 className="absolute m-2 h-5 w-5 text-primary" />
          </div>
        )}
        <div className="px-4 pb-4">
          <div className="flex justify-between">
            <Image src={imageSrc} alt={""} width={50} height={50} />
            {props.showDefaultButton && (
              <UpdateToDefaultMethodButton paymethodId={props.payMethod.id} />
            )}
          </div>
          <div className=" flex h-full w-full items-center justify-between ">
            <div className=" flex w-full items-center gap-4">
              {props.payMethod.type === "card" && (
                <Card
                  last4={props.payMethod.card?.last4 || ""}
                  expMonth={props.payMethod.card?.exp_month || 0}
                  expYear={props.payMethod.card?.exp_year || 0}
                />
              )}
              {props.payMethod.type === "sepa_debit" && (
                <Sepa
                  last4={props.payMethod.sepa_debit?.last4 || ""}
                  bank_code={props.payMethod.sepa_debit?.bank_code || ""}
                  country={props.payMethod.sepa_debit?.country || ""}
                />
              )}
              {props.payMethod && props.payMethod.type === "paypal" && (
                <>
                  <Paypal
                    payerEmail={props.payMethod.paypal?.payer_email as string}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
