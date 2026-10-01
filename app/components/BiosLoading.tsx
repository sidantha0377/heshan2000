import styles from "./BiosLoading.module.css";

export function BiosLoading() {
  return (
    <div className={styles.bios}>
      <p>
        S3 Savage4 Pro (377) Video BIOS. Version 1.1b.02a.
        <br />
        Copyright 2000 S3 Incorporated.
        <br />
        <span className={styles.cursor}>_</span>
      </p>
    </div>
  );
}