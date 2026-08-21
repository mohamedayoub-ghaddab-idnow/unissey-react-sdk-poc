import { AcquisitionPreset, VideoRecorder } from "@unissey-web/sdk-react";

import { ErrorMessage } from "../components/ErrorMessage";
import { Help } from "../components/Help";
import { useIadPrepare } from "../hooks/useIadPrepare";
import { logEvent } from "../utils/events";
import { saveEvent } from "../services/records";
import styles from "./IadPage.module.css";

export function IadPage() {
  const iad = useIadPrepare();

  return (
    <div className={styles.iadPage}>
      <div className={styles.iadTabs}>
        <button
          type="button"
          className={iad.mode === "prepare" ? styles.active : ""}
          onClick={() => iad.selectMode("prepare")}
        >
          Prepare session
        </button>
        <button
          type="button"
          className={iad.mode === "manual" ? styles.active : ""}
          onClick={() => iad.selectMode("manual")}
        >
          I already have a token
        </button>
      </div>

      {iad.mode === "prepare" && (
        <>
          <Help>
            IAD requires prepared session data from your backend. Provide your
            IAD prepare endpoint and API key below. This page only calls the
            prepare endpoint; captured media is only logged after you complete
            the capture.
          </Help>
          <label>
            IAD prepare URL
            <input
              type="url"
              value={iad.prepareUrl}
              onChange={(event) => iad.setPrepareUrl(event.target.value)}
              placeholder="https://your-backend.example.com/iad/prepare"
            />
          </label>
          <label>
            API key / Authorization header value
            <input
              type="password"
              value={iad.apiKey}
              onChange={(event) => iad.setApiKey(event.target.value)}
              placeholder="Bearer ... or your API key"
            />
          </label>
          <button type="button" onClick={iad.prepare} disabled={iad.loading}>
            {iad.loading ? "Preparing IAD session..." : "Prepare IAD session"}
          </button>
        </>
      )}

      {iad.mode === "manual" && (
        <>
          <Help>
            Already have IAD prepare data (token) from your backend? Paste it
            below to start the recorder without calling the prepare endpoint.
          </Help>
          <label>
            IAD prepare data (token)
            <textarea
              value={iad.data}
              onChange={(event) => iad.setData(event.target.value)}
              placeholder="Paste your IAD prepare data / token here"
              rows={4}
            />
          </label>
          <button type="button" onClick={iad.applyData}>
            Use token
          </button>
        </>
      )}

      {iad.error && <ErrorMessage>{iad.error}</ErrorMessage>}
      {iad.config && (
        <VideoRecorder
          preset={AcquisitionPreset.SELFIE_MJPEG}
          config={iad.config}
          onRecordCompleted={saveEvent("recordCompleted")}
          onRecorderReady={logEvent("recorderReady")}
        />
      )}
    </div>
  );
}
