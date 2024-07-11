import produce from "immer";
import moment from "moment-timezone";
import { RRule } from "rrule";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { getUnavailableTimeslots } from "@/src/client-functions/client-planner/planner-api-calls";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import type {
  PlannerLayerWithAvailableResources,
  Resource,
} from "@/src/types/planner/planner.types";
import type {
  AvailableTimeSlot,
  PlannerConstraints,
} from "@/src/types/planner/planner-constraints.types";
import {
  defaultConstraints,
  defaultOptions,
} from "@/src/types/planner/planner-constraints.types";
import type { PlannerError } from "@/src/types/planner/planner-errors.types";

interface PlannerState {
  aiLoading: boolean;
  tab: "automatic" | "manual";
  error: PlannerError | null;
  layers: PlannerLayerWithAvailableResources[];
  loadingPreview: boolean;
  constraints: PlannerConstraints;
  currentAccordion: string;
  draftAppointments: ScheduleAppointment[];
  aiText: string;
  typeManualSelection: boolean;
}

interface PlannerActions {
  setLayers: (layers: PlannerLayerWithAvailableResources[]) => void;
  addLayer: (layer: PlannerLayerWithAvailableResources) => void;
  removeLayer: (layerId: string) => void;
  addResourceToLayer: (resource: Resource, layerId: string) => void;
  removeResourceFromLayer: (id: string, layerId: string) => void;
  setConstraints: (constraints: PlannerConstraints) => void;
  updateConstraints: (constraints: Partial<PlannerConstraints>) => void;
  addTimeSlot: () => void;
  updateTimeSlot: (index: number, updatedTimeSlot: AvailableTimeSlot) => void;
  removeTimeSlot: (index: number) => void;
  setAiLoading: (loading: boolean) => void;
  setTab: (tab: "automatic" | "manual") => void;
  setError: (error: PlannerError | null) => void;
  setPreviewLoading: (loading: boolean) => void;
  setDraftAppointments: (draftAppointments: ScheduleAppointment[]) => void;
  openAccordion: (value: string) => void;
  updateDraftAppointment: (
    id: string,
    data: Partial<ScheduleAppointment>,
  ) => void;
  reset: () => void;
  aiText: string;
  setAiText: (text: string) => void;
  setTypeManualSelection: (value: boolean) => void;
}

const initialState: PlannerState = {
  layers: [],
  tab: "automatic",
  aiLoading: false,
  loadingPreview: false,
  error: null,
  currentAccordion: "layers",
  constraints: defaultConstraints,
  draftAppointments: [],
  aiText: "",
  typeManualSelection: false,
};

type PlannerStore = PlannerState & PlannerActions;

const usePlanner = createWithEqualityFn<PlannerStore>()(
  (set) => ({
    ...initialState,

    openAccordion: (value) =>
      set(() => ({
        currentAccordion: value,
      })),
    setDraftAppointments: (draftAppointments) =>
      set(() => ({
        draftAppointments,
      })),
    setPreviewLoading: (loading) => set(() => ({ loadingPreview: loading })),
    setError: (error) => set(() => ({ error })),
    setTab: (tab) =>
      set(() => ({
        tab,
      })),
    setAiLoading: (loading) =>
      set(() => ({
        aiLoading: loading,
      })),
    setConstraints: (constraints) =>
      set(() => ({
        constraints,
      })),

    updateConstraints: (constraints) =>
      set((state) => ({
        constraints: {
          ...state.constraints,
          ...constraints,
        },
      })),
    setLayers: (layers) =>
      set(() => ({
        layers,
      })),

    addLayer: async (layer) => {
      set((state) => ({
        layers: [
          ...state.layers,
          {
            layer: {
              ...layer.layer,
              loadingUnavailabilities: true,
              unavailabilities: [],
            },
            resources: [],
          },
        ],
      }));

      const data = await getUnavailableTimeslots({
        id: layer.layer.id,
        type: "layer",
      });

      set((state) => {
        const layers = state.layers.map((l) => {
          if (l.layer.id === layer.layer.id) {
            const convertedUnavailabilities = data.unavailabilities.map(
              (unavailability) => ({
                start: moment.utc(unavailability.start).toDate(),
                end: moment.utc(unavailability.end).toDate(),
              }),
            );
            return {
              ...l,
              layer: {
                ...l.layer,
                loadingUnavailabilities: false,
                unavailabilities: convertedUnavailabilities,
              },
            };
          }
          return l;
        });

        console.log(layers);

        return { layers };
      });
    },

    addTimeSlot: () =>
      set((state) => ({
        constraints: {
          ...state.constraints,
          availableTimeSlots: [
            ...state.constraints.availableTimeSlots,
            {
              rrule: new RRule({
                freq: RRule.WEEKLY,
                byweekday: [],
              }),
              startTime: { hour: 9, minute: 0 },
              endTime: { hour: 17, minute: 0 },
              options: defaultOptions,
              mode: "use-default-options",
            },
          ],
        },
      })),

    updateTimeSlot: (index, updatedTimeSlot) =>
      set((state) => ({
        constraints: {
          ...state.constraints,
          availableTimeSlots: state.constraints.availableTimeSlots.map(
            (timeSlot, i) => (i === index ? updatedTimeSlot : timeSlot),
          ),
        },
      })),

    removeTimeSlot: (index) =>
      set((state) => ({
        constraints: {
          ...state.constraints,
          availableTimeSlots: state.constraints.availableTimeSlots.filter(
            (_, i) => i !== index,
          ),
        },
      })),

    removeLayer: (layerId) =>
      set((state) => ({
        layers: state.layers.filter((layer) => layer.layer.id !== layerId),
      })),

    addResourceToLayer: async (resource, layerId) => {
      set((state) => {
        const layers = state.layers.map((layer) => {
          if (layer.layer.id === layerId) {
            return {
              ...layer,
              resources: [
                ...layer.resources,
                {
                  ...resource,
                  loadingUnavailabilities: true,
                  unavailabilities: [],
                },
              ],
            };
          }
          return layer;
        });

        return { layers };
      });

      const data = await getUnavailableTimeslots({
        id: resource.id,
        type: resource.type,
      });

      set((state) => {
        const layers = state.layers.map((layer) => {
          if (layer.layer.id === layerId) {
            return {
              ...layer,
              resources: layer.resources.map((r) => {
                if (r.id === resource.id) {
                  const convertedUnavailabilities = data.unavailabilities.map(
                    (unavailability) => ({
                      start: moment.utc(unavailability.start).toDate(),
                      end: moment.utc(unavailability.end).toDate(),
                    }),
                  );
                  return {
                    ...r,
                    loadingUnavailabilities: false,
                    unavailabilities: convertedUnavailabilities,
                  };
                }
                return r;
              }),
            };
          }
          return layer;
        });

        console.log(layers);

        return { layers };
      });
    },

    removeResourceFromLayer: (id, layerId) => {
      set((state) => {
        const layers = state.layers.map((layer) => {
          if (layer.layer.id === layerId) {
            return {
              ...layer,
              resources: layer.resources.filter(
                (resource) => resource.id !== id,
              ),
            };
          }
          return layer;
        });

        return { layers };
      });
    },
    updateDraftAppointment: (id, data) =>
      set((state) =>
        produce(state, (draft) => {
          const idx = draft.draftAppointments.findIndex((i) => i.id === id);
          const toUpdate = draft.draftAppointments[idx];
          if (toUpdate) draft.draftAppointments[idx] = { ...toUpdate, ...data };
        }),
      ),

    reset: () =>
      set(() => ({
        ...initialState,
      })),
    setAiText: (text) =>
      set(() => ({
        aiText: text,
      })),
    setTypeManualSelection: (value) =>
      set(() => ({
        typeManualSelection: value,
      })),
  }),
  shallow,
);

export default usePlanner;
