import { useNavigation } from "../navigation/zustand";
import { initializePageRegistry } from "./page-initializer";
import type { PageRegistry } from "./page-registry";

export class PageOperations {
  private _registry: PageRegistry;
  private static _instance: PageOperations;

  private constructor(registry: PageRegistry) {
    this._registry = registry;
  }

  static getInstance(): PageOperations {
    if (!PageOperations._instance) {
      const registry = initializePageRegistry();
      PageOperations._instance = new PageOperations(registry);
    }
    return PageOperations._instance;
  }

  setPage(page: Page["titleKey"]) {
    const zustand = useNavigation.getState();
    zustand.setPage(page);
  }

  getCurrentPage() {
    const zustand = useNavigation.getState();
    const pageKey = zustand.page;
    return this.getPage(pageKey);
  }

  getPage(page: Page["titleKey"]) {
    if (!this._registry.listRegisteredKeys().includes(page.toString())) {
      this.setPage("COURSES");
      return this._registry.get("COURSES");
    }
    return this._registry.get(page);
  }

  getPages() {
    return this._registry.getRegisteredPages();
  }

  async getSecondaryNavigationElements(): Promise<
    SecondaryNavigationElement[]
  > {
    const page = this.getCurrentPage();

    // Ensure the page is defined and has a navigationType before proceeding.
    if (!page) {
      throw new Error("No current page is set.");
    }

    switch (page.navigationType) {
      case "with-static-secondary-navigation":
        // Directly return the static elements if the page has static secondary navigation.
        return page.secondaryNavigationElements;

      case "with-dynamic-secondary-navigation":
        // Await and return the fetched elements for dynamic secondary navigation.
        try {
          return await page.fetchSecondaryNavigationElements();
        } catch (error) {
          console.error(
            "Failed to fetch dynamic secondary navigation elements:",
            error,
          );
          throw new Error(
            "Error fetching dynamic secondary navigation elements.",
          );
        }

      default:
        // Return an empty array for pages without secondary navigation.
        return [];
    }
  }
}
