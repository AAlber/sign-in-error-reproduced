import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { createMockContentBlock } from "@/__tests__/helpers";
import { server } from "@/__tests__/msw/server";
import useCourse from "../../../zustand";
import DueDate from "./due-date";

describe("BlockDate Component", () => {
  const dummyBlock = createMockContentBlock({ requirements: [] });

  it("adds due date", async () => {
    server.use(
      rest.post(`/api/content-block/update`, (_, rest, ctx) => {
        return rest(ctx.status(200), ctx.json({}));
      }),
    );

    useCourse.setState({ contentBlocks: [dummyBlock], hasSpecialRole: true });
    const user = userEvent.setup();

    render(<DueDate block={dummyBlock} />);
    const addButton = await screen.findByRole("button", { name: /add due/i });

    await user.click(addButton);

    /**
     * calendar should be open at this point, just simulate click on day 20
     * simulate click on the next month button then click on date 20
     */

    const nextMonthButton = await screen.findByRole("button", {
      description(_, element) {
        const nameAttr = element.getAttribute("name");
        return nameAttr === "next-month";
      },
    });

    await user.click(nextMonthButton);

    const date = 20;
    const dayButton = await screen.findByText(date);

    await user.click(dayButton);

    const state = useCourse.getState().contentBlocks[0];
    expect(state?.dueDate?.getDate()).toBe(date);
  });
});
