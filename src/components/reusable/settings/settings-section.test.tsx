import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import SettingsSection from "./settings-section";

describe("Settings section", () => {
  const mock = jest.fn();

  it("Footer button is disabled", async () => {
    render(
      <SettingsSection footerButtonDisabled footerButtonAction={mock}>
        <div>Hello</div>
      </SettingsSection>,
    );

    await screen.findByText(/hello/i);
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
    expect(mock).not.toHaveBeenCalled();
  });

  it("Footer button action works", async () => {
    const user = userEvent.setup();
    render(
      <SettingsSection footerButtonAction={mock}>
        <div>Hello</div>
      </SettingsSection>,
    );

    const button = await screen.findByRole("button");
    await user.click(button);

    expect(mock).toHaveBeenCalled();
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
    expect(screen.getByText(/hello/i)).toBeEnabled();
  });
});
