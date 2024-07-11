import { arrayMove } from "@dnd-kit/sortable";
import { act, render, screen, within } from "@testing-library/react";
import { rest } from "msw";
import { IntercomProvider } from "react-use-intercom";
import {
  createMockContentBlock,
  createUserWithRoleInstitutionAndLayersData,
} from "@/__tests__/helpers";
import type { MockLayer } from "@/__tests__/helpers/types";
import { server } from "@/__tests__/msw/server";
import DndTable from "@/src/components/course/content-blocks/table/dnd-table";
import useCourse from "@/src/components/course/zustand";
import type { ContentBlock } from "@/src/types/course.types";

describe("Administration DND Table", () => {
  let layers: MockLayer[],
    theLayer: MockLayer,
    mockHandInBlock: ContentBlock<"HandIn">,
    mockAssessmentBlock: ContentBlock<"Assessment">,
    mockAssessmentBlock2: ContentBlock<"Assessment">,
    contentBlocks: ContentBlock[];

  beforeAll(async () => {
    /***************************** INITIALIZE TEST VARIABLES ******************************/

    const mockData = await createUserWithRoleInstitutionAndLayersData({
      saveMockToPrismaDb: false,
    });

    // adminUser = mockData.user;
    layers = mockData.layers;
    theLayer = layers[0]!;

    mockHandInBlock = createMockContentBlock<"HandIn">({
      type: "HandIn",
      specs: {
        allowedFileTypes: "",
        isGroupSubmission: false,
        isSharedSubmission: false,
      },
      layerId: theLayer.id,
      position: 0,
      requirements: [],
    });

    mockAssessmentBlock = createMockContentBlock<"Assessment">({
      type: "Assessment",
      specs: { content: "{}" },
      layerId: theLayer.id,
      position: 1,
      requirements: [],
    });

    mockAssessmentBlock2 = createMockContentBlock<"Assessment">({
      type: "Assessment",
      specs: { content: "{}" },
      layerId: theLayer.id,
      position: 2,
      requirements: [],
    });

    contentBlocks = [
      mockHandInBlock,
      mockAssessmentBlock,
      mockAssessmentBlock2,
    ];

    useCourse.setState({
      contentBlocks,
    });
  });

  it("Updates the order of contentblocks when state has changed", async () => {
    server.use(
      rest.post("/api/content-block/reorder", (_, res, ctx) => {
        return res.once(ctx.json<ContentBlock[]>([]));
      }),
    );

    render(
      <IntercomProvider appId="">
        <DndTable loading={false} />
      </IntercomProvider>,
    );

    const tBody = await screen.findByTestId("blocks-table-body");
    let tRows = await within(tBody).findAllByRole("row");

    // 3 contentBlocks
    expect(tRows.length).toBe(3);

    // first contentBlock is of handIn type
    await within(tRows[0]!).findByText(mockHandInBlock.name);

    await act(
      () =>
        new Promise<void>((resolve) => {
          /**
           * simulating drag and drop of the table using RTL test is impractical
           * as the library very heavily relies on window.getBoundingClientRect - but jest
           * tests runs in a non-DOM environment https://github.com/clauderic/dnd-kit/issues/261#issuecomment-844651307,
           * therefore to test, we just manually update the state instead, and assert that the table
           * reflects the correct position of contentblocks (no API calls will happen since we cannot fire onDragEnd listener)
           */
          const { contentBlocks, setContentBlocks } = useCourse.getState();
          const newPosition = arrayMove(contentBlocks, 1, 0); // we use same util used within onDragEnd listener
          setContentBlocks(newPosition);
          resolve();
        }),
    );

    tRows = await within(tBody).findAllByRole("row");
    // assert that the Table first contentBlock row is now the assessment block
    await within(tRows[0]!).findByText(mockAssessmentBlock.name);

    // just assert that zustand state is correctly updated
    const { contentBlocks } = useCourse.getState();
    expect(contentBlocks[0]?.id).toBe(mockAssessmentBlock.id);
  });
});
