import styles from "./ResultPanel.module.css";
import SummaryCards from "./SummaryCards";
import HierarchyCard from "./HierarchyCard";
import InvalidEntries from "./InvalidEntries";

function Section({ title, icon, badge, children }) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleWrap}>
          <span className={styles.sectionIcon}>{icon}</span>
          <h2 className={styles.sectionTitle}>{title}</h2>
        </div>
        {badge}
      </div>
      {children}
    </section>
  );
}

export default function ResultPanel({ data }) {
  const { hierarchies, invalid_entries, duplicate_edges, summary, user_id, email_id, enrollment_number } = data;

  return (
    <div className={styles.panel}>

      {/* Identity Banner */}
      <div className={styles.identityBanner}>
        <div className={styles.identityItem}>
          <span className={styles.identityLabel}>User ID</span>
          <span className={styles.identityValue}>{user_id}</span>
        </div>
        <div className={styles.identityDivider} />
        <div className={styles.identityItem}>
          <span className={styles.identityLabel}>Email</span>
          <span className={styles.identityValue}>{email_id}</span>
        </div>
        <div className={styles.identityDivider} />
        <div className={styles.identityItem}>
          <span className={styles.identityLabel}>Enrollment</span>
          <span className={styles.identityValue}>{enrollment_number}</span>
        </div>
      </div>

      {/* Summary */}
      <Section
        title="Summary"
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
        }
      >
        <SummaryCards summary={summary} />
      </Section>

      <hr className="divider" />

      {/* Hierarchies */}
      <Section
        title="Hierarchies"
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v6M12 8l-4 4M12 8l4 4M8 12v6M16 12v6"/>
          </svg>
        }
        badge={
          <span className="badge badge-indigo">{hierarchies.length} group{hierarchies.length !== 1 ? "s" : ""}</span>
        }
      >
        <div className={styles.hierarchyList}>
          {hierarchies.map((h, i) => (
            <HierarchyCard key={h.root} hierarchy={h} index={i} />
          ))}
        </div>
      </Section>

      {/* Invalid + Duplicates */}
      {((invalid_entries?.length > 0) || (duplicate_edges?.length > 0)) && (
        <>
          <hr className="divider" />
          <Section
            title="Flagged Entries"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            }
            badge={
              <span className="badge badge-red">
                {(invalid_entries?.length || 0) + (duplicate_edges?.length || 0)} flagged
              </span>
            }
          >
            <InvalidEntries invalid={invalid_entries} duplicates={duplicate_edges} />
          </Section>
        </>
      )}
    </div>
  );
}
