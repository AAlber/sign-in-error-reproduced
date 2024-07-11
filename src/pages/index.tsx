import Head from "next/head";
import { useSyncInstitutionThemeAndLanguage } from "../client-functions/client-utils/hooks/useSyncInstitutionThemeAndLanguage";
import { useSyncWithRouter } from "../client-functions/client-utils/hooks/useSyncWithRouter";
import { useSyncWithStripe } from "../client-functions/client-utils/hooks/useSyncWithStripe";
import { Dashboard } from "../components/dashboard";
import { NavigationProvider } from "../components/dashboard/navigation/navigation-provider";
import SplitScreenComponent from "../components/dashboard/split-screen-component";
import { PageWrapper } from "../components/reusable/page-layout/wrapper";
import {
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/reusable/shadcn-ui/resizable";

/**
 * The main page component for the application's dashboard.
 * It sets up the page's head elements, applies the institution's theme,
 * synchronizes page state with the router, and conditionally sets the current page based on the user's role.
 * It also renders the dashboard layout, including the toolbar, navigation bars, and page content.
 */
export default function Index() {
  // Synchronize application state with URL parameters and manage subscription checks.
  useSyncWithRouter();

  // Syncing with stripe and opening a modal if the user is not subscribed
  useSyncWithStripe();

  // Apply institution's theme and sync language settings for personalized experience.
  useSyncInstitutionThemeAndLanguage();

  return (
    <>
      <Head>
        <title>Fuxam</title>
        <meta name="description" content="Redefining education" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      {/* Page wrapper includes modals and other overlays */}
      <PageWrapper>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>
            <NavigationProvider>
              {/* Dashboard toolbar: displays action items and page-specific controls */}
              <Dashboard>
                {/* Main dashboard layout: includes navigation bars and content area */}
                <Dashboard.Navigation>
                  {/* Primary navigation bar on the far left side*/}
                  <Dashboard.Navigation.Primary>
                    {/* Top section of the primary navigation bar: contains pages and user based items */}
                    <Dashboard.Navigation.Primary.Top>
                      <Dashboard.Navigation.Primary.InstitutionLogo />
                      <Dashboard.Navigation.Primary.Pages />
                    </Dashboard.Navigation.Primary.Top>

                    {/* Bottom section of the primary navigation bar: only contains user account  */}
                    <Dashboard.Navigation.Primary.Bottom>
                      <Dashboard.Navigation.Primary.UserServices />
                      <Dashboard.Navigation.Primary.Support />
                      <Dashboard.Navigation.Primary.UserAccount />
                    </Dashboard.Navigation.Primary.Bottom>
                  </Dashboard.Navigation.Primary>

                  {/* Secondary navigation bar: contextually 
                    changes based on the primary page selection, providing sub-navigation 
                    (if available for current page)*/}
                  <Dashboard.Navigation.Secondary>
                    <Dashboard.Navigation.Secondary.SearchInput />
                    <Dashboard.Navigation.Secondary.ConditionalSkeleton />
                    <Dashboard.Navigation.Secondary.Tabs />
                  </Dashboard.Navigation.Secondary>
                </Dashboard.Navigation>
                <Dashboard.ContentWithNavigation>
                  <Dashboard.Toolbar />
                  <Dashboard.Content />
                </Dashboard.ContentWithNavigation>
                {/* Content area: displays the main content based on selected page and tab */}
              </Dashboard>
            </NavigationProvider>
          </ResizablePanel>

          <SplitScreenComponent />
          {/* Optional Split screen component: displays a resizable panel next to the main content */}
        </ResizablePanelGroup>
      </PageWrapper>
    </>
  );
}
