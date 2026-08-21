import type { ReactNode } from "react";
import styles from "./ErrorMessage.module.css";

/** Red error paragraph shared across pages. */
export function ErrorMessage({ children }: { children: ReactNode }) {
  return <p className={styles.error}>{children}</p>;
}
