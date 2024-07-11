import type { PlannerLayerWithAvailableResources } from "@/src/types/planner/planner.types";
import type { PlannerConstraints } from "@/src/types/planner/planner-constraints.types";
import type { PlannerError } from "@/src/types/planner/planner-errors.types";

export const aiPrompt = ({
  layers,
  t,
  constraints,
  error,
}: {
  constraints: PlannerConstraints;
  error: PlannerError | null;
  layers: PlannerLayerWithAvailableResources[];
  t: any;
}) =>
  JSON.stringify(
    layers.map((l) => {
      return (
        "Unavailabilties where we cannot plant" +
        JSON.stringify([
          ...(l.layer.unavailabilities ?? []),
          ...l.resources.map((r) => r.unavailabilities),
        ])
      );
    }),
    null,
    2,
  ) +
  "\n\nMy planning constraints are: " +
  JSON.stringify(constraints, null, 2) +
  +"\n\nThe planning error I am getting is: " +
  JSON.stringify({
    cause: t("planner" + error?.cause + ".title"),
    description: t("planner." + error?.cause + ".description"),
    ...error,
  }) +
  "\n\n Please explain the problem and how I can change my preferences to fix it. You can also point our specific unavailabilties of layers or resources that might contribute to the problem. You can only answer in the language of the error!";
