import { SelfieCapture } from "@unissey-web/sdk-react";

import { CaptureLayout } from "../components/CaptureLayout";
import { useIadFlow } from "../hooks/useIadFlow";
import { logEvent } from "../utils/events";
import { saveEvent } from "../services/records";

export function SelfiePage() {
  const iad = useIadFlow();

  return (
    <CaptureLayout iad={iad}>
      {!iad.enabled && (
        <SelfieCapture
          onSelfie={logEvent("selfie")}
          onRecordCompleted={saveEvent("recordCompleted")}
          onRecorderReady={logEvent("recorderReady")}
        />
      )}

      {iad.enabled && iad.config && (
        <SelfieCapture
          recorderOptions={{ config: iad.config }}
          onSelfie={logEvent("selfie")}
          onRecordCompleted={iad.handleRecordCompleted}
          onRecorderReady={logEvent("recorderReady")}
        />
      )}
    </CaptureLayout>
  );
}
