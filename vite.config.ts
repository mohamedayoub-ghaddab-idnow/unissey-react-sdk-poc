import { fileURLToPath, URL } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vitest/config';
import type { ViteDevServer } from 'vite';

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    req.on('error', reject);
  });
}

/**
 * Dev-only endpoint that persists a Unissey SDK capture payload as a single
 * self-contained JSON file in `unissey_records/video_records/`.
 *
 * The written file is exactly the `{ media, metadata }` object the SDK logs,
 * with `media` serialized as a data URL. A backend consumer rebuilds the
 * original Blob and calls /analyze with one line:
 *   const media = await (await fetch(record.media)).blob();
 */
function saveJsonEndpoint(
  server: ViteDevServer,
  route: string,
  outDir: string,
  bodyKey: string,
  label: string,
) {
  server.middlewares.use(route, (req: IncomingMessage, res: ServerResponse) => {
    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.end('Method Not Allowed');
      return;
    }

    void (async () => {
      try {
        const body = JSON.parse(await readBody(req));
        const { timestamp } = body;
        const payload = body[bodyKey];
        const base = String(timestamp || bodyKey).replace(/[^a-z0-9-]+/gi, '-');
        const fileName = `${base}.json`;

        await mkdir(outDir, { recursive: true });
        await writeFile(path.join(outDir, fileName), JSON.stringify(payload, null, 2));

        server.config.logger.info(`[${label}] wrote ${fileName}`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: true, file: fileName }));
      } catch (error) {
        server.config.logger.error(`[${label}] failed: ${String(error)}`);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, error: String(error) }));
      }
    })();
  });
}

/**
 * Dev-only endpoint that persists Unissey SDK capture payloads as JSON files
 * under `unissey_records/`:
 *   - POST /api/save-record  -> video_records/  (the SDK `{ media, metadata }`)
 *
 * IAD `/analyze` responses are no longer saved to disk — they are shown in a
 * modal (with a JSON download) in the app instead.
 */
function saveRecordsPlugin(): Plugin {
  const recordsDir = fileURLToPath(new URL('./unissey_records/video_records', import.meta.url));

  return {
    name: 'unissey-save-records',
    configureServer(server) {
      saveJsonEndpoint(server, '/api/save-record', recordsDir, 'record', 'save-record');
    },
  };
}

export default defineConfig({
  plugins: [react(), saveRecordsPlugin()],
  server: {
    // POC-only: proxy the browser's IAD calls to the Unissey dev host so we
    // dodge CORS + the dev host's self-signed TLS cert. The app calls
    // `/unissey-api/...` and Vite forwards to `${target}/...`.
    proxy: {
      '/unissey-api': {
        target: 'https://unissey-api-analyze.idcheck-dev02-0.axt',
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/unissey-api/, ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    globals: true,
    alias: {
      '@unissey-web/sdk-react': fileURLToPath(new URL('./src/test/sdkReactMock.tsx', import.meta.url)),
    },
  },
});
