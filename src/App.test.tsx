import { fireEvent, render, screen } from "@testing-library/react";
import { test } from "vitest";
import App from "./App";

test("renders capture demo navigation", () => {
  render(<App />);
  expect(
    screen.getByRole("button", { name: /^video recorder$/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /iad video recorder/i }),
  ).toBeInTheDocument();
});

// Guards that the SDK mock stays complete: every page must render without a
// missing-export crash when navigated to.
test("navigates to each capture page", () => {
  render(<App />);

  // Video is the default page.
  expect(screen.getByTestId("video-recorder")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /^selfie capture$/i }));
  expect(screen.getByTestId("selfie-capture")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /^reference capture$/i }));
  expect(screen.getByTestId("reference-capture")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /^full capture$/i }));
  expect(screen.getByTestId("full-capture")).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", { name: /iad video recorder/i }),
  );
  expect(
    screen.getByRole("button", { name: /prepare session/i }),
  ).toBeInTheDocument();
});
