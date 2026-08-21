import type { IadFlow } from "../hooks/useIadFlow";
import { ErrorMessage } from "./ErrorMessage";
import { Help } from "./Help";
import styles from "./IadControls.module.css";

/** Checkbox + prepare status shared by every "With IAD" capture page. */
export function IadControls({ iad }: { iad: IadFlow }) {
  return (
    <>
      <label className={styles.iadToggle}>
        <input
          type="checkbox"
          checked={iad.enabled}
          onChange={(event) => iad.toggle(event.target.checked)}
        />
        With IAD
      </label>

      {iad.enabled && !iad.config && (
        <>
          <Help>
            IAD runs a Unissey injection-attack-detection scan: the demo calls{" "}
            <code>/prepare</code>, starts the capture with the returned session,
            then calls <code>/analyze</code> on completion and saves the result
            JSON.
          </Help>
          {!iad.loading && (
            <button type="button" onClick={iad.prepare}>
              Retry IAD prepare
            </button>
          )}
        </>
      )}

      {iad.loading && <Help>Preparing IAD session...</Help>}
      {iad.error && <ErrorMessage>{iad.error}</ErrorMessage>}
      {iad.status && <Help>{iad.status}</Help>}
    </>
  );
}
