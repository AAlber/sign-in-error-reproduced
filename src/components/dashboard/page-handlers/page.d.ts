/**
 * Base interface for elements in the secondary navigation.
 */
interface SecondaryNavigationElementBase {
  /** Unique identifier for the navigation element. */
  id: string | number;
}

/**
 * Represents a tab element in the secondary navigation.
 */
interface Tab extends SecondaryNavigationElementBase {
  /** Type of the secondary navigation element, specifically a tab in this case. */
  type: "tab" | "async-tab";
  /** Value used for searching within the tab's content. */
  searchValue: string;
  /** Function that returns the tab component. Accepts a boolean indicating if the tab is active. */
  tabComponent: (isActive: boolean) => React.ReactNode;
  /** Component displayed when this tab is active. */
  contentComponent: React.ReactNode;
  /** Component displayed in the toolbar area when this tab is active. */
  toolbarComponent: React.ReactNode;
  /** Optional to make the tab not clickable */
  disabled?: boolean;
}

/**
 * Represents a divider element in the secondary navigation.
 */
interface Divider extends SecondaryNavigationElementBase {
  /** Type of the secondary navigation element, specifically a divider in this case. */
  type: "divider";
  /** Component that represents the visual appearance of the divider. */
  component: React.ReactNode;
}

/**
 * Union type for sub-navigation elements, which can be either a Tab or a Divider.
 */
type SecondaryNavigationElement = Tab | Divider;

/**
 * Base interface for pages within the application.
 */
interface PageBase {
  /** Key for identifying the title of the page. */
  titleKey: PageKey;
  /** Component used as the icon for the page. */
  iconComponent: React.ReactNode;
  /** Optional role required to access the page. */
  accessRoles?: Role[];
  /** Optional split screen component, that will display a resizable splitscreen besides the normal content */
  splitScreenComponent?: React.ReactNode;
}

/**
 * Interface for pages without secondary navigation.
 */
interface PageWithoutSecondaryNavigation extends PageBase {
  /** Specifies the type of navigation used by the page. */
  navigationType: "without-secondary-navigation";
  /** Main component displayed on the page. */
  contentComponent: React.ReactNode;
  /** Optional component displayed in the toolbar area of the page. */
  toolbarComponent?: React.ReactNode;
}

/**
 * Interface for pages with static secondary navigation.
 */
interface PageWithStaticSecondaryNavigation extends PageBase {
  /** Specifies the type of navigation used by the page. */
  navigationType: "with-static-secondary-navigation";
  /** Array of elements used for the secondary navigation. */
  secondaryNavigationElements: SecondaryNavigationElement[];
  /** optional navigation options */
  options?: PageOptions;
}

/**
 * Interface for pages with dynamic secondary navigation.
 */
interface PageWithDynamicSecondaryNavigation extends PageBase {
  /** Specifies the type of navigation used by the page. */
  navigationType: "with-dynamic-secondary-navigation";
  /** Function that fetches elements for the secondary navigation asynchronously. */
  fetchSecondaryNavigationElements: () => Promise<SecondaryNavigationElement[]>;
  /** Component displayed while fetching the secondary navigation elements. */
  skeletonComponent: React.ReactNode;
  /** Optional no tabs available disclaimer shown when no tabs are available */
  noTabsAvailableDisclaimer?: React.ReactNode;
  /** Optional no content disclaimer shown when no tab is selected */
  noTabSelectedDisclaimer?: React.ReactNode;
  /** optional navigation options */
  options?: PageOptions;
}

/**
 * Union type for all page configurations, including pages without secondary navigation,
 * with static secondary navigation, and with dynamic secondary navigation.
 */
type Page =
  | PageWithoutSecondaryNavigation
  | PageWithStaticSecondaryNavigation
  | PageWithDynamicSecondaryNavigation;

/**
 * Enum-like type for page keys, used for identifying specific pages within the application.
 */
type PageKey =
  | "CHAT"
  | "COURSES"
  | "STRUCTURE"
  | "USERMANAGEMENT"
  | "ORGANIZATION_SETTINGS"
  | "CALENDAR";

type PageOptions = Partial<{
  searchDisabled: boolean;
  fixedSecondaryNavigation: boolean;
  hideBarOnLessThanTwoElements: boolean;
}>;
