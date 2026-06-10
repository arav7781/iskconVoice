import styles from "./SummaryCards.module.css";

const METRICS = [
  {
    key: "total_trees",
    label: "Valid Trees",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v6M12 8l-4 4M12 8l4 4M8 12v6M16 12v6"/>
      </svg>
    ),
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.25)",
  },
  {
    key: "total_cycles",
    label: "Cyclic Groups",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M23 4v6h-6M1 20v-6h6"/>
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
      </svg>
    ),
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.25)",
  },
  {
    key: "largest_tree_root",
    label: "Largest Tree Root",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>
    ),
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
    isString: true,
  },
];

export default function SummaryCards({ summary }) {
  return (
    <div className={styles.grid}>
      {METRICS.map(({ key, label, icon, color, bg, border, isString }, i) => (
        <div
          key={key}
          className={styles.card}
          style={{
            "--card-color": color,
            "--card-bg": bg,
            "--card-border": border,
            animationDelay: `${i * 100}ms`,
          }}
        >
          <div className={styles.iconWrap}>{icon}</div>
          <div className={styles.value}>
            {isString ? (
              <span className={styles.valueStr}>{summary[key] || "—"}</span>
            ) : (
              <span className={styles.valueNum}>{summary[key]}</span>
            )}
          </div>
          <div className={styles.label}>{label}</div>
          <div className={styles.glow} />
        </div>
      ))}
    </div>
  );
}
