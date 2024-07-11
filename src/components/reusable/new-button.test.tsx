import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Button from "./new-button";

describe("New Button", () => {
  const user = userEvent.setup();
  const fn = jest.fn();

  it("Is Disabled", async () => {
    render(<Button title="Hello" enabled={false} onClick={fn} />);
    const button = screen.getByRole("button", { name: /hello/i });

    await user.click(button);
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(fn).not.toHaveBeenCalled();
  });

  it("Is Loading", async () => {
    render(<Button title="Hello" enabled loading onClick={fn} />);
    const button = screen.getByRole("button");

    await user.click(button);
    expect(button).toBeInTheDocument();
    expect(screen.queryByText(/hello/i)).not.toBeInTheDocument();
    expect(fn).not.toHaveBeenCalled();
  });

  it("Is clickable", async () => {
    render(<Button title="Hello" onClick={fn} />);
    const button = screen.getByRole("button");

    await user.click(button);
    expect(button).toBeInTheDocument();
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
    expect(fn).toHaveBeenCalled();
  });
});
