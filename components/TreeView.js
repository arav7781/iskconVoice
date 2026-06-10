"use client";
import { useState } from "react";
import styles from "./TreeView.module.css";

function TreeNode({ nodeKey, subtree, depth = 0 }) {
  const [open, setOpen] = useState(true);
  const children = Object.keys(subtree);
  const isLeaf = children.length === 0;

  const colors = [
    "#6366f1", "#8b5cf6", "#06b6d4", "#10b981",
    "#f59e0b", "#ec4899", "#14b8a6", "#a855f7",
  ];
  const color = colors[depth % colors.length];

  return (
    <div
      className={styles.nodeWrap}
      style={{ animationDelay: `${depth * 60}ms` }}
    >
      <div
        className={`${styles.node} ${isLeaf ? styles.leaf : ""}`}
        onClick={() => !isLeaf && setOpen((o) => !o)}
        style={{ "--node-color": color }}
      >
        {/* Connector line */}
        {depth > 0 && <div className={styles.connector} />}

        {/* Toggle icon */}
        {!isLeaf ? (
          <span className={`${styles.toggle} ${open ? styles.open : ""}`}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path d="M2 3l3 4 3-4H2z" />
            </svg>
          </span>
        ) : (
          <span className={styles.dot} />
        )}

        {/* Node label */}
        <span className={styles.label}>{nodeKey}</span>

        {/* Badge */}
        {!isLeaf && (
          <span className={styles.childCount}>
            {children.length} {children.length === 1 ? "child" : "children"}
          </span>
        )}
        {isLeaf && <span className={styles.leafBadge}>leaf</span>}
      </div>

      {/* Children */}
      {!isLeaf && open && (
        <div className={styles.children}>
          {children.map((k) => (
            <TreeNode key={k} nodeKey={k} subtree={subtree[k]} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TreeView({ tree, root }) {
  const rootSubtree = tree[root] ?? {};
  return (
    <div className={styles.container}>
      <TreeNode nodeKey={root} subtree={rootSubtree} depth={0} />
    </div>
  );
}
