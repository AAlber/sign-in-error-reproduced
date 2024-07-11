import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import mime from "mime";
import prettyBytes from "pretty-bytes";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { mimeTypeToHumanReadable } from "@/src/client-functions/client-cloudflare/utils";
import { getInstitutionUserDocuments } from "@/src/client-functions/client-user-management";
import { capitalizeFirstLetter } from "@/src/client-functions/client-utils";
import type { ReducedR2ObjectWithName } from "@/src/types/storage.types";
import AsyncTable from "../../async-table";
import TruncateHover from "../../truncate-hover";
import { useUserOverview } from "../../user-overview-sheet/zustand";
import UserDocumentsDeleteButton from "./delete-document-button";
import UserDocumentsDownloadButton from "./download-document-button";
import UserDocumentUploader from "./user-document-uploader";

export default function UserDocumentsTable() {
  const { t } = useTranslation("page");
  const [data, setData] = useState<ReducedR2ObjectWithName[]>([]);
  const { user } = useUserOverview();

  const columns: ColumnDef<ReducedR2ObjectWithName>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <TruncateHover text={row.original.name} truncateAt={30} />
          </div>
        );
      },
    },
    {
      id: "date",
      accessorKey: "date",
      header: t("date"),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2 text-muted-contrast">
            {dayjs(row.original.LastModified).format("DD.MM.YY")}
          </div>
        );
      },
    },
    {
      id: "x",
      accessorKey: "x",
      header: t("type"),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2 text-muted-contrast">
            {capitalizeFirstLetter(
              mimeTypeToHumanReadable(mime.getType(row.original.Key) || "File"),
            )}
          </div>
        );
      },
    },
    {
      id: "size",
      accessorKey: "size",
      header: t("size"),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2 text-muted-contrast">
            {prettyBytes(row.original.Size)}
          </div>
        );
      },
    },
    {
      id: "download",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <UserDocumentsDownloadButton
              fileKey={row.original.Key}
              user={user}
            />
            <UserDocumentsDeleteButton
              fileKey={row.original.Key}
              userDocuments={data}
              setUserDocuments={setData}
            />
          </div>
        );
      },
    },
  ];

  return (
    <AsyncTable
      promise={() => getInstitutionUserDocuments(user?.id)}
      columns={columns}
      data={data.map((obj) => {
        return {
          ...obj,
          name: obj.Key.split("/").pop() || obj.Key,
        };
      })}
      setData={setData}
      styleSettings={{
        showComponentWithoutData: true,
        showSearchBar: true,
        additionalComponent: (
          <div>
            <UserDocumentUploader
              userDocuments={data}
              setUserDocuments={setData}
              user={user}
            />
          </div>
        ),
      }}
    />
  );
}
