import { FullCapture } from "@unissey-web/sdk-react";

import { CaptureLayout } from "../components/CaptureLayout";
import { useIadFlow } from "../hooks/useIadFlow";
import { logEvent } from "../utils/events";
import { saveEvent } from "../services/records";

export function FullCapturePage() {
  const iad = useIadFlow();

  return (
    <CaptureLayout iad={iad}>
      {!iad.enabled && (
        <FullCapture
          onData={saveEvent("data")}
          onRecorderReady={logEvent("recorderReady")}
        />
      )}

      {iad.enabled && iad.config && (
        <FullCapture
          recorderOptions={{ config: iad.config }}
          onData={iad.handleData}
          onRecorderReady={logEvent("recorderReady")}
        />
      )}
    </CaptureLayout>
  );
}
