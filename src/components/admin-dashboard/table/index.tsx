import type { Invite } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { memo, useMemo } from "react";
import { getAdminDashInstitutions } from "@/src/client-functions/client-admin-dashboard";
import { formatStripeDate } from "@/src/client-functions/client-stripe/utils";
import type { AdminDashSubscription } from "@/src/server/functions/server-stripe";
import { isPartOfFakeTrialInstitutions } from "@/src/utils/functions";
import type { AdminDashInstitution } from "@/src/utils/stripe-types";
import ConfirmationModal from "../../popups/confirmation-modal";
import AsyncTable from "../../reusable/async-table";
import Input from "../../reusable/input";
import { Button } from "../../reusable/shadcn-ui/button";
import { Checkbox } from "../../reusable/shadcn-ui/checkbox";
import { AdminDashTopRightMenu } from "../top-right-menu";
import { DeleteInstitutionButton } from "./buttons/delete-institution-button";
import { DeleteMultipleButton } from "./buttons/delete-multiple-instis-button";
import { InstitutionNameButton } from "./buttons/institution-name-button";
import { OpenEditModalButton } from "./buttons/open-edit-modal-button";
import AdminDashFilters from "./filters";
import InstitutionOverviewSheet from "./institution-overview-sheet";
import { EditPopover } from "./popovers/edit-popover";
import { EmailPopover } from "./popovers/email-popover";
import InvitationPopover from "./popovers/invitation-popover";
import UsersPopover from "./popovers/user-popover";
import { useAdminDash } from "./zustand";

export const isAdminDashTestInstitution = (
  subscription: AdminDashSubscription | null | undefined,
) => {
  return subscription && subscription.isTestInstitution === true;
};

export const getAdminDashPaymentStatus = (
  institution: AdminDashInstitution,
) => {
  if (!institution) return "Unknown";
  return isPartOfFakeTrialInstitutions(institution.institution.id)
    ? "Fake Trial (like FHS)"
    : isAdminDashTestInstitution(institution.subscription)
    ? "Test Institution"
    : !institution.subscription
    ? "No Subscription"
    : institution.subscription.status === "canceled"
    ? "Canceled"
    : institution.subscription.status === "active"
    ? institution.subscription.quantity + " Paid Users"
    : institution.subscription.status === "incomplete"
    ? "Incomplete"
    : institution.subscription.status === "incomplete_expired"
    ? "Incomplete Expired"
    : institution.subscription.status === "past_due"
    ? "Past Due"
    : institution.subscription.status === "trialing"
    ? "Trialing"
    : institution.subscription.status === "unpaid"
    ? "Unpaid"
    : "Unknown";
};

export const AdminDashboard = memo(() => {
  const {
    refresh,
    adminDashPassword,
    setAdminDashPassword,
    adminDashInstitutions,
    setAdminDashInstitutions,
    filter,
    setPasswordConfirmed,
    passwordConfirmed,
    setOpenOverviewSheet,
    openOverviewSheet,
    setSelectedInstitutionIds,
    selectedInstitutionIds,
  } = useAdminDash();

  const columns: ColumnDef<AdminDashInstitution>[] = [
    {
      id: "select",
      cell: ({ row }) => {
        const isSelected = selectedInstitutionIds.includes(
          row.original.institution.id,
        );

        return (
          <div className="ml-2 flex w-8 items-center justify-start">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() =>
                isSelected
                  ? setSelectedInstitutionIds(
                      selectedInstitutionIds.filter(
                        (id) => id !== row.original.institution.id,
                      ),
                    )
                  : setSelectedInstitutionIds([
                      row.original.institution.id,
                      ...selectedInstitutionIds,
                    ])
              }
              aria-label="Select row"
            />
          </div>
        );
      },
    },
    {
      id: "name",
      accessorKey: "institution.name",
      header: "name",
      cell: ({ row }) => {
        return (
          <InstitutionNameButton
            index={row.index}
            adminDashInstitution={row.original}
          />
        );
      },
    },
    {
      id: "isTestInstitution",
      header: "Payment",
      cell: ({ row }) => {
        return (
          <p className="text-sm text-contrast">
            {getAdminDashPaymentStatus(row.original)}
          </p>
        );
      },
    },
    {
      id: "Created At",
      header: "Created At",
      cell: ({ row }) => {
        return (
          <p className="text-sm text-contrast">
            {row.original.institution.metadata &&
            row.original.institution.metadata.createdAt
              ? dayjs(row.original.institution.metadata.createdAt).format(
                  "DD MM YY",
                )
              : ""}
          </p>
        );
      },
    },
    {
      id: "Signed in At",
      header: "Signed in At",
      cell: ({ row }) => (
        <p className="text-sm text-contrast">
          {row.original.signedInAt as unknown as string}
        </p>
      ),
    },
    {
      id: "Expires on",
      header: "Expires on",
      cell: ({ row }) => (
        <p className="text-sm text-contrast">
          {isAdminDashTestInstitution(row.original.subscription) &&
          row.original.subscription &&
          row.original.subscription.cancel_at
            ? formatStripeDate(row.original.subscription.cancel_at)
            : ""}
        </p>
      ),
    },
    {
      id: "Next Cycle",
      header: "Next Cycle",
      cell: ({ row }) => {
        return (
          <p className="text-sm text-contrast">
            {!row.original.subscription ||
            row.original.subscription.status === "canceled" ||
            isAdminDashTestInstitution(row.original.subscription)
              ? ""
              : formatStripeDate(row.original.subscription.current_period_end)}
          </p>
        );
      },
    },
    {
      id: "Total Users",
      header: "Total Users",
      cell: ({ row }) => {
        return (
          <UsersPopover
            institutionId={row.original.institution.id}
            totalUsers={row.original.totalUsers}
          />
        );
      },
    },
    {
      id: "Invitations",
      header: "Invitations",
      cell: ({ row }) => {
        const invitations = row.original.institution.invite as Invite[];
        return <InvitationPopover invitations={invitations} />;
      },
    },
    {
      id: "10",
      cell: ({ row }) => {
        return (
          <div className="flex justify-between">
            <OpenEditModalButton
              institutionId={row.original.institution.id}
              subscription={row.original.subscription}
            />
            <EmailPopover institutionId={row.original.institution.id} />

            <DeleteInstitutionButton
              institutionId={row.original.institution.id}
            />
          </div>
        );
      },
    },
  ];
  // Assuming each function returns true if the institution should be included based on a specific criterion
  const filterFunctions = {
    "Fake Trial (like FHS)": (institution: AdminDashInstitution) =>
      isPartOfFakeTrialInstitutions(institution.institution.id),
    // Add more filters as needed
    "Test Institution": (institution: AdminDashInstitution) =>
      isAdminDashTestInstitution(institution.subscription),
    "No Subscription": (institution: AdminDashInstitution) =>
      !institution.subscription,
    Subscription: (institution: AdminDashInstitution) =>
      !!institution.subscription &&
      !isAdminDashTestInstitution(institution.subscription) &&
      !isPartOfFakeTrialInstitutions(institution.institution.id),
    "No Filter": () => true,
    // More filters can be added here
  };

  const filteredData = useMemo(
    () =>
      adminDashInstitutions.filter((institution) => {
        // Check all filters; only include institutions that pass all active filter checks
        return (
          filter &&
          filterFunctions[filter] &&
          filterFunctions[filter](institution)
        );
      }),
    [adminDashInstitutions, filter],
  );

  return (
    <div className="flex flex-col justify-center px-10 py-4">
      <ConfirmationModal />
      {!passwordConfirmed ? (
        <div className="mb-4 flex flex-col items-start gap-1">
          <p className="text-sm text-offblack-5 dark:text-offblack-8">
            {"please insert your password"}{" "}
          </p>
          <Input
            placeholder="Passwort"
            text={adminDashPassword}
            setText={setAdminDashPassword}
          />
          <Button onClick={() => setPasswordConfirmed(true)}>
            Confirm Password
          </Button>
        </div>
      ) : (
        <>
          <AdminDashFilters />
          <div className="h-4"></div>
          <AsyncTable<AdminDashInstitution>
            promise={() => getAdminDashInstitutions(adminDashPassword)}
            columns={columns}
            data={filter ? filteredData : adminDashInstitutions}
            setData={setAdminDashInstitutions}
            refreshTrigger={refresh}
            styleSettings={{
              showSearchBar: true,
              rowsPerPage: 50,
              additionalComponent:
                selectedInstitutionIds.length === 0 ? (
                  <AdminDashTopRightMenu />
                ) : (
                  <DeleteMultipleButton />
                ),
            }}
          />
        </>
      )}
      <InstitutionOverviewSheet
        open={openOverviewSheet}
        setOpen={setOpenOverviewSheet}
      />
      <EditPopover />
    </div>
  );
});

AdminDashboard.displayName = "AdminDashboard";
