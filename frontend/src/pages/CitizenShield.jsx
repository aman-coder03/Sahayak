import { useState } from 'react'
import { MdShield, MdWarning, MdCheckCircle, MdInfo } from 'react-icons/md'
import { analyzeShield } from '../services/api'
import {
  SectionHeader, Card, RiskBadge, CmdButton, CmdTextarea,
  ScoreBar, Alert, PageWrapper
} from '../components/common'

const SAMPLE_MSGS = [
  {
    label: 'FedEx Scam SMS',
    text: 'URGENT: Your FedEx package has been seized at customs. Illegal goods detected. You must pay Rs 5000 immediately to avoid arrest. Call: 9876543210. CBI Officer Sharma.',
  },
  {
    label: 'KYC Freeze',
    text: 'Dear customer, your bank account will be blocked in 24 hours due to incomplete KYC. Click here to update immediately: bit.ly/kyc-update or call 1800-XXX-XXXX.',
  },
]

export default function CitizenShield() {
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const analyze = async () => {
    if (!message.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const { data } = await analyzeShield(message)
      setResult(data)
    } catch {
      setError('Analysis failed. Ensure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const riskLevel = result
    ? result.risk_score >= 75
      ? 'HIGH'
      : result.risk_score >= 40
      ? 'MEDIUM'
      : 'LOW'
    : null

  const riskColor = riskLevel === 'HIGH' ? 'danger' : riskLevel === 'MEDIUM' ? 'warn' : 'success'

  return (
    <PageWrapper>
      <div>
        <SectionHeader
          title="Citizen Fraud Shield"
          subtitle="Paste any suspicious SMS, WhatsApp message, or call transcript for AI-powered analysis"
          badge="AI POWERED"
        />
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Input panel */}
        <Card className="col-span-2 p-5 space-y-4">
          <div>
            <div className="text-xs font-mono text-cmd-subtext uppercase tracking-widest mb-3">
              Quick Load Sample
            </div>
            <div className="flex flex-col gap-2">
              {SAMPLE_MSGS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setMessage(s.text)}
                  className="text-left text-xs font-mono px-3 py-2 bg-cmd-bg border border-cmd-border rounded hover:border-cmd-accent/30 hover:text-cmd-accent text-cmd-subtext transition-colors"
                >
                  ▸ {s.label}
                </button>
              ))}
            </div>
          </div>

          <CmdTextarea
            label="Message / Transcript"
            placeholder="Paste suspicious SMS, WhatsApp message, or call transcript here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={10}
          />

          <CmdButton onClick={analyze} loading={loading} disabled={!message.trim()} className="w-full justify-center">
            <MdShield />
            Analyze Threat
          </CmdButton>

          {error && <Alert type="danger">{error}</Alert>}
        </Card>

        {/* Results panel */}
        <div className="col-span-3 space-y-4">
          {!result && !loading && (
            <Card className="p-10 flex flex-col items-center justify-center text-center h-full min-h-64">
              <MdShield className="text-5xl text-cmd-muted mb-4" />
              <div className="text-cmd-subtext text-sm">
                Paste a message and click Analyze to begin threat assessment
              </div>
            </Card>
          )}

          {loading && (
            <Card className="p-10 flex flex-col items-center justify-center h-full min-h-64">
              <div className="w-12 h-12 border-2 border-cmd-border border-t-cmd-accent rounded-full animate-spin mb-4" />
              <div className="text-cmd-subtext text-sm font-mono">ANALYZING THREAT VECTORS...</div>
            </Card>
          )}

          {result && (
            <>
              {/* Risk score hero */}
              <Card className={`p-5 border ${riskColor === 'danger' ? 'border-cmd-danger/30 glow-border-danger' : riskColor === 'warn' ? 'border-cmd-warn/30 glow-border-warn' : 'border-cmd-success/30 glow-border-success'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs font-mono text-cmd-subtext uppercase tracking-widest mb-1">
                      Threat Assessment
                    </div>
                    <div className="text-4xl font-bold font-mono text-cmd-text">
                      {result.risk_score}
                      <span className="text-lg text-cmd-subtext ml-1">/100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {riskLevel === 'HIGH' ? (
                      <MdWarning className="text-5xl text-cmd-danger mb-2 ml-auto" />
                    ) : riskLevel === 'MEDIUM' ? (
                      <MdInfo className="text-5xl text-cmd-warn mb-2 ml-auto" />
                    ) : (
                      <MdCheckCircle className="text-5xl text-cmd-success mb-2 ml-auto" />
                    )}
                    <RiskBadge level={riskLevel} />
                  </div>
                </div>
                <div className="h-2 bg-cmd-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      riskColor === 'danger' ? 'bg-cmd-danger' : riskColor === 'warn' ? 'bg-cmd-warn' : 'bg-cmd-success'
                    }`}
                    style={{ width: `${result.risk_score}%` }}
                  />
                </div>
                {result.verdict && (
                  <div className="mt-3 text-sm text-cmd-text font-mono">
                    <span className="text-cmd-subtext">VERDICT: </span>
                    {result.verdict}
                  </div>
                )}
              </Card>

              {/* Fraud DNA */}
              {result.fraud_dna && (
                <Card className="p-5">
                  <SectionHeader title="Fraud DNA Markers" />
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(result.fraud_dna)
                      ? result.fraud_dna.map((dna, i) => (
                          <span
                            key={i}
                            className="text-xs font-mono px-3 py-1 bg-cmd-accent/10 border border-cmd-accent/20 rounded-full text-cmd-accent"
                          >
                            {dna}
                          </span>
                        ))
                      : Object.entries(result.fraud_dna).map(([k, v]) => (
                          <span
                            key={k}
                            className="text-xs font-mono px-3 py-1 bg-cmd-accent/10 border border-cmd-accent/20 rounded-full text-cmd-accent"
                          >
                            {k}: {v}
                          </span>
                        ))}
                  </div>
                </Card>
              )}

              {/* Reasons */}
              {result.reasons && result.reasons.length > 0 && (
                <Card className="p-5">
                  <SectionHeader title="Threat Indicators" />
                  <div className="space-y-2">
                    {result.reasons.map((r, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 px-3 py-2 bg-cmd-bg border border-cmd-border rounded text-sm font-mono"
                      >
                        <span className="text-cmd-danger mt-0.5 flex-shrink-0">◈</span>
                        <span className="text-cmd-text">{r}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Advisory */}
              {result.advisory && (
                <Alert type={riskColor === 'danger' ? 'danger' : riskColor === 'warn' ? 'warn' : 'success'}>
                  <div className="font-bold mb-1">ADVISORY</div>
                  {result.advisory}
                </Alert>
              )}
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}