import { Clock, Settings2, TextIcon } from "lucide-react";
import MultiPageModal from "../../reusable/multi-page-modal";
import CourseSettings from "./course-settings";
import LabelingSettings from "./labeling";
import LayerSaveButton from "./save-btn";
import TimingSettings from "./timing";
import useLayerSettings from "./zustand";

export default function LayerSettings() {
  const { layer, open, setOpen, reset } = useLayerSettings();

  return (
    <MultiPageModal
      open={open}
      setOpen={setOpen}
      useTabsInsteadOfSteps
      title="layer_settings.title"
      finishButtonText="general.save"
      height="md"
      noButtons
      additionalButton={<LayerSaveButton />}
      onFinish={() => Promise.resolve()}
      onClose={reset}
      pages={[
        {
          nextStepRequirement: () => true,
          title: "layer_settings_labeling",
          tabTitle: "layer_settings_labeling",
          tabIcon: <TextIcon size={17} />,
          description: "layer_settings_labeling_desc",
          children: <LabelingSettings />,
        },
        ...(!layer?.isLinkedCourse
          ? [
              {
                nextStepRequirement: () => true,
                title: "layer_settings_timing",
                tabTitle: "layer_settings_timing",
                tabIcon: <Clock size={17} />,
                description: "layer_settings_timing_desc",
                children: <TimingSettings />,
              },
            ]
          : []),
        ...(layer?.isCourse
          ? [
              {
                nextStepRequirement: () => true,
                title: "layer_settings_course_settings",
                tabTitle: "layer_settings_course_settings",
                tabIcon: <Settings2 size={17} />,
                description: "layer_settings_course_settings_desc",
                children: <CourseSettings />,
              },
            ]
          : []),
      ]}
    />
  );
}
