import clsx from "clsx";
import { Slash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import classNames from "@/src/client-functions/client-utils";
import { log } from "@/src/utils/logger/logger";
import useUser from "@/src/zustand/user";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../reusable/shadcn-ui/breadcrumb";
import type { Layer } from "../types";
import useAdministration from "../zustand";
import Snippet from "./snippet-navigation";

type BreadCrumb = { id: string; name: string };

export default function Breadcrumbs() {
  const { t } = useTranslation("page");
  const [breadcrumbs, setBreadcrumbs] = useState<BreadCrumb[]>([]);
  const { user: data } = useUser();
  const [
    currentLayer,
    rootFlatLayer,
    setCurrentLayer,
    setFilter,
    setLayerTree_,
  ] = useAdministration((state) => [
    state.currentLayer,
    state.rootFlatLayer,
    state.setCurrentLayer,
    state.setFilter,
    state.setLayerTree_,
  ]);

  const hierarchyPath = structureHandler.utils.layerTree.getHierarchyPath(
    currentLayer,
    rootFlatLayer ?? [],
  );

  useEffect(() => {
    const breadcrumbsToDisplay = hierarchyPath.slice(-3);
    setBreadcrumbs(breadcrumbsToDisplay);
  }, [currentLayer]);

  /**
   * Rebuild the `initialLayerTree` onClick of
   * `overview` breadcrumb
   */

  const handleRebuildInitialLayerTree = () => {
    log.click("Clicked breadcrumb in structure");
    if (rootFlatLayer) {
      setCurrentLayer(data.currentInstitutionId);
      const state = useAdministration.getState();
      const newTree = structureHandler.utils.layerTree.buildTree(
        state.rootFlatLayer ?? [],
      );

      setLayerTree_(newTree);
      setFilter("");
    }
  };

  /**
   * Build the layerTree, with the parentId set to the currently selected layer,
   * onClick of a breadcrumb other than overview
   */

  const handleRebuildTreeFromSelectedLayer = (id: string) => () => {
    log.click("Clicked breadcrumb in structure");
    if (rootFlatLayer) {
      const layer = rootFlatLayer.find((i) => i.id === id);
      if (layer) {
        const newTree = structureHandler.utils.layerTree.normalizeTree(
          layer as Layer,
        );
        setLayerTree_(newTree);
        setCurrentLayer(id);
        setFilter("");
      }
    }
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <button
            onClick={handleRebuildInitialLayerTree}
            className={classNames(!!breadcrumbs.length ? "block" : "hidden")}
          >
            {t("admin_dashboard.table_header_overview")}
          </button>
        </BreadcrumbItem>
        {breadcrumbs.map((breadcrumb, index) => {
          return (
            <React.Fragment key="dots">
              <BreadcrumbSeparator className="h-4 w-4 text-muted">
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {index === 0 && breadcrumbs.length > 2 ? (
                  <Snippet content={breadcrumbs} />
                ) : (
                  <button
                    onClick={handleRebuildTreeFromSelectedLayer(breadcrumb.id)}
                    className={clsx(
                      breadcrumb.id === currentLayer
                        ? "text-contrast"
                        : "text-muted-contrast",
                      "text-sm transition-colors hover:text-contrast",
                    )}
                  >
                    {breadcrumb.name}
                  </button>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
