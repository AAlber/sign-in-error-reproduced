import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { server } from "@/__tests__/msw/server";
import api from "@/src/pages/api/api";
import useUser from "@/src/zustand/user";
import NameLogoSettings from "./index";

describe("asdf", () => {
  it("Renders and updates local user institution theme state correctly", async () => {
    server.use(
      rest.put(api.updateInstitutionTheme, (_, res, ctx) => {
        return res(ctx.json({}));
      }),
    );

    const user = userEvent.setup();
    render(<NameLogoSettings />);

    // test selecting a color theme

    let colorSelector = await screen.findByRole("button", {
      name: /current color/i,
    });

    await user.click(colorSelector);
    let saveButton = await screen.findByRole("button", { name: /save/i });
    expect(saveButton).toBeDisabled();

    const colorButton = await screen.findByRole("button", { name: /ghost/i });
    await user.click(colorButton);

    saveButton = await screen.findByRole("button", { name: /save/i });
    expect(saveButton).toBeEnabled();

    await user.click(saveButton);
    const { user: testUser } = useUser.getState();

    expect(testUser.institution?.theme).toBe("gray");

    // test custom theme and color picker

    colorSelector = await screen.findByRole("button", {
      name: /current color/i,
    });
    await user.click(colorSelector);

    const customThemeButton = await screen.findByRole("button", {
      name: /custom theme/i,
    });

    await user.click(customThemeButton);
    const colorCodeTrigger = await screen.findByRole("button", {
      name: /color code/i,
    });

    await user.click(colorCodeTrigger);

    const colorInputTextBox = await screen.findByTestId("colorpicker-input");
    await user.clear(colorInputTextBox);
    await user.type(colorInputTextBox, "#aaaaaa");
    await waitFor(() => expect(colorInputTextBox).toHaveValue("#aaaaaa"));

    saveButton = await screen.findByRole("button", { name: /save/i });
    expect(saveButton).toBeEnabled();
    await user.click(saveButton);

    const u = useUser.getState();
    expect(u.user.institution).toMatchObject({
      theme: "custom",
      customThemeHEX: "#aaaaaa",
    });
  });
});
