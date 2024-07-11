import { Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { fetchInstitutions } from "@/src/client-functions/client-user";
import useUser from "@/src/zustand/user";
import AsyncSelect from "../../../reusable/async-select";

export default function InstitutionSwitcher() {
  const { user: user } = useUser();
  const [logo, setLogo] = useState<string>("/logo.svg");

  const fetchData = async () => {
    const fetchedInstitutions = await fetchInstitutions();
    const currentInstitution = fetchedInstitutions.find(
      (insitution) => insitution.id === user.currentInstitutionId,
    );
    const otherInstitutions = fetchedInstitutions.filter(
      (insitution) => insitution.id !== user.currentInstitutionId,
    );
    return currentInstitution
      ? [currentInstitution, ...otherInstitutions]
      : otherInstitutions;
  };

  return (
    <AsyncSelect
      renderHoverCard={false}
      trigger={
        <div className="flex items-center justify-between hover:opacity-80">
          <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-foreground text-xl text-contrast shadow-sm">
            <Image
              className="size-6 object-scale-down"
              src={user.institution?.logo ?? "/logo.svg"}
              referrerPolicy="origin"
              width={100}
              height={100}
              alt=""
            />
          </div>
        </div>
      }
      openWithShortcut={false}
      placeholder="organization_switcher.search"
      noDataMessage="organization_switcher.no_organizations"
      fetchData={fetchData}
      onSelect={(item) =>
        window.location.assign("/switch-institution/" + item.id)
      }
      searchValue={(item) => item.name + " " + item.id}
      itemComponent={(item) => {
        const url = item.logo ?? "/logo.svg";
        const isCurrentInstitution = user.currentInstitutionId === item.id;
        return (
          <div className="flex w-full items-center justify-between">
            <p className="flex w-full items-center gap-2">
              <img
                className="size-5 object-scale-down"
                src={url}
                width={50}
                height={50}
                alt=""
              />
              <span>{item.name}</span>
            </p>
            {isCurrentInstitution && (
              <Check size={16} className="ml-2 text-muted-contrast" />
            )}
          </div>
        );
      }}
    />
  );
}
