import type { Editor, Range } from "@tiptap/core";
import type { LucideIcon } from "lucide-react";
/**
 * Interface for defining the structure of an Element category.
 */
export interface ElementCategory {
  /** Name of the category. */
  name: string;
}

/**
 * Available Element categories.
 */
export type AvailableElementCategories = "Typography" | "Media" | "Technical";

/**
 * Example categories.
 * Define your categories here as needed.
 */
export const ElementCategories: {
  [name in AvailableElementCategories]: ElementCategory;
} = {
  Typography: {
    name: "typography",
  },
  Media: {
    name: "media",
  },
  Technical: {
    name: "technical",
  },
};

export type AvailableSlashCommandCategories = "Format" | "Insert" | "Misc";

export const SlashCommandCategories: {
  [name in AvailableSlashCommandCategories]: ElementCategory;
} = {
  Format: {
    name: "format",
  },
  Insert: {
    name: "insert",
  },
  Misc: {
    name: "misc",
  },
};

/**
 * Interface for defining the structure of help content.
 */
export type HelpContent = {
  videoUrl?: string;
  description: string;
};

/**
 * Interface for defining the structure of a registered Element.
 */
export interface RegisteredElement {
  /** Name of the element. */
  name: string;
  /** Icon for the element. */
  icon: LucideIcon;
  /** Detailed icon for the element. */
  detailedIcon: JSX.Element;
  /** Description for the element. */
  description: string;
  /** Help content for the element. */
  helpContent: HelpContent;
  /** Search terms for the element. */
  searchTerms: string[];
  /** On slash command. */
  onSlashCommand?: ({
    editor,
    range,
  }: {
    editor: Editor;
    range: Range;
  }) => void;
  /** On click. */
  onClick: ({ editor }: { editor: Editor }) => void;
  /** On drop. */
  onDrop?: ({ editor, pos }: { editor: Editor; pos: number }) => void;
  /** Mandatory category for the element. */
  category: ElementCategory;
  /** Optional category for the slash command. */
  slashCommandCategory?: ElementCategory;
}

/**
 * Class for managing the registration and retrieval of Elements.
 */
export class ElementRegistry {
  public elementTypes = new Map<string, RegisteredElement>();

  /**
   * Registers a new Element.
   * @param {RegisteredElement} element - The element to register.
   * @throws Will throw an error if the element is missing a category or if an element with the same name is already registered.
   */
  add(element: RegisteredElement) {
    if (!element.category) {
      throw new Error(`Element '${element.name}' must have a category.`);
    }

    if (this.elementTypes.has(element.name)) {
      throw new Error(
        `Element with name ${element.name} is already registered.`,
      );
    }

    this.elementTypes.set(element.name, element);
  }

  /**
   * Retrieves a registered Element by its name.
   * @param {string} name - The name of the Element to retrieve.
   * @returns {RegisteredElement} The registered Element.
   * @throws Will throw an error if the Element with the specified name is not found.
   */
  get(name: string): RegisteredElement {
    const element = this.elementTypes.get(name);
    if (!element) {
      throw new Error(`Element with name ${name} not found.`);
    }
    return element;
  }
}

/**
 * Builder class for creating and configuring Elements.
 */
export class ElementBuilder {
  private element: Partial<RegisteredElement> = {};

  /**
   * Sets the name of the Element.
   * @param {string} name - The name of the Element.
   * @returns {ElementBuilder} This builder instance for chaining.
   */
  withName(name: string): ElementBuilder {
    this.element.name = name;
    return this;
  }

  /**
   * Sets the icon of the Element.
   * @param {React.ReactNode} icon - The icon of the Element.
   * @returns {ElementBuilder} This builder instance for chaining.
   */
  withIcon(icon: LucideIcon): ElementBuilder {
    this.element.icon = icon;
    return this;
  }

  /**
   * Sets the detailed icon of the Element.
   * @param {JSX.Element} detailedIcon - The detailed icon of the Element.
   * @returns {ElementBuilder} This builder instance for chaining.
   */
  withDetailedIcon(detailedIcon: JSX.Element): ElementBuilder {
    this.element.detailedIcon = detailedIcon;
    return this;
  }

  /**
   * Sets the description of the Element.
   * @param {string} description - The description of the Element.
   * @returns {ElementBuilder} This builder instance for chaining.
   */
  withDescription(description: string): ElementBuilder {
    this.element.description = description;
    return this;
  }

  /**
   * Sets the search tags of the Element.
   * @param {string[]} tags - The search tags of the Element.
   * @returns {ElementBuilder} This builder instance for chaining.
   */
  withSearchTerms(tags: string[]): ElementBuilder {
    this.element.searchTerms = tags;
    return this;
  }

  /**
   * Sets the category of the Element.
   * @param {ElementCategory} category - The category of the Element.
   * @returns {ElementBuilder} This builder instance for chaining.
   */
  withCategory(category: AvailableElementCategories): ElementBuilder {
    this.element.category = ElementCategories[category];
    if (!this.element.category) {
      throw new Error(`Category with name ${category} not found.`);
    }
    return this;
  }

  /**
   * Sets the help content of the Element.
   * @param {HelpContent} helpContent - The help content of the Element.
   * @returns {ElementBuilder} This builder instance for chaining.
   */
  withHelpContent(helpContent: HelpContent): ElementBuilder {
    this.element.helpContent = helpContent;
    return this;
  }

  /**
   * Sets the slash command category of the Element.
   * @param {ElementCategory} category - The category of the Element.
   * @returns {ElementBuilder} This builder instance for chaining.
   */
  withSlashCommandCategory(
    category: AvailableSlashCommandCategories,
  ): ElementBuilder {
    this.element.slashCommandCategory = SlashCommandCategories[category];
    if (!this.element.slashCommandCategory) {
      throw new Error(`Category with name ${category} not found.`);
    }
    return this;
  }

  /**
   * Sets the on slash command of the Element. If not set, the Element will not appear in the slash command menu.
   * @param {({ editor, range }: { editor: Editor; range: Range }) => void} onSlashCommand - The on slash command of the Element.
   * @returns {ElementBuilder} This builder instance for chaining.
   */
  withSlashCommand(
    slashCommandCategory: AvailableSlashCommandCategories,
    onSlashCommand: ({
      editor,
      range,
    }: {
      editor: Editor;
      range: Range;
    }) => void,
  ): ElementBuilder {
    this.withSlashCommandCategory(slashCommandCategory);
    this.element.onSlashCommand = onSlashCommand;
    return this;
  }

  /**
   * Sets the on click of the Element.
   * @param {({ editor }: { editor: Editor }) => void} onClick - The on click of the Element.
   * @returns {ElementBuilder} This builder instance for chaining.
   */
  withOnClickCommand(
    onClick: ({ editor }: { editor: Editor }) => void,
  ): ElementBuilder {
    this.element.onClick = onClick;
    return this;
  }

  /**
   * Sets the on drop of the Element. If not set, the Element will not be droppable.
   * @param {({ editor, pos }: { editor: Editor; pos: number }) => void} onDrop - The on drop of the Element.
   * @returns {ElementBuilder} This builder instance for chaining.
   */
  withDropCommand(
    onDrop: ({ editor, pos }: { editor: Editor; pos: number }) => void,
  ): ElementBuilder {
    this.element.onDrop = onDrop;
    return this;
  }

  /**
   * Builds and returns the configured Element.
   * @returns {RegisteredElement} The configured Element.
   * @throws Will throw an error if required properties are missing.
   */
  build(): RegisteredElement {
    if (!this.element.name) {
      throw new Error(`Missing required property: name.`);
    }

    if (!this.element.icon) {
      throw new Error(`Missing required property: icon.`);
    }

    if (!this.element.detailedIcon) {
      throw new Error(`Missing required property: detailedIcon.`);
    }

    if (!this.element.category) {
      throw new Error(`Missing required property: category.`);
    }

    if (!this.element.description) {
      throw new Error(`Missing required property: description.`);
    }

    if (!this.element.searchTerms) {
      throw new Error(`Missing required property: tags.`);
    }

    if (!this.element.helpContent) {
      throw new Error(`Missing required property: helpContent.`);
    }

    if (!this.element.onClick) {
      throw new Error(`Missing required property: onClick.`);
    }

    return this.element as RegisteredElement;
  }
}

const elementRegistry = new ElementRegistry();
export default elementRegistry;
