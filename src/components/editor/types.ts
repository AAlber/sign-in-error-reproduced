// types.ts
import type { JSONContent } from "@tiptap/react";

/**
 * Represents a page in the workbench.
 * @interface
 */
export interface EditorPage {
  // Unique identifier for the page. You can se
  id: string; // .
  thumbnail?: string; // Thumbnail of the page.
  content: JSONContent | null; // Content of the page in JSON format.
}

/**
 * Represents the data structure for the workbench.
 * @interface
 */
export interface EditorData {
  pages: EditorPage[]; // An array of workbench pages.
}

/**
 * Represents options for configuring the workbench.
 * @type
 */
export type EditorOptions = {
  /**
   * When set to true, displays page manager and element library and makes tiptap editor
   * editable. When set to false, the page navigator will be shown automatically.
   */
  canCreate?: boolean;
  /**
   * Removes element library and displays page navigator. Tiptap editor is not editable
   * but interactive elements can be interacted with.
   */
  canInteract?: boolean;
  /**
   * ID of the block the workbench has been opened from. This is used to save user progress
   * when to the workbench.
   */
  originBlockId?: string;
};

/**
 * Represents the state and actions of the workbench.
 * @interface
 */
export interface Editor {
  /** Indicates whether the workbench is open */
  open: boolean;
  /** ID of the current page */
  currentPageId: string;
  /**
   * When set to true, displays page manager and element library and makes tiptap editor
   * editable. When set to false, the page navigator will be shown automatically.
   */
  canCreate: boolean;
  /**
   * Removes element library and displays page navigator. Tiptap editor is not editable
   * but interactive elements can be interacted with.
   */
  canInteract: boolean;
  /** Storage for the current workbench state, including pages and their content */
  data: EditorData;
  /**
   * ID of the block the workbench has been opened from. This is used to save user progress
   * when to the workbench.
   */
  originBlockId?: string;

  /**
   * Sets the 'open' property.
   * @param {boolean} open - Indicates whether the workbench is open.
   */
  setOpen: (open: boolean) => void;

  /**
   * Sets the ID of the current page.
   * @param {string} data - ID of the new current page.
   */
  setCurrentPageId: (data: string) => void;

  /**
   * Sets the pages data.
   * @param {EditorPage[]} data - New pages data.
   */
  setPages: (data: EditorPage[]) => void;

  /**
   * Gets all pages.
   * @returns {EditorPage[]} An array containing all pages.
   */
  getPages: () => EditorPage[];

  /**
   * Updates the content of the current page.
   * @param {JSONContent} data - New content for the current page.
   */
  updateCurrentPageContent: (data: JSONContent) => void;

  /**
   * Gets the content of the current page.
   * @returns {JSONContent} The content of the current page.
   */
  getCurrentPageContent: () => JSONContent | null;

  /**
   * Gets the thumbnail of the current page.
   * @returns {HTMLCanvasElement} The thumbnail of the current page.
   */
  getCurrentPageThumbnail: () => string | undefined | null;

  /**
   * Updates the thumbnail of a page with a specific ID.
   * @param {string} pageId - ID of the page.
   * @param {HTMLCanvasElement} thumbnail - New thumbnail for the page.
   */
  updatePageThumbnail: (pageId: string, thumbnail: string) => void;

  /**
   * Inserts a new page at a specific index.
   * @param {number} pageIndex - Index where the new page should be inserted.
   * @param {JSONContent} pageContent - Content for the new page.
   */
  insertPage: (pageIndex: number, pageContent: JSONContent | null) => void;

  /**
   * Removes a page with a specific ID.
   * @param {string} pageId - ID of the page to be removed.
   */
  removePage: (pageId: string) => void;

  /**
   * Gets the index of a page with a specific ID.
   * @param {string} pageId - ID of the page.
   * @returns {number} Index of the page in the pages array.
   */
  getIndexOfPage: (pageId: string) => number;

  /**
   * Inserts a new page at a specific index with optional content.
   * @param {number} pageIndex - Index where the new page should be inserted.
   * @param {JSONContent} [pageContent={}] - Content for the new page (optional).
   */
  insertNewPage: (pageIndex: number, pageContent?: JSONContent) => void;

  /**
   * Goes to previous page.
   */
  goToPreviousPage: () => void;

  /**
   * Goes to next page.
   */
  goToNextPage: () => void;

  /**
   * Checks if the page change is possible.
   * @param {"next" | "previous"} direction - Direction of the page change.
   * @returns {boolean} True if the page change is possible, false otherwise.
   */
  canChangePage: (direction: "next" | "previous") => boolean;

  /**
   * Gets all pages in the state.
   * @returns {EditorPage[]} An array containing all pages in the state.
   */
  addPage: () => void;

  /**
   * Opens a new workbench. If data is provided, it will be used to initialize the workbench.
   * If no data is provided, the workbench will be initialized with an empty page.
   * @param {EditorData} [data] - Optional data to initialize the workbench with.
   * @param {EditorOptions} [options] - Optional configuration options for the workbench.
   */
  openEditor: (data?: EditorData, options?: EditorOptions) => void;
}
