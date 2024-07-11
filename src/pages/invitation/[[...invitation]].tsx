import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { onInitialLoad } from "@/src/client-functions/client-invite";
import InvitationError from "@/src/components/invitation/invitation-error";
import InvitationLoader from "@/src/components/invitation/loader";
import useInvitation from "@/src/components/invitation/zustand";

export default function Invitation() {
  const { user } = useUser();
  const { inviteResponse } = useInvitation();
  const router = useRouter();

  useEffect(() => {
    onInitialLoad(router, user?.id);
  }, [router.isReady]);

  return (
    <>
      <Head>
        <title>Processing invite...</title>
        <meta name="description" content="Processing invite..." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-screen w-screen">
        {inviteResponse?.success === false ? (
          <InvitationError />
        ) : (
          <InvitationLoader />
        )}
      </div>
    </>
  );
}
