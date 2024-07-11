import moment from "moment-timezone";
import { useEffect } from "react";
import { getDraftAppointments } from "@/src/client-functions/client-planner/planner-api-calls";
import { useDebounce } from "@/src/client-functions/client-utils/hooks";
import useSchedule from "../schedule/zustand";
import usePlanner from "./zustand";

const usePlannerLogic = () => {
  const [
    layers,
    constraints,
    draftAppointments,
    currentAccordion,
    openAccordion,
    setDraftAppointments,
    setError,
    setPreviewLoading,
  ] = usePlanner((state) => [
    state.layers,
    state.constraints,
    state.draftAppointments,
    state.currentAccordion,
    state.openAccordion,
    state.setDraftAppointments,
    state.setError,
    state.setPreviewLoading,
  ]);

  const [plannerOpen, appointments, setAppointments] = useSchedule((state) => [
    state.plannerOpen,
    state.appointments,
    state.setAppointments,
  ]);

  useEffect(() => {
    if (plannerOpen) openAccordion("layers");
  }, [plannerOpen]);

  useDebounce(
    () => {
      if (layers.length === 0) return;
      setPreviewLoading(true);
      getDraftAppointments(layers, constraints).then((data) => {
        setPreviewLoading(false);
        if (data.error) {
          setError(data.error);
        } else setError(null);
        if (!data.ok && data.error.severity === "error") {
          setDraftAppointments([]);
        } else if (data.ok) {
          setDraftAppointments(
            data.data.map((a) => ({
              ...a,
              dateTime: moment.utc(a.dateTime).toDate(),
            })),
          );
        }
      });
    },
    [layers, constraints],
    500,
  );

  useEffect(() => {
    if (draftAppointments.length === 0)
      setAppointments(appointments.filter((a) => a.type !== "draft"));
    else
      setAppointments([
        ...appointments.filter((a) => !a.type && a.type !== "draft"),
        ...draftAppointments,
      ]);
  }, [draftAppointments]);

  return {
    currentAccordion,
    openAccordion,
  };
};

export default usePlannerLogic;
