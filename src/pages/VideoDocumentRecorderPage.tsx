import {
  AcquisitionPreset,
  OverlayDisplayMode,
  VideoRecorder,
} from "@unissey-web/sdk-react";

import { CaptureLayout } from "../components/CaptureLayout";
import { useIadFlow } from "../hooks/useIadFlow";
import { logEvent } from "../utils/events";
import { saveEvent } from "../services/records";

export function VideoDocumentRecorder() {
  const iad = useIadFlow();

  return (
    <CaptureLayout iad={iad}>
      {!iad.enabled && (
        <VideoRecorder
          preset={AcquisitionPreset.DOC_VIDEO}
          config={{
            overlayConfig: { displayMode: OverlayDisplayMode.ID_DOCUMENT },
          }}
          onRecordCompleted={saveEvent("recordCompleted")}
          onRecorderReady={logEvent("recorderReady")}
        />
      )}

      {iad.enabled && iad.config && (
        <VideoRecorder
          preset={AcquisitionPreset.NO_RECORD}
          faceChecker="disabled"
          config={{
            recordingConfig: {
              length: {
                type: "duration",
                durationMs: 1000,
              },
              faceCheckerConfig: {
                check: "disabled",
              },
            },
            overlayConfig: { displayMode: OverlayDisplayMode.ID_DOCUMENT },
            ...iad.config,
          }}
          onRecordCompleted={iad.handleRecordCompleted}
          onRecorderReady={logEvent("recorderReady")}
        />
      )}
    </CaptureLayout>
  );
}
