import { blobToDataUrl } from "../utils/blob";
import { logEvent } from "../utils/events";

/**
 * Persist a capture payload to unissey_records/video_records as a single
 * self-contained JSON file of shape { media, metadata } — `media` is a
 * data URL that reconstructs to the original Blob:
 *   const media = await (await fetch(record.media)).blob();
 *   await analyze(apiKey, media, record.metadata);
 */
export async function saveRecord(detail: {
  media?: Blob;
  metadata?: unknown;
}): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const media = detail?.media ? await blobToDataUrl(detail.media) : undefined;

  const response = await fetch("/api/save-record", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      timestamp,
      record: { media, metadata: detail?.metadata },
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.ok) {
    throw new Error(result.error || `save-record failed: ${response.status}`);
  }
  console.log("saved record", result.file);
}

/**
 * Build an SDK event listener that logs the payload (via {@link logEvent}) and
 * persists it with {@link saveRecord}. Used by capture pages when IAD is off.
 */
export function saveEvent(name: string) {
  const log = logEvent(name);
  return (event: Event) => {
    log(event);
    const detail = (event as CustomEvent).detail;
    console.log(detail);
  };
}
