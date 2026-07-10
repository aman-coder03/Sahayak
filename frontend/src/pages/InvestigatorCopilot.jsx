import { useState, useRef, useEffect } from "react";
import { copilot } from "../services/api";
import { Spinner } from "../components/ui";
import { MdSend, MdSmartToy, MdPerson } from "react-icons/md";

const SUGGESTIONS = [
  "Show me all high-risk digital arrest cases from Delhi",
  "Which phone numbers appear in multiple fraud cases?",
  "Find cases linked to UPI ID fraudster@ybl",
  "Show recent counterfeit currency seizures",
  "What fraud clusters are most active this week?",
];

export default function InvestigatorCopilot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "SAHAYAK Investigator Copilot online. I can query the fraud case database, cross-reference evidence, and surface patterns across investigations. What would you like to investigate?",
      ts: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (q) => {
    const query = q || input.trim();
    if (!query) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: query, ts: new Date().toLocaleTimeString() }]);
    setLoading(true);

    try {
      const { data } = await copilot(query);
      const content = formatCopilotResponse(data);
      setMessages((m) => [...m, { role: "assistant", content, ts: new Date().toLocaleTimeString(), raw: data }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "⚠ Backend unreachable. In production this queries the live fraud case database.",
          ts: new Date().toLocaleTimeString(),
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatCopilotResponse = (data) => {
    if (!data) return "No results found.";
    if (typeof data === "string") return data;
    if (Array.isArray(data)) {
      if (data.length === 0) return "No matching cases found in the database.";
      return `Found ${data.length} matching investigation(s):\n\n` +
        data.map((d, i) =>
          `${i + 1}. Case ${d.id || d.case_id || "—"} · ${d.fraud_type || d.type || "Unknown"} · Risk: ${d.network_risk || d.risk || "—"} · ${d.city || ""}`
        ).join("\n");
    }
    if (typeof data === "object") {
      if (data.results) return formatCopilotResponse(data.results);
      if (data.message) return data.message;
      return JSON.stringify(data, null, 2);
    }
    return String(data);
  };

  return (
    <div className="flex flex-col h-full animate-fadeIn">
      {/* Header */}
      <div className="px-5 py-3 border-b border-border flex-shrink-0">
        <h1 className="text-sm font-semibold">Investigator Copilot</h1>
        <p className="text-[11px] text-tx-muted">AI-powered case intelligence · live fraud database queries · cross-case pattern detection</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 items-start animate-slideUp ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${
                    msg.role === "user" ? "bg-brand" : "bg-bg-4 border border-border"
                  }`}
                >
                  {msg.role === "user" ? <MdPerson className="text-white" /> : <MdSmartToy className="text-brand" />}
                </div>
                <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div
                    className={`rounded-lg px-4 py-3 text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-brand-bg border border-brand-border rounded-tr-sm"
                        : msg.error
                        ? "bg-danger-bg border border-danger-border rounded-tl-sm"
                        : "bg-bg-3 border border-border rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-tx-dim px-1">{msg.ts}</span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 items-start animate-slideUp">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-bg-4 border border-border">
                  <MdSmartToy className="text-brand text-sm" />
                </div>
                <div className="bg-bg-3 border border-border rounded-lg rounded-tl-sm px-4 py-3 flex items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-xs text-tx-muted">Querying database…</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border flex-shrink-0">
            <div className="flex gap-2">
              <input
                className="input flex-1"
                placeholder="Ask about cases, suspects, patterns, fraud clusters…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
              />
              <button className="btn btn-primary" onClick={() => send()} disabled={loading || !input.trim()}>
                <MdSend />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-56 border-l border-border bg-bg-2 p-4 flex-shrink-0 overflow-y-auto">
          <div className="card-title mb-3">Suggested Queries</div>
          <div className="space-y-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="w-full text-left text-[11px] px-3 py-2 rounded-md bg-bg-3 border border-border hover:border-brand hover:text-brand transition-all text-tx-muted leading-snug"
                onClick={() => send(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="card-title mt-5 mb-3">Capabilities</div>
          <div className="space-y-1.5 text-[10px] text-tx-muted">
            {[
              "Cross-case pattern analysis",
              "Suspect phone/UPI lookup",
              "Cluster intelligence queries",
              "FIR status tracking",
              "Geospatial case mapping",
              "Network risk summaries",
            ].map((c) => (
              <div key={c} className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-brand flex-shrink-0" />
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
