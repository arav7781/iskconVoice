"use client";
import { useState } from "react";
import { processGraph } from "../lib/api";

function TreeNode({ nodeKey, subtree, depth = 0 }) {
  const [open, setOpen] = useState(true);
  const children = Object.keys(subtree || {});
  const isLeaf = children.length === 0;
  
  return (
    <div className="flex flex-col relative mt-1.5">
      <div 
        className={`flex items-center gap-2 py-1.5 px-2 rounded-md transition-colors ${!isLeaf ? 'cursor-pointer hover:bg-surface-variant/50' : ''}`}
        onClick={() => !isLeaf && setOpen(!open)}
      >
         <div className={`flex items-center justify-center w-5 h-5 rounded ${!isLeaf ? 'bg-primary/10 text-primary' : ''}`}>
           {!isLeaf ? (
             <span className="material-symbols-outlined text-[14px]" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
               chevron_right
             </span>
           ) : (
             <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
           )}
         </div>
         <span className={`text-sm ${!isLeaf ? 'font-semibold text-on-surface' : 'text-on-surface-variant'}`}>
           {nodeKey}
         </span>
         {!isLeaf && (
            <span className="text-[10px] font-mono text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded-sm opacity-70">
              {children.length}
            </span>
         )}
      </div>
      
      {!isLeaf && open && (
         <div className="flex flex-col border-l border-outline-variant/50 ml-2.5 pl-4 relative">
           {children.map(k => (
             <TreeNode key={k} nodeKey={k} subtree={subtree[k]} depth={depth + 1} />
           ))}
         </div>
      )}
    </div>
  )
}

function TreeView({ tree, root }) {
  const rootSubtree = tree[root] ?? {};
  return (
    <div className="w-full">
      <TreeNode nodeKey={root} subtree={rootSubtree} depth={0} />
    </div>
  );
}

function DocumentationTab() {
  return (
    <div className="bg-surface rounded-lg p-lg neo-raised space-y-md max-w-4xl mx-auto">
      <div className="flex items-center gap-xs text-primary mb-6">
        <span className="material-symbols-outlined text-3xl" data-icon="menu_book">menu_book</span>
        <h2 className="font-display-lg text-3xl font-bold">SIT Graph Hierarchy API</h2>
      </div>
      <p className="text-on-surface-variant text-lg">REST API that processes hierarchical node relationships and returns structured insights.</p>
      
      <div className="space-y-8 mt-8">
        <section>
          <h3 className="font-title-md text-xl font-bold text-on-surface border-b border-outline-variant/30 pb-2 mb-4">Endpoint</h3>
          <div className="bg-inverse-surface text-inverse-on-surface p-4 rounded-md font-mono text-sm">
            POST /api/graph<br/>
            Content-Type: application/json
          </div>
          <h4 className="font-bold text-on-surface mt-4 mb-2">Request</h4>
          <div className="bg-inverse-surface text-inverse-on-surface p-4 rounded-md font-mono text-sm">
            {'{ "edges": ["A->B", "A->C", "B->D"] }'}
          </div>
        </section>

        <section>
          <h3 className="font-title-md text-xl font-bold text-on-surface border-b border-outline-variant/30 pb-2 mb-4">Local Development</h3>
          <div className="bg-inverse-surface text-inverse-on-surface p-4 rounded-md font-mono text-sm">
            npm install<br/>
            npm run dev &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# nodemon hot-reload<br/>
            # or<br/>
            npm start &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# plain node
          </div>
          <p className="text-on-surface-variant mt-2">API will be available at <code>http://localhost:3000/api/graph</code></p>
        </section>

        <section>
          <h3 className="font-title-md text-xl font-bold text-on-surface border-b border-outline-variant/30 pb-2 mb-4">Deployment</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-on-surface mb-2">Option A — Render (simplest, free tier)</h4>
              <ol className="list-decimal list-inside space-y-1 text-on-surface-variant ml-2">
                <li>Push this repo to GitHub</li>
                <li>Go to https://render.com → New → Web Service</li>
                <li>Connect your GitHub repo</li>
                <li>Set Build Command to <code>npm install</code>, Start Command to <code>npm start</code>, Environment to Node</li>
                <li>Deploy — Render auto-assigns a public URL</li>
              </ol>
            </div>

            <div>
              <h4 className="font-bold text-on-surface mb-2">Option B — AWS Elastic Beanstalk</h4>
              <div className="bg-inverse-surface text-inverse-on-surface p-4 rounded-md font-mono text-sm space-y-2">
                <div># Install AWS CLI and EB CLI:<br/>pip install awsebcli</div>
                <div># Initialise:<br/>eb init sit-graph-api --platform node.js --region ap-south-1</div>
                <div># Create environment and deploy:<br/>eb create sit-graph-api-env<br/>eb deploy<br/>eb open</div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-on-surface mb-2">Option C — AWS EC2 (manual)</h4>
              <div className="bg-inverse-surface text-inverse-on-surface p-4 rounded-md font-mono text-sm space-y-2">
                <div># On EC2 (Amazon Linux 2)<br/>sudo yum update -y<br/>curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -<br/>sudo yum install -y nodejs git</div>
                <div>git clone &lt;your-repo-url&gt;<br/>cd sit-graph-api<br/>npm install</div>
                <div># Run with PM2 for persistence<br/>sudo npm install -g pm2<br/>pm2 start server.js --name sit-graph-api<br/>pm2 startup<br/>pm2 save</div>
              </div>
              <p className="text-on-surface-variant mt-2 text-sm">Open port 3000 (or 80 via nginx reverse proxy) in your EC2 Security Group.</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-title-md text-xl font-bold text-on-surface border-b border-outline-variant/30 pb-2 mb-4">Project Structure</h3>
          <div className="bg-inverse-surface text-inverse-on-surface p-4 rounded-md font-mono text-sm mb-4">
            sit-graph-api/<br/>
            ├── server.js &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# All server code (SOLID architecture)<br/>
            ├── package.json<br/>
            └── README.md
          </div>

          <h4 className="font-bold text-on-surface mb-2">Architecture layers inside server.js</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-variant text-on-surface">
                  <th className="p-2 border border-outline-variant/30">Layer</th>
                  <th className="p-2 border border-outline-variant/30">Class</th>
                  <th className="p-2 border border-outline-variant/30">Responsibility</th>
                </tr>
              </thead>
              <tbody className="text-on-surface-variant text-sm">
                <tr><td className="p-2 border border-outline-variant/30 font-semibold">Validation</td><td className="p-2 border border-outline-variant/30 font-mono">EdgeValidator</td><td className="p-2 border border-outline-variant/30">Validates edge format rules</td></tr>
                <tr><td className="p-2 border border-outline-variant/30 font-semibold">Parsing</td><td className="p-2 border border-outline-variant/30 font-mono">EdgeParser</td><td className="p-2 border border-outline-variant/30">Deduplicates, separates invalid entries</td></tr>
                <tr><td className="p-2 border border-outline-variant/30 font-semibold">Graph</td><td className="p-2 border border-outline-variant/30 font-mono">GraphBuilder</td><td className="p-2 border border-outline-variant/30">Builds adjacency + parent maps</td></tr>
                <tr><td className="p-2 border border-outline-variant/30 font-semibold">Groups</td><td className="p-2 border border-outline-variant/30 font-mono">GroupResolver</td><td className="p-2 border border-outline-variant/30">Union-Find to find connected components</td></tr>
                <tr><td className="p-2 border border-outline-variant/30 font-semibold">Cycles</td><td className="p-2 border border-outline-variant/30 font-mono">CycleDetector</td><td className="p-2 border border-outline-variant/30">DFS cycle detection per component</td></tr>
                <tr><td className="p-2 border border-outline-variant/30 font-semibold">Serialization</td><td className="p-2 border border-outline-variant/30 font-mono">TreeSerializer</td><td className="p-2 border border-outline-variant/30">Nested object tree + depth calculation</td></tr>
                <tr><td className="p-2 border border-outline-variant/30 font-semibold">Orchestration</td><td className="p-2 border border-outline-variant/30 font-mono">HierarchyBuilder</td><td className="p-2 border border-outline-variant/30">Combines above into hierarchies array</td></tr>
                <tr><td className="p-2 border border-outline-variant/30 font-semibold">Summary</td><td className="p-2 border border-outline-variant/30 font-mono">SummaryBuilder</td><td className="p-2 border border-outline-variant/30">Computes summary stats</td></tr>
                <tr><td className="p-2 border border-outline-variant/30 font-semibold">Service</td><td className="p-2 border border-outline-variant/30 font-mono">GraphService</td><td className="p-2 border border-outline-variant/30">Orchestrates end-to-end pipeline</td></tr>
                <tr><td className="p-2 border border-outline-variant/30 font-semibold">HTTP</td><td className="p-2 border border-outline-variant/30 font-mono">GraphController</td><td className="p-2 border border-outline-variant/30">Request/response handling only</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function Home() {
    const [activeTab, setActiveTab] = useState("explorer");
    const [edgesText, setEdgesText] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

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
                const matches = [...trimmed.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
                if (matches.length > 0) {
                    if (matches[0] === "edges") {
                        return matches.slice(1).map((s) => s.trim()).filter(Boolean);
                    }
                    return matches.map((s) => s.trim()).filter(Boolean);
                }
            }
        }
        return raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    };

    const handleProcess = async () => {
        if (!edgesText.trim()) return;
        const edges = parseEdges(edgesText);
        if (edges.length === 0) {
            setError("Please enter at least one valid edge.");
            return;
        }
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
        <>
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#4648d4 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
            
            <header className="glass-panel sticky top-0 z-50 w-full px-margin-desktop py-md flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-md">
                    <div className="w-10 h-10 bg-vibrant-gradient rounded-lg flex items-center justify-center shadow-lg">
                        <span className="material-symbols-outlined text-white" data-icon="account_tree">account_tree</span>
                    </div>
                    <span className="font-display-lg text-[28px] leading-tight font-bold text-primary tracking-tight">Graph Hierarchy Explorer</span>
                </div>
                <nav className="hidden md:flex gap-lg items-center cursor-pointer">
                    <button 
                        onClick={() => setActiveTab("explorer")}
                        className={`font-bold transition-all py-1 px-2 ${activeTab === 'explorer' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                        Explorer
                    </button>
                    <button 
                        onClick={() => setActiveTab("documentation")}
                        className={`font-bold transition-all py-1 px-2 ${activeTab === 'documentation' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                        Documentation
                    </button>
                </nav>
                <div className="flex items-center gap-md">
                    <button className="w-10 h-10 neo-button-raised rounded-full text-on-surface-variant hover:text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl" data-icon="settings">settings</span>
                    </button>
                    <button className="w-10 h-10 neo-button-raised rounded-full text-on-surface-variant hover:text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl" data-icon="account_circle">account_circle</span>
                    </button>
                </div>
            </header>

            <main className="flex-grow px-margin-desktop py-xl space-y-xl max-w-[1600px] mx-auto w-full relative z-10">
                {activeTab === "documentation" ? (
                    <DocumentationTab />
                ) : (
                    <>
                        <section className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-center">
                            <div className="lg:col-span-7 space-y-md">
                                <div className="inline-flex items-center px-sm py-1 bg-primary-fixed rounded-full text-on-primary-fixed font-bold text-label-caps">
                                    <span className="material-symbols-outlined text-sm mr-1" data-icon="auto_awesome">auto_awesome</span>
                                    Engineering challenge v2.0
                                </div>
                                <h2 className="font-headline-lg text-[42px] leading-tight text-on-surface tracking-tight">
                                    Visualize Complex <br /><span className="text-primary">Data Hierarchies</span>
                                </h2>
                                <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
                                    Define, visualize, and analyze complex hierarchical relationships through our tactile neomorphic graph engine. Identify cycles, manage deep-nested structures, and validate data integrity in real-time.
                                </p>
                                <div className="flex gap-md pt-base">
                                    <button className="bg-vibrant-gradient text-white px-lg py-sm rounded-full font-bold shadow-lg hover:shadow-indigo-500/25 transition-all">Get Started</button>
                                    <button onClick={() => setActiveTab("documentation")} className="neo-button-raised text-on-surface px-lg py-sm rounded-full font-bold">Learn More</button>
                                </div>
                            </div>
                            <div className="lg:col-span-5 aspect-[4/3] rounded-lg neo-raised overflow-hidden relative group">
                                <div className="absolute inset-0 bg-vibrant-gradient opacity-5 transition-opacity group-hover:opacity-10"></div>
                                <img alt="Abstract Tech Grid" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApT1d_tcTp5a_2T-ooiiRNolokXLPP6uEKJyBRhkgnROZGDLY6xZU3FJ-9wHf7Dahpo2PfBBYlb_GLtp63OZcza90NoW0_VafNT05tsVeSrkVF6XedBVu2QWy5CLXPLffXUnaXHGeHFlaR4AQHY0kFJf96DRAxgwvIsBlGFz9bmhl0TWZY0pF5uNH31gf5FXBU59Il76zdJHu3YvF7_ayR79cpVjc6Yjv4PcyJTAhY7zkZn776phb2U-8QVew7LRgGbBy94iVfRg_3" />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent"></div>
                            </div>
                        </section>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
                            <div className="space-y-lg lg:col-span-1">
                                <div className="bg-surface rounded-lg p-md neo-raised space-y-md">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-xs text-primary">
                                            <span className="material-symbols-outlined" data-icon="edit_note">edit_note</span>
                                            <h3 className="font-title-md text-title-md">Edge Definition</h3>
                                        </div>
                                        <span className="text-label-caps text-on-surface-variant opacity-50">.CSV / .JSON</span>
                                    </div>
                                    <div className="neo-inset p-md rounded-md bg-surface-container-low min-h-[250px] flex flex-col">
                                        <textarea 
                                            className="flex-grow w-full bg-transparent border-none focus:ring-0 font-mono text-body-sm text-on-surface-variant resize-none custom-scrollbar" 
                                            placeholder="Enter node pairs (e.g., Parent -> Child)...&#10;A -> B&#10;B -> C"
                                            value={edgesText}
                                            onChange={(e) => setEdgesText(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-end pt-base">
                                        <button 
                                            onClick={handleProcess}
                                            disabled={loading}
                                            className="bg-vibrant-gradient px-lg py-sm rounded-full text-white font-bold flex items-center gap-xs shadow-md active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            <span className="material-symbols-outlined text-sm" data-icon={loading ? "hourglass_empty" : "play_arrow"}>
                                                {loading ? "hourglass_empty" : "play_arrow"}
                                            </span>
                                            {loading ? "Processing..." : "Process Graph"}
                                        </button>
                                    </div>
                                    {error && (
                                        <div className="text-error text-sm mt-2">
                                            {error}
                                        </div>
                                    )}
                                </div>

                                <div className="glass-panel rounded-lg p-md neo-raised space-y-md">
                                    <div className="flex items-center gap-xs text-tertiary">
                                        <span className="material-symbols-outlined" data-icon="warning">warning</span>
                                        <h3 className="font-title-md text-title-md">Data Quality Flags</h3>
                                    </div>
                                    <div className="space-y-sm">
                                        {result ? (
                                            <>
                                                {result.invalid_entries?.length > 0 ? result.invalid_entries.map((entry, idx) => (
                                                    <div key={`inv-${idx}`} className="flex items-start gap-md p-md rounded-md neo-inset bg-white/40 border-l-4 border-error group hover:bg-error-container/20 transition-colors">
                                                        <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error shadow-sm group-hover:scale-110 transition-transform">
                                                            <span className="material-symbols-outlined text-xl" data-icon="sync_problem">sync_problem</span>
                                                        </div>
                                                        <div className="flex-grow">
                                                            <p className="font-bold text-on-surface text-body-sm">Invalid Entry / Cycle</p>
                                                            <p className="text-on-surface-variant text-body-sm opacity-80">{entry.edge || entry || JSON.stringify(entry)}</p>
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <div className="text-on-surface-variant text-sm opacity-70 px-2">No invalid entries detected.</div>
                                                )}
                                                
                                                {result.duplicate_edges?.length > 0 && result.duplicate_edges.map((edge, idx) => (
                                                    <div key={`dup-${idx}`} className="flex items-start gap-md p-md rounded-md neo-inset bg-white/40 border-l-4 border-secondary group hover:bg-secondary-container/20 transition-colors mt-2">
                                                        <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary shadow-sm group-hover:scale-110 transition-transform">
                                                            <span className="material-symbols-outlined text-xl" data-icon="link_off">link_off</span>
                                                        </div>
                                                        <div className="flex-grow">
                                                            <p className="font-bold text-on-surface text-body-sm">Duplicate Edge</p>
                                                            <p className="text-on-surface-variant text-body-sm opacity-80">{edge}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            <div className="text-on-surface-variant text-sm opacity-70 px-2 italic">Run process to see quality flags.</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-2 space-y-lg">
                                {/* Summary Cards Row */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
                                    <div className="bg-surface p-md rounded-lg neo-raised text-center flex flex-col justify-center group hover:bg-primary/5 transition-colors overflow-hidden">
                                        <p className="text-label-caps font-label-caps text-on-surface-variant mb-2 opacity-70">USER IDENTITY</p>
                                        <p className="text-sm font-bold text-primary group-hover:scale-105 transition-transform truncate w-full px-2" title={result?.user_id || "Waiting..."}>{result?.user_id || "-"}</p>
                                        <div className="text-[10px] text-on-surface-variant mt-1 opacity-80 flex flex-col">
                                            <span className="truncate w-full px-2" title={result?.email_id || ""}>{result?.email_id || ""}</span>
                                            <span>{result?.enrollment_number || ""}</span>
                                        </div>
                                    </div>
                                    <div className="bg-surface p-md rounded-lg neo-raised text-center flex flex-col justify-center group hover:bg-primary/5 transition-colors">
                                        <p className="text-label-caps font-label-caps text-on-surface-variant mb-1 opacity-70">TOTAL TREES</p>
                                        <p className="text-[32px] font-bold text-primary group-hover:scale-110 transition-transform">{result?.summary?.total_trees ?? "-"}</p>
                                    </div>
                                    <div className="bg-surface p-md rounded-lg neo-raised text-center flex flex-col justify-center group hover:bg-error/5 transition-colors">
                                        <p className="text-label-caps font-label-caps text-on-surface-variant mb-1 opacity-70 text-error/60">TOTAL CYCLES</p>
                                        <p className="text-[32px] font-bold text-error group-hover:scale-110 transition-transform">{result?.summary?.total_cycles ?? "-"}</p>
                                    </div>
                                    <div className="bg-surface p-md rounded-lg neo-raised text-center flex flex-col justify-center group hover:bg-secondary/5 transition-colors">
                                        <p className="text-label-caps font-label-caps text-on-surface-variant mb-1 opacity-70">LARGEST ROOT</p>
                                        <p className="text-[32px] font-bold text-secondary group-hover:scale-110 transition-transform">{result?.summary?.largest_tree_root || "-"}</p>
                                    </div>
                                </div>

                                <div className="bg-surface rounded-lg p-md neo-raised space-y-md min-h-[600px] flex flex-col relative">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-xs text-primary">
                                            <span className="material-symbols-outlined" data-icon="hub">hub</span>
                                            <h3 className="font-title-md text-title-md">Graph Visualization</h3>
                                        </div>
                                        {result && (
                                            <div className="flex gap-sm p-1 neo-inset rounded-full bg-surface-container-low">
                                                <button className="px-md py-xs rounded-full bg-vibrant-gradient text-white font-bold text-body-sm shadow-md transition-all active:scale-95">Tree View</button>
                                                <button className="px-md py-xs rounded-full text-on-surface-variant font-bold text-body-sm hover:text-primary transition-colors">Cycle View</button>
                                            </div>
                                        )}
                                    </div>
                                    <div className={`flex-grow neo-inset rounded-lg bg-surface-container-low relative ${!result ? 'overflow-hidden flex items-center justify-center' : 'overflow-auto p-md'} group/canvas`}>
                                        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(#4F46E5 0.8px, transparent 0.8px)", backgroundSize: "32px 32px" }}></div>
                                        
                                        {!result ? (
                                            <>
                                                <svg className="z-10 drop-shadow-2xl" height="400" viewBox="0 0 500 400" width="500">
                                                    <defs>
                                                        <linearGradient id="edgeGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                                                            <stop offset="0%" stopColor="#4F46E5"></stop>
                                                            <stop offset="100%" stopColor="#06B6D4"></stop>
                                                        </linearGradient>
                                                        <filter id="glow">
                                                            <feGaussianBlur result="blur" stdDeviation="3"></feGaussianBlur>
                                                            <feComposite in="SourceGraphic" in2="blur" operator="over"></feComposite>
                                                        </filter>
                                                        <marker id="arrow" markerHeight="6" markerWidth="6" orient="auto" refX="15" refY="3">
                                                            <path d="M0,0 L6,3 L0,6 Z" fill="#4F46E5" opacity="0.8"></path>
                                                        </marker>
                                                    </defs>
                                                    <g className="edges" opacity="0.6" stroke="url(#edgeGrad)" strokeWidth="2">
                                                        <path d="M250,60 L120,180" filter="url(#glow)" markerEnd="url(#arrow)"></path>
                                                        <path d="M250,60 L380,180" filter="url(#glow)" markerEnd="url(#arrow)"></path>
                                                        <path d="M120,180 L120,320" filter="url(#glow)" markerEnd="url(#arrow)"></path>
                                                        <path d="M120,180 L250,320" filter="url(#glow)" markerEnd="url(#arrow)"></path>
                                                    </g>
                                                    <g className="nodes">
                                                        <circle cx="250" cy="60" fill="#4F46E5" filter="url(#glow)" r="14" stroke="white" strokeWidth="3"></circle>
                                                        <text fill="white" fontFamily="Inter" fontSize="10" fontWeight="bold" textAnchor="middle" x="250" y="64">R</text>
                                                        <circle cx="120" cy="180" fill="#06B6D4" filter="url(#glow)" r="12" stroke="white" strokeWidth="2"></circle>
                                                        <circle cx="380" cy="180" fill="#06B6D4" filter="url(#glow)" r="12" stroke="white" strokeWidth="2"></circle>
                                                        <circle cx="120" cy="320" fill="#06B6D4" filter="url(#glow)" r="12" stroke="white" strokeWidth="2"></circle>
                                                        <circle cx="250" cy="320" fill="#06B6D4" filter="url(#glow)" r="12" stroke="white" strokeWidth="2"></circle>
                                                    </g>
                                                </svg>
                                                <div className="absolute inset-0 bg-surface-container-low/50 backdrop-blur-[2px] flex items-center justify-center z-20">
                                                    <div className="bg-surface p-md rounded-lg neo-raised text-center max-w-sm">
                                                        <span className="material-symbols-outlined text-primary text-4xl mb-2">account_tree</span>
                                                        <h4 className="font-title-md text-on-surface mb-1">Waiting for Input</h4>
                                                        <p className="text-body-sm text-on-surface-variant">Enter edge definitions on the left and click Process Graph to render.</p>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full space-y-md z-10 relative">
                                                {result.hierarchies?.map((h, i) => (
                                                    <div key={i} className="bg-surface/90 p-md rounded-lg shadow-md border border-white/60 backdrop-blur-md transition-all hover:shadow-lg">
                                                        <div className="flex items-center gap-3 mb-sm border-b border-outline-variant/30 pb-3">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${h.has_cycle ? 'bg-error-container text-error' : 'bg-primary-container text-primary'}`}>
                                                                <span className="material-symbols-outlined">
                                                                    {h.has_cycle ? 'sync_problem' : 'account_tree'}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Root Node</p>
                                                                <p className="font-bold text-on-surface text-lg leading-none">{h.root}</p>
                                                            </div>
                                                            
                                                            {h.has_cycle ? (
                                                                <span className="badge badge-red ml-auto text-sm px-3 py-1">⚠ Cycle</span>
                                                            ) : (
                                                                <span className="badge badge-green ml-auto text-sm px-3 py-1">✓ Valid (Depth {h.depth})</span>
                                                            )}
                                                        </div>
                                                        
                                                        {h.has_cycle ? (
                                                            <div className="p-md bg-error-container/30 text-error rounded-md text-sm flex flex-col gap-3 border border-error/20">
                                                                <div className="flex items-start gap-3">
                                                                    <span className="material-symbols-outlined text-xl mt-0.5">warning</span>
                                                                    <div>
                                                                        <p className="font-bold mb-1">A cycle was detected in this group.</p>
                                                                        <p className="opacity-80 mb-3">All nodes in this group form a circular dependency — a complete valid tree structure cannot be built.</p>
                                                                        {h.tree && Object.keys(h.tree).length > 0 && (
                                                                            <div className="bg-white/60 text-on-surface p-sm rounded-md border border-error/20 shadow-inner">
                                                                                <p className="text-xs font-bold text-error mb-2 uppercase tracking-wide">Partial Tree Path (Tracing the Cycle)</p>
                                                                                <TreeView tree={h.tree} root={h.root} />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="bg-white/50 rounded-md p-sm border border-outline-variant/20">
                                                                <TreeView tree={h.tree} root={h.root} />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-on-surface-variant px-base">
                                        <div className="flex items-center gap-md">
                                            <span className="flex items-center gap-xs"><span className="w-2 h-2 rounded-full bg-primary"></span> Root</span>
                                            <span className="flex items-center gap-xs"><span className="w-2 h-2 rounded-full bg-secondary"></span> Leaf</span>
                                        </div>
                                        <span className="font-mono">Total Groups: {result?.hierarchies?.length || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>

            <footer className="glass-panel px-margin-desktop py-lg flex flex-col md:flex-row justify-between items-center w-full mt-xl border-t border-white/20">
                <div className="flex flex-col gap-xs items-center md:items-start mb-md md:mb-0">
                    <div className="flex items-center gap-xs">
                        <div className="w-6 h-6 bg-vibrant-gradient rounded-sm flex items-center justify-center text-[10px] text-white">SIT</div>
                        <span className="font-title-md text-on-surface">Graph Hierarchy Explorer</span>
                    </div>
                    <p className="font-body-sm text-on-surface-variant opacity-60">© 2024 SIT Engineering Challenge • All rights reserved</p>
                </div>
                <div className="flex gap-lg">
                    <a className="font-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Technical Docs</a>
                    <a className="font-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">API Reference</a>
                    <a className="font-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">System Status</a>
                </div>
            </footer>
        </>
    );
}
