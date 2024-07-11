import { create } from "zustand";
import type { FuxamEdgeConfig } from "../client-functions/client-edge-config";
import { getVercelEdgeConfig } from "../client-functions/client-edge-config";

interface EdgeConfigState {
  edgeConfig: FuxamEdgeConfig;
  fetchEdgeConfig: (enabled?: boolean) => Promise<void>;
}

const initialState = {
  edgeConfig: {
    maintenance: false,
    institutionsThatHaveFakeTrialPlan: [],
  },
};

const useEdgeConfig = create<EdgeConfigState>((set) => ({
  ...initialState,
  fetchEdgeConfig: async (enabled?: boolean) => {
    if (typeof enabled === "boolean" && enabled === false) return;

    const edgeConfig = await getVercelEdgeConfig();
    set({ edgeConfig });
    if (edgeConfig.maintenance && window.location.pathname !== "/maintenance") {
      window.location.href = "/maintenance";
    }
  },
}));

export default useEdgeConfig;
