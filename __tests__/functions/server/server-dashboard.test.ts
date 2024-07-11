import {
  buildLayerTree,
  getInitialLayersOfUser,
} from "@/src/server/functions/server-administration-dashboard";

describe("Server Dashboard Tests", () => {
  const institution_id = "insti";
  const layer1 = "layer1";
  const layer2 = "layer2";

  const mockLayers: any[] = [
    // layers without courses
    {
      course: null,
      displayName: "",
      end: null,
      id: layer1,
      institution_id,
      isCourse: false,
      isLinkedCourse: false,
      linkedCourseLayerId: null,
      name: "",
      parent_id: institution_id,
      position: 1,
      start: null,
    },
    {
      course: null,
      displayName: "",
      end: null,
      id: layer2,
      institution_id,
      isCourse: false,
      isLinkedCourse: false,
      linkedCourseLayerId: null,
      name: "",
      parent_id: layer1, // this layer should be a child of layer1
      position: 1,
      start: null,
    },

    // layers with course info
    {
      course: {
        icon: "",
        layer_id: "layerWithCourse1",
        name: "",
      },
      displayName: "",
      end: null,
      id: "layerWithCourse1",
      institution_id,
      isCourse: true,
      isLinkedCourse: false,
      linkedCourseLayerId: null,
      name: "",
      parent_id: layer1,
      position: 1,
      start: null,
    },
    {
      course: {
        icon: "",
        layer_id: "layerWithCourse2",
        name: "",
      },
      displayName: "",
      end: null,
      id: "layerWithCourse2",
      institution_id,
      isCourse: true,
      isLinkedCourse: false,
      linkedCourseLayerId: null,
      name: "",
      parent_id: layer1,
      position: 1,
      start: null,
    },
    {
      course: {
        icon: "",
        layer_id: "layerWithCourse3",
        name: "",
      },
      displayName: "",
      end: null,
      id: "layerWithCourse3",
      institution_id,
      isCourse: true,
      isLinkedCourse: false,
      linkedCourseLayerId: null,
      name: "",
      parent_id: layer2, // this course should be a child of layer 2
      position: 1,
      start: null,
    },
  ];

  describe("buildLayerTree", () => {
    /**
     * Rules
     * 1. if `isCourse` is false, then course is `null` else course is an object
     * 2. if course is defined, the `id` of the course is same with `id` of layer
     * 3. parent_id can be the institution id
     * 4. parent_id cannot be a layer with a course
     */

    it("Returns an empty array", () => {
      const layerTree = buildLayerTree([]);
      expect(Array.isArray(layerTree)).toBeTruthy();
      expect(layerTree.length).toBe(0); // there is only 1 root layer
    });

    it("Returns 1 root layer and builds tree correctly", () => {
      const layerTree = buildLayerTree(mockLayers, institution_id);
      expect(Array.isArray(layerTree)).toBeTruthy();
      expect(layerTree.length).toBe(1);
      expect(layerTree[0]?.children.length).toBe(3);
      expect(layerTree[0]?.children[0]?.children.length).toBe(1);

      const validLayerId = layerTree[0]?.children.find(
        (layer) => layer.id === mockLayers[1]?.id,
      );

      const invalidLayerId = layerTree[0]?.children.find(
        (layer) => layer.id === "random",
      );

      expect(validLayerId).toBeDefined();
      expect(invalidLayerId).toBeUndefined();
    });

    it("Builds tree correctly when given a rootId other than institutionId", () => {
      const layerTree = buildLayerTree(mockLayers, layer1);

      expect(Array.isArray(layerTree)).toBeTruthy();
      expect(layerTree.length).toBe(3);
    });

    it("Returns multiple root layers", () => {
      const clonedLayer = [
        ...mockLayers,
        {
          course: {
            icon: "",
            layer_id: "layerWithCourse4",
            name: "",
          },
          displayName: "",
          end: null,
          id: "layerWithCourse4",
          institution_id,
          isCourse: true,
          name: "",
          parent_id: "random",
          position: 1,
          start: null,
          isLinkedCourse: false,
          linkedCourseLayerId: null,
        },
      ];

      const layerTree = buildLayerTree(clonedLayer);
      expect(Array.isArray(layerTree)).toBeTruthy();
      expect(layerTree.length).toBe(2);
    });
  });

  describe("getInitialLayersOfUser", () => {
    const clonedLayer = [
      ...mockLayers,
      {
        course: {
          icon: "",
          layer_id: "layerWithCourse4",
          name: "",
        },
        displayName: "",
        end: null,
        id: "layerWithCourse4",
        institution_id,
        isCourse: true,
        name: "",
        parent_id: "random",
        position: 1,
        start: null,
        linkedCourseLayerId: null,
        isLinkedCourse: null,
      },
    ];

    const layerTree = buildLayerTree(clonedLayer, institution_id);

    it("Returns correct number of layers given the roles", () => {
      let initialLayers = getInitialLayersOfUser(layerTree, [
        { layerId: layer1, role: "moderator" },
        { layerId: "layerWithCourse4", role: "admin" },
      ]);

      expect(initialLayers.length).toBe(1);

      initialLayers = getInitialLayersOfUser(layerTree, [
        { layerId: layer1, role: "moderator" },
        { layerId: "layerWithCourse4", role: "moderator" },
      ]);

      expect(initialLayers.length).toBe(2);

      initialLayers = getInitialLayersOfUser(layerTree, [
        { layerId: layer2, role: "moderator" },
        { layerId: "layerWithCourse4", role: "member" },
      ]);

      expect(initialLayers.length).toBe(0);

      initialLayers = getInitialLayersOfUser(layerTree, []);
      expect(initialLayers.length).toBe(0);
    });
  });
});
