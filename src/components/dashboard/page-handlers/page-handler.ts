import { PageOperations } from "./page-operations";

/**
 * Facade for managing and accessing page-related operations.
 * This class provides a simplified interface to various page state operations,
 * abstracting away the complexities of directly interacting with the PageOperations.
 */
class PageHandler {
  private operations = PageOperations.getInstance();

  /**
   * Container for methods related to setting page states.
   */
  set = {
    /**
     * Sets the current page in the application state.
     * @param {Page} page - The page object to set as the current page.
     */
    page: this.operations.setPage.bind(this.operations),
  };

  /**
   * Container for methods related to getting page states and elements.
   */
  get = {
    /**
     * Retrieves the current page from the application state.
     * @returns {Page} The current page object.
     */
    currentPage: this.operations.getCurrentPage.bind(this.operations),

    /**
     * Retrieves a list of all available pages in the application.
     * @returns {Page[]} An array of page objects representing all available pages.
     */
    availablePages: this.operations.getPages.bind(this.operations),

    /**
     * Retrieves a specific page by its key from the application state.
     * @param {string} key - The key of the page to retrieve.
     * @returns {Page} The page object corresponding to the provided key.
     */
    page: this.operations.getPage.bind(this.operations),

    /**
     * Fetches secondary navigation elements based on the navigation type of the current page.
     * This method supports both static and dynamic secondary navigation configurations.
     * @returns {Promise<SecondaryNavigationElement[]>} A promise that resolves to an array of SecondaryNavigationElement objects.
     */
    secondaryNavigationElements:
      this.operations.getSecondaryNavigationElements.bind(this.operations),
  };
}

const pageHandler = new PageHandler();
export default pageHandler;
