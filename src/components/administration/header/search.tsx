import React from "react";
import { useTranslation } from "react-i18next";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import useUser from "@/src/zustand/user";
import { Input } from "../../reusable/shadcn-ui/input";
import useAdministration from "../zustand";

export default function Search() {
  const { currentLayer, setLayerTree_, rootFlatLayer, filter, setFilter } =
    useAdministration();
  const { t } = useTranslation("page");
  const { user } = useUser();
  const isInstitutionLayer = currentLayer === user.currentInstitutionId;

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const val = e.target.value;
    setFilter(val);

    if (!rootFlatLayer) return;

    const root = [
      ...(isInstitutionLayer
        ? rootFlatLayer
        : structureHandler.utils.layerTree.flattenTree(
            rootFlatLayer.find((layer) => layer.id === currentLayer)
              ?.children ?? [],
          )),
    ];

    if (!!val) {
      const filteredLayers = root.filter(
        ({ name }) => !!name?.toLowerCase().includes(val.toLowerCase()),
      );

      if (!!filteredLayers.length) {
        const filteredTree =
          structureHandler.utils.layerTree.buildTree(filteredLayers);
        setLayerTree_(filteredTree);
      }
    } else {
      const revertTree = structureHandler.utils.layerTree.buildTree(root);
      setLayerTree_(revertTree);
    }
  };

  return (
    <Input
      value={filter}
      placeholder={t("course_layer_search")}
      className="max-w-[250px]"
      onChange={handleChange}
    />
  );
}
