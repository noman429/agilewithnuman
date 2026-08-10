import { useMemo, useState } from 'react';
import type { Theme } from '../data/theme';
import { AGILE_SUBGROUPS, CATEGORY_META, DOC_DATA, buildDocDetail } from '../data/docs';
import { getAgileEnhancement } from '../data/agileEnhancements';
import { CATEGORY_COPY, getDocEnhancement } from '../data/docEnhancements';
import { highlightMatch } from '../utils';

const getSummary = (name: string, category: string, fallback: string) =>
  category === 'Agile Artifacts' ? fallback : getDocEnhancement(name)?.summary ?? fallback;

export default function Docs({ theme }: { theme: Theme }) {
  const [docSearch, setDocSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [detailDocName, setDetailDocName] = useState<string | null>(null);

  const dq = docSearch.trim().toLowerCase();
  const isSearching = !!dq;
  const catScoped = catFilter === 'All' ? DOC_DATA : DOC_DATA.filter((d) => d.category === catFilter);

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    return catScoped.filter((d) => {
      const standardEnhancement = d.category === 'Agile Artifacts' ? undefined : getDocEnhancement(d.name);
      const agileEnhancement = d.category === 'Agile Artifacts' ? getAgileEnhancement(d.name) : undefined;
      const searchable = [
        d.name,
        d.category,
        d.oneLiner,
        standardEnhancement?.summary,
        standardEnhancement?.definition,
        standardEnhancement?.why,
        standardEnhancement?.example,
        standardEnhancement?.related,
        agileEnhancement?.definition,
        agileEnhancement?.why,
        agileEnhancement?.owner,
        agileEnhancement?.inputs,
        agileEnhancement?.outputs,
        agileEnhancement?.example,
        agileEnhancement?.bestPractice,
        agileEnhancement?.commonMistake,
        ...(agileEnhancement?.related || []),
        ...(agileEnhancement?.interview || []),
      ].filter(Boolean).join(' ').toLowerCase();
      return searchable.includes(dq);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dq, catFilter]);

  const categoryList = CATEGORY_META.filter((c) => catFilter === 'All' || catFilter === c.id).map((c) => {
    const docs = catScoped.filter((d) => d.category === c.id);
    const open = openCategory === c.id;
    const hasSubgroups = docs.some((d) => d.subgroup);
    const groups = hasSubgroups
      ? AGILE_SUBGROUPS.filter((sg) => docs.some((d) => d.subgroup === sg.id)).map((sg) => ({ label: sg.label, docs: docs.filter((d) => d.subgroup === sg.id) }))
      : [{ label: null as string | null, docs }];
    const desc = c.id === 'Agile Artifacts' ? c.desc : CATEGORY_COPY[c.id] ?? c.desc;
    return { ...c, desc, count: docs.length, groups, open };
  });

  const detailDocRaw = detailDocName ? DOC_DATA.find((d) => d.name === detailDocName) : null;
  const detailDoc = detailDocRaw ? buildDocDetail(detailDocRaw) : null;
  const detailEnhancement = detailDocRaw && detailDocRaw.category !== 'Agile Artifacts'
    ? getDocEnhancement(detailDocRaw.name)
    : undefined;
  const agileEnhancement = detailDocRaw && detailDocRaw.category === 'Agile Artifacts'
    ? getAgileEnhancement(detailDocRaw.name)
    : undefined;

  const closeDocDetail = () => setDetailDocName(null);

  return (
    <section id="docs" style={{ padding: '96px 40px', maxWidth: 1200, margin: '0 auto' }}>
      <div className="reveal sec-eyebrow" style={{ marginBottom: 14, color: '#5b7cfa' }}>
        <span style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700 }}>Documentation Library</span>
      </div>
      <h2 className="reveal sec-heading" style={{ color: theme.text }}>A structured knowledge base, not a pile of files.</h2>
      <div className="sec-underline head-cyan-blue" style={{ marginBottom: 16 }} />
      <p style={{ fontSize: 14.5, color: theme.muted, margin: '0 0 26px', maxWidth: 720, lineHeight: 1.65 }}>
        Explore practical delivery artifacts with concise definitions, ownership context, and realistic examples showing what each document looks like in an actual software project.
      </p>

      <input
        value={docSearch}
        onInput={(e) => setDocSearch((e.target as HTMLInputElement).value)}
        placeholder="Search documents (e.g. risk, story, diagram)..."
        style={{ width: '100%', maxWidth: 440, padding: '12px 16px', borderRadius: 10, border: `1px solid ${theme.cardBorder}`, background: theme.card, color: theme.text, fontSize: 14, outline: 'none', marginBottom: 16 }}
      />

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {['All', ...CATEGORY_META.map((c) => c.id)].map((id) => {
          const active = catFilter === id;
          const label = id === 'All' ? 'All' : id.split(' & ')[0];
          return (
            <button
              key={id}
              className="chip"
              onClick={() => setCatFilter(id)}
              style={{
                fontSize: 12.5, fontWeight: 600, padding: '8px 15px', borderRadius: 999,
                border: `1px solid ${active ? 'transparent' : theme.cardBorder}`,
                background: active ? 'linear-gradient(90deg,#5b7cfa,#9b6bfa)' : theme.card,
                color: active ? '#ffffff' : theme.text, cursor: 'pointer',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {isSearching && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 14 }}>
            {searchResults.map((d) => {
              const summary = getSummary(d.name, d.category, d.oneLiner);
              return (
                <div key={d.name} className="doc-card2" onClick={() => setDetailDocName(d.name)} style={{ background: theme.card, border: `1px solid ${theme.cardBorder}`, borderRadius: 12, padding: '16px 18px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9b6bfa', marginBottom: 6 }}>{d.category}</div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 4 }}>{highlightMatch(d.name, dq)}</div>
                  <div style={{ fontSize: 12, color: theme.muted, lineHeight: 1.55 }}>{highlightMatch(summary, dq)}</div>
                </div>
              );
            })}
          </div>
          {searchResults.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: theme.muted, fontSize: 14 }}>No documents match "{docSearch}".</div>
          )}
        </>
      )}

      {!isSearching && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {categoryList.map((cat) => (
            <div key={cat.id}>
              <div
                className="acc-header"
                onClick={() => setOpenCategory(cat.open ? null : cat.id)}
                style={{
                  cursor: 'pointer', padding: '22px 26px', borderRadius: 16, background: theme.card,
                  borderTop: `1px solid ${theme.cardBorder}`, borderRight: `1px solid ${theme.cardBorder}`, borderBottom: `1px solid ${theme.cardBorder}`,
                  borderLeft: `3px solid ${cat.accent}`, display: 'flex', alignItems: 'center', gap: 18,
                }}
              >
                <div className="acc-title-wrap" style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-0.01em', color: theme.text }}>{cat.id}</div>
                  <div style={{ fontSize: 13.5, color: theme.muted, marginTop: 6, lineHeight: 1.55 }}>{cat.desc}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme.muted, whiteSpace: 'nowrap' }}>{cat.count} Documents</div>
                <div className={`acc-chevron${cat.open ? ' open' : ''}`} style={{ fontSize: 16, color: theme.muted }}>⌄</div>
              </div>
              <div style={{ display: 'grid', gridTemplateRows: cat.open ? '1fr' : '0fr', transition: 'grid-template-rows .45s cubic-bezier(.4,0,.2,1), opacity .35s ease', opacity: cat.open ? 1 : 0 }}>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '18px 4px 6px' }}>
                    {cat.groups.map((grp, gi) => (
                      <div key={grp.label ?? gi} style={{ marginBottom: 22 }}>
                        {grp.label && (
                          <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: cat.accent, margin: '0 0 12px' }}>{grp.label}</div>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
                          {grp.docs.map((d, di) => (
                            <div
                              key={d.name}
                              className="doc-card2 reveal"
                              style={{ animationDelay: `${di * 0.04}s`, background: theme.card, border: `1px solid ${theme.cardBorder}`, borderRadius: 12, padding: '16px 18px' }}
                              onClick={() => setDetailDocName(d.name)}
                            >
                              <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 5 }}>{d.name}</div>
                              <div style={{ fontSize: 12, color: theme.muted, lineHeight: 1.55 }}>{getSummary(d.name, d.category, d.oneLiner)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {detailDoc && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={closeDocDetail} style={{ position: 'absolute', inset: 0, background: 'rgba(5,6,14,0.6)', backdropFilter: 'blur(4px)' }} />
          <div className="modal-pop" style={{ position: 'relative', maxWidth: 640, width: '100%', maxHeight: '84vh', overflowY: 'auto', background: theme.card, border: `1px solid ${theme.cardBorder}`, borderRadius: 20, padding: 32, boxShadow: '0 30px 80px -20px rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)' }}>
            <button onClick={closeDocDetail} style={{ position: 'absolute', top: 18, right: 18, width: 32, height: 32, borderRadius: '50%', border: `1px solid ${theme.cardBorder}`, background: theme.bg2, color: theme.text, cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#9b6bfa', marginBottom: 8 }}>{detailDoc.category}</div>
            <h3 style={{ fontSize: 23, fontWeight: 800, margin: '0 0 18px', paddingRight: 42 }}>{detailDoc.name}</h3>

            {detailDoc.isAgile && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Field label="Definition" value={agileEnhancement?.definition ?? detailDoc.definition} color={theme.text} muted={theme.muted} />
                <Field label="Why it matters" value={agileEnhancement?.why ?? detailDoc.why} color={theme.muted} muted={theme.muted} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Owner / accountability" value={agileEnhancement?.owner ?? detailDoc.owner} small color={theme.text} muted={theme.muted} />
                  <Field label="Real-world example" value={agileEnhancement?.example ?? detailDoc.example} small color={theme.muted} muted={theme.muted} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Inputs / evidence" value={agileEnhancement?.inputs ?? detailDoc.inputs} small color={theme.muted} muted={theme.muted} />
                  <Field label="Outputs / result" value={agileEnhancement?.outputs ?? detailDoc.outputs} small color={theme.muted} muted={theme.muted} />
                </div>
                <Field label="Best practice" value={agileEnhancement?.bestPractice ?? detailDoc.bestPractice} color={theme.muted} muted="#22c55e" />
                <Field label="Common mistake" value={agileEnhancement?.commonMistake ?? detailDoc.commonMistake} color={theme.muted} muted="#f45fb0" />
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.muted, marginBottom: 6 }}>Related concepts</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {(agileEnhancement?.related ?? detailDoc.related ?? []).map((rel) => (
                      <span key={rel} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 999, background: theme.bg2, border: `1px solid ${theme.cardBorder}`, color: theme.text }}>{rel}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.muted, marginBottom: 6 }}>Interview questions</div>
                  <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {(agileEnhancement?.interview ?? detailDoc.interview ?? []).map((qq) => (
                      <li key={qq} style={{ fontSize: 13.5, lineHeight: 1.5, color: theme.muted }}>{qq}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {detailDoc.notAgile && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <Field label="Definition" value={detailEnhancement?.definition ?? detailDoc.description} color={theme.text} muted={theme.muted} />
                <Field label="Why it matters" value={detailEnhancement?.why ?? detailDoc.purpose} color={theme.muted} muted="#7b93ff" />
                <div style={{ padding: '16px 18px', borderRadius: 14, background: theme.bg2, border: `1px solid ${theme.cardBorder}` }}>
                  <Field label="Real-world example" value={detailEnhancement?.example ?? detailDoc.example ?? 'Example varies by project context.'} color={theme.text} muted="#22c55e" />
                </div>
                <Field label="When to use it" value={detailDoc.when} color={theme.muted} muted={theme.muted} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Field label="Created / maintained by" value={detailDoc.creates} small color={theme.text} muted={theme.muted} />
                  <Field label="Reviewed / approved by" value={detailDoc.approves} small color={theme.text} muted={theme.muted} />
                </div>
                <Field label="Works with" value={detailEnhancement?.related ?? detailDoc.relationship} color={theme.muted} muted={theme.muted} />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function Field({ label, value, color, muted, small }: { label: string; value?: string; color: string; muted: string; small?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: muted, marginBottom: 5 }}>{label}</div>
      <p style={{ fontSize: small ? 13.5 : 14, lineHeight: small ? 1.5 : 1.65, color, margin: 0 }}>{value}</p>
    </div>
  );
}
