import { create } from "zustand";

export type ChannelLists =
  | "course"
  | "messaging"
  | "otherInstitutions"
  | "groups"
  | "hidden";

interface IChannelList {
  /**
   * Shows what list to render when the channel
   * list filter is enabled
   */
  listToRender: ChannelLists | undefined;
}

interface ChannelListsMethods {
  setListToRender: (data: IChannelList["listToRender"]) => void;
}

const initialState: IChannelList = {
  listToRender: undefined,
};

const useChannelList = create<IChannelList & ChannelListsMethods>()((set) => ({
  ...initialState,
  setListToRender: (data) => set(() => ({ listToRender: data })),
}));

export default useChannelList;
