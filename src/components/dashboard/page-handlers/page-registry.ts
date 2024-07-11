/**
 * A builder class for creating page objects with various configurations.
 */
export class PageBuilder {
  protected page: Partial<Page> = {};

  constructor(private titleKey: PageKey) {
    this.page.titleKey = titleKey;
  }

  /**
   * Sets the icon component for the page.
   * @param iconComponent - A React node to be used as the icon component.
   * @returns The instance of PageBuilder for chaining.
   */
  withIconComponent(iconComponent: React.ReactNode): PageBuilder {
    this.page.iconComponent = iconComponent;
    return this;
  }

  /**
   * Sets the required role for the page.
   * @param accessRoles - The role required to access the page.
   * @returns The instance of PageBuilder for chaining.
   */
  withAccessRoles(accessRoles: Role[]): PageBuilder {
    this.page.accessRoles = accessRoles;
    return this;
  }

  /**
   * Sets the split screen component for the page.
   * This will display a resizable split screen besides the normal content.
   * @param splitScreenComponent - A React node to be used as the split screen component.
   * @returns The instance of PageBuilder for chaining.
   */
  withSplitScreenComponent(splitScreenComponent: React.ReactNode): PageBuilder {
    this.page.splitScreenComponent = splitScreenComponent;
    return this;
  }

  /**
   * Sets the navigation type of the page and returns the appropriate builder interface
   * based on the specified navigation type.
   * @param navigationType - The navigation type of the page.
   * @returns An instance of the appropriate builder interface for chaining.
   */
  withNavigationType<T extends Page["navigationType"]>(
    navigationType: T,
  ): NavigationTypeToBuilderMap[T] {
    this.page.navigationType = navigationType;
    let builder: NavigationTypeToBuilderMap[T];

    switch (navigationType) {
      case "without-secondary-navigation":
        builder = new WithoutSecondaryNavigationBuilder(
          this.page,
        ) as NavigationTypeToBuilderMap[T];
        break;
      case "with-static-secondary-navigation":
        builder = new WithStaticSecondaryNavigationBuilder(
          this.page,
        ) as NavigationTypeToBuilderMap[T];
        break;
      case "with-dynamic-secondary-navigation":
        builder = new WithDynamicSecondaryNavigationBuilder(
          this.page,
        ) as NavigationTypeToBuilderMap[T];
        break;
      default:
        throw new Error(`Invalid navigation type: ${navigationType}`);
    }

    return builder;
  }
}

// Builder for pages without secondary navigation
class WithoutSecondaryNavigationBuilder {
  private _page: Partial<PageWithoutSecondaryNavigation> = {};

  constructor(private page: Partial<Page>) {
    this._page = page as Partial<PageWithoutSecondaryNavigation>;
  }

  withContentComponent(
    contentComponent: React.ReactNode,
  ): WithoutSecondaryNavigationBuilder {
    this._page.contentComponent = contentComponent;
    return this;
  }

  withToolbarComponent(
    toolbarComponent: React.ReactNode,
  ): WithoutSecondaryNavigationBuilder {
    this._page.toolbarComponent = toolbarComponent;
    return this;
  }

  build(): PageWithoutSecondaryNavigation {
    return this.page as PageWithoutSecondaryNavigation;
  }
}

class WithStaticSecondaryNavigationBuilder {
  private _page: Partial<PageWithStaticSecondaryNavigation> = {};

  constructor(private page: Partial<Page>) {
    this._page = page as Partial<PageWithStaticSecondaryNavigation>;
  }

  withSecondaryNavigationElements(
    elements: SecondaryNavigationElement[],
  ): WithStaticSecondaryNavigationBuilder {
    this._page.secondaryNavigationElements = elements;
    return this;
  }

  withOptions(options: PageOptions) {
    this._page.options = options;
    return this;
  }

  build(): PageWithStaticSecondaryNavigation {
    return this.page as PageWithStaticSecondaryNavigation;
  }
}

class WithDynamicSecondaryNavigationBuilder {
  private _page: Partial<PageWithDynamicSecondaryNavigation> = {};

  constructor(private page: Partial<Page>) {
    this._page = page as Partial<PageWithDynamicSecondaryNavigation>;
  }

  /**
   * Sets the function that fetches elements for the secondary navigation asynchronously.
   * @param fetchElements - A function that fetches elements for the secondary navigation asynchronously.
   * @returns The instance of PageBuilder for chaining.
   */
  withDynamicSecondaryNavigationElements(
    fetchElements: () => Promise<SecondaryNavigationElement[]>,
  ): WithDynamicSecondaryNavigationBuilder {
    this._page.fetchSecondaryNavigationElements = fetchElements;
    return this;
  }

  /**
   * Sets the no tabs available disclaimer for the page.
   * This will display a disclaimer when no tabs are available.
   * @param noTabsAvailableDisclaimer - A React node to be used as the no tabs available disclaimer.
   * @returns The instance of PageBuilder for chaining.
   */
  withNoTabsAvailableDisclaimer(
    noTabsAvailableDisclaimer: React.ReactNode,
  ): WithDynamicSecondaryNavigationBuilder {
    this._page.noTabsAvailableDisclaimer = noTabsAvailableDisclaimer;
    return this;
  }

  /**
   * Sets the no tab selected disclaimer for the page.
   * This will display a disclaimer when no tab is selected.
   * @param noTabSelectedDisclaimer - A React node to be used as the no tab selected disclaimer.
   * @returns The instance of PageBuilder for chaining.
   */
  withNoTabSelectedDisclaimer(
    noTabSelectedDisclaimer: React.ReactNode,
  ): WithDynamicSecondaryNavigationBuilder {
    this._page.noTabSelectedDisclaimer = noTabSelectedDisclaimer;
    return this;
  }

  /**
   * Sets the skeleton component for the page to be displayed while fetching the secondary navigation elements.
   * @param skeletonComponent - A React node to be used as the skeleton component.
   * @returns The instance of PageBuilder for chaining.
   */
  withSkeletonComponent(
    skeletonComponent: React.ReactNode,
  ): WithDynamicSecondaryNavigationBuilder {
    this._page.skeletonComponent = skeletonComponent;
    return this;
  }

  withOptions(options: PageOptions) {
    this._page.options = options;
    return this;
  }

  build(): PageWithDynamicSecondaryNavigation {
    return this.page as PageWithDynamicSecondaryNavigation;
  }
}

/**
 * A registry class for managing page configurations.
 */
class PageRegistry {
  private pages = new Map<string, Page>();

  /**
   * Registers a new page configuration.
   * @param page - The page object to register.
   * @throws Error if a page with the same key is already registered.
   */
  add(page: Page) {
    if (this.pages.has(page.titleKey)) {
      throw new Error(
        `Page with key '${page.titleKey}' is already registered.`,
      );
    }
    this.pages.set(page.titleKey, page);
  }

  /**
   * Retrieves a registered page by its key.
   * @param titleKey - The key of the page to retrieve.
   * @returns The registered page object.
   * @throws Error if the page with the specified key is not found.
   */
  get(titleKey: PageKey): Page {
    const page = this.pages.get(titleKey);
    if (!page) {
      throw new Error(`Page with title key '${titleKey}' not found.`);
    }
    return page;
  }

  /**
   * Lists the keys of all registered pages.
   * @returns An array of registered page keys.
   */
  listRegisteredKeys(): string[] {
    return Array.from(this.pages.keys());
  }

  /**
   * Gets an array of all registered pages.
   * @returns An array of registered page objects.
   */
  getRegisteredPages(): Page[] {
    return Array.from(this.pages.values());
  }
}

export { PageRegistry };

type NavigationTypeToBuilderMap = {
  "without-secondary-navigation": WithoutSecondaryNavigationBuilder;
  "with-static-secondary-navigation": WithStaticSecondaryNavigationBuilder;
  "with-dynamic-secondary-navigation": WithDynamicSecondaryNavigationBuilder;
};
