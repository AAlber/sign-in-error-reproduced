import { Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Box from "../box";
import { Button } from "../shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../shadcn-ui/dropdown-menu";

type TagSelectorProps = {
  title: string;
  description: string;
  availableTags: Tag[];
  selectedTags: string[];
  keepUsedTags?: boolean;
  maxTags?: number;
  tagName: string;
  smallPadding?: boolean;
  onChange: (selectedTags: string[]) => void;
  onOpenChange?: (open: boolean) => void;
};

export type Tag = {
  icon?: any;
  label: string;
};

export default function TagSelector({
  maxTags = 0,
  ...props
}: TagSelectorProps) {
  const filteredTags = props.availableTags.filter(
    (tag) => !props.selectedTags.includes(tag.label),
  );
  const tagsToMap = props.keepUsedTags ? props.availableTags : filteredTags;

  const { t } = useTranslation("page");

  return (
    <Box smallPadding={props.smallPadding}>
      {(props.title || props.description) && (
        <div className="mb-2 flex flex-col">
          <span className="font-medium text-contrast">{t(props.title)}</span>
          <span className="text-sm text-muted-contrast">
            {t(props.description)}
          </span>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {props.selectedTags.map((selectedTag, index) => {
          const tag = props.availableTags.find(
            (tag) => tag.label === selectedTag,
          );
          if (!tag) return null;
          return (
            <div
              key={index}
              className="flex items-center gap-2 rounded-md border border-border py-1 pl-2 pr-1 text-sm text-contrast"
            >
              {tag.icon && <tag.icon className="h-4 w-4" />}
              <div>{t(tag.label)}</div>
              <X
                className="first-letter: ml-2 h-3.5 w-3.5 cursor-pointer hover:text-destructive"
                onClick={() => {
                  if (props.selectedTags.length === 1) {
                    return props.onChange([]);
                  }
                  if (index >= 0 && index < props.selectedTags.length) {
                    const copyOfSelectedTags = [...props.selectedTags];
                    copyOfSelectedTags.splice(index, 1);
                    props.onChange(copyOfSelectedTags);
                  }
                }}
              />
            </div>
          );
        })}
        {(props.selectedTags.length < props.availableTags.length ||
          props.keepUsedTags) &&
          (maxTags === 0 || maxTags > props.selectedTags.length) && (
            <DropdownMenu onOpenChange={props.onOpenChange}>
              <DropdownMenuTrigger className="outline-none ring-0 focus:border-transparent">
                <Button variant={"default"} className="flex items-center gap-2">
                  {<Plus className="mr-1 h-4 w-4" />}
                  {props.selectedTags.length === 0 ? t(props.tagName) : ""}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {tagsToMap.map((tag, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => {
                      props.onChange([...props.selectedTags, tag.label]);
                    }}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      {tag.icon && <tag.icon className="h-4 w-4" />}
                      <span>{t(tag.label)}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
      </div>
    </Box>
  );
}
