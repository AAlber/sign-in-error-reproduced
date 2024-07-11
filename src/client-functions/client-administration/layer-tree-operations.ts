import type { DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type {
  FlattenedItem,
  Layer,
  TreeItem,
  TreeItems,
} from "@/src/components/administration/types";
import useAdministration from "@/src/components/administration/zustand";
import { toast } from "@/src/components/reusable/toaster/toast";
import type { ReorderLayerPositionArgs } from "@/src/pages/api/administration/reorder-layer-position";
import type {
  CreateLayerApiArgs,
  LinkedCourse,
} from "@/src/types/server/administration.types";
import { filterUndefined } from "@/src/utils/utils";
import useUser from "@/src/zustand/user";
import confirmAction from "../client-options-modal";
import type { DndKitOperations } from "./dnd-kit-operations";
import dndKitOperations from "./dnd-kit-operations";

/** Non-async state operations related to the Layer tree thats creates the administration structure */
export class LayerTreeOperations {
  constructor(private readonly _dndOperations: DndKitOperations) {}

  generateNewLayerObject(args: CreateLayerApiArgs): Layer {
    const { id, institution_id, isCourse, name, parent_id } = args;

    let courseData: LinkedCourse | { isCourse: boolean } = {
      isCourse,
    };

    if (isCourse && args.isLinkedCourse) {
      courseData = {
        isLinkedCourse: true,
        linkedCourseLayerId: args.linkedCourseLayerId,
        isCourse: true,
      } satisfies LinkedCourse;
    }

    return {
      id: id as string,
      name,
      institution_id,
      parent_id,
      children: [],
      ...courseData,
    };
  }

  /**
   * Rebuilds the layer tree from root or the currently selected layer,
   * on update of its children
   */

  cultivateLayerData(layer: Layer) {
    const { currentLayer, rootFlatLayer = [] } = useAdministration.getState();

    const institutionId = useUser.getState().user.currentInstitutionId;
    const clonedRootFlatTree: FlattenedItem[] = [...rootFlatLayer];

    const modifiedLayerIndex = clonedRootFlatTree.findIndex(
      (i) => i.id === layer.id,
    );
    if (modifiedLayerIndex === -1) {
      // This is a new Layer, append to end
      clonedRootFlatTree.push({
        ...layer,
        parentId: layer.parent_id as string,
        depth: 0,
        index: 0,
      });
    } else {
      // there has been a change in the layer, Update the layer in place
      const modifiedLayer = clonedRootFlatTree[modifiedLayerIndex];

      clonedRootFlatTree[modifiedLayerIndex] = {
        ...modifiedLayer,
        ...layer,
        parentId: layer.parent_id as string,
        index: modifiedLayerIndex,
        depth: 0,
      };
    }

    // Rebuild the whole tree
    const newTree = this.buildTree(clonedRootFlatTree);

    if (currentLayer === institutionId) {
      useAdministration.setState({
        rootFlatLayer: clonedRootFlatTree,
        layerTree_: newTree,
      });
    } else {
      // Else rebuild the tree from the currently selected layer
      const flattenedClonedTree = this.flattenTree(newTree);
      const currentlySelectedLayer = flattenedClonedTree.find(
        (layer) => layer.id === currentLayer,
      );

      if (currentlySelectedLayer) {
        const flatTreeOfCurrentLayer = this.flattenTree(
          currentlySelectedLayer.children,
        );

        const treeFromCurrentLayer = this.buildTree(
          flatTreeOfCurrentLayer,
          currentLayer,
        );

        useAdministration.setState({
          rootFlatLayer: clonedRootFlatTree,
          layerTree_: treeFromCurrentLayer,
        });
      }
    }
  }

  buildTree(flattenedItems: FlattenedItem[], rootId?: string): TreeItems {
    const rootId_ = rootId ?? useUser.getState().user.currentInstitutionId;
    const root: TreeItem = { id: rootId_, children: [] };
    const nodes: Record<string, TreeItem> = { [root.id]: root };
    const layers = flattenedItems.map((layer) => ({
      ...layer,
      children: [],
    }));

    layers.forEach((layer) => {
      const { id, children } = layer;
      const parentInTree = layers.some((i) => i.id === layer.parentId);
      const parentId = parentInTree ? layer.parentId ?? root.id : root.id;
      const parent = nodes[parentId] ?? this.findLayer(layers, parentId);

      nodes[id] = { id, children };
      parent?.children.push(layer);
    });

    return this._fixChildrenPosition(root.children);
  }

  flattenTree(items: TreeItems): FlattenedItem[] {
    return this._dndOperations.flatten(items);
  }

  findLayer(layers: TreeItem[], layerId: UniqueIdentifier) {
    return layers.find(({ id }) => id === layerId);
  }

  getFlattenedItems(activeId: Nullable<UniqueIdentifier>) {
    const { layerTree_ = [] } = useAdministration.getState();
    const flattenedTree = this.flattenTree(layerTree_);
    const collapsedItems = flattenedTree.reduce<UniqueIdentifier[]>(
      (acc, { children, collapsed, id }) =>
        collapsed && children.length ? [...acc, id] : acc,
      [],
    );

    return this._dndOperations.removeChildrenOf(
      flattenedTree,
      activeId ? [activeId, ...collapsedItems] : collapsedItems,
    );
  }

  /** Trace the hierarchy path of the specified layer in the layer tree. */
  getHierarchyPath(id: string, flatTree: FlattenedItem[]) {
    const path: { id: string; name: string }[] = [];

    function _findLayer(id_: string) {
      const layer = flatTree.find((i) => i.id === id_);
      if (layer) {
        path.push({ id: layer.id as string, name: layer.name ?? "" });
        _findLayer(layer.parentId as string);
      }
    }

    _findLayer(id);
    return [...path.reverse()];
  }

  getLayerNameToShow(layer: any): string {
    return layer.displayName || layer.name;
  }

  getLinkedCoursesOfCourse(courseLayerId: Layer["id"]) {
    const { rootFlatLayer } = useAdministration.getState();

    return rootFlatLayer
      ?.map((layer) =>
        layer.isLinkedCourse && layer.linkedCourseLayerId === courseLayerId
          ? layer
          : undefined,
      )
      .filter(filterUndefined);
  }

  handleCollapse(id: UniqueIdentifier, bool?: boolean) {
    const { layerTree_ = [], setLayerTree_ } = useAdministration.getState();
    const newTree = this._dndOperations.setProperty(
      layerTree_,
      id,
      "collapsed",
      (value) => {
        return bool ?? !value;
      },
    );

    setLayerTree_(newTree);
  }

  handleDragEnd(
    projected: Nullable<ReturnType<typeof this._dndOperations.getProjection>>,
    resetState: () => void,
    onLayerMove: (
      data: ReorderLayerPositionArgs,
    ) => Promise<{ success: boolean }>,
  ) {
    return ({ active, over }: DragEndEvent) => {
      resetState();
      const { user: user } = useUser.getState();
      const {
        layerTree_ = [],
        currentLayer,
        setLayerTree_,
        setRootFlatLayer,
      } = useAdministration.getState();

      const clonedTree = [...layerTree_];

      if (projected && over) {
        const { depth, parentId } = projected;
        const clonedItems: FlattenedItem[] = this.flattenTree(clonedTree);
        const clonedRoot = [...clonedItems];

        const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
        const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
        const activeTreeItem = clonedItems[activeIndex];

        /** The initial parent of the layer before the dragging */
        const initialParent = clonedRoot.find(
          (i) => i.id === activeTreeItem?.parentId,
        );

        clonedItems[activeIndex] = {
          ...activeTreeItem,
          depth,
          parentId,
        } as FlattenedItem;

        const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
        const newItems = this.buildTree(sortedItems);

        /** The updated version of `activeTreeItem` */
        const activeItem = clonedItems[activeIndex];

        // Avoid mutating if there is no change in position
        if (JSON.stringify(clonedTree) === JSON.stringify(newItems)) return;

        // prevent from moving layer or course into a course
        const newParent = clonedItems.find(
          (i) => i.id === activeItem?.parentId,
        );

        if (newParent?.isCourse) {
          const isCourse = clonedItems[activeIndex]?.isCourse;

          toast.warning(
            isCourse
              ? "Moving the course into a course is not allowed."
              : "Moving a layer into a course is not allowed.",
            {
              description: isCourse
                ? "Please move the course into a layer instead."
                : "Please move the layer into a layer instead.",
            },
          );

          return;
        }

        if (activeItem?.id) {
          const parentId = (newParent?.id as string) ?? currentLayer; // on init currentLayer === currentInstitution
          const isRoot = parentId === currentLayer;
          const newFlatTree = this.flattenTree(newItems);
          const newParent_ = newFlatTree.find((i) => i.id === parentId);

          const data: ReorderLayerPositionArgs = {
            layerId: activeItem.id as string,
            parentId,
            children: isRoot
              ? newItems.map((layer) => String(layer.id))
              : newParent_?.children.map((layer) => String(layer.id)) ?? [],
          };

          const rollbackAction = () => {
            setLayerTree_(clonedTree);
            if (currentLayer === user.currentInstitutionId) {
              setRootFlatLayer(clonedRoot);
            }
          };

          const moveLayer = () => {
            onLayerMove(data).catch(rollbackAction);
            this._dndOperations.setProperty(
              newItems,
              activeItem.id,
              "parent_id",
              () => parentId,
            );
          };

          const isMovingToAnotherParent =
            initialParent?.id !== newParent?.id ||
            initialParent?.depth !== newParent?.depth;

          if (isMovingToAnotherParent) {
            /**
             * Only show confirmation modal if moving to a different parent,
             * don't show modal if just reordering layer position
             */
            confirmAction(moveLayer, {
              actionName: "general.confirm",
              allowCancel: true,
              cancelName: "general.cancel",
              shouldCancelOnClose: true,
              title: "new_parent_confirmation_title",
              description: "new_parent_confirmation_description",
              onCancel: rollbackAction,
            });
          } else {
            moveLayer();
          }
        }

        if (currentLayer === user.currentInstitutionId) {
          setRootFlatLayer(sortedItems);
        }

        setLayerTree_(newItems);
      }
    };
  }

  handleRemove(id: UniqueIdentifier) {
    const { layerTree_ = [], setLayerTree_ } = useAdministration.getState();
    const newTree = this._dndOperations.removeItem(layerTree_, id);
    setLayerTree_(newTree);
  }

  normalizeTree(arr: Layer): TreeItems {
    const flattenedTree = this.flattenTree(arr.children);
    const newTree = this.buildTree(flattenedTree);
    return newTree;
  }

  rebuildLayerTree(idToRemove: string) {
    const { layerTree_, rootFlatLayer, setRootFlatLayer, setLayerTree_ } =
      useAdministration.getState();

    if (rootFlatLayer && layerTree_) {
      // rebuild the rootFlatLayer first
      const rootTree = this.buildTree(rootFlatLayer);
      const newRootTree = this._dndOperations.removeItem(rootTree, idToRemove);
      const flattenedRoot = this.flattenTree(newRootTree);
      setRootFlatLayer(flattenedRoot);

      // also remove id from current layerTree (children of currentLayer)
      const newTree = this._dndOperations.removeItem(layerTree_, idToRemove);
      setLayerTree_(newTree);
    }
  }

  rebuildRootFlatLayer() {
    const {
      currentLayer,
      layerTree_ = [],
      rootFlatLayer,
      setRootFlatLayer,
      filter,
    } = useAdministration.getState();

    if (rootFlatLayer && !!layerTree_.length) {
      const newTree = this.buildTree(rootFlatLayer);
      const layer = this._dndOperations.findItemDeep(newTree, currentLayer);

      if (layer) {
        layer.children = layerTree_;
        const flattenedLayer = this.flattenTree(newTree);
        !filter && setRootFlatLayer(flattenedLayer);
      }
    }
  }

  private _fixChildrenPosition(tree: TreeItems): TreeItems {
    return tree.map((i, idx) => {
      return {
        ...i,
        index: idx,
        position: idx,
        children: this._fixChildrenPosition(i.children),
      };
    });
  }
}

const layerTreeOperations = new LayerTreeOperations(dndKitOperations);
export default layerTreeOperations;
