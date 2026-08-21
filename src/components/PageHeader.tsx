import { Help } from "./Help";

/** Shared page title + the generic "logs to console" help blurb. */
export function PageHeader({ title }: { title: string }) {
  return (
    <>
      <h1>{title}</h1>
      <Help>
        This demo logs SDK event payloads to the browser console after you
        complete a capture. Start and finish a capture before checking the logs.
      </Help>
    </>
  );
}
