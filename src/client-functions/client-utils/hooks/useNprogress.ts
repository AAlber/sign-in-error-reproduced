import { useRouter } from "next/router";
import nProgress from "nprogress";
import { useEffect } from "react";

export const useNprogress = () => {
  const router = useRouter();
  useEffect(() => {
    nProgress.configure({ showSpinner: false });
    router.events.on("routeChangeStart", () => nProgress.trickle());
    router.events.on("routeChangeComplete", () => nProgress.done());
    router.events.on("routeChangeError", () => nProgress.done());
  }, []);
};
