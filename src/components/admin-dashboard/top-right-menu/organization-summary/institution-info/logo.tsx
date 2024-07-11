import { useCreatePaymentLink } from "../../zustand";

export default function InstitutionLogo() {
  const { logoLink } = useCreatePaymentLink();

  return (
    <img
      src={logoLink ? logoLink : "/logo.png"}
      className="size-20 rounded-md border border-border object-contain p-2"
      alt="logo"
    />
  );
}
