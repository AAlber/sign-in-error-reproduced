import { useEffect } from "react";
import useAuthSignout from "@/src/client-functions/client-signout";
import FuxamBotLayoutWithBox from "@/src/components/reusable/fuxam-bot-layout-box";
import Spinner from "@/src/components/spinner";

const SignOutPage = () => {
  const { signOut } = useAuthSignout("sign-out");

  useEffect(() => {
    signOut();
  }, []);

  return (
    <>
      <div className="h-screen w-screen">
        <FuxamBotLayoutWithBox state={"welcome"}>
          <FuxamBotLayoutWithBox.Heading>
            Signing out...
          </FuxamBotLayoutWithBox.Heading>
          <Spinner />
        </FuxamBotLayoutWithBox>
      </div>
    </>
  );
};

export default SignOutPage;
