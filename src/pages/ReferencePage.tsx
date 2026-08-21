import { ReferenceCapture } from "@unissey-web/sdk-react";

import { logEvent } from "../utils/events";
import { saveEvent } from "../services/records";

/**
 * ReferenceCapture is a document/ID photo capture; its public API
 * (recorderOptions only exposes logLevel) has no IAD session config, so there
 * is no "With IAD" toggle here — IAD scans a liveness selfie.
 */
export function ReferencePage() {
  return (
    <ReferenceCapture
      onReference={logEvent("reference")}
      onRecordCompleted={saveEvent("recordCompleted")}
      onRecorderReady={logEvent("recorderReady")}
    />
  );
}
