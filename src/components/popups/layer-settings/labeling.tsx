import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Form from "../../reusable/formlayout";
import Input from "../../reusable/input";
import useLayerSettings from "./zustand";

export default function LabelingSettings() {
  const { t } = useTranslation("page");

  const { layer, title, displayName, setDisplayName, setTitle } =
    useLayerSettings();

  useEffect(() => {
    setDisplayName(layer?.displayName || "");
    setTitle(layer?.name || "");
  }, []);

  return (
    <Form>
      <Form.Item
        label="layer_settings_name"
        description="layer_settings_name_desc"
        descriptionBelowChildren
        align="top"
      >
        <Input
          maxLength={50}
          showCount
          text={title}
          setText={setTitle}
          placeholder="Untitled"
        />
      </Form.Item>
      <Form.Item
        label="layer_settings_display_name"
        description="layer_settings_display_name_desc"
        descriptionBelowChildren
        align="top"
      >
        <Input
          maxLength={50}
          showCount
          text={displayName}
          setText={setDisplayName}
          placeholder="Untitled"
        />
      </Form.Item>
    </Form>
  );
}
