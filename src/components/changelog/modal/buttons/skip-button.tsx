import { handleSkip } from "@/src/client-functions/client-changelog";
import Button from "@/src/components/reusable/new-button";
import useChangelogStore from "../../zustand";

export const SkipButton = () => {
  const { idsToShow, setNoNewChangelog } = useChangelogStore();

  return (
    <>
      <Button
        title="changelog_skip_button"
        onClick={() => {
          handleSkip(idsToShow);
          setNoNewChangelog(true);
        }}
      />
    </>
  );
};
