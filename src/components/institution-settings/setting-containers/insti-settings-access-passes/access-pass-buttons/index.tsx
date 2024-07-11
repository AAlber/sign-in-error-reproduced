import { useRouter } from "next/router";
import { useEffect } from "react";
import { getStripeConnectAccount } from "@/src/client-functions/client-paid-access-pass";
import { removeQueryParam } from "@/src/client-functions/client-utils";
import AsyncComponent from "@/src/components/reusable/async-component";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { BasicAccountInfo } from "@/src/utils/stripe-types";
import AccessPassLearn from "../access-pass-learn";
import { useAccessPasses } from "../zustand";
import AddAccessPassButton from "./add-access-pass";
import CreateStripeAccountButton from "./create-stripe-account";

export default function AccessPassButtons() {
  const {
    accountCompletionInProgress,
    accountInfo,
    setAccountCompletionInProgress,
  } = useAccessPasses();

  const router = useRouter();
  useEffect(() => {
    if (
      accountInfo?.id &&
      accountInfo?.enabled &&
      accountCompletionInProgress
    ) {
      setAccountCompletionInProgress(false);
      removeQueryParam(router);
    }
  }, [accountInfo]);
  return (
    <AsyncComponent
      promise={getStripeConnectAccount}
      component={(accountInfo: BasicAccountInfo) => (
        <div className="items-between flex w-full justify-between">
          <div className="flex gap-2">
            <AddAccessPassButton accountInfo={accountInfo} />
            {accountCompletionInProgress ? (
              <Button> {"access_pass.account_processing"} </Button>
            ) : accountInfo.id && accountInfo.enabled ? (
              <></>
            ) : (
              <CreateStripeAccountButton />
            )}
          </div>
          <AccessPassLearn />
        </div>
      )}
    />
  );
}
