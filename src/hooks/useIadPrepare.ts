import { useState } from "react";
import type { SessionConfig } from "@unissey-web/sdk-react";

import { performIadPrepare } from "../services/iad";

export type IadMode = "prepare" | "manual";

/**
 * State machine for the standalone IAD video-recorder page. Supports two ways
 * of obtaining the IAD `SessionConfig`:
 *   - "prepare": call a backend prepare endpoint (URL + API key) for the token.
 *   - "manual":  paste an already-issued prepare token directly.
 * Either way the resulting `iadConfig` starts the recorder.
 */
export function useIadPrepare() {
  const [mode, setMode] = useState<IadMode>("prepare");
  const [prepareUrl, setPrepareUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [data, setData] = useState("");
  const [config, setConfig] = useState<SessionConfig>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const prepare = async () => {
    setLoading(true);
    setError(undefined);
    setConfig(undefined);

    try {
      if (!prepareUrl) {
        throw new Error("Provide the IAD prepare URL.");
      }

      const prepared = await performIadPrepare(prepareUrl, apiKey);
      setConfig({ iadConfig: { data: prepared } });
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  const applyData = () => {
    setError(undefined);
    setConfig(undefined);

    const token = data.trim();
    if (!token) {
      setError("Paste your IAD prepare data (token).");
      return;
    }

    setConfig({ iadConfig: { data: token } });
  };

  const selectMode = (next: IadMode) => {
    setMode(next);
    setError(undefined);
    setConfig(undefined);
  };

  return {
    mode,
    prepareUrl,
    setPrepareUrl,
    apiKey,
    setApiKey,
    data,
    setData,
    config,
    error,
    loading,
    prepare,
    applyData,
    selectMode,
  };
}
