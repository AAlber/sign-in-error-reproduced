import { Check, X } from "lucide-react";
import { handleSkip } from "@/src/client-functions/client-changelog";
import Button from "@/src/components/reusable/new-button";
import useChangelogStore from "../../zustand";

export default function CloseButton(props: { onlyIcon?: boolean }) {
  const { setOpen, idsToShow, setNoNewChangelog } = useChangelogStore();
  return (
    <>
      {!props.onlyIcon ? (
        <>
          <Button
            icon={<Check />}
            onClick={() => {
              handleSkip(idsToShow);
              setNoNewChangelog(true);
            }}
          />
        </>
      ) : (
        <>
          <button
            className="absolute left-0 top-0 p-3"
            onClick={() => setOpen(false)}
          >
            <X />
          </button>
        </>
      )}
    </>
  );
}
