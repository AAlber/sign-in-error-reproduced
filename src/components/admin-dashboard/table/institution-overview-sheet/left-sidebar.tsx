import dayjs from "dayjs";
import { X } from "lucide-react";
import Image from "next/image";
import { memo } from "react";
import { Button } from "../../../reusable/shadcn-ui/button";
import { SheetClose } from "../../../reusable/shadcn-ui/sheet";
import TruncateHover from "../../../reusable/truncate-hover";
import { useAdminDash } from "../zustand";
import CreditDataEditor from "./credit-data-editors";
import InstitutionDataItem from "./institution-data-item";
import SubscriptionOverview from "./subscription-overview";

const InstitutionOverviewLeftSidebar = memo(
  function InstitutionOverviewLeftSidebar() {
    const { openedAdminDashInstitution } = useAdminDash();
    const institution = openedAdminDashInstitution?.institution;
    return (
      institution && (
        <>
          <div className="flex size-full max-w-[300px] flex-col gap-2 border-r border-border bg-foreground px-4">
            <div className="flex h-14 items-center border-b border-border bg-foreground p-4">
              <SheetClose>
                <Button variant={"ghost"} size={"icon"}>
                  <X className="size-4" />
                </Button>
              </SheetClose>
            </div>
            <div className="flex w-full flex-col items-center gap-2 p-4">
              <Image
                priority
                className={`size-32 rounded-full object-cover`}
                src={institution.logo ? institution.logo : "/logo.svg"}
                alt="User Image"
                width={256}
                height={256}
              />
              <div className="flex flex-col justify-center text-center">
                <TruncateHover
                  text={institution.name}
                  truncateAt={26}
                  className="text-lg font-bold text-contrast"
                />
              </div>
            </div>
            <InstitutionDataItem label={"Id"} value={institution.id} />
            <InstitutionDataItem
              label={"Created"}
              value={
                institution.metadata && institution.metadata.createdAt
                  ? dayjs(institution.metadata.createdAt).format(
                      "DD.MM.YYYY HH:MM",
                    )
                  : "Date not available"
              }
            />
            <InstitutionDataItem
              label={"First Admin Email"}
              value={
                institution.metadata && institution.metadata.firstAdminEmail
                  ? institution.metadata.firstAdminEmail
                  : "No first admin email"
              }
            />
            <InstitutionDataItem
              label={"First Admin Sign In"}
              value={
                institution.metadata && institution.metadata.signedInAt
                  ? dayjs(institution.metadata.signedInAt).format(
                      "DD.MM.YYYY HH:MM",
                    )
                  : "No first admin sign in"
              }
            />
            <CreditDataEditor />
            <SubscriptionOverview />
          </div>
        </>
      )
    );
  },
);
export default InstitutionOverviewLeftSidebar;
