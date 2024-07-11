import { ArrowUpDown, Plus } from "lucide-react";
import { addPaymentMethodClientSecret } from "@/src/client-functions/client-stripe";
import { DropdownMenuTrigger } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import { useUpgradeModal } from "../../zustand";

export default function AddNewPaymentMethod(props: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { setAddPaymentMethodModalOpen } = useUpgradeModal();
  return (
    <DropdownMenuTrigger
      asChild
      className="mr-5 flex h-full w-4/6 cursor-pointer items-center gap-x-3 px-2"
    >
      <div className="h-full w-full">
        <div
          onClick={() => {
            addPaymentMethodClientSecret().then(() => {
              setAddPaymentMethodModalOpen(true);
            });
          }}
          className="flex h-full w-full items-center justify-center rounded-lg border border-border bg-foreground py-10  hover:opacity-50"
        >
          <Plus className=" h-6 w-6" />
        </div>
        <div
          className="flex h-full w-full items-center justify-center rounded-lg border border-border bg-foreground py-10  hover:opacity-50 "
          onClick={() => props.setOpen(!props.open)}
        >
          <ArrowUpDown className=" h-6 w-6" />
        </div>
      </div>
    </DropdownMenuTrigger>
  );
}
