import useChangelogStore from "../components/changelog/zustand";

const {
  setIdsToShow,
  viewedIds,
  setOpen,
  setChangelog,
  setPagination,
  setLoading,
  pagination,
  addToViewedIds,
} = useChangelogStore.getState();

export const removeViewedIds = (idsToShow: string[], viewedIds: string[]) => {
  return setIdsToShow(idsToShow.filter((id) => !viewedIds.includes(id)));
};

const setAllViewedIDs = (idsToShow: string[]) => {
  return idsToShow.forEach((id) => addToViewedIds(id));
};

export const handleSkip = (idsToShow: string[]) => {
  setAllViewedIDs(idsToShow);
  setIdsToShow([]);
  setOpen(false);
  console.log("skip");
};

export const handleFetch = () => {
  const QUERY = encodeURIComponent('*[_type == "changelog"]');
  const PROJECT_ID = "4xe535du";
  const DATASET = "production";
  const URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`;
  fetch(URL)
    .then((res) => res.json())
    .then(async (data: { result: Changelog[] }) => {
      const sortedData = data.result.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );

      setChangelog(sortedData);
      const idsToShow = sortedData
        .slice(0, 3)
        .map((item) => item.id)
        .filter((id) => !viewedIds.includes(id));

      setIdsToShow(idsToShow);
      setOpen(true);
      setPagination({
        page: 1,
        limit: 1,
        total: idsToShow.length,
      });

      setLoading(false);
    })
    .catch((error) => {
      console.error(error);
    });
};

export const lastPageCondition = pagination.page < pagination.total;
