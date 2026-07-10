import { useState, useEffect, useRef } from "react";
import { fraudNetwork } from "../services/api";
import { Spinner, ErrorBanner, AuditLog, ScoreBar } from "../components/ui";
import * as d3 from "d3";

const NODE_COLOR = { Phone: "#d9d9db", UPI: "#6f6f74", FraudCluster: "#e0293e" };
const LABEL_COLOR = { Phone: "#0a0a0a", UPI: "#ffffff", FraudCluster: "#ffffff" };
const NODE_R = { Phone: 22, UPI: 18, FraudCluster: 26 };

function NetworkGraph({ nodes, edges }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!nodes?.length || !svgRef.current) return;
    const el = svgRef.current;
    const W = el.clientWidth;
    const H = el.clientHeight;
    d3.select(el).selectAll("*").remove();

    const svg = d3.select(el);
    svg.append("defs").append("marker")
      .attr("id", "arrow").attr("viewBox", "0 0 10 10")
      .attr("refX", 28).attr("refY", 5)
      .attr("markerWidth", 5).attr("markerHeight", 5).attr("orient", "auto")
      .append("path").attr("d", "M0,0L10,5L0,10Z").attr("fill", "#3a3a3d");

    const g = svg.append("g");
    svg.call(d3.zoom().scaleExtent([0.3, 3]).on("zoom", (e) => g.attr("transform", e.transform)));

    const simNodes = nodes.map((n, i) => ({
      ...n,
      x: W / 2 + Math.cos((i / nodes.length) * Math.PI * 2) * 140,
      y: H / 2 + Math.sin((i / nodes.length) * Math.PI * 2) * 110,
    }));
    const nodeMap = Object.fromEntries(simNodes.map((n) => [n.id, n]));

    const simEdges = edges.map((e) => ({
      source: nodeMap[e.source] ?? simNodes[0],
      target: nodeMap[e.target] ?? simNodes[1],
    }));

    const sim = d3.forceSimulation(simNodes)
      .force("link", d3.forceLink(simEdges).distance(160).strength(0.5))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(W / 2, H / 2))
      .force("collision", d3.forceCollide(40));

    const link = g.selectAll("line").data(simEdges).enter().append("line")
      .attr("stroke", "#3a3a3d").attr("stroke-width", 1.5).attr("marker-end", "url(#arrow)");

    const node = g.selectAll("g.node").data(simNodes).enter().append("g")
      .attr("class", "node").attr("cursor", "pointer")
      .call(d3.drag()
        .on("start", (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on("end", (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
      );

    node.append("circle")
      .attr("r", (d) => NODE_R[d.type] ?? 16)
      .attr("fill", (d) => NODE_COLOR[d.type] ?? "#6f6f74")
      .attr("fill-opacity", 0.92)
      .attr("stroke", (d) => NODE_COLOR[d.type] ?? "#6f6f74")
      .attr("stroke-width", 2).attr("stroke-opacity", 0.5);

    node.append("text")
      .text((d) => d.id.length > 14 ? d.id.slice(0, 12) + "…" : d.id)
      .attr("text-anchor", "middle").attr("dy", (d) => (NODE_R[d.type] ?? 16) + 14)
      .attr("fill", "#b5b5b9").attr("font-size", 9).attr("font-family", "Inter,sans-serif")
      .attr("pointer-events", "none");

    node.append("text")
      .text((d) => d.type)
      .attr("text-anchor", "middle").attr("dy", 4)
      .attr("fill", "#fff").attr("font-size", 8).attr("font-weight", "600")
      .attr("font-family", "Inter,sans-serif").attr("pointer-events", "none");

    sim.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y);
      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => sim.stop();
  }, [nodes, edges]);

  return <svg ref={svgRef} className="w-full h-full" />;
}

export default function FraudNetwork() {
  const [form, setForm] = useState({ phone: "", upi: "", transcript: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [auditLog, setAuditLog] = useState([]);

  const addLog = (msg) => setAuditLog((p) => [...p, `[${new Date().toISOString()}] ${msg}`]);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const loadDemo = () => setForm({
    phone: "+91-9876543210",
    upi: "fraudster@ybl",
    transcript: "This is CBI Officer Verma. Your Aadhaar is used in money laundering. You are under digital arrest. Pay ₹3.5L bail via UPI immediately.",
  });

  const analyze = async () => {
    if (!form.phone || !form.upi || !form.transcript) return;
    setLoading(true);
    setError(null);
    setResult(null);
    addLog(`NETWORK_BUILD phone=${form.phone} upi=${form.upi}`);

    try {
      const { data } = await fraudNetwork(form);
      setResult(data);
      addLog(`CLUSTER=${data.cluster} RISK=${data.network_risk} DNA=${data.fraud_dna}`);
      addLog(`NODES=${data.nodes?.length} EDGES=${data.edges?.length}`);
    } catch {
      setError("Backend unreachable.");
      addLog("ERROR backend_unreachable");
    } finally {
      setLoading(false);
    }
  };

  const riskColor = result?.network_risk === "HIGH"
    ? "text-danger" : result?.network_risk === "MEDIUM"
    ? "text-warn" : "text-ok";

  return (
    <div className="p-5 animate-fadeIn">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-sm font-semibold">Fraud Network Intelligence</h1>
          <p className="text-[11px] text-tx-muted mt-0.5">
            Neo4j GDS · D3 force graph · cluster attribution · real-time link prediction
          </p>
        </div>
        <button className="btn btn-ghost text-xs" onClick={loadDemo}>Load demo</button>
      </div>

      <div className="grid grid-cols-5 gap-4 h-[calc(100vh-160px)]">
        {/* Form */}
        <div className="col-span-2 flex flex-col gap-3 overflow-y-auto">
          <div className="card p-4 space-y-3">
            <div className="card-title">Network Inputs</div>
            <div>
              <div className="label">Phone *</div>
              <input className="input" placeholder="+91-XXXXXXXXXX" value={form.phone} onChange={set("phone")} />
            </div>
            <div>
              <div className="label">UPI ID *</div>
              <input className="input" placeholder="suspect@upi" value={form.upi} onChange={set("upi")} />
            </div>
            <div>
              <div className="label">Transcript *</div>
              <textarea className="input min-h-[100px] resize-none" placeholder="Scam transcript…" value={form.transcript} onChange={set("transcript")} />
            </div>
            <button className="btn btn-primary w-full" onClick={analyze} disabled={loading || !form.phone || !form.upi || !form.transcript}>
              {loading ? <Spinner size="sm" /> : "🕸"}
              {loading ? "Building network…" : "Build Fraud Network"}
            </button>
          </div>

          {result && (
            <div className="space-y-3 animate-slideUp">
              <div className="card p-4 space-y-3">
                <div className="card-title">Network Summary</div>
                <div className="divide-y divide-border">
                  {[
                    ["Fraud DNA", result.fraud_dna],
                    ["Cluster", result.cluster],
                    ["Network Risk", result.network_risk],
                    ["Nodes", result.nodes?.length],
                    ["Edges", result.edges?.length],
                  ].map(([k, v]) => (
                    <div key={k} className="kv">
                      <span className="kv-k">{k}</span>
                      <span className={`kv-v mono text-[11px] ${k === "Network Risk" ? riskColor : ""}`}>{v ?? "—"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Node list */}
              <div className="card p-4">
                <div className="card-title">Network Nodes</div>
                <div className="space-y-1.5">
                  {result.nodes?.map((n, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2 bg-bg-4 rounded-md border border-border">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: NODE_COLOR[n.type] ?? "#6f6f74", boxShadow: "inset 0 0 0 1px rgba(120,120,120,0.35)" }} />
                        <span className="mono truncate max-w-[120px]" title={n.id}>{n.id}</span>
                      </div>
                      <span className="text-tx-muted text-[10px]">{n.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edges */}
              <div className="card p-4">
                <div className="card-title">Relationships</div>
                <div className="space-y-1.5">
                  {result.edges?.map((e, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-tx-muted">
                      <span className="mono text-brand truncate max-w-[80px]" title={e.source}>{e.source}</span>
                      <span className="text-border-2">→</span>
                      <span className="mono text-warn truncate max-w-[80px]" title={e.target}>{e.target}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {auditLog.length > 0 && (
            <div className="card p-4">
              <div className="card-title">Audit Log</div>
              <AuditLog entries={auditLog} />
            </div>
          )}
        </div>

        {/* Graph canvas */}
        <div className="col-span-3 flex flex-col gap-3">
          {error && <ErrorBanner message={error} />}

          <div className="card console-surface flex-1 overflow-hidden relative">
            {!result && !loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-tx-muted gap-3">
                <div className="text-4xl">🕸</div>
                <p className="text-xs">Submit inputs to visualise the fraud network graph</p>
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <Spinner />
                <p className="text-xs text-tx-muted">Building network topology…</p>
              </div>
            )}
            {result?.nodes && <NetworkGraph nodes={result.nodes} edges={result.edges} />}
          </div>

          {/* Legend */}
          <div className="card p-3 flex items-center gap-6">
            {Object.entries(NODE_COLOR).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2 text-xs text-tx-muted">
                <div className="w-3 h-3 rounded-full" style={{ background: color, boxShadow: "inset 0 0 0 1px rgba(120,120,120,0.35)" }} />
                {type}
              </div>
            ))}
            <div className="ml-auto text-[10px] text-tx-dim">Drag nodes to explore · scroll to zoom</div>
          </div>
        </div>
      </div>
    </div>
  );
}
