import * as clerkServerFn from "@clerk/nextjs/server";
import type { User } from "@prisma/client";
import {
  apiTestHandler,
  apiTestHandlerWithJson,
  createMockContentBlock,
  createUserWithRoleInstitutionAndLayersData,
} from "@/__tests__/helpers";
import type { MockLayer } from "@/__tests__/helpers/types";
import createContentBlockApiHandler from "@/src/pages/api/content-block/create";
import deleteContentBlockApiHandler from "@/src/pages/api/content-block/delete";
import getContentBlocksApiHandler from "@/src/pages/api/content-block/get/[layerId]";
import type { ReorderContentBlockPositionArgs } from "@/src/pages/api/content-block/reorder";
import reorderContentBlockPositionApiHandler from "@/src/pages/api/content-block/reorder";
import updateContentBlockApiHandler from "@/src/pages/api/content-block/update";
import updateContentBlockRequirementApiHandler from "@/src/pages/api/content-block/update-requirement";
import duplicateContentBlockApiHandler from "@/src/pages/api/courses/import-data-from-course";
import { prisma } from "@/src/server/db/client";
import type {
  UpdateContentBlock,
  UpdateContentBlockRequirements,
} from "@/src/types/content-block/types/cb-types";
import type { ContentBlock } from "@/src/types/course.types";
import type { CopyLayerContentToAnotherLayerArgs } from "@/src/types/server/course.types";

const getAuth = jest.spyOn(clerkServerFn, "getAuth");
const timeout = 120000;

/**
 * NOTE:
 *
 * - the order of the test is important here as each `it block` rely on the result of
 * previous `it blocks`
 *
 * - the LINEAR CONTENT BLOCK requirement feature is now the a default feature, meaning by default
 * the 2nd contentblock created will automatically require the 1st, and 3rd will will require the 2nd an so on.
 * check `createContentBlockApiHandler` for its implementation
 */

describe("content-block CRUD api", () => {
  let adminUser: User,
    assessment: ContentBlock,
    blocks: ContentBlock[],
    fileBlock: ContentBlock,
    handIn: ContentBlock,
    layers: MockLayer[],
    mockAssessmentBlock: ContentBlock<"Assessment">,
    mockFileBlock: ContentBlock<"File">,
    mockHandInBlock: ContentBlock<"HandIn">,
    prismaBlocks: any,
    theLayer: MockLayer;

  beforeAll(async () => {
    const mockData = await createUserWithRoleInstitutionAndLayersData();
    adminUser = mockData.user;
    layers = mockData.layers;

    /**************** INITIALIZE VARIABLES *****************/

    const layerToTest = layers[0];
    if (!layerToTest) throw new Error("flaky test");
    theLayer = layerToTest;

    getAuth.mockReturnValue({ userId: adminUser.id } as any);

    mockHandInBlock = createMockContentBlock<"HandIn">({
      type: "HandIn",
      specs: {
        allowedFileTypes: "",
        isGroupSubmission: false,
        isSharedSubmission: false,
      },
      layerId: theLayer.id,
    });

    mockAssessmentBlock = createMockContentBlock<"Assessment">({
      type: "Assessment",
      specs: { content: "{}" },
      layerId: theLayer.id,
    });

    mockFileBlock = createMockContentBlock<"File">({
      type: "File",
      specs: { files: ["url"], isProtected: false },
      layerId: theLayer.id,
    });
  }, timeout);

  it("CREATE", async () => {
    handIn = await apiTestHandlerWithJson<ContentBlock>(
      createContentBlockApiHandler,
      {
        method: "POST",
        body: mockHandInBlock,
      },
    );

    /**
     * NOTE:
     *
     * When creating a contentBlock in a course which has existing blocks, the newly created block
     * will automatically add the previous block as its requirement (LINEAR REQUIREMENT BLOCKS FEATURE),
     * if there are no existing blocks yet it that layer, then it has no requirements
     *
     * in the case here after creating the assessment block, we expect the handIn block to be its requirement
     */

    expect(handIn.id).toBe(mockHandInBlock.id);

    assessment = await apiTestHandlerWithJson<ContentBlock>(
      createContentBlockApiHandler,
      {
        method: "POST",
        body: mockAssessmentBlock,
      },
    );

    expect(assessment).toBeDefined();
    expect(assessment.requirements[0]?.id).toBe(handIn.id);

    prismaBlocks = await prisma.contentBlock.findMany({
      where: { layerId: theLayer.id },
    });

    expect(prismaBlocks.length).toBe(2);
  });

  it("UPDATE", async () => {
    const dueDate = new Date();
    handIn = await apiTestHandlerWithJson<ContentBlock>(
      updateContentBlockApiHandler,
      {
        method: "POST",
        body: { id: handIn.id, dueDate } as UpdateContentBlock,
      },
    );

    if (!handIn.dueDate) throw new Error("Flaky test");

    expect(new Date(handIn.dueDate).getTime()).toBe(dueDate.getTime());
  });

  it("Adds a requirement to the contentBlock", async () => {
    fileBlock = await apiTestHandlerWithJson<ContentBlock>(
      createContentBlockApiHandler,
      {
        method: "POST",
        body: mockFileBlock,
      },
    );

    /**
     * NOTE again, this is the 3rd block we are creating in this test case,
     * meaning this block will automatically require the previous block in this layer (assessment)
     *
     * we simulate replacing the requirement with the 1st block (handIn) instead
     */

    expect(fileBlock.id).toBe(mockFileBlock.id);
    expect(fileBlock.requirements[0]?.id).toBe(assessment.id);

    const updateBlockRequirementResult = await apiTestHandlerWithJson<{
      success: boolean;
    }>(updateContentBlockRequirementApiHandler, {
      method: "POST",
      body: {
        blockId: fileBlock.id,
        requirementId: handIn.id,
      } as UpdateContentBlockRequirements,
    });
    expect(updateBlockRequirementResult.success).toBeTruthy();

    const handInBlockWithRequirement =
      await prisma.contentBlock.findUniqueOrThrow({
        where: { id: handIn.id },
        include: { requiredBy: true },
      });

    // handIn (the first block for this layer) is now required by both assessment and fileBlock
    expect(handInBlockWithRequirement.requiredBy.length).toBe(2);
  });

  it("Duplicates the contentBlock", async () => {
    const duplicateContentBlock = await apiTestHandler(
      duplicateContentBlockApiHandler,
      {
        method: "POST",
        body: {
          layerIdToImportFrom: theLayer.id,
          layerIdToImportTo: theLayer.id,
          selectedContentBlockIds: [assessment.id],
          overwriteExistingContent: false,
        } as CopyLayerContentToAnotherLayerArgs,
      },
    );

    expect(duplicateContentBlock.statusCode).toBe(200);

    prismaBlocks = await prisma.contentBlock.findMany({
      where: { layerId: theLayer.id },
    });

    expect(prismaBlocks.length).toBe(4);
  });

  it("DELETE", async () => {
    await apiTestHandler(deleteContentBlockApiHandler, {
      method: "DELETE",
      body: { blockId: assessment.id },
    });

    prismaBlocks = await prisma.contentBlock.findMany({
      where: { layerId: theLayer.id },
    });

    expect(prismaBlocks.length).toBe(3);
  });

  it("GET", async () => {
    /****************** GET ALL CONTENT BLOCKS *****************/

    blocks = await apiTestHandlerWithJson<ContentBlock[]>(
      getContentBlocksApiHandler,
      {
        method: "GET",
        query: {
          layerId: theLayer.id,
        },
      },
    );

    expect(Array.isArray(blocks)).toBeTruthy();
    expect(blocks.length).toBe(3);

    /****************** GET SINGLE CONTENT BLOCK *****************/

    const singleBlock = await apiTestHandlerWithJson<ContentBlock>(
      getContentBlocksApiHandler,
      {
        method: "GET",
        query: {
          layerId: theLayer.id,
          blockId: handIn.id,
        },
      },
    );

    expect(singleBlock.id).toBe(handIn.id);
  });

  it("Reorders the position of contentblocs", async () => {
    /****************** REORDER CONTENT BLOCKS *****************/

    const cbArranged: ReorderContentBlockPositionArgs["contentBlocks"][number][] =
      [
        { id: blocks[0]?.id ?? "", position: 1 }, // array order should not matter, position will come from clientSide
        { id: blocks[2]?.id ?? "", position: 0 },
        { id: blocks[1]?.id ?? "", position: 2 },
      ];

    const reorderResult = await apiTestHandler(
      reorderContentBlockPositionApiHandler,
      {
        method: "POST",
        body: {
          layerId: theLayer.id,
          contentBlocks: cbArranged,
        } as ReorderContentBlockPositionArgs,
      },
    );

    expect(reorderResult.statusCode).toBe(200);

    const getContentBlocks2 = await apiTestHandlerWithJson<ContentBlock[]>(
      getContentBlocksApiHandler,
      {
        method: "GET",
        query: {
          layerId: theLayer.id,
        },
      },
    );

    expect(getContentBlocks2[0]?.id).toBe(blocks[2]?.id);
    expect(getContentBlocks2[0]?.position).toBe(0);
  });
});
