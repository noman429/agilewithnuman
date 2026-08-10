import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Theme } from '../data/theme';

type AIWorkflow = {
  title: string;
  summary: string;
  aiContribution: string;
  pmResponsibility: string;
  safeguards: string;
  example: string;
  outputs: string[];
};

const WORKFLOWS: AIWorkflow[] = [
  {
    title: 'Requirements & Business Analysis',
    summary: 'Turn discovery inputs into clearer requirements, stories, acceptance criteria, and decision-ready documentation.',
    aiContribution: 'AI helps structure raw notes, expose ambiguity, propose requirement breakdowns, draft user stories and acceptance criteria, and surface missing scenarios for review.',
    pmResponsibility: 'I validate every requirement against stakeholder intent, business rules, scope, feasibility, dependencies, and delivery context before it enters the backlog or formal documentation.',
    safeguards: 'No AI-generated requirement is treated as approved. Sensitive client information is minimized, outputs are reviewed, and stakeholder validation remains the source of truth.',
    example: 'After a payments discovery session, I can use AI to organize scattered notes into functional themes, draft candidate user stories and edge cases, then manually reconcile them against the client discussion before backlog refinement.',
    outputs: ['BRD / FRD support', 'User stories', 'Acceptance criteria', 'Requirement gaps'],
  },
  {
    title: 'Planning & Backlog Management',
    summary: 'Accelerate decomposition, refinement, dependency thinking, and preparation for planning conversations.',
    aiContribution: 'AI can suggest work breakdowns, identify dependency patterns, challenge oversized stories, generate refinement questions, and provide alternative sequencing scenarios.',
    pmResponsibility: 'I own the delivery judgment: priorities, estimates, team capacity, commitments, trade-offs, sequencing, and final backlog decisions stay with the accountable people and team.',
    safeguards: 'AI is used for options and prompts, not automatic prioritization or estimation. Historical team data and current capacity override generic model suggestions.',
    example: 'Before Sprint Planning, I can ask AI to flag stories that appear too broad, identify likely dependencies across frontend/backend/QA, and generate questions for refinement; the team then estimates and decides what is realistically forecast.',
    outputs: ['Refinement questions', 'Dependency candidates', 'Story decomposition', 'Planning options'],
  },
  {
    title: 'Risk & Decision Support',
    summary: 'Use AI as a second set of eyes for risks, assumptions, dependencies, scenarios, and decision preparation.',
    aiContribution: 'AI helps brainstorm failure modes, categorize risks, challenge assumptions, compare response options, and turn project signals into candidate RAID entries.',
    pmResponsibility: 'I assess probability, impact, ownership, escalation thresholds, response plans, and whether a suggested risk is actually relevant to the project.',
    safeguards: 'AI does not make risk acceptance or escalation decisions. Recommendations are checked against project evidence, contracts, architecture, stakeholder tolerance, and team input.',
    example: 'For a third-party API migration, AI can help surface risks around rate limits, authentication changes, data mapping, rollback, and vendor dependency; I then validate them with engineering and convert only relevant items into the RAID log.',
    outputs: ['Risk candidates', 'Scenario analysis', 'RAID updates', 'Decision options'],
  },
  {
    title: 'Stakeholder Communication',
    summary: 'Reduce repetitive communication work while keeping messages accurate, audience-specific, and decision-oriented.',
    aiContribution: 'AI assists with meeting summaries, action extraction, status-report drafts, executive summaries, release communication, and adapting technical detail for different audiences.',
    pmResponsibility: 'I verify facts, ownership, dates, tone, risks, decisions, and commitments before anything is sent to clients, sponsors, or delivery teams.',
    safeguards: 'AI never sends stakeholder communication autonomously. Drafts are checked against the source conversation and current project state to prevent invented actions or commitments.',
    example: 'After a client call, I can use AI to structure notes into decisions, owners, due dates, open questions, and a concise follow-up email, then validate every item before sending.',
    outputs: ['Meeting minutes', 'Status updates', 'Action lists', 'Executive summaries'],
  },
  {
    title: 'QA & Delivery Quality',
    summary: 'Expand test thinking and requirement coverage before manual QA and release decisions.',
    aiContribution: 'AI helps generate edge cases, negative scenarios, test ideas, requirement-to-test checks, regression candidates, and questions around ambiguous acceptance criteria.',
    pmResponsibility: 'I coordinate with QA and engineering to decide actual coverage, severity, release readiness, defect priority, and whether generated scenarios are valid for the system.',
    safeguards: 'Generated tests are hypotheses, not evidence. Manual or automated execution, reproducibility, environment validation, and QA sign-off remain required.',
    example: 'For a checkout change, AI can propose scenarios for duplicate submission, expired sessions, gateway timeouts, partial failures, retries, and validation errors; QA then selects, executes, and records the applicable cases.',
    outputs: ['Edge cases', 'Test ideas', 'Coverage gaps', 'Regression candidates'],
  },
  {
    title: 'Documentation & Knowledge',
    summary: 'Keep delivery documentation current without spending project-management time rewriting the same information repeatedly.',
    aiContribution: 'AI helps transform approved source material into structured release notes, handoffs, summaries, knowledge-base content, checklists, and first drafts of project documentation.',
    pmResponsibility: 'I maintain document purpose, version accuracy, traceability, audience fit, and final approval. The authoritative source remains the validated project record—not the AI draft.',
    safeguards: 'Generated text is cross-checked against Jira, approved requirements, meeting decisions, test results, and release scope before publication.',
    example: 'At release time, I can combine approved tickets and QA results into a draft release-note structure, then verify shipped scope, known issues, deployment notes, and stakeholder wording before publishing.',
    outputs: ['Release notes', 'Handoffs', 'Knowledge summaries', 'Project checklists'],
  },
];

export default function AIProjectDelivery({ theme }: { theme: Theme }) {
  const [selected, setSelected] = useState<AIWorkflow | null>(null);
  const [showScrollCue, setShowScrollCue] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selected) {
      setShowScrollCue(false);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };
    document.addEventListener('keydown', onKeyDown);

    const frame = window.requestAnimationFrame(() => {
      const modal = modalRef.current;
      if (!modal) return;
      modal.scrollTop = 0;
      setShowScrollCue(modal.scrollHeight > modal.clientHeight + 8);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [selected]);

  const handleModalScroll = () => {
    const modal = modalRef.current;
    if (!modal) return;
    const hasMore = modal.scrollTop + modal.clientHeight < modal.scrollHeight - 12;
    setShowScrollCue(hasMore);
  };

  const scrollModalForward = () => {
    modalRef.current?.scrollBy({ top: 260, behavior: 'smooth' });
  };

  const vars = {
    '--ai-card': theme.card,
    '--ai-border': theme.cardBorder,
    '--ai-text': theme.text,
    '--ai-muted': theme.muted,
    '--ai-bg2': theme.bg2,
  } as CSSProperties;

  return (
    <section id="ai-delivery" className="ai-delivery" style={vars} aria-labelledby="ai-delivery-title">
      <style>{`
        .ai-delivery{max-width:1200px;margin:0 auto;padding:96px 40px;scroll-margin-top:110px;color:var(--ai-text)}
        .ai-eyebrow{font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#22d3ee}
        .ai-heading{margin:12px 0 10px;font-size:clamp(32px,4.7vw,54px);line-height:1.04;letter-spacing:-.045em}
        .ai-intro{max-width:780px;margin:0;color:var(--ai-muted);font-size:15px;line-height:1.65}
        .ai-principle{margin-top:24px;padding:17px 19px;border:1px solid rgba(34,211,238,.28);border-radius:16px;background:linear-gradient(135deg,rgba(34,211,238,.08),rgba(91,124,250,.06));display:flex;gap:13px;align-items:flex-start}
        .ai-principle-mark{flex:0 0 auto;width:28px;height:28px;border-radius:9px;display:grid;place-items:center;background:rgba(34,211,238,.14);color:#22d3ee;font-weight:900;font-size:13px}.ai-principle strong{display:block;font-size:13px;margin-bottom:4px}.ai-principle p{margin:0;color:var(--ai-muted);font-size:12.5px;line-height:1.55}
        .ai-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:30px}.ai-card{position:relative;min-height:190px;padding:21px;border:1px solid var(--ai-border);border-radius:18px;background:var(--ai-card);text-align:left;color:var(--ai-text);cursor:pointer;transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease;overflow:hidden}.ai-card:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 100% 0%,rgba(34,211,238,.1),transparent 40%);pointer-events:none}.ai-card:hover{transform:translateY(-3px);border-color:rgba(34,211,238,.35);box-shadow:0 20px 55px -42px rgba(34,211,238,.8)}.ai-card:focus-visible,.ai-close:focus-visible,.ai-scroll-cue:focus-visible{outline:2px solid #22d3ee;outline-offset:3px}
        .ai-number{font-size:9px;font-weight:850;letter-spacing:.13em;color:#22d3ee;text-transform:uppercase}.ai-card h3{margin:10px 0 8px;font-size:18px;line-height:1.25;letter-spacing:-.02em}.ai-card p{margin:0;color:var(--ai-muted);font-size:12.5px;line-height:1.55}.ai-open{position:absolute;right:18px;bottom:16px;color:#22d3ee;font-size:11px;font-weight:800}
        .ai-toolkit{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:24px;color:var(--ai-muted);font-size:11.5px}.ai-toolkit strong{color:var(--ai-text);font-size:11px;text-transform:uppercase;letter-spacing:.08em}.ai-chip{padding:6px 9px;border:1px solid var(--ai-border);border-radius:999px;background:var(--ai-card);font-weight:700;color:var(--ai-text)}
        .ai-modal-layer{position:fixed;inset:0;z-index:1250;display:grid;place-items:center;padding:20px;background:rgba(4,7,17,.74);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
        .ai-modal-shell{position:relative;width:min(720px,100%);max-height:min(84vh,760px)}
        .ai-modal{width:100%;max-height:min(84vh,760px);overflow:auto;scrollbar-width:none;-ms-overflow-style:none;border:1px solid var(--ai-border);border-radius:22px;background:var(--ai-bg2);color:var(--ai-text);box-shadow:0 36px 110px -38px rgba(0,0,0,.88);overscroll-behavior:contain}
        .ai-modal::-webkit-scrollbar{display:none;width:0;height:0}
        .ai-modal-head{position:sticky;top:0;z-index:2;display:flex;justify-content:space-between;gap:18px;padding:22px 24px 18px;border-bottom:1px solid var(--ai-border);background:var(--ai-bg2)}.ai-modal-kicker{font-size:9.5px;font-weight:850;text-transform:uppercase;letter-spacing:.12em;color:#22d3ee}.ai-modal h2{margin:7px 0 0;font-size:27px;line-height:1.1;letter-spacing:-.035em}.ai-close{flex:0 0 auto;width:38px;height:38px;border:1px solid var(--ai-border);border-radius:50%;background:var(--ai-card);color:var(--ai-text);font-size:20px;cursor:pointer}.ai-modal-body{padding:22px 24px 68px;display:grid;gap:14px}.ai-block{padding:15px 16px;border:1px solid var(--ai-border);border-radius:14px;background:var(--ai-card)}.ai-block h3{margin:0 0 7px;font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--ai-muted)}.ai-block p{margin:0;font-size:13px;line-height:1.6}.ai-example{border-color:rgba(34,197,94,.25)}.ai-example h3{color:#22c55e}.ai-output-list{display:flex;gap:7px;flex-wrap:wrap}.ai-output{padding:6px 9px;border-radius:999px;background:rgba(34,211,238,.1);color:#22d3ee;font-size:11px;font-weight:750}
        .ai-scroll-cue-wrap{position:absolute;z-index:5;left:1px;right:1px;bottom:1px;height:72px;border-radius:0 0 21px 21px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:11px;background:linear-gradient(to bottom,transparent 0%,color-mix(in srgb,var(--ai-bg2) 78%,transparent) 42%,var(--ai-bg2) 88%);pointer-events:none;animation:aiCueFade .22s ease both}
        .ai-scroll-cue{pointer-events:auto;border:1px solid rgba(34,211,238,.28);background:color-mix(in srgb,var(--ai-bg2) 88%,transparent);color:#22d3ee;border-radius:999px;padding:7px 12px 6px;display:flex;align-items:center;gap:8px;cursor:pointer;box-shadow:0 10px 30px -18px rgba(34,211,238,.8);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
        .ai-scroll-cue-label{font-size:9px;font-weight:850;letter-spacing:.12em;text-transform:uppercase}.ai-scroll-chevrons{display:flex;flex-direction:column;line-height:.42;font-size:12px;transform:translateY(-1px)}.ai-scroll-chevrons span:first-child{animation:aiScrollPulse 1.25s ease-in-out infinite}.ai-scroll-chevrons span:last-child{animation:aiScrollPulse 1.25s .16s ease-in-out infinite}
        @keyframes aiScrollPulse{0%,100%{opacity:.25;transform:translateY(-1px)}50%{opacity:1;transform:translateY(2px)}}@keyframes aiCueFade{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:900px){.ai-grid{grid-template-columns:1fr 1fr}}
        @media(max-width:640px){.ai-delivery{padding:78px 20px}.ai-grid{grid-template-columns:1fr}.ai-principle{padding:15px}.ai-modal-head,.ai-modal-body{padding-left:18px;padding-right:18px}.ai-modal-body{padding-bottom:68px}.ai-modal h2{font-size:24px}.ai-scroll-cue-label{font-size:8.5px}}
        @media(prefers-reduced-motion:reduce){.ai-delivery *{transition:none!important}.ai-scroll-chevrons span{animation:none!important}.ai-scroll-cue-wrap{animation:none!important}}
      `}</style>

      <div className="reveal ai-eyebrow">AI · Project Delivery</div>
      <h2 id="ai-delivery-title" className="reveal ai-heading">AI-Enabled Project Delivery</h2>
      <p className="reveal ai-intro">
        I use AI as a delivery accelerator—not as a substitute for project judgment. It supports analysis, planning, quality, communication, and documentation while accountability and final decisions remain human-led.
      </p>

      <div className="reveal ai-principle">
        <div className="ai-principle-mark">✓</div>
        <div>
          <strong>Human-in-the-loop by design</strong>
          <p>AI-generated outputs are working material. Requirements, risks, estimates, test ideas, stakeholder messages, and delivery decisions are reviewed against real project context before use.</p>
        </div>
      </div>

      <div className="ai-grid">
        {WORKFLOWS.map((workflow, index) => (
          <button key={workflow.title} type="button" className="ai-card reveal" onClick={() => setSelected(workflow)}>
            <div className="ai-number">Workflow {String(index + 1).padStart(2, '0')}</div>
            <h3>{workflow.title}</h3>
            <p>{workflow.summary}</p>
            <span className="ai-open">Explore ↗</span>
          </button>
        ))}
      </div>

      <div className="reveal ai-toolkit" aria-label="Current AI toolkit">
        <strong>Current toolkit</strong>
        <span className="ai-chip">ChatGPT</span>
        <span className="ai-chip">Claude</span>
        <span className="ai-chip">Codex</span>
        <span>Applied across PM, BA, QA, research, documentation, and delivery workflows.</span>
      </div>

      {selected && (
        <div
          className="ai-modal-layer"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <div className="ai-modal-shell">
            <div
              ref={modalRef}
              className="ai-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="ai-modal-title"
              onScroll={handleModalScroll}
            >
              <div className="ai-modal-head">
                <div>
                  <div className="ai-modal-kicker">AI-Enabled Project Delivery</div>
                  <h2 id="ai-modal-title">{selected.title}</h2>
                </div>
                <button type="button" className="ai-close" onClick={() => setSelected(null)} aria-label="Close AI workflow details">×</button>
              </div>
              <div className="ai-modal-body">
                <div className="ai-block">
                  <h3>How AI contributes</h3>
                  <p>{selected.aiContribution}</p>
                </div>
                <div className="ai-block">
                  <h3>My PM responsibility</h3>
                  <p>{selected.pmResponsibility}</p>
                </div>
                <div className="ai-block">
                  <h3>Safeguards</h3>
                  <p>{selected.safeguards}</p>
                </div>
                <div className="ai-block ai-example">
                  <h3>Realistic example</h3>
                  <p>{selected.example}</p>
                </div>
                <div className="ai-block">
                  <h3>Typical outputs</h3>
                  <div className="ai-output-list">
                    {selected.outputs.map((output) => <span key={output} className="ai-output">{output}</span>)}
                  </div>
                </div>
              </div>
            </div>

            {showScrollCue && (
              <div className="ai-scroll-cue-wrap" aria-hidden="false">
                <button type="button" className="ai-scroll-cue" onClick={scrollModalForward} aria-label="Scroll for more details">
                  <span className="ai-scroll-cue-label">Scroll for more</span>
                  <span className="ai-scroll-chevrons" aria-hidden="true"><span>⌄</span><span>⌄</span></span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
