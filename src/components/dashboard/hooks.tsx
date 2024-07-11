import { useEffect } from "react";
import { loadTabs } from "./functions";
import { useNavigation } from "./navigation/zustand";

export const useTabs = () => {
  const [tabs, page, refreshTrigger] = useNavigation((state) => [
    state.tabs,
    state.page,
    state.refreshTrigger,
  ]);

  useEffect(() => {
    loadTabs({ silentLoad: false });
  }, [page, refreshTrigger]);

  return { tabs };
};
