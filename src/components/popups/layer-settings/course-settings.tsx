import { useTranslation } from "react-i18next";
import Form from "../../reusable/formlayout";
import Input from "../../reusable/input";
import useLayerSettings from "./zustand";

export default function CourseSettings() {
  const { subtitle, setSubtitle } = useLayerSettings();
  const { t } = useTranslation("page");
  return (
    <Form>
      <Form.Item
        label={t("course_settings_subtitle")}
        description={t("course_setting_description")}
        descriptionBelowChildren
      >
        <Input
          maxLength={50}
          showCount
          text={subtitle}
          setText={(text) => setSubtitle(text)}
          placeholder="Untitled"
        />
      </Form.Item>
    </Form>
  );
}
