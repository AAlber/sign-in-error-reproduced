import type { ExtensionName } from "../components/tiptap-editor";
import type {
  SlashMenuCommands,
  TiptapEditorFeatures,
} from "../components/tiptap-editor/types";

export const defaultExtensions: ExtensionName[] = [
  "Document",
  "StarterKit",
  "Focus",
  "TextAlign",
  "TextStyle",
  "Subscript",
  "Superscript",
  "FontSize",
  "Columns",
  "Column",
  "ListItem",
  "Color",
  "Dropcursor",
  "Underline",
];

export const featureExtensionMapping: {
  [k in keyof Required<TiptapEditorFeatures>]: ExtensionName[];
} = {
  codeBlock: ["CodeBlockColor"],
  history: ["History"],
  highlight: ["Highlight"],
  slashCommand: ["SlashCommand"],
  blockquoteFigure: ["BlockquoteFigure"],
  link: ["LinkExtension"],
  textStyle: ["TextStyle"],
  fontSize: ["FontSize"],
  columns: ["Columns"],
  tableOfContent: ["TableOfContent"],
  youtube: ["Youtube", "YoutubeEmbed"],
  fileHandler: ["FileHandler"],
  imageUpload: ["ImageUpload", "ImageBlock"],
  fileUpload: ["FileUpload", "FileBlock"],
  table: ["Table", "TableCell", "TableHeader", "TableRow"],
  ai: ["AI"],
  heading: ["StarterKit"],
  placeholder: ["Placeholder"],
};

export const featureSlashCommandMapping: {
  [k in keyof TiptapEditorFeatures]: SlashMenuCommands[];
} = {
  codeBlock: ["code-block"],
  blockquoteFigure: ["blockquote-figure"],
  columns: ["columns"],
  tableOfContent: ["table-of-content"],
  youtube: ["youtube"],
  imageUpload: ["image"],
  fileUpload: ["file"],
  table: ["table"],
  heading: ["heading1", "heading2", "heading3"],
};

export const isFeatureEnabled = (
  features: TiptapEditorFeatures,
  feature: keyof Required<TiptapEditorFeatures>,
  defaultValue = true,
) => features[feature]?.enabled ?? defaultValue;

export const getExtensionsForFeatures = (features: TiptapEditorFeatures) => {
  const extensionsToAdd: ExtensionName[] = [...defaultExtensions];

  for (const [feature, extensions] of Object.entries(featureExtensionMapping)) {
    if (
      isFeatureEnabled(
        features,
        feature as keyof Required<TiptapEditorFeatures>,
        true,
      )
    ) {
      extensionsToAdd.push(...extensions);
    }
  }

  return extensionsToAdd;
};

export const getOmitSlashMenuCommands = (
  features: TiptapEditorFeatures,
): string[] => {
  const omitCommands: string[] = [];

  for (const [feature] of Object.entries(featureExtensionMapping)) {
    if (
      !isFeatureEnabled(
        features,
        feature as keyof Required<TiptapEditorFeatures>,
        true,
      )
    ) {
      omitCommands.push(
        ...(featureSlashCommandMapping[
          feature as keyof Required<TiptapEditorFeatures>
        ] || ""),
      );
    }
  }

  return omitCommands;
};
