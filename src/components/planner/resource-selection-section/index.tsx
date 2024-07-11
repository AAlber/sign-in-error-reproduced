import { Boxes } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UNFINISHED_ARTICLE_ID } from "@/src/utils/utils";
import { EmptyState } from "../../reusable/empty-state";
import { Accordion } from "../../reusable/shadcn-ui/accordion";
import { Button } from "../../reusable/shadcn-ui/button";
import WithToolTip from "../../reusable/with-tooltip";
import {
  canHaveOfflineAppointments,
  getConstraintDisabledCause,
  isConstraintsEnabled,
  makeAllAppointmentsOnline,
} from "../functions";
import { PlannerWrapper } from "../wrapper";
import usePlanner from "../zustand";
import LayerSelector from "./add-new-layer";
import LayerWithResources from "./layer-with-resources";

export default function LayerAndResourceSelection() {
  const [layers, openAccordion] = usePlanner((state) => [
    state.layers,
    state.openAccordion,
  ]);
  const [openLayer, setOpenLayer] = useState<string>("");
  const { t } = useTranslation("page");

  useEffect(() => {
    if (!canHaveOfflineAppointments(layers)) return makeAllAppointmentsOnline();
  }, [layers]);

  return (
    <PlannerWrapper
      id="layers"
      title={t("planner_title")}
      description={t("planner_description")}
    >
      <div className="h-full w-full overflow-y-scroll">
        {/* Select a course to schedule appointments for */}
        {layers.length > 0 ? (
          <>
            <Accordion
              value={openLayer}
              onValueChange={(value) => setOpenLayer(value as string)}
              type="single"
              collapsible
              className="w-full"
            >
              {layers.map((layer) => (
                <LayerWithResources key={layer.layer.id} layer={layer} />
              ))}
            </Accordion>
            <div className="mt-4 flex w-full items-center justify-between px-3">
              <LayerSelector onSelect={(layerId) => setOpenLayer(layerId)} />
              <WithToolTip
                text={getConstraintDisabledCause(layers)}
                disabled={!isConstraintsEnabled(layers)}
              >
                <Button
                  disabled={isConstraintsEnabled(layers)}
                  variant="cta"
                  onClick={() => openAccordion("constraints")}
                >
                  {t("next")}
                </Button>
              </WithToolTip>
            </div>
          </>
        ) : (
          <EmptyState
            className="p-6"
            icon={Boxes}
            title={t("planner_empty_state_title")}
            description={t("planner_empty_state_description")}
          >
            <LayerSelector onSelect={(layerId) => setOpenLayer(layerId)} />
            <EmptyState.Article
              text="planner_empty_state_article"
              articleId={UNFINISHED_ARTICLE_ID}
            />
          </EmptyState>
        )}
      </div>
    </PlannerWrapper>
  );
}
