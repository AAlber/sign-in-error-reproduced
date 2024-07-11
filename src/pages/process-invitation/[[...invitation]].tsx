import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  onCompletedAccessPassPayment,
  onInitialInviteLoad,
  onReceiveInviteResponse,
  shouldShowLoader,
} from "@/src/client-functions/client-invite";
import InvitationError from "@/src/components/invitation/invitation-error";
import InvitationJoiner from "@/src/components/invitation/invitation-joiner";
import InvitationLoader from "@/src/components/invitation/loader";
import useInvitation from "@/src/components/invitation/zustand";

export default function Invitation() {
  const { invite, inviteResponse } = useInvitation();
  const { user, isLoaded } = useUser();
  const [accessPassValidatorToken, setAccessPassValidatorToken] =
    useState<string>();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    onInitialInviteLoad(router, setAccessPassValidatorToken, user?.id);
  }, [router.isReady, isLoaded]);

  useEffect(() => {
    onCompletedAccessPassPayment(accessPassValidatorToken);
  }, [accessPassValidatorToken, invite]);

  useEffect(() => {
    if (user) onReceiveInviteResponse(router);
  }, [inviteResponse]);

  const showLoader = shouldShowLoader();

  return (
    <>
      <Head>
        <title>Processing invite...</title>
        <meta name="description" content="Processing invite..." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen w-screen">
        {showLoader ? (
          <InvitationLoader />
        ) : inviteResponse?.error ? (
          <InvitationError />
        ) : (
          <InvitationJoiner />
        )}
      </div>
    </>
  );
}
