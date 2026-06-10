"use client";
import { useState } from "react";
import EdgeInput from "../components/EdgeInput";
import ResultPanel from "../components/ResultPanel";
import { processGraph } from "../lib/api";
import styles from "./page.module.css";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (edges) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await processGraph(edges);
      setResult(data);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* ── Header ───────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>
                <path d="M12 7v4M5 17l5-6M19 17l-5-6"/>
              </svg>
            </div>
            <div>
              <div className={styles.logoTitle}>Graph Hierarchy Explorer</div>
              <div className={styles.logoSub}>SIT Full Stack Challenge</div>
            </div>
          </div>
          <div className={styles.headerBadges}>
            <span className="badge badge-indigo">
              <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="3"/></svg>
              API Live
            </span>
            <span className="badge badge-cyan">REST · JSON</span>
          </div>
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────── */}
      <main className={styles.main}>
        <div className={styles.container}>

          {/* Hero */}
          {!result && !loading && !error && (
            <div className={styles.hero}>
              <div className={styles.heroContent}>
                <span className="badge badge-indigo" style={{ marginBottom: 16 }}>
                  Graph Analysis Engine
                </span>
                <h1 className={styles.heroTitle}>
                  Visualize Node{" "}
                  <span className="gradient-text">Hierarchies</span>
                </h1>
                <p className={styles.heroDesc}>
                  Enter directed edges (<code>A-&gt;B</code>) to detect trees, cycles, and
                  structural relationships. Built for the SIT Engineering Challenge.
                </p>
                <div className={styles.features}>
                  {[
                    { icon: "🌳", text: "Multi-tree detection" },
                    { icon: "🔄", text: "Cycle identification" },
                    { icon: "📊", text: "Depth analysis" },
                    { icon: "🔗", text: "Duplicate filtering" },
                  ].map((f) => (
                    <div key={f.text} className={styles.featureChip}>
                      <span>{f.icon}</span>
                      <span>{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Two-column layout when result exists */}
          <div className={`${styles.layout} ${result ? styles.layoutSplit : ""}`}>
            {/* Input panel */}
            <div className={`${styles.inputPanel} glass`}>
              <EdgeInput onSubmit={handleSubmit} loading={loading} />
            </div>

            {/* Result / Error */}
            {(result || error || loading) && (
              <div className={styles.resultPane}>
                {/* Loading skeleton */}
                {loading && (
                  <div className={styles.loadingWrap}>
                    <div className={styles.loadingSpinner} />
                    <p className={styles.loadingText}>Analyzing graph structure...</p>
                    <div className={styles.loadingBars}>
                      {[70, 50, 85, 40].map((w, i) => (
                        <div key={i} className={styles.loadingBar} style={{ width: `${w}%`, animationDelay: `${i * 150}ms` }} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Error state */}
                {!loading && error && (
                  <div className={styles.errorCard}>
                    <div className={styles.errorIcon}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className={styles.errorTitle}>Request Failed</h3>
                      <p className={styles.errorMsg}>{error}</p>
                      <p className={styles.errorHint}>Make sure the backend is running on <code>localhost:3000</code></p>
                    </div>
                  </div>
                )}

                {/* Result */}
                {!loading && result && (
                  <div className={styles.resultCard}>
                    <div className={styles.resultHeader}>
                      <div className={styles.resultHeaderLeft}>
                        <div className={styles.successDot} />
                        <span className={styles.resultHeaderTitle}>Analysis Complete</span>
                      </div>
                      <button
                        className={styles.clearBtn}
                        onClick={() => setResult(null)}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                        New Analysis
                      </button>
                    </div>
                    <ResultPanel data={result} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className={styles.footer}>
        <span>Graph Hierarchy Explorer</span>
        <span className={styles.footerDot} />
        <span>SIT Full Stack Engineering Challenge</span>
        <span className={styles.footerDot} />
        <span>POST <code>/api/graph</code></span>
      </footer>
    </div>
  );
}
