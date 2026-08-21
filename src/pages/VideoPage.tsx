import {
  AcquisitionPreset,
  OverlayDisplayMode,
  VideoRecorder,
} from "@unissey-web/sdk-react";

import { CaptureLayout } from "../components/CaptureLayout";
import { useIadFlow } from "../hooks/useIadFlow";
import { logEvent } from "../utils/events";
import { saveEvent } from "../services/records";

export function VideoPage() {
  const iad = useIadFlow();

  return (
    <CaptureLayout iad={iad}>
      {!iad.enabled && (
        <VideoRecorder
          preset={AcquisitionPreset.SELFIE_MJPEG}
          config={{
            overlayConfig: { displayMode: OverlayDisplayMode.OVAL },
          }}
          onRecordCompleted={saveEvent("recordCompleted")}
          onRecorderReady={logEvent("recorderReady")}
        />
      )}

      {iad.enabled && iad.config && (
        <VideoRecorder
          preset={AcquisitionPreset.SELFIE_MJPEG}
          faceChecker="disabled"
          config={{
            recordingConfig: {
              length: {
                type: "duration",
                durationMs: 1000,
              },
            },
            ...iad.config,
          }}
          onRecordCompleted={iad.handleRecordCompleted}
          onRecorderReady={logEvent("recorderReady")}
        />
      )}
    </CaptureLayout>
  );
}
