import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../../reusable/shadcn-ui/dropdown-menu";
import ImportContent from "./import-content";
import NewAppointment from "./new-appointment";
import { NewContentBlock } from "./new-content-block";

export default function CourseNewDropdown({
  children,
  onlyBlocks,
}: {
  children: React.ReactNode;
  onlyBlocks?: boolean;
}) {
  const { t } = useTranslation("page");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const blocks = contentBlockHandler.get.registeredContentBlocks();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2">
        {contentBlockHandler.get.categories().map((category) => {
          return (
            <DropdownMenuSub key={category.name}>
              <DropdownMenuSubTrigger>
                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background">
                  <div className="flex w-5 justify-center text-contrast">
                    {category.icon}
                  </div>
                </div>
                <div className="flex flex-col">
                  {t(category.name)}
                  <span className="text-xs text-muted-contrast">
                    {t(category.description)}
                  </span>
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {blocks
                  .filter(
                    (block) =>
                      block.category &&
                      block.category.name === category.name &&
                      block.status !== "deprecated",
                  )
                  .map((block) => {
                    return <NewContentBlock block={block} key={block.name} />;
                  })}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          );
        })}
        {blocks
          .filter((block) => !block.category && block.status !== "deprecated")
          .map((block) => {
            return <NewContentBlock block={block} key={block.name} />;
          })}

        {!onlyBlocks && (
          <>
            <DropdownMenuSeparator />
            <NewAppointment />
            <ImportContent />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
