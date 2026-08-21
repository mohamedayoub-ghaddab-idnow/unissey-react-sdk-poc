import type { Page } from "../config/pages";
import { pages } from "../config/pages";
import styles from "./Nav.module.css";

/** Top navigation bar; one button per capture-flow page. */
export function Nav({
  page,
  onSelect,
}: {
  page: Page;
  onSelect: (page: Page) => void;
}) {
  return (
    <nav className={styles.nav}>
      {pages.map((item) => (
        <button
          key={item.id}
          type="button"
          className={page === item.id ? styles.active : ""}
          onClick={() => onSelect(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
