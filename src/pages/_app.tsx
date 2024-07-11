import "nprogress/nprogress.css";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/chat.scss";
import "../../styles/globals.css";
import "../translations/i18n/index";
import { deDe, enUS } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { setAutoFreeze } from "immer";
import { type AppType } from "next/app";
import { useRouter } from "next/router";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { IntercomProvider } from "react-use-intercom";
import useUser from "@/src/zustand/user";
import { geist } from "@/styles/fonts";
import { getTargetAndToken } from "../client-functions/client-invite";
import useAuthSignout from "../client-functions/client-signout";
import useThemeStore from "../components/dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";
import ErrorBoundary from "../components/error-boundary";
import GetStreamProvider from "../components/getstream";
import Intercom from "../components/intercom";
import usePersistInvite from "../components/invitation/persist-invite-zustand";
import { Toaster } from "../components/reusable/toaster";
import { UserProvider } from "../components/user-provider";
import useDragObject from "../zustand/dragged-object";
import useEdgeConfig from "../zustand/edge-config";

const MyApp: AppType = (props) => {
  const { theme } = useThemeStore();
  const { user } = useUser();

  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: { queries: { refetchOnWindowFocus: false } },
    }),
  );

  const { persistedInvite } = usePersistInvite();
  const isDark = theme === "dark";

  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    const { target, token } = getTargetAndToken(router);
    const targetsAreEqual = persistedInvite?.target === target;
    const tokensAreEqual = persistedInvite?.token === token;
    const bothTargetAndTokenMatch = targetsAreEqual && tokensAreEqual;

    if (
      persistedInvite &&
      !window.location.href.includes("process-invitation")
    ) {
      if (bothTargetAndTokenMatch) {
        window.location.assign(
          `/process-invitation/${persistedInvite.target}/${persistedInvite.token}`,
        );
      } else {
        if (!target || !token) {
          window.location.assign(
            `/process-invitation/${persistedInvite.target}/${persistedInvite.token}`,
          );
        }
      }
    }

    // assign queryClient to window, so that it can be used anywhere, e.g. inside functions
    window.queryClient = queryClient;
  }, [persistedInvite, router.isReady, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <main className={geist.className}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <IntercomProvider appId={"ujn432m3"} autoBoot>
            <Intercom />
            <ClerkProvider
              appearance={{
                baseTheme: isDark ? dark : undefined,
                userProfile: {
                  layout: {
                    shimmer: true,
                  },
                  variables: {
                    borderRadius: "5px",
                  },
                  elements: {
                    navbar: "p-2",
                    formField__signOutOfOtherSessions: "hidden",
                    avatarBox:
                      "border border-offwhite-3 dark:border-offblack-5",
                    avatarImage: "rounded-full border-none",
                    navbarButton: "px-2 hover:bg-accent/50",
                    navbarButton__active:
                      "rounded-md text-contrast bg-primary hover:bg-secondary",
                    modalBackdrop: "bg-background/50",
                    modalContent: "border border-border rounded-[14px]",
                  },
                },
                elements: {
                  navbarButton__active:
                    "rounded-md text-contrast bg-primary hover:bg-secondary",
                  avatarImage:
                    "border offwhite-3 dark:border-offblack-5 rounded-full",
                  otpCodeFieldInput:
                    "rounded-md h-9 border-solid bg-background focus:outline-none focus:ring-transparent dark:text-white border-offwhite-3 dark:border-offblack-5",
                  formButtonPrimary:
                    "bg-black dark:bg-background dark:text-black text-white font-bold py-2 hover:bg-offblack-2 dark:hover:bg-offwhite-2 h-9 rounded-md",
                  footerActionLink:
                    "flex justify-center text-sm dark:text-white text-black",
                  footerActionText: "dark:text-offblack-8 text-offwhite-5",
                  formFieldInput:
                    "rounded-md h-9 border-solid bg-background focus:outline-none focus:ring-transparent dark:text-white border-offwhite-3 dark:border-offblack-5",
                },
                variables: {
                  colorWarning: "yellow",
                  colorDanger: "red",
                  colorSuccess: "green",
                  // Had to be removed for core-2
                  // colorAlphaShade: isDark ? "white" : "black",
                  colorTextSecondary: isDark
                    ? "hsl(215,20.2%,65.1%)"
                    : "hsl(215.4,16.3%,46.9%)",
                  colorBackground: isDark
                    ? "hsl(222.2,84%,4.9%)"
                    : "hsl(0,0%,97.5%)",
                  borderRadius: "4px",
                  colorPrimary: "#3b82f6",
                  colorText: isDark
                    ? "hsl(210,40%,98%)"
                    : "hsl(222.2,84%,4.9%)",
                },
              }}
              localization={user.language === "de" ? deDe : enUS}
              {...props.pageProps}
            >
              <Main {...props} />
              <SpeedInsights />
            </ClerkProvider>
          </IntercomProvider>
        </NextThemesProvider>
        <Analytics />
      </main>
    </QueryClientProvider>
  );
};

export default MyApp;

function Main({ Component, pageProps }) {
  const { fetchEdgeConfig } = useEdgeConfig();
  const { setData, setResult } = useDragObject();
  const { signOut } = useAuthSignout("app.tsx");

  useEffect(() => {
    setAutoFreeze(false); // https://immerjs.github.io/immer/freezing/
    const abortController = new AbortController();
    fetchEdgeConfig(process.env.NODE_ENV !== "development");

    return () => {
      abortController.abort();
    };
  }, []);

  const onDragUpdate = (update: any) => {
    const { destination, source } = update;
    if (!destination) return;
    if (
      destination?.droppableId === source.droppableId &&
      destination?.index === source.index
    ) {
      return;
    }
  };

  useEffect(() => {
    if (!window) return;
    function handleFirstTab(e: KeyboardEvent) {
      if (e.key === "Tab") {
        document.body.classList.add("user-is-tabbing");
        window.removeEventListener("keydown", handleFirstTab);
        window.addEventListener("mousedown", handleMouseDownOnce);
      }
    }

    function handleMouseDownOnce() {
      document.body.classList.remove("user-is-tabbing");
      window.removeEventListener("mousedown", handleMouseDownOnce);
      window.addEventListener("keydown", handleFirstTab);
    }

    window.addEventListener("keydown", handleFirstTab);
  }, []);

  return (
    <ErrorBoundary
      onReset={async (_error, close) => {
        await signOut();
        close();
      }}
    >
      <Analytics />
      <UserProvider attribute="class" defaultTheme="system" enableSystem>
        <style jsx global>{`
          html {
            font-family: ${geist.style.fontFamily};
          }
        `}</style>
        <DragDropContext
          onDragUpdate={onDragUpdate}
          onDragEnd={(result) => {
            if (result.combine) {
              setData(result.combine.draggableId, result.draggableId);
            } else if (!result.destination?.droppableId) return;
            else {
              setData(result.destination.droppableId, result.draggableId);
              setResult(result);
            }
          }}
        >
          <GetStreamProvider>
            <Component {...pageProps} />
          </GetStreamProvider>
        </DragDropContext>
      </UserProvider>
      <Toaster />
    </ErrorBoundary>
  );
}

declare global {
  interface Window {
    queryClient: QueryClient;
  }
}
