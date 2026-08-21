import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import type { UnisseyAnalyzeResponse } from "../services/iad";
import { ResultModal } from "./ResultModal";

const sampleResult: UnisseyAnalyzeResponse = {
  status: 200,
  message: "ok",
  data: {
    session_id: "session-123",
    session_group_id: "group-456",
    retries_remaining: 2,
    details: {
      liveness: { result: "genuine" },
      injection: { selfie: { trust_score: 0.99 } },
    },
  },
};

test("renders nothing without a result", () => {
  const { container } = render(
    <ResultModal result={undefined} onClose={() => {}} />,
  );
  expect(container).toBeEmptyDOMElement();
});

test("shows the response and session id, and Close calls onClose", () => {
  const onClose = vi.fn();
  render(<ResultModal result={sampleResult} onClose={onClose} />);

  expect(screen.getByRole("dialog")).toBeInTheDocument();
  // Appears in the header and inside the rendered JSON body.
  expect(screen.getAllByText(/session-123/).length).toBeGreaterThan(0);
  expect(screen.getByRole("button", { name: /download json/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /^close$/i }));
  expect(onClose).toHaveBeenCalledTimes(1);
});
