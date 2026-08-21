import type { ReactNode } from "react";
import type { IadFlow } from "../hooks/useIadFlow";
import { IadControls } from "./IadControls";
import { ResultModal } from "./ResultModal";
import styles from "./CaptureLayout.module.css";

/**
 * Shared shell for the capture pages: the `.capturePage` grid + the "With IAD"
 * controls, with the page's recorder rendered as `children`.
 */
export function CaptureLayout({
  iad,
  children,
}: {
  iad: IadFlow;
  children: ReactNode;
}) {
  return (
    <div className={styles.capturePage}>
      <IadControls iad={iad} />
      {children}
      <ResultModal result={iad.result} onClose={iad.clearResult} />
    </div>
  );
}
