import { useState } from 'react'
import { MdShield, MdWarning, MdCheckCircle, MdInfo } from 'react-icons/md'
import { analyzeShield } from '../services/api'
import {
  SectionHeader, Card, RiskBadge, CmdButton, CmdTextarea,
  Alert, PageWrapper, ScoreBar,
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

const RISK_BAR_COLOR = {
  HIGH:   'var(--color-danger)',
  MEDIUM: 'var(--color-warning)',
  LOW:    'var(--color-success)',
}
const RISK_BORDER = {
  HIGH:   'rgba(239,68,68,0.3)',
  MEDIUM: 'rgba(245,158,11,0.3)',
  LOW:    'rgba(34,197,94,0.3)',
}

export default function CitizenShield() {
  const [message, setMessage] = useState('')
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const analyze = async () => {
    if (!message.trim()) return
    setLoading(true); setError(''); setResult(null)
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
    ? result.risk_score >= 75 ? 'HIGH' : result.risk_score >= 40 ? 'MEDIUM' : 'LOW'
    : null

  return (
    <PageWrapper>
      <SectionHeader
        title="Citizen Fraud Shield"
        subtitle="Paste any suspicious SMS, WhatsApp message, or call transcript for AI-powered analysis"
        badge="AI POWERED"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 12 }}>

        {/* ── Input panel ── */}
        <Card style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Samples */}
          <div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.5625rem',
              textTransform: 'uppercase', letterSpacing: '0.12em',
              color: 'var(--color-text-muted)', marginBottom: 8,
            }}>
              Quick Load Sample
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SAMPLE_MSGS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setMessage(s.text)}
                  style={{
                    textAlign: 'left', padding: '7px 12px',
                    background: 'var(--color-elevated)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-secondary)',
                    fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                    cursor: 'pointer',
                    transition: 'border-color var(--transition), color var(--transition)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent-border)'; e.currentTarget.style.color = 'var(--color-accent)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-secondary)' }}
                >
                  ▸ {s.label}
                </button>
              ))}
            </div>
          </div>

          <CmdTextarea
            label="Message / Transcript"
            placeholder="Paste suspicious SMS, WhatsApp message, or call transcript here…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={10}
          />

          <CmdButton onClick={analyze} loading={loading} disabled={!message.trim()} style={{ width: '100%' }}>
            <MdShield style={{ fontSize: 15 }} />
            Analyze Threat
          </CmdButton>

          {error && <Alert type="danger">{error}</Alert>}
        </Card>

        {/* ── Results panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Empty state */}
          {!result && !loading && (
            <Card style={{
              padding: 48, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', flex: 1, minHeight: 220,
            }}>
              <MdShield style={{ fontSize: 44, color: 'var(--color-text-muted)', marginBottom: 12 }} />
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                Paste a message and click Analyze to begin threat assessment
              </div>
            </Card>
          )}

          {/* Loading */}
          {loading && (
            <Card style={{
              padding: 48, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              flex: 1, minHeight: 220, gap: 14,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                border: '2px solid var(--color-border-md)',
                borderTopColor: 'var(--color-accent)',
                animation: 'spin 0.7s linear infinite',
              }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-muted)', letterSpacing: '0.12em' }}>
                ANALYZING THREAT VECTORS...
              </div>
            </Card>
          )}

          {/* Results */}
          {result && (
            <>
              {/* Risk score hero */}
              <Card style={{ padding: 20, borderColor: RISK_BORDER[riskLevel] ?? 'var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-muted)', marginBottom: 8 }}>
                      Threat Assessment
                    </div>
                    <div style={{
                      fontSize: '2.5rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
                      color: 'var(--color-text-primary)', lineHeight: 1, letterSpacing: '-0.03em',
                    }}>
                      {result.risk_score}
                      <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginLeft: 4 }}>/100</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    {riskLevel === 'HIGH'
                      ? <MdWarning    style={{ fontSize: 38, color: 'var(--color-danger)'  }} />
                      : riskLevel === 'MEDIUM'
                      ? <MdInfo       style={{ fontSize: 38, color: 'var(--color-warning)' }} />
                      : <MdCheckCircle style={{ fontSize: 38, color: 'var(--color-success)' }} />
                    }
                    <RiskBadge level={riskLevel} />
                  </div>
                </div>
                <ScoreBar value={result.risk_score} color={RISK_BAR_COLOR[riskLevel] ?? 'var(--color-accent)'} />
                {result.verdict && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-text-primary)', marginTop: 12 }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>VERDICT: </span>
                    {result.verdict}
                  </div>
                )}
              </Card>

              {/* Fraud DNA markers */}
              {result.fraud_dna && (
                <Card style={{ padding: 18 }}>
                  <SectionHeader title="Fraud DNA Markers" />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {(Array.isArray(result.fraud_dna)
                      ? result.fraud_dna.map((dna, i) => ({ key: i, label: dna }))
                      : Object.entries(result.fraud_dna).map(([k, v]) => ({ key: k, label: `${k}: ${v}` }))
                    ).map(({ key, label }) => (
                      <span key={key} style={{
                        padding: '4px 12px', borderRadius: 99,
                        background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)',
                        color: 'var(--color-accent)', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem',
                      }}>
                        {label}
                      </span>
                    ))}
                  </div>
                </Card>
              )}

              {/* Threat indicators */}
              {result.reasons?.length > 0 && (
                <Card style={{ padding: 18 }}>
                  <SectionHeader title="Threat Indicators" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {result.reasons.map((r, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '8px 12px', background: 'var(--color-elevated)',
                        border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)',
                        fontFamily: 'var(--font-mono)', fontSize: '0.8125rem',
                      }}>
                        <span style={{ color: 'var(--color-danger)', flexShrink: 0, marginTop: 1 }}>◈</span>
                        <span style={{ color: 'var(--color-text-primary)' }}>{r}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Advisory */}
              {result.advisory && (
                <Alert type={riskLevel === 'HIGH' ? 'danger' : riskLevel === 'MEDIUM' ? 'warn' : 'success'}>
                  <div style={{ fontWeight: 700, marginBottom: 4, fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.12em' }}>
                    ADVISORY
                  </div>
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
