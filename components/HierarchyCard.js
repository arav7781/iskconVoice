"use client";
import { useState } from "react";
import TreeView from "./TreeView";
import styles from "./HierarchyCard.module.css";

export default function HierarchyCard({ hierarchy, index }) {
  const [expanded, setExpanded] = useState(true);
  const { root, tree, depth, has_cycle } = hierarchy;

  return (
    <div
      className={`${styles.card} ${has_cycle ? styles.cycle : styles.tree}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Card Header */}
      <div className={styles.header} onClick={() => setExpanded((e) => !e)}>
        <div className={styles.headerLeft}>
          {has_cycle ? (
            <div className={styles.iconCycle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M23 4v6h-6M1 20v-6h6"/>
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
              </svg>
            </div>
          ) : (
            <div className={styles.iconTree}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v6M12 8l-4 4M12 8l4 4M8 12v6M16 12v6"/>
              </svg>
            </div>
          )}

          <div>
            <div className={styles.rootLabel}>
              Root: <span className={styles.rootNode}>{root}</span>
            </div>
            <div className={styles.meta}>
              {has_cycle ? (
                <span className="badge badge-red">⚠ Cycle Detected</span>
              ) : (
                <>
                  <span className="badge badge-green">✓ Valid Tree</span>
                  <span className={styles.depthInfo}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="2" x2="12" y2="22"/><polyline points="17,7 12,2 7,7"/>
                    </svg>
                    Depth {depth}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          className={`${styles.chevron} ${expanded ? styles.chevronOpen : ""}`}
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </button>
      </div>

      {/* Card Body */}
      {expanded && (
        <div className={styles.body}>
          <div className={styles.divider} />
          {has_cycle ? (
            <div className={styles.cycleMessage}>
              <div className={styles.cycleIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M23 4v6h-6M1 20v-6h6"/>
                  <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                </svg>
              </div>
              <p>A <strong>cycle</strong> was detected in this group.</p>
              <p className={styles.cycleSubtext}>All nodes in this group form a circular dependency — no tree structure can be built.</p>
            </div>
          ) : (
            <div className={styles.treeWrap}>
              <TreeView tree={tree} root={root} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
