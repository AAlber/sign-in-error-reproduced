import { Shuffle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../shadcn-ui/button";
import { Input } from "../shadcn-ui/input";
import { type Icon3D, icons3d } from "./3d-icons";

export default function Icons3DTab({
  onSelect,
}: {
  onSelect: (icon: string) => void;
}) {
  const { t } = useTranslation("page");
  const [search, setSearch] = useState("");

  const filteredIcons = icons3d.filter(
    (icon) =>
      icon.name.toLowerCase().includes(search.toLowerCase()) ||
      icon.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
  );

  type IconsByCategory = {
    [category: string]: Icon3D[];
  };

  const iconsByCategory: IconsByCategory = filteredIcons.reduce((acc, icon) => {
    const category = icon.category || "Others";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(icon);
    return acc;
  }, {});

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="flex w-full items-center gap-2">
        <Input
          placeholder={t("general.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          size={"icon"}
          onClick={() =>
            onSelect(
              filteredIcons[Math.floor(Math.random() * filteredIcons.length)]!
                .path,
            )
          }
        >
          <Shuffle className="h-4 w-4" />
        </Button>
      </div>
      <div className="relative flex h-[400px] w-full flex-col  gap-2 overflow-y-scroll">
        {Object.entries(iconsByCategory).map(
          ([category, icons]: [string, Icon3D[]]) => (
            <div key={category} className="mt-2 h-auto">
              <h2 className="text-sm text-muted-contrast first-letter:uppercase">
                {t(category)}
              </h2>
              <div className="grid h-auto grid-cols-6">
                {icons.map((icon) => (
                  <Button
                    key={icon.path}
                    variant={"ghost"}
                    className="h-14 w-14 p-2.5"
                    onClick={() => onSelect(icon.path)}
                  >
                    <Image
                      src={icon.path}
                      width={50}
                      height={50}
                      alt={icon.name}
                      className="object-contain"
                    />
                  </Button>
                ))}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
