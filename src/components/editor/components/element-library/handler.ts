import { initializeElementsRegistry } from "./init"; // Adjust the import path as necessary
import type {
  ElementCategory,
  ElementRegistry,
  RegisteredElement,
} from "./registry";
import { ElementCategories, SlashCommandCategories } from "./registry";

export class ElementRegistryHandler {
  /** The registry that holds information about registered elements. */
  private registry: ElementRegistry;

  /** A singleton instance of the `ElementRegistryHandler` class. */
  private static instance: ElementRegistryHandler;

  /**
   * Creates an instance of the `ElementRegistryHandler` class.
   * @param {ElementRegistry} registry - The element registry.
   * @private
   */
  private constructor(registry: ElementRegistry) {
    this.registry = registry;
  }

  /**
   * Provides the singleton instance of the `ElementRegistryHandler` class.
   * @returns {ElementRegistryHandler} The singleton instance.
   */
  static getInstance(): ElementRegistryHandler {
    if (!ElementRegistryHandler.instance) {
      const registry = initializeElementsRegistry();
      ElementRegistryHandler.instance = new ElementRegistryHandler(registry);
    }
    return ElementRegistryHandler.instance;
  }

  /**
   * Lists the names of all registered Elements.
   * @returns {string[]} An array of registered Element names.
   */
  listRegisteredElements(): string[] {
    return Array.from(this.registry.elementTypes.keys());
  }

  /**
   * Gets an array of all registered Elements.
   * @returns {RegisteredElement[]} An array of registered Elements.
   */
  getRegisteredElements(): RegisteredElement[] {
    return Array.from(this.registry.elementTypes.values());
  }

  /**
   * Gets an array of all categories
   * @returns {ElementCategory[]} An array of all categories
   */
  getCategories(): ElementCategory[] {
    return Object.values(ElementCategories);
  }

  /**
   * Gets an array of all slash command categories
   * @returns {ElementCategory[]} An array of all slash command categories
   */
  getSlashCommandCategories(): ElementCategory[] {
    return Object.values(SlashCommandCategories);
  }
}

const elementRegistryHandler = ElementRegistryHandler.getInstance();
export default elementRegistryHandler;
