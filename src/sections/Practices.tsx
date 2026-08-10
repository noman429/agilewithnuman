import { useState } from 'react';
import type { Theme } from '../data/theme';
import { METHOD_DATA, COMPARISON_DATA } from '../data/methodologies';

export default function Practices({ theme }: { theme: Theme }) {
  const [openMethod, setOpenMethod] = useState<number | null>(null);
  const [comparisonsExpanded, setComparisonsExpanded] = useState(false);

  const comparisonsCap = 3;
  const comparisons = comparisonsExpanded ? COMPARISON_DATA : COMPARISON_DATA.slice(0, comparisonsCap);

  return (
    <>
      <section id="practices" style={{ padding: '96px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div className="reveal sec-eyebrow" style={{ marginBottom: 14, color: '#22c55e' }}>
          <span style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>Knowledge Hub</span>
        </div>
        <h2 className="reveal sec-heading" style={{ marginBottom: 8, color: theme.text }}>Delivery frameworks, explained.</h2>
        <div className="sec-underline head-green-cyan" />
        <p style={{ fontSize: 14.5, color: theme.muted, margin: '0 0 28px', maxWidth: 640 }}>
          Click any framework card to expand: roles, artifacts, workflow, and trade-offs.
        </p>

        <a
          href="#project-lifecycle"
          aria-label="Jump to the interactive project management lifecycle flowchart"
          className="card"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) auto',
            gap: 20,
            alignItems: 'center',
            padding: '22px',
            marginBottom: 18,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(91,124,250,.12), rgba(155,107,250,.08) 48%, rgba(34,197,94,.07))',
            color: theme.text,
            textDecoration: 'none',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: '#7b93ff' }}>Interactive flowchart</span>
              <span style={{ fontSize: 10, color: theme.muted }}>5 connected phases</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-.01em' }}>Project Management Lifecycle</div>
            <p style={{ margin: '7px 0 14px', maxWidth: 760, fontSize: 13, lineHeight: 1.55, color: theme.muted }}>
              A concise visual flow from Initiation to Closure. Click any activity, deliverable, stakeholder, or approval to open the detail.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {['Initiate', 'Plan', 'Execute', 'Monitor & Control', 'Close'].map((step, index) => (
                <span key={step} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 10.5, fontWeight: 700, color: index === 3 ? '#22c55e' : theme.muted }}>
                  {index > 0 && <span aria-hidden="true" style={{ opacity: .42 }}>→</span>}
                  {step}
                </span>
              ))}
            </div>
          </div>
          <span aria-hidden="true" style={{ width: 42, height: 42, borderRadius: 13, display: 'grid', placeItems: 'center', background: 'rgba(91,124,250,.14)', color: '#7b93ff', fontSize: 20 }}>↓</span>
        </a>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {METHOD_DATA.map((m, i) => {
            const open = openMethod === i;
            return (
              <div key={m.name} className="card" style={{ background: theme.card, border: `1px solid ${theme.cardBorder}`, borderRadius: 14, overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenMethod(open ? null : i)}
                  style={{ width: '100%', textAlign: 'left', padding: '17px 22px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: theme.text }}
                >
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 16.5 }}>{m.name}</span>
                    <span style={{ fontSize: 13, color: theme.muted, marginLeft: 12 }}>{m.tagline}</span>
                  </div>
                  <span style={{ fontSize: 18, color: '#5b7cfa' }}>{open ? '−' : '+'}</span>
                </button>
                {open && (
                  <div className="method-detail-grid" style={{ padding: '0 22px 22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div>
                      <p style={{ fontSize: 13.5, lineHeight: 1.55, color: theme.muted, margin: '0 0 12px' }}>{m.intro}</p>
                      <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9b6bfa', marginBottom: 6 }}>Roles</div>
                      <div style={{ fontSize: 13, color: theme.muted, marginBottom: 12 }}>{m.roles.join(', ')}</div>
                      <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9b6bfa', marginBottom: 6 }}>Artifacts</div>
                      <div style={{ fontSize: 13, color: theme.muted }}>{m.artifacts.join(', ')}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9b6bfa', marginBottom: 6 }}>Workflow</div>
                      <div style={{ fontSize: 13, color: theme.muted, marginBottom: 12 }}>{m.workflow}</div>
                      <div className="pros-cons-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 11.5, fontWeight: 700, color: '#22c55e', marginBottom: 4 }}>Pros</div>
                          <div style={{ fontSize: 12.5, color: theme.muted }}>{m.pros.join(', ')}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11.5, fontWeight: 700, color: '#f45fb0', marginBottom: 4 }}>Cons</div>
                          <div style={{ fontSize: 12.5, color: theme.muted }}>{m.cons.join(', ')}</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: theme.muted, marginTop: 12 }}>Best for: <strong style={{ color: theme.text }}>{m.bestFor}</strong></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section id="comparisons-anchor" style={{ padding: '0 40px', maxWidth: 1200, margin: '0 auto' }}>
        <h3 style={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.01em', margin: '52px 0 22px' }}>Head-to-head comparisons</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 18 }}>
          {comparisons.map((comp) => (
            <div key={comp.a + comp.b} className="card" style={{ background: theme.card, border: `1px solid ${theme.cardBorder}`, borderRadius: 14, padding: '26px 0 4px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, padding: '0 22px 22px' }}>
                <span style={{ fontSize: 15, fontWeight: 700, padding: '9px 18px', borderRadius: 999, background: 'rgba(91,124,250,0.16)', color: '#5b7cfa' }}>{comp.a}</span>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: theme.muted, letterSpacing: '0.08em' }}>VS</span>
                <span style={{ fontSize: 15, fontWeight: 700, padding: '9px 18px', borderRadius: 999, background: 'rgba(244,95,176,0.16)', color: '#f45fb0' }}>{comp.b}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '0.85fr 1fr 1fr', position: 'sticky', top: 0, background: theme.card, borderTop: '1px solid rgba(127,127,127,0.16)', borderBottom: '1px solid rgba(127,127,127,0.16)' }}>
                <div style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: theme.muted }}>Criteria</div>
                <div style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#5b7cfa', background: 'rgba(91,124,250,0.07)' }}>{comp.a}</div>
                <div style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#f45fb0', background: 'rgba(244,95,176,0.07)' }}>{comp.b}</div>
              </div>
              {comp.rows.map((r) => (
                <div key={r.aspect} className="comp-row" style={{ display: 'grid', gridTemplateColumns: '0.85fr 1fr 1fr', borderBottom: '1px solid rgba(127,127,127,0.12)' }}>
                  <div style={{ padding: 16, fontSize: 15, fontWeight: 500, color: theme.muted, display: 'flex', alignItems: 'center', lineHeight: 1.5 }}>{r.aspect}</div>
                  <div style={{ padding: 16, fontSize: 15, fontWeight: 700, background: 'rgba(91,124,250,0.05)', display: 'flex', alignItems: 'center', lineHeight: 1.5 }}>{r.left}</div>
                  <div style={{ padding: 16, fontSize: 15, fontWeight: 700, background: 'rgba(244,95,176,0.05)', display: 'flex', alignItems: 'center', lineHeight: 1.5 }}>{r.right}</div>
                </div>
              ))}
              <div style={{ height: 8 }} />
            </div>
          ))}
        </div>
        {COMPARISON_DATA.length > comparisonsCap && (
          <button
            onClick={() => setComparisonsExpanded((v) => !v)}
            style={{ marginTop: 16, fontSize: 13, fontWeight: 600, padding: '9px 18px', borderRadius: 9, border: `1px solid ${theme.cardBorder}`, background: theme.card, color: theme.text, cursor: 'pointer' }}
          >
            {comparisonsExpanded ? 'Show fewer' : `Show all ${COMPARISON_DATA.length}`}
          </button>
        )}
      </section>
    </>
  );
}
