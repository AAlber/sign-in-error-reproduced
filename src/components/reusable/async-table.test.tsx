import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import AsyncTable from "./async-table";

const columns = [
  {
    id: "name",
    accessorKey: "name",
    header: "header",
    cell: () => null,
  },
  {
    id: "menu",
    cell: () => null,
  },
];

describe("Async-table", () => {
  it("Renders", async () => {
    const { asFragment } = render(
      <AsyncTable columns={columns} promise={() => Promise.resolve([])} />,
    );
    const loading = screen.getByText(/loading.../i);
    await waitForElementToBeRemoved(loading);
    await screen.findByRole("table");
    // expect(asFragment()).toMatchSnapshot();
  });
});
