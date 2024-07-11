import type { ColumnDef } from "@tanstack/react-table";
import { InfinityIcon, Ticket } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getAndSetAccessPassStatusInfos } from "@/src/client-functions/client-access-pass";
import { extractAccessPassListItem } from "@/src/client-functions/client-access-pass/data-extrapolation";
import AsyncTable from "@/src/components/reusable/async-table";
import { EmptyState } from "@/src/components/reusable/empty-state/empty-state";
import TruncateHover from "@/src/components/reusable/truncate-hover";
import type { AccessPassStatusInfo } from "@/src/utils/stripe-types";
import AccessPassButtons from "../access-pass-buttons";
import { useAccessPasses } from "../zustand";
import AccessPassEditor from "./access-pass-editor";
import ActivateAccessPassButton from "./activate-access-pass-button";
import CopyLinkButton from "./copy-link-button";
import DeleteDropdown from "./delete-dropdown";
import PricePerUser from "./price-per-user";
import StatusColors from "./status-description";

export default function AccessPassTable() {
  const { accessPassStatusInfos, setAccessPassStatusInfos } = useAccessPasses();
  const { t } = useTranslation("page");
  const columns: ColumnDef<AccessPassStatusInfo>[] = [
    {
      id: "status",
      cell: ({ row }) => <StatusColors info={row.original} />,
    },
    {
      id: "name",
      header: t("layer"),
      cell: ({ row }) => (
        <p className="text-sm text-contrast">
          <TruncateHover text={row.original.layerName} truncateAt={15} />
        </p>
      ),
    },
    {
      id: "duration",
      accessorKey: "duration",
      header: t("duration"),
      cell: ({ row }) => (
        <p className="text-sm text-contrast">
          {extractAccessPassListItem(row.original, t).dateText}
        </p>
      ),
    },
    {
      id: "users",
      header: t("users"),
      cell: ({ row }) => (
        <p className={"t-primary flex h-8 items-center gap-2 text-sm"}>
          <span>
            {extractAccessPassListItem(row.original, t).maxUserText || (
              <InfinityIcon className="size-4" />
            )}
          </span>
        </p>
      ),
    },
    {
      id: "price-for-user",
      header: t("price_for_user"),
      cell: ({ row }) => <PricePerUser info={row.original} />,
    },
    {
      id: "action-buttons",
      cell: ({ row }) =>
        row.original.status !== "canceled" && (
          <>
            {row.original.status ? (
              <CopyLinkButton info={row.original} />
            ) : (
              <ActivateAccessPassButton info={row.original} />
            )}
          </>
        ),
    },
    {
      id: "delete-dropdown",
      cell: ({ row }) =>
        row.original.status !== "canceled" && (
          <div className="flex gap-2">
            <AccessPassEditor accessPass={row.original.accessPass} />
            <DeleteDropdown info={row.original} />
          </div>
        ),
    },
  ];

  return (
    <>
      <AsyncTable<AccessPassStatusInfo>
        promise={() => getAndSetAccessPassStatusInfos()}
        columns={columns}
        styleSettings={{
          emptyState: (
            <EmptyState
              icon={Ticket}
              title="access.pass.empty.title"
              description="access.pass.empty.description"
            >
              <EmptyState.LearnTrigger
                triggerId="access-pass-learn-menu"
                focusVideo="learn_menu.standard-access-pass.video_url"
              />{" "}
            </EmptyState>
          ),
          showSearchBar: false,
          additionalComponent: <AccessPassButtons />,
        }}
        data={accessPassStatusInfos}
        setData={setAccessPassStatusInfos}
      />
    </>
  );
}
