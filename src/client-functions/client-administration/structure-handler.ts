import type { AdministrationOperations } from "./administration-operations";
import administrationOperations from "./administration-operations";
import type { DndKitOperations } from "./dnd-kit-operations";
import dndKitOperations from "./dnd-kit-operations";
import type { LayerTreeOperations } from "./layer-tree-operations";
import layerTreeOperations from "./layer-tree-operations";

/**
 * The handler responsible for managing the state and async
 * operations that builds the UI for the administration layer tree structure.
 */
class StructureHandler {
  constructor(
    private readonly _administrationOperations: AdministrationOperations,
    private readonly _dndOperations: DndKitOperations,
    private readonly _layerTreeOperations: LayerTreeOperations,
  ) {}

  create = {
    layer: this._administrationOperations.createObject.bind(
      this._administrationOperations,
    ),
  };

  update = {
    layerName: this._administrationOperations.renameObject.bind(
      this._administrationOperations,
    ),
    layerPosition: this._administrationOperations.reorderLayerPosition.bind(
      this._administrationOperations,
    ),
    layerTimeSpan: this._administrationOperations.updateLayerTimespan.bind(
      this._administrationOperations,
    ),
  };

  get = {
    coursesUserHasAccessTo:
      this._administrationOperations.getCoursesUserHasAccessTo.bind(
        this._administrationOperations,
      ),
    userCoursesWithProgressData:
      this._administrationOperations.getUserCoursesWithProgressData.bind(
        this._administrationOperations,
      ),
    layer: this._administrationOperations.getLayer.bind(
      this._administrationOperations,
    ),
    layers: this._administrationOperations.getLayers.bind(
      this._administrationOperations,
    ),
    layerPath: this._administrationOperations.getLayerPath.bind(
      this._administrationOperations,
    ),
    layerPathId: this._administrationOperations.getLayerPathId.bind(
      this._administrationOperations,
    ),
    layerTree: this._administrationOperations.getLayerTree.bind(
      this._administrationOperations,
    ),
    layersUserHasSpecialAccessTo:
      this._administrationOperations.getLayersUserHasSpecialAccessTo.bind(
        this._administrationOperations,
      ),
    topMostLayersUserHasAccessTo:
      this._administrationOperations.getTopMostLayersUserHasAccessTo.bind(
        this._administrationOperations,
      ),
  };

  delete = {
    layer: this._administrationOperations.deleteObject.bind(
      this._administrationOperations,
    ),
  };

  utils = {
    dndKit: this._dndOperations,
    layerTree: this._layerTreeOperations,
  };
}

const structureHandler = new StructureHandler(
  administrationOperations,
  dndKitOperations,
  layerTreeOperations,
);

export default structureHandler;
