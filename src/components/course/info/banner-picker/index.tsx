import { Edit } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/reusable/shadcn-ui/tabs";
import useCourse from "../../zustand";
import CustomBannerSelection from "./custom-selection";
import GradientSelection from "./gradient-selection";
import UnsplashSelection from "./unsplash-selection";

export default function BannerPicker() {
  const { hasSpecialRole } = useCourse();
  const { t } = useTranslation("page");

  if (!hasSpecialRole) return null;

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          size={"icon"}
          className=" absolute bottom-0 right-0 hidden hover:bg-accent group-hover:flex"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Tabs defaultValue="gradient" className="p-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gradient">{t("course.gradient")}</TabsTrigger>
            <TabsTrigger value="custom">Upload</TabsTrigger>
            <TabsTrigger value="unsplash">
              <Image
                src="/images/unsplash.png"
                width={13}
                height={13}
                className={`mr-2.5 dark:invert`}
                alt="Unsplash"
              />
              {t("workbench.sidebar_element_image_popup_unsplash")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="gradient">
            <GradientSelection />
          </TabsContent>
          <TabsContent value="unsplash">
            <UnsplashSelection />
          </TabsContent>
          <TabsContent value="custom">
            <CustomBannerSelection />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
