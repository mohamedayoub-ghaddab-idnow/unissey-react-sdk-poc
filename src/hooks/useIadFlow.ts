import { useState } from "react";
import type { SessionConfig } from "@unissey-web/sdk-react";

import type { UnisseyAnalyzeResponse } from "../services/iad";
import { analyzeIad, prepareIad } from "../services/iad";

/**
 * Shared "With IAD" flow for the capture pages. Toggling it on calls /prepare,
 * builds the SessionConfig used to start the capture, and exposes analyze
 * handlers that call /analyze on completion and save the result JSON.
 */
export function useIadFlow() {
  const [enabled, setEnabled] = useState(false);
  const [config, setConfig] = useState<SessionConfig>();
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UnisseyAnalyzeResponse>();

  const clearResult = () => setResult(undefined);

  // 1. Call /prepare, get the token, then start the capture with the IAD config.
  const prepare = async () => {
    setLoading(true);
    setError(undefined);
    setStatus(undefined);
    setConfig(undefined);

    try {
      const data = await prepareIad();
      setConfig({ iadConfig: { data } });
      setStatus("IAD session ready. Complete a capture to analyze.");
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  const toggle = (on: boolean) => {
    setEnabled(on);
    setError(undefined);
    setStatus(undefined);
    setConfig(undefined);
    setResult(undefined);

    // Enabling "With IAD" kicks off the prepare call right away.
    if (on) {
      void prepare();
    }
  };

  // 2. On completion, call /analyze with the captured media + metadata and
  //    persist the analyze result instead of dumping a local record.
  const analyze = (media: Blob | undefined, metadata: unknown) => {
    void (async () => {
      try {
        if (!media) {
          throw new Error("Capture completed without media.");
        }
        setError(undefined);
        setResult(undefined);
        setStatus("Analyzing capture with IAD...");

        const serialized =
          typeof metadata === "string"
            ? metadata
            : JSON.stringify(metadata ?? {});
        // On 200 OK, surface the full response in a modal (no local file save).
        const analyzed = await analyzeIad(media, serialized);
        //await getLogs(analyzed.data.session_id);
        setResult(analyzed);
        setStatus("Analysis complete.");
      } catch (error) {
        setStatus(undefined);
        setResult(undefined);
        setError(error instanceof Error ? error.message : String(error));
      }
    })();
  };

  // recordCompleted payload ({ media, metadata }) — video, selfie, reference.
  const handleRecordCompleted = (event: Event) => {
    const detail = (event as CustomEvent).detail as {
      media?: Blob;
      metadata?: unknown;
    };
    console.log("recordCompleted", detail);
    analyze(detail?.media, detail?.metadata);
  };

  // FullCapture data payload ({ selfie, reference, metadata }) — the selfie is
  // the media that gets scanned for liveness/injection.
  const handleData = (event: Event) => {
    const detail = (event as CustomEvent).detail as {
      selfie?: Blob;
      reference?: Blob;
      metadata?: unknown;
    };
    console.log("data", detail);
    console.log("data selfie", detail?.selfie);
    analyze(detail?.selfie, detail?.metadata);
  };

  return {
    enabled,
    config,
    error,
    status,
    loading,
    result,
    clearResult,
    prepare,
    toggle,
    handleRecordCompleted,
    handleData,
  };
}

export type IadFlow = ReturnType<typeof useIadFlow>;
