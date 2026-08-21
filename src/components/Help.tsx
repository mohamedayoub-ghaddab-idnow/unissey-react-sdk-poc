import type { ReactNode } from "react";
import styles from "./Help.module.css";

/** Muted helper/status paragraph shared across pages. */
export function Help({ children }: { children: ReactNode }) {
  return <p className={styles.help}>{children}</p>;
}
