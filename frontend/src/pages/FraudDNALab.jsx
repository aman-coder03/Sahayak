import { useState } from "react";
import { generateDNA } from "../services/api";
import { ScoreBar, Spinner, ErrorBanner, AuditLog } from "../components/ui";
import { MdBiotech } from "react-icons/md";

const RISK_COLOR = {
  HIGH: "text-danger",
  MEDIUM: "text-warn",
  LOW: "text-ok",
};

const SCORE_BAR_COLOR = {
  authority: "bg-danger",
  urgency: "bg-warn",
  payment: "bg-violet",
  confidence: "bg-brand",
};

export default function FraudDNALab() {
  const [form, setForm] = useState({
    phone: "",
    upi: "",
    transcript: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [auditLog, setAuditLog] = useState([]);

  const addLog = (msg) => {
    const ts = new Date().toISOString();
    setAuditLog((prev) => [...prev, `[${ts}] ${msg}`]);
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const generate = async () => {
    if (!form.phone || !form.upi || !form.transcript) return;
    setLoading(true);
    setError(null);
    setResult(null);
    addLog(`DNA_GENERATE phone=${form.phone} upi=${form.upi}`);

    try {
      const payload = {
        ...form,
        latitude: parseFloat(form.latitude) || 28.6,
        longitude: parseFloat(form.longitude) || 77.2,
        city: form.city || "Unknown",
        state: form.state || "Unknown",
      };
      const { data } = await generateDNA(payload);
      setResult(data);
      addLog(`DNA_ID=${data.dna_id} CLUSTER=${data.cluster} RISK=${data.network_risk}`);
      addLog(`SCORES auth=${data.authority_score} urgency=${data.urgency_score} payment=${data.payment_score}`);
      addLog("DNA_COMPLETE status=SUCCESS");
    } catch (e) {
      setError("DNA generation failed. Check backend connection.");
      addLog("ERROR dna_generation_failed");
    } finally {
      setLoading(false);
    }
  };

  const loadDemo = () => {
    setForm({
      phone: "+91-9876543210",
      upi: "fraudster@ybl",
      transcript: "This is Officer Rajesh Verma from CBI headquarters. Your Aadhaar has been linked to a major money laundering case. You are under digital arrest. Do not tell anyone or you will be arrested immediately. Pay ₹3,50,000 bail via UPI within 2 hours.",
      city: "Delhi",
      state: "Delhi",
      latitude: "28.6",
      longitude: "77.2",
    });
  };

  return (
    <div className="p-5 animate-fadeIn">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-sm font-semibold">Fraud DNA Lab</h1>
          <p className="text-[11px] text-tx-muted mt-0.5">
            Generate cryptographic fraud fingerprint · SHA-256 identity · cluster attribution
          </p>
        </div>
        <button className="btn btn-ghost text-xs" onClick={loadDemo}>Load demo</button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Form */}
        <div className="col-span-2 space-y-3">
          <div className="card p-4 space-y-3">
            <div className="card-title">Case Inputs</div>
            <div>
              <div className="label">Phone Number *</div>
              <input className="input" placeholder="+91-XXXXXXXXXX" value={form.phone} onChange={set("phone")} />
            </div>
            <div>
              <div className="label">UPI ID *</div>
              <input className="input" placeholder="suspect@upi" value={form.upi} onChange={set("upi")} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="label">City</div>
                <input className="input" placeholder="Delhi" value={form.city} onChange={set("city")} />
              </div>
              <div>
                <div className="label">State</div>
                <input className="input" placeholder="Delhi" value={form.state} onChange={set("state")} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="label">Latitude</div>
                <input className="input" placeholder="28.6" value={form.latitude} onChange={set("latitude")} />
              </div>
              <div>
                <div className="label">Longitude</div>
                <input className="input" placeholder="77.2" value={form.longitude} onChange={set("longitude")} />
              </div>
            </div>
            <div>
              <div className="label">Call Transcript / Message *</div>
              <textarea
                className="input min-h-[120px] resize-y"
                placeholder="Paste scam transcript here…"
                value={form.transcript}
                onChange={set("transcript")}
              />
            </div>
            <button
              className="btn btn-primary w-full"
              onClick={generate}
              disabled={loading || !form.phone || !form.upi || !form.transcript}
            >
              {loading ? <Spinner size="sm" /> : <MdBiotech />}
              {loading ? "Generating DNA…" : "Generate Fraud DNA"}
            </button>
          </div>

          {auditLog.length > 0 && (
            <div className="card p-4">
              <div className="card-title">Audit Log</div>
              <AuditLog entries={auditLog} />
            </div>
          )}
        </div>

        {/* Results */}
        <div className="col-span-3 space-y-3">
          {error && <ErrorBanner message={error} />}

          {!result && !loading && (
            <div className="card p-10 text-center space-y-2">
              <MdBiotech className="text-5xl text-tx-dim mx-auto" />
              <p className="text-xs text-tx-muted">Fill in the case details and generate a Fraud DNA fingerprint</p>
            </div>
          )}

          {loading && (
            <div className="card p-10 flex flex-col items-center gap-3">
              <Spinner />
              <p className="text-xs text-tx-muted">Hashing identity · running pattern analysis…</p>
            </div>
          )}

          {result && (
            <div className="space-y-3 animate-slideUp">
              {/* DNA Identity Card */}
              <div className="card p-5 border border-brand-border bg-brand-bg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="card-title">Fraud DNA Identity</div>
                    <div className="text-2xl font-black mono text-brand">{result.dna_id}</div>
                  </div>
                  <div className="text-right">
                    <div className="card-title">Network Risk</div>
                    <div className={`text-xl font-black ${RISK_COLOR[result.network_risk] ?? "text-tx"}`}>
                      {result.network_risk}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="kv flex-col items-start border-0 pb-0">
                    <span className="kv-k mb-0.5">Cluster</span>
                    <span className="mono font-bold text-violet">{result.cluster}</span>
                  </div>
                  <div className="kv flex-col items-start border-0 pb-0">
                    <span className="kv-k mb-0.5">Fraud Type</span>
                    <span className="font-medium">{result.fraud_type}</span>
                  </div>
                  <div className="kv flex-col items-start border-0 pb-0">
                    <span className="kv-k mb-0.5">Generated</span>
                    <span className="mono text-[10px]">
                      {result.generated_at ? new Date(result.generated_at).toLocaleTimeString() : "—"}
                    </span>
                  </div>
                </div>
                {result.case_id && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <span className="text-[10px] text-tx-muted">Case ID: </span>
                    <span className="mono text-[10px] text-brand">CASE-{result.case_id}</span>
                  </div>
                )}
              </div>

              {/* Score Bars */}
              <div className="card p-4 space-y-4">
                <div className="card-title">Threat Indicator Scores</div>
                <ScoreBar label="Authority Impersonation Score" value={result.authority_score} color="bg-danger" />
                <ScoreBar label="Urgency / Fear Score" value={result.urgency_score} color="bg-warn" />
                <ScoreBar label="Payment Demand Score" value={result.payment_score} color="bg-violet" />
                <ScoreBar label="Overall Confidence Score" value={result.confidence_score} color="bg-brand" />
              </div>

              {/* Score Grid */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Authority", value: result.authority_score, color: "text-danger" },
                  { label: "Urgency", value: result.urgency_score, color: "text-warn" },
                  { label: "Payment", value: result.payment_score, color: "text-violet" },
                  { label: "Confidence", value: result.confidence_score, color: "text-brand" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="card p-3 text-center">
                    <div className="card-title text-center">{label}</div>
                    <div className={`text-2xl font-black mono ${color}`}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Intelligence Summary */}
              {result.intelligence_summary && (
                <div className="card p-4">
                  <div className="card-title">Intelligence Summary</div>
                  <p className="text-xs leading-relaxed text-tx">
                    {typeof result.intelligence_summary === "string"
                      ? result.intelligence_summary
                      : Array.isArray(result.intelligence_summary)
                      ? result.intelligence_summary.join(" · ")
                      : JSON.stringify(result.intelligence_summary)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
