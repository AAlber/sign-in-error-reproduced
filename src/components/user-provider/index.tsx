import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import useSetNotificationsPermission from "@/src/client-functions/client-notification/hooks/useSetNotificationsPermission";
import FullScreenSkeleton from "../reusable/fullscreen-skeleton";
import {
  useCheckIfUserNeedsToFilloutOrganizationData,
  useInitializeAppTheme,
  useInitializeUser,
} from "./hooks";

export function UserProvider({ children, ...props }: ThemeProviderProps) {
  const { user, loading, isSignedIn, isClerkLoaded } = useInitializeUser();
  useInitializeAppTheme(user);
  useSetNotificationsPermission();
  useCheckIfUserNeedsToFilloutOrganizationData(user, loading);

  if (!isSignedIn && isClerkLoaded) return <>{children}</>;

  if (loading) return <FullScreenSkeleton />;

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
