import { moveItemToBeginning } from "@/src/client-functions/client-utils";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import PaymentInformation from "../../../payment-methods/payment-information";
import { useBilling } from "../../../zustand-billing";

export default function CardOptions() {
  const { paymentMethods, setPaymentMethods } = useBilling();

  return (
    <DropdownMenuGroup className="!left-20 flex !h-full !w-full  flex-col gap-y-3 ">
      {paymentMethods.slice(1).map((payMethod) => {
        return (
          <DropdownMenuItem
            key={payMethod.id}
            className="! !flex !w-full cursor-pointer !flex-col !items-stretch !p-0 hover:opacity-70"
            onClick={() => {
              const newArray = moveItemToBeginning(
                paymentMethods,
                payMethod.id,
              );
              setPaymentMethods(newArray);
            }}
          >
            <PaymentInformation key={payMethod.id} payMethod={payMethod} />
          </DropdownMenuItem>
        );
      })}
    </DropdownMenuGroup>
  );
}
