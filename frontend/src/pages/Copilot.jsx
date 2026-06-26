import { useState, useRef, useEffect } from 'react'
import { MdSend, MdSmartToy, MdPerson, MdAutoAwesome } from 'react-icons/md'
import { queryCopilot } from '../services/api'
import { PageWrapper, Card, SectionHeader, Spinner, Alert } from '../components/common'

const SUGGESTED = [
  'Show recent UPI fraud patterns in Delhi',
  'What are the top fraud DNA markers for digital arrest scams?',
  'Summarize suspect cluster C-7 activity',
  'What evidence is needed for KYC impersonation cases?',
]

function Message({ role, content, loading }) {
  const isUser = role === 'user'
  return (
    <div style={{
      display: 'flex', gap: 10,
      alignItems: 'flex-start',
      flexDirection: isUser ? 'row-reverse' : 'row',
    }}>
      {/* Avatar */}
      <div style={{
        width: 28, height: 28, borderRadius: 'var(--radius-sm)', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isUser ? 'var(--color-accent-dim)' : 'var(--color-elevated)',
        border: `1px solid ${isUser ? 'var(--color-accent-border)' : 'var(--color-border)'}`,
        color: isUser ? 'var(--color-accent)' : 'var(--color-text-muted)',
      }}>
        {isUser
          ? <MdPerson    style={{ fontSize: 15 }} />
          : <MdSmartToy  style={{ fontSize: 15 }} />
        }
      </div>

      {/* Bubble */}
      <div style={{
        maxWidth: '72%', padding: '10px 14px', borderRadius: 'var(--radius-md)',
        background: isUser ? 'var(--color-accent-dim)' : 'var(--color-elevated)',
        border: `1px solid ${isUser ? 'var(--color-accent-border)' : 'var(--color-border)'}`,
        color: isUser ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
        fontSize: '0.875rem', lineHeight: 1.6,
      }}>
        {loading
          ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Spinner size="sm" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                THINKING...
              </span>
            </div>
          )
          : content
        }
      </div>
    </div>
  )
}

export default function Copilot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "I'm your AI Investigator Copilot. Ask me about cases, fraud patterns, suspect clusters, or evidence requirements." },
  ])
  const [query, setQuery]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const bottomRef             = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const q = (text ?? query).trim()
    if (!q || loading) return
    setQuery(''); setError('')
    setMessages(prev => [...prev, { role: 'user', content: q }])
    setLoading(true)
    try {
      const { data } = await queryCopilot(q)
      const reply = data?.response ?? data?.answer ?? data?.result ?? JSON.stringify(data)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setError('Copilot unavailable. Ensure the backend is running on port 8000.')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <PageWrapper>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <SectionHeader
          title="AI Investigator Copilot"
          subtitle="Ask about cases, fraud patterns, suspect clusters, or evidence requirements"
          badge="AI POWERED"
        />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px',
          borderRadius: 'var(--radius-sm)', background: 'var(--color-success-dim)',
          border: '1px solid rgba(34,197,94,0.2)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)', animation: 'pulse 2s infinite' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', color: 'var(--color-success)', letterSpacing: '0.1em' }}>
            ONLINE
          </span>
        </div>
      </div>

      {/* Suggested queries */}
      {messages.length === 1 && (
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-muted)', marginBottom: 8 }}>
            Suggested queries
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {SUGGESTED.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                style={{
                  padding: '6px 14px', borderRadius: 99,
                  background: 'var(--color-elevated)', border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem', cursor: 'pointer',
                  transition: 'border-color var(--transition), color var(--transition)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent-border)'; e.currentTarget.style.color = 'var(--color-accent)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-secondary)' }}
              >
                <MdAutoAwesome style={{ fontSize: 10, marginRight: 5, verticalAlign: 'middle' }} />
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat window */}
      <Card style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 420, overflow: 'hidden' }}>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '20px',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          {messages.map((m, i) => (
            <Message key={i} role={m.role} content={m.content} />
          ))}
          {loading && <Message role="assistant" content="" loading />}
          <div ref={bottomRef} />
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: '0 20px 10px' }}>
            <Alert type="danger">{error}</Alert>
          </div>
        )}

        {/* Input row */}
        <div style={{
          padding: '12px 20px', borderTop: '1px solid var(--color-border)',
          display: 'flex', gap: 8, alignItems: 'flex-end',
          background: 'var(--color-card)', flexShrink: 0,
        }}>
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKey}
            placeholder="Ask about a case, fraud type, suspect, or investigation…"
            rows={1}
            style={{
              flex: 1, background: 'var(--color-elevated)',
              border: '1px solid var(--color-border-md)',
              borderRadius: 'var(--radius-sm)', padding: '9px 12px',
              fontSize: '0.875rem', fontFamily: 'var(--font-sans)',
              color: 'var(--color-text-primary)', resize: 'none', outline: 'none',
              lineHeight: 1.5, transition: 'border-color var(--transition)',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--color-border-md)'}
          />
          <button
            onClick={() => send()}
            disabled={!query.trim() || loading}
            style={{
              width: 36, height: 36, flexShrink: 0,
              borderRadius: 'var(--radius-sm)',
              background: (!query.trim() || loading) ? 'var(--color-elevated)' : 'var(--color-accent)',
              border: `1px solid ${(!query.trim() || loading) ? 'var(--color-border)' : 'var(--color-accent)'}`,
              color: (!query.trim() || loading) ? 'var(--color-text-muted)' : '#fff',
              cursor: (!query.trim() || loading) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background var(--transition), border-color var(--transition)',
            }}
          >
            {loading ? <Spinner size="sm" /> : <MdSend style={{ fontSize: 15 }} />}
          </button>
        </div>
      </Card>
    </PageWrapper>
  )
}
