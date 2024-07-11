import type { ColumnDef } from "@tanstack/react-table";
import { UserRoundX } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { UserWithPeerFeedback } from "@/src/client-functions/client-peer-feedback";
import { getUsersOfCourseWithPeerFeedback } from "@/src/client-functions/client-peer-feedback";
import { truncate } from "@/src/client-functions/client-utils";
import { EmptyState } from "@/src/components/reusable/empty-state";
import AsyncTable from "../../reusable/async-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../reusable/shadcn-ui/card";
import UserDefaultImage from "../../user-default-image";
import Stars from "../content-blocks/feedback/stars";
import { default as useCourse } from "../zustand";
import OpenDialogButton from "./open-dialog-button";
import PeerFeedbackDialog from "./peer-feedback-dialog";
import PeerFeedbackPopover from "./peer-feedback-popover";
import usePeerFeedbackStore from "./zustand";

export default function CoursePeerFeedbackTable() {
  const { t } = useTranslation("page");
  const { course } = useCourse();

  const {
    refresh,
    data,
    setData,
    setIsOpen,
    setFeedback,
    setUserWithPeerFeedback,
    setRating,
  } = usePeerFeedbackStore();

  const columns: ColumnDef<UserWithPeerFeedback>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t("name"),
      cell: ({ row }) => (
        <div className="flex items-center justify-start gap-4">
          <UserDefaultImage user={row.original} dimensions={"h-6 w-6"} />
          {truncate(row.original.name, 30)}
        </div>
      ),
    },
    {
      id: "peer-rating",
      accessorKey: "peer-rating",
      header: t("peer-rating"),
      cell: ({ row }) => {
        const ratings = row.original.feedbacks.reduce(
          (acc, cur) => acc + cur.rating,
          0,
        );
        const avgRating = Math.round(ratings / row.original.feedbacks.length);
        return (
          <div className="flex items-center gap-2">
            <Stars
              score={avgRating}
              onClick={(n) => {
                setIsOpen(true);
                setFeedback("");
                setRating(n + 1);
                setUserWithPeerFeedback(row.original);
              }}
            />
            <span className="ml-2 text-muted-contrast">
              {row.original.feedbacks.length}
            </span>
          </div>
        );
      },
    },
    {
      id: "give-feedback",
      accessorKey: "give-feedback",
      header: "",
      cell: ({ row }) => {
        return (
          <div className="flex w-full items-center justify-end">
            <OpenDialogButton user={row.original} />
          </div>
        );
      },
    },
  ];

  return (
    <div className="h-full w-full p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-contrast">
            {t("peer_feedback.title")}
          </CardTitle>
          <CardDescription>{t("peer_feedback.description")}</CardDescription>
        </CardHeader>
        <CardContent className="h-full w-full">
          <AsyncTable<UserWithPeerFeedback>
            promise={() => getUsersOfCourseWithPeerFeedback(course!.layer_id)}
            columns={columns}
            setData={setData}
            data={data}
            refreshTrigger={refresh || course}
            styleSettings={{
              emptyState: (
                <EmptyState
                  icon={UserRoundX}
                  title="peer.feedback.empty.title"
                  description="peer.feedback.empty.description"
                />
              ),
              rowsPerPage: 20,
              additionalComponent: <PeerFeedbackPopover />,
            }}
          />
          <PeerFeedbackDialog />
        </CardContent>
      </Card>
    </div>
  );
}
