import { useEffect } from "react";
import JsonFormatter from "react-json-formatter";

import type { UnisseyAnalyzeResponse } from "../services/iad";
import { downloadJson } from "../utils/download";
import styles from "./ResultModal.module.css";

/**
 * Modal showing the full Unissey `/analyze` JSON response, with a button to
 * download it as `<session_id>.json`. Renders nothing when there is no result.
 */
export function ResultModal({
  result,
  onClose,
}: {
  result: UnisseyAnalyzeResponse | undefined;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!result) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [result, onClose]);

  if (!result) return null;

  const sessionId = result.data?.session_id;
  const filename = `${sessionId || "analyze-result"}.json`;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label="IAD analyze result"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <h2>Analyze result</h2>
          {sessionId && (
            <span className={styles.sessionId}>session {sessionId}</span>
          )}
        </div>

        <div className={styles.body}>
          <JsonFormatter json={JSON.stringify(result, null, 2)} />
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.download}
            onClick={() => downloadJson(filename, result)}
          >
            Download JSON
          </button>
          <button type="button" className={styles.close} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
