import Title from "@/src/components/reusable/title";
import { ElementBehaviourType } from "../../elements/element-type";
import elementTypes from "../../elements/element-types";
import useWorkbench, { WorkbenchType } from "../../zustand";
import Separator from "../separator";
import { SidebarElement } from "../sidebar-element";
import useElementLibrary from "./zustand";

export function ElementLibrary() {
  const { workbenchType } = useWorkbench();
  const { search } = useElementLibrary();

  return (
    <ul role="list" className="mt-4 flex-1 overflow-y-auto">
      <Title text="workbench.element_library" type="h2" />
      <Separator title={"workbench.sidebar_separator_title1"} />
      <div className="grid grid-cols-3 gap-2">
        {elementTypes
          .filter(
            (element) =>
              !element.depcrecated &&
              element.behaviourType === ElementBehaviourType.INFORMATIVE &&
              element.name
                .toLocaleLowerCase()
                .includes(search.toLocaleLowerCase()),
          )
          .map((element, idx) => SidebarElement({ element, idx }))}
      </div>

      {workbenchType === WorkbenchType.ASSESSMENT && (
        <>
          <Separator title={"workbench.sidebar_separator_title2"} />
          <div className="grid grid-cols-3 gap-2">
            {elementTypes
              .filter(
                (element) =>
                  !element.depcrecated &&
                  element.behaviourType === ElementBehaviourType.INTERACTIVE &&
                  element.name
                    .toLocaleLowerCase()
                    .includes(search.toLocaleLowerCase()),
              )
              .map((element, idx) => SidebarElement({ element, idx }))}
          </div>
        </>
      )}
      <Separator title={"workbench.sidebar_separator_title3"} />
      <div className="grid grid-cols-3 gap-2">
        {elementTypes
          .filter(
            (element) =>
              !element.depcrecated &&
              element.behaviourType === ElementBehaviourType.AUTOMATION &&
              element.name
                .toLocaleLowerCase()
                .includes(search.toLocaleLowerCase()),
          )
          .map((element, idx) => SidebarElement({ element, idx }))}
      </div>
    </ul>
  );
}
