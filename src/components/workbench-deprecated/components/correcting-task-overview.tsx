import Image from "next/image";
import { useEffect, useState } from "react";
import { getContent } from "@/src/client-functions/client-workbench";
import elementTypes from "../elements/element-types";
import type { WorkbenchElement } from "../types";
import useWorkbench from "../zustand";

export default function TaskOverview() {
  const {
    setSelectedElement: setSelectedElement,
    setSelectedUser,
    getElementsOfCurrentPage,
    setContent,
    selectedElement,
    submittedUsers,
    documents,
    content,
  } = useWorkbench();
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    if (selectedElement) return;
    const firstTask = getElementsOfCurrentPage()
      .filter(
        (element) =>
          !elementTypes.filter((type) => type.id === element.type).at(0)
            ?.behaviourType,
      )
      .at(0);
    if (firstTask) setSelectedElement(firstTask.id);
  }, [selectedElement]);

  useEffect(() => {
    if (!submittedUsers[0]) return setNoResults(true);
    const userTaskContent = getContent(submittedUsers[0].id, documents);
    if (!userTaskContent) return;
    setContent(userTaskContent);
    setSelectedUser(submittedUsers[0]);
  }, []);

  if (noResults)
    return (
      <section className="my-auto flex flex-col items-center justify-center px-10 py-20 text-center">
        <Image
          src="/illustrations/empty.webp"
          className="mb-4 mr-2"
          width={100}
          height={100}
          priority
          alt=""
        />
        <h2 className="text-2xl font-bold text-contrast">No results yet</h2>
        <p className="mt-2 text-muted-contrast">
          There are no results yet. Please wait until the users have submitted
          their work.
        </p>
      </section>
    );

  return (
    <div className="sticky top-0 hidden h-full w-full overflow-y-scroll bg-background lg:flex lg:flex-col">
      {getElementsOfCurrentPage()
        .filter(
          (element) =>
            !elementTypes.filter((type) => type.id === element.type).at(0)
              ?.behaviourType,
        )
        .map((element) =>
          MapItem(element, setSelectedElement, selectedElement),
        )}
    </div>
  );
}

function MapItem(
  element: WorkbenchElement,
  setSelectedElement,
  selectedElement,
) {
  const type = elementTypes.find((type) => type.id === element.type);

  return (
    <div
      key={element.id}
      onClick={() => {
        setSelectedElement(element.id);
      }}
      className={`${
        selectedElement === element.id && "bg-gray-50 dark:bg-offblack-2"
      } flex cursor-pointer items-center gap-2 border-b border-offwhite-2 px-3 py-1 text-sm text-offblack-2 hover:bg-gray-50 dark:border-offblack-3 dark:text-offwhite-2 dark:hover:bg-offblack-2`}
    >
      <p className="flex w-5 justify-center">{type?.iconSmall}</p>
      <p className="flex-1 truncate">
        {!element.metadata.task ? type?.name : element.metadata.task}
      </p>
    </div>
  );
}
