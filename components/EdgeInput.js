"use client";
import { useState, useRef, useCallback } from "react";
import styles from "./EdgeInput.module.css";

const EXAMPLE_EDGES = [
  "A->B", "A->C", "B->D", "C->E", "E->F",
  "X->Y", "Y->Z", "Z->X",
  "P->Q", "Q->R",
  "G->H", "G->H", "G->I",
  "hello", "1->2", "A->",
];

export default function EdgeInput({ onSubmit, loading }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const textareaRef = useRef(null);

  const parseEdges = (raw) => {
    const trimmed = raw.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((s) => String(s).trim()).filter(Boolean);
        }
        if (parsed && typeof parsed === "object" && Array.isArray(parsed.edges)) {
          return parsed.edges.map((s) => String(s).trim()).filter(Boolean);
        }
      } catch (_) {
        // Fallback: extract double-quoted items if parsing fails
        const matches = [...trimmed.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
        if (matches.length > 0) {
          if (matches[0] === "edges") {
            return matches.slice(1).map((s) => s.trim()).filter(Boolean);
          }
          return matches.map((s) => s.trim()).filter(Boolean);
        }
      }
    }
    return raw
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const handleSubmit = () => {
    const edges = parseEdges(text);
    if (edges.length === 0) {
      setError("Please enter at least one edge.");
      return;
    }
    setError("");
    onSubmit(edges);
  };

  const handleExample = () => {
    setText(EXAMPLE_EDGES.join("\n"));
    setError("");
    textareaRef.current?.focus();
  };

  const handleClear = () => {
    setText("");
    setError("");
    textareaRef.current?.focus();
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.getData("text/plain");
    if (dropped) setText((prev) => (prev ? prev + "\n" + dropped : dropped));
  }, []);

  const edgeCount = parseEdges(text).length;

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconWrap}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
          <div>
            <h2 className={styles.title}>Edge Input</h2>
            <p className={styles.subtitle}>Enter edges as <code>X-&gt;Y</code>, one per line or comma-separated</p>
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.btnSecondary} onClick={handleExample} title="Load example">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5,3 19,12 5,21 5,3"/>
            </svg>
            Example
          </button>
          {text && (
            <button className={styles.btnGhost} onClick={handleClear} title="Clear">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div
        className={`${styles.textareaWrap} ${dragOver ? styles.dragOver : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={text}
          onChange={(e) => { setText(e.target.value); setError(""); }}
          placeholder={"A->B\nA->C\nB->D\nC->E\n..."}
          rows={10}
          spellCheck={false}
          id="edge-input"
        />
        {text && (
          <div className={styles.counter}>
            <span className={styles.counterBadge}>{edgeCount} edge{edgeCount !== 1 ? "s" : ""}</span>
          </div>
        )}
        {dragOver && (
          <div className={styles.dropOverlay}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Drop to add edges
          </div>
        )}
      </div>

      {/* Format hints */}
      <div className={styles.hints}>
        <span className={styles.hint}><span className={styles.hintValid}>✓ A-&gt;B</span> valid</span>
        <span className={styles.hint}><span className={styles.hintInvalid}>✗ hello</span> invalid</span>
        <span className={styles.hint}><span className={styles.hintInvalid}>✗ A-&gt;A</span> self-loop</span>
        <span className={styles.hint}><span className={styles.hintInvalid}>✗ AB-&gt;C</span> multi-char</span>
      </div>

      {/* Error */}
      {error && (
        <div className={styles.errorMsg}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        className={styles.submitBtn}
        onClick={handleSubmit}
        disabled={loading || !text.trim()}
        id="submit-btn"
      >
        {loading ? (
          <>
            <span className={styles.spinner} />
            Processing...
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            Analyze Graph
          </>
        )}
      </button>
    </div>
  );
}
