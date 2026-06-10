import styles from "./InvalidEntries.module.css";

export default function InvalidEntries({ invalid, duplicates }) {
  const hasInvalid = invalid?.length > 0;
  const hasDuplicates = duplicates?.length > 0;
  if (!hasInvalid && !hasDuplicates) return null;

  return (
    <div className={styles.wrapper}>
      {hasInvalid && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.iconRed}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </div>
            <span className={styles.sectionTitle}>Invalid Entries</span>
            <span className="badge badge-red">{invalid.length}</span>
          </div>
          <div className={styles.chips}>
            {invalid.map((entry, i) => (
              <span key={i} className={styles.chipRed}>
                <code>{entry || '""'}</code>
              </span>
            ))}
          </div>
        </div>
      )}

      {hasDuplicates && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.iconAmber}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/>
              </svg>
            </div>
            <span className={styles.sectionTitle}>Duplicate Edges</span>
            <span className="badge badge-amber">{duplicates.length}</span>
          </div>
          <div className={styles.chips}>
            {duplicates.map((entry, i) => (
              <span key={i} className={styles.chipAmber}>
                <code>{entry}</code>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
