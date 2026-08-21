/**
 * Unissey IAD (injection-attack-detection) API client, mirroring
 * io.idnow.docidv.web `unisseyIad.client.ts`.
 *
 * The Unissey dev host is reached through the Vite proxy (`/unissey-api`, see
 * vite.config.ts) to avoid browser CORS + self-signed TLS issues. The dev host
 * is VPN-protected, so no Authorization header is needed.
 */
const UNISSEY_API_BASE = "/unissey-api";

/** Shape of the live dev /analyze response (see unisseyIad.client.ts). */
export type UnisseyAnalyzeResponse = {
  status: number;
  message: string;
  data: {
    session_id: string;
    session_group_id: string;
    retries_remaining: number;
    details: {
      liveness: { result: string };
      injection: { selfie: { trust_score: number } };
    };
  };
};

// Header params per https://doc.unissey.com/api/on-prem-r6
export async function prepareIad(): Promise<string> {
  const response = await fetch(`${UNISSEY_API_BASE}/api/v3/iad/prepare`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "iad-policy": "high",
    },
  });

  if (!response.ok) {
    throw new Error(
      `IAD prepare failed: ${response.status} ${response.statusText}`,
    );
  }

  // The prepare payload (token/session data) is passed verbatim to iadConfig.data.
  return response.text();
}

export async function analyzeIad(
  media: Blob,
  metadata: string,
): Promise<UnisseyAnalyzeResponse> {
  const formData = new FormData();
  formData.append("selfie", media);
  formData.append("processings", "liveness");
  formData.append("metadata", metadata);

  const response = await fetch(`${UNISSEY_API_BASE}/api/v3/analyze`, {
    method: "POST",
    headers: {
      "pad-policy": "dynamic",
      "quality-policy": "info",
      "dev-mode": "false",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `IAD analyze failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

// TODO: dead code — the only call site (in useIadFlow) is commented out. Wire it
// up or delete it. The error message is also a copy-paste from analyzeIad.
export async function getLogs(sessionId: string): Promise<any> {
  const response = await fetch(
    `${UNISSEY_API_BASE}/logs/v1/session/${sessionId}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error(
      `IAD analyze failed: ${response.status} ${response.statusText}`,
    );
  }
  const data = await response.json();
  console.log("getLogs", data);
  return data;
}

/**
 * IAD requires prepare data created by your backend before the recorder starts.
 * The IAD demo page makes this call explicit: provide your prepare URL and API
 * key in the form. It does not upload captured media.
 */
export async function performIadPrepare(
  url: string,
  apiKey: string,
): Promise<string> {
  const response = await fetch(url, {
    method: "POST",
    headers: apiKey ? { Authorization: apiKey } : undefined,
  });

  if (!response.ok) {
    throw new Error(
      `IAD prepare failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}
