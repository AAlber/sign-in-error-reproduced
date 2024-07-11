import { cx } from "class-variance-authority";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { convertToEmbedLink } from "@/src/client-functions/client-utils";
import Skeleton from "../skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "./shadcn-ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./shadcn-ui/tabs";

interface HelpVideoHoverBaseProps {
  children: React.ReactNode;
}

interface HelpVideoHoverSingleProps extends HelpVideoHoverBaseProps {
  type: "single";
  url: string;
  title: string;
  description: string;
}

interface HelpVideoHoverMultiProps extends HelpVideoHoverBaseProps {
  type: "multi";
  tabs: {
    url: string;
    tabTitle: string;
    title: string;
    description: string;
  }[];
}

export default function HelpVideoHover(
  props: HelpVideoHoverSingleProps | HelpVideoHoverMultiProps,
) {
  if (props.type === "single") {
    return <HelpVideoHoverSingle {...props} />;
  } else {
    return <HelpVideoHoverMulti {...props} />;
  }
}

function HelpVideoHoverSingle(props: HelpVideoHoverSingleProps) {
  const { t } = useTranslation("page");
  const emmbedLink = convertToEmbedLink(t(props.url));
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Popover
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setIsLoaded(false);
        }
      }}
    >
      <PopoverTrigger asChild className="cursor-pointer">
        {props.children}
      </PopoverTrigger>
      <PopoverContent className="w-[450px]">
        <div className="flex flex-col">
          <div
            className={cx(
              "flex items-center justify-center rounded-md border border-border",
              isLoaded ? "opacity-100" : "hidden opacity-0",
            )}
          >
            <iframe
              className="aspect-video h-full w-full rounded-md "
              src={emmbedLink}
              allowFullScreen
              onLoad={() => setIsLoaded(true)}
            />
          </div>

          {!isLoaded && (
            <div className="relative flex aspect-video max-h-[297px] overflow-hidden rounded-md border border-border">
              <div className="!h-screen !w-full">
                <Skeleton />
              </div>
            </div>
          )}
          <h1 className="mx-5 mt-4 text-center text-lg font-bold text-contrast">
            {t(props.title)}
          </h1>
          <p className="mx-5 mb-2 text-center text-sm text-muted-contrast">
            {t(props.description)}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function HelpVideoHoverMulti(props: HelpVideoHoverMultiProps) {
  const { t } = useTranslation("page");
  const [isLoaded, setIsLoaded] = useState<string[]>([]);

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open) {
          setIsLoaded([]);
        }
      }}
    >
      <PopoverTrigger className="cursor-pointer" asChild>
        {props.children}
      </PopoverTrigger>
      <PopoverContent className="w-[450px]">
        <Tabs defaultValue={props.tabs[0]!.url}>
          <TabsList className="w-full">
            {props.tabs.map((tab) => (
              <TabsTrigger className="w-full" value={tab.url} key={tab.url}>
                {t(tab.tabTitle)}
              </TabsTrigger>
            ))}
          </TabsList>
          {props.tabs.map((tab) => {
            return (
              <TabsContent value={tab.url} key={tab.url}>
                <div className="col-span-2 flex flex-col">
                  <div
                    className={cx(
                      "flex items-center justify-center rounded-md border border-border",
                      isLoaded.includes(tab.url)
                        ? "opacity-100"
                        : "hidden opacity-0",
                    )}
                  >
                    <iframe
                      className="aspect-video h-full w-full rounded-md "
                      src={convertToEmbedLink(t(tab.url))}
                      allowFullScreen
                      onLoad={() => setIsLoaded([...isLoaded, tab.url])}
                    />
                  </div>

                  {!isLoaded.includes(tab.url) && (
                    <div className="relative flex aspect-video max-h-[297px] overflow-hidden rounded-md border border-border">
                      <div className="!h-screen !w-full">
                        <Skeleton />
                      </div>
                    </div>
                  )}
                  <h1 className="mx-5 mt-4 text-center text-lg font-bold text-contrast">
                    {t(tab.title)}
                  </h1>
                  <p className="mx-5 mb-2 text-center text-sm text-muted-contrast">
                    {t(tab.description)}
                  </p>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
