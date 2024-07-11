import React from "react";
import { useTranslation } from "react-i18next";
import useScheduleFilter from "../../../zustand-filter";
import { StandaloneCustomFilterButton } from "./item-button";

const OrganizedByMeFilterButton = () => {
  const { setOnlyOrganizedByMe, onlyOrganizedByMe, setFilteredLayers } =
    useScheduleFilter();
  const { t } = useTranslation("page");
  const handleShowOnlyOrganizedByMe = (onlyOrganizedByMe: boolean) => {
    setFilteredLayers([]);
    setOnlyOrganizedByMe(onlyOrganizedByMe);
  };
  return (
    <StandaloneCustomFilterButton
      filterName={t("custom_filter_organized_by_me")}
      handleClick={() => handleShowOnlyOrganizedByMe(!onlyOrganizedByMe)}
      handleTick={(tick) => handleShowOnlyOrganizedByMe(tick)}
      checked={onlyOrganizedByMe}
    />
  );
};

export default OrganizedByMeFilterButton;
