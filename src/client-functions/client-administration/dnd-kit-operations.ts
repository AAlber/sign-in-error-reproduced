import type { DropAnimation, Modifier, UniqueIdentifier } from "@dnd-kit/core";
import { defaultDropAnimation, MeasuringStrategy } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
  FlattenedItem,
  TreeItem,
  TreeItems,
} from "@/src/components/administration/types";
import useAdministration from "@/src/components/administration/zustand";

/**
 * DND Kit Core Utils
 * https://github.com/clauderic/dnd-kit/blob/master/stories/3%20-%20Examples/Tree/utilities.ts
 */

export class DndKitOperations {
  adjustTranslate: Modifier = ({ transform }) => {
    return {
      ...transform,
      y: transform.y - 5,
    };
  };

  countChildren(items: TreeItem[], count = 0): number {
    return items.reduce((acc, { children }) => {
      if (children.length) {
        return this.countChildren(children, acc + 1);
      }

      return acc + 1;
    }, count);
  }

  flatten(
    items: TreeItems | undefined,
    parentId: UniqueIdentifier | null = null,
    depth = 0,
  ): FlattenedItem[] {
    return (
      items?.reduce<FlattenedItem[]>((acc, item, index) => {
        return [
          ...acc,
          { ...item, parentId, depth, index },
          ...this.flatten(item.children, item.id, depth + 1),
        ];
      }, []) ?? []
    );
  }

  findItemDeep(
    items: TreeItems,
    itemId: UniqueIdentifier,
  ): TreeItem | undefined {
    for (const item of items) {
      const { id, children } = item;

      if (id === itemId) {
        return item;
      }

      if (children.length) {
        const child = this.findItemDeep(children, itemId);

        if (child) {
          return child;
        }
      }
    }

    return undefined;
  }

  getProjection(
    items: FlattenedItem[],
    activeId: UniqueIdentifier,
    overId: UniqueIdentifier,
    dragOffset: number,
    indentationWidth: number,
  ) {
    function getParentId() {
      if (depth === 0 || !previousItem) {
        return null;
      }

      if (depth === previousItem.depth) {
        return previousItem.parentId;
      }

      if (depth > previousItem.depth) {
        return previousItem.id;
      }

      const newParent = newItems
        .slice(0, overItemIndex)
        .reverse()
        .find((item) => item.depth === depth)?.parentId;

      return newParent ?? null;
    }

    const overItemIndex = items.findIndex(({ id }) => id === overId);
    const activeItemIndex = items.findIndex(({ id }) => id === activeId);
    const activeItem = items[activeItemIndex];
    const newItems = arrayMove(items, activeItemIndex, overItemIndex);
    const previousItem = newItems[overItemIndex - 1];
    const nextItem = newItems[overItemIndex + 1];
    const dragDepth = this._getDragDepth(dragOffset, indentationWidth);
    const projectedDepth = activeItem!.depth + dragDepth;
    const maxDepth = this._getMaxDepth({
      previousItem: previousItem!,
    });
    const minDepth = this._getMinDepth({ nextItem: nextItem! });
    let depth = projectedDepth;

    if (projectedDepth >= maxDepth) {
      depth = maxDepth;
    } else if (projectedDepth < minDepth) {
      depth = minDepth;
    }

    return { depth, maxDepth, minDepth, parentId: getParentId() };
  }

  removeChildrenOf(items: FlattenedItem[], ids: UniqueIdentifier[]) {
    const excludeParentIds = [...ids];

    return items.filter((item) => {
      if (item.parentId && excludeParentIds.includes(item.parentId)) {
        if (item.children.length) {
          excludeParentIds.push(item.id);
        }
        return false;
      }

      return true;
    });
  }

  removeItem(items: TreeItems, id: UniqueIdentifier) {
    const newItems: TreeItems = [];

    for (const item of items) {
      if (item.id === id || item.linkedCourseLayerId === id) {
        continue;
      }

      if (item.children.length) {
        item.children = this.removeItem(item.children, id);
      }

      newItems.push(item);
    }

    return newItems;
  }

  setProperty<T extends keyof TreeItem>(
    items: TreeItems,
    id: UniqueIdentifier,
    property: T,
    setter: (value: TreeItem[T]) => TreeItem[T],
  ) {
    // TODO: move rootflatlayer outside of state to avoid dependency cycle
    const { rootFlatLayer = [] } = useAdministration.getState();
    for (const item of items) {
      if (item.id === id) {
        const newProperty = setter(item[property]);
        item[property] = newProperty;

        const found = rootFlatLayer.find((i) => i.id === id) as TreeItem;
        if (found) found[property] = newProperty;
        continue;
      }

      if (item.children.length) {
        item.children = this.setProperty(item.children, id, property, setter);
      }
    }

    return [...items];
  }

  private _getDragDepth(offset: number, indentationWidth: number) {
    return Math.round(offset / indentationWidth);
  }

  private _getMaxDepth({ previousItem }: { previousItem: FlattenedItem }) {
    return previousItem
      ? previousItem.isCourse
        ? previousItem.depth
        : previousItem.depth + 1
      : 0;
  }

  private _getMinDepth({ nextItem }: { nextItem: FlattenedItem }) {
    return nextItem ? nextItem.depth : 0;
  }

  /** @deprecated */
  private _getChildCount(items: TreeItems, id: UniqueIdentifier) {
    const item = this.findItemDeep(items, id);

    return item ? this.countChildren(item.children) : 0;
  }
}

export const DndKitOptions: {
  measuring: { droppable: { strategy: MeasuringStrategy } };
  dropAnimationConfig: DropAnimation;
} = {
  measuring: {
    droppable: {
      strategy: MeasuringStrategy.Always,
    },
  },
  dropAnimationConfig: {
    keyframes({ transform }) {
      return [
        { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
        {
          opacity: 0,
          transform: CSS.Transform.toString({
            ...transform.final,
            x: transform.final.x + 5,
            y: transform.final.y + 5,
          }),
        },
      ];
    },
    easing: "ease-out",
    sideEffects({ active }) {
      active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: defaultDropAnimation.duration,
        easing: defaultDropAnimation.easing,
      });
    },
  },
};

const dndKitOperations = new DndKitOperations();
export default dndKitOperations;
