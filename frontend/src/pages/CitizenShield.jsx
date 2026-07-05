import { useState } from "react";
import { citizenShield } from "../services/api";
import { RiskMeter, Spinner, ErrorBanner, AuditLog } from "../components/ui";
import { MdSend, MdShield } from "react-icons/md";

const QUICK = [
  { label: "🚨 Digital Arrest", text: "Someone called saying my Aadhaar is linked to a crime and I am under digital arrest. They want me to stay on video call and not tell anyone." },
  { label: "📱 Fake KYC SMS", text: "I got an SMS to update my KYC immediately or my bank account will be blocked. There is a link in the message." },
  { label: "📦 Customs Parcel", text: "A customs officer called saying my parcel has drugs. I need to pay ₹80,000 via UPI to avoid arrest." },
  { label: "💼 Job Scam", text: "WhatsApp message: earn ₹5000 daily working part time, just like YouTube videos and screenshots. They asked for my bank account." },
  { label: "⚡ Already Transferred", text: "I already sent ₹1.5 lakh to a UPI number 20 minutes ago after a scam call. What should I do right now?" },
];

export default function CitizenShield() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [auditLog, setAuditLog] = useState([]);

  const addLog = (msg) => {
    const ts = new Date().toISOString();
    setAuditLog((prev) => [...prev, `[${ts}] ${msg}`]);
  };

  const analyze = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    addLog(`SESSION_START input_length=${message.length}`);

    try {
      const { data } = await citizenShield(message);
      setResult(data);
      addLog(`VERDICT=${data.verdict} RISK_SCORE=${data.risk_score} DNA=${data.fraud_dna}`);
      addLog("SESSION_COMPLETE status=SUCCESS");
    } catch (e) {
      setError("Backend unreachable. Please call 1930 for immediate help.");
      addLog("ERROR backend_unreachable");
    } finally {
      setLoading(false);
    }
  };

  const riskColor =
    result?.risk_score >= 80
      ? "border-danger bg-danger-bg"
      : result?.risk_score >= 50
      ? "border-warn-border bg-warn-bg"
      : "border-ok-border bg-ok-bg";

  const verdictColor =
    result?.risk_score >= 80
      ? "text-danger"
      : result?.risk_score >= 50
      ? "text-warn"
      : "text-ok";

  return (
    <div className="p-5 animate-fadeIn">
      <div className="mb-4">
        <h1 className="text-sm font-semibold">Citizen Fraud Shield</h1>
        <p className="text-[11px] text-tx-muted mt-0.5">
          AI-powered scam detection · 12 regional languages · integrated NCRB reporting · FPR &lt; 2%
        </p>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Left: Input */}
        <div className="col-span-3 space-y-3">
          <div className="card p-4 space-y-3">
            <div className="label">Paste suspicious call transcript / SMS / WhatsApp message</div>
            <textarea
              className="input min-h-[180px] resize-y"
              placeholder={`Example:\n"This is Officer Verma from CBI. Your Aadhaar has been used in money laundering. You are under digital arrest. Do not tell anyone or you will be arrested immediately..."`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <button
                className="btn btn-primary flex-1"
                onClick={analyze}
                disabled={loading || !message.trim()}
              >
                {loading ? <Spinner size="sm" /> : <MdShield />}
                {loading ? "Analysing…" : "Analyse Message"}
              </button>
              <button className="btn btn-ghost" onClick={() => { setMessage(""); setResult(null); setAuditLog([]); }}>
                Clear
              </button>
            </div>
          </div>

          {/* Quick Reports */}
          <div className="card p-4">
            <div className="card-title">Quick Report Templates</div>
            <div className="grid grid-cols-1 gap-1.5">
              {QUICK.map((q) => (
                <button
                  key={q.label}
                  className="text-left text-xs px-3 py-2 rounded-md bg-bg-4 border border-border hover:border-brand hover:text-brand transition-all text-tx-muted"
                  onClick={() => setMessage(q.text)}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Audit Log */}
          {auditLog.length > 0 && (
            <div className="card p-4">
              <div className="card-title">Audit Log — IT Act 2000 s.65B Compliant</div>
              <AuditLog entries={auditLog} />
            </div>
          )}
        </div>

        {/* Right: Results */}
        <div className="col-span-2 space-y-3">
          {error && <ErrorBanner message={error} />}

          {!result && !loading && (
            <div className="card p-6 text-center space-y-2">
              <MdShield className="text-4xl text-tx-dim mx-auto" />
              <p className="text-xs text-tx-muted">Submit a message to receive fraud risk assessment</p>
            </div>
          )}

          {loading && (
            <div className="card p-8 flex flex-col items-center gap-3">
              <Spinner />
              <p className="text-xs text-tx-muted">Running NLP pipeline…</p>
            </div>
          )}

          {result && (
            <>
              <RiskMeter score={result.risk_score} />

              <div className={`card p-4 border ${riskColor}`}>
                <div className="card-title">Verdict</div>
                <div className={`text-base font-bold ${verdictColor}`}>{result.verdict}</div>
                {result.fraud_dna && (
                  <div className="mt-2 text-[10px] text-tx-muted">
                    Fraud DNA: <span className="mono text-brand">{result.fraud_dna}</span>
                  </div>
                )}
              </div>

              {result.reasons && (
                <div className="card p-4">
                  <div className="card-title">Intelligence Summary</div>
                  <p className="text-xs text-tx leading-relaxed">{result.reasons}</p>
                </div>
              )}

              {result.advisory?.length > 0 && (
                <div className="card p-4">
                  <div className="card-title">Advisory</div>
                  <ol className="space-y-1.5">
                    {result.advisory.map((a, i) => (
                      <li key={i} className="text-xs flex gap-2 items-start">
                        <span className="text-brand font-bold mono flex-shrink-0">{i + 1}.</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="card p-3 bg-danger-bg border-danger-border text-center">
                <p className="text-xs text-danger font-semibold">
                  📞 Cybercrime Helpline: <span className="text-lg mono">1930</span>
                </p>
                <p className="text-[10px] text-tx-muted mt-0.5">cybercrime.gov.in</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
