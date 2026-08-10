import { useEffect, useState, type CSSProperties } from 'react';
import type { Theme } from '../data/theme';

type CategoryKey = 'activities' | 'deliverables' | 'stakeholders' | 'approval';

type LifecycleItem = {
  label: string;
  detail: string;
  why: string;
  done: string;
  connects: string;
};

type Phase = {
  number: string;
  name: string;
  summary: string;
  categories: Record<CategoryKey, LifecycleItem[]>;
};

type SelectedItem = {
  phase: Phase;
  category: CategoryKey;
  item: LifecycleItem;
};

const CATEGORY_META: Record<CategoryKey, { label: string; color: string }> = {
  activities: { label: 'Activities', color: '#7b93ff' },
  deliverables: { label: 'Deliverables', color: '#b479ff' },
  stakeholders: { label: 'Stakeholders', color: '#f6b84a' },
  approval: { label: 'Approval', color: '#31d67b' },
};

const PHASES: Phase[] = [
  {
    number: '01',
    name: 'Initiation',
    summary: 'Turn a business need into an authorized project.',
    categories: {
      activities: [
        {
          label: 'Define purpose & goals',
          detail: 'Clarify the problem or opportunity, the outcome the project should create, and how success will be recognized.',
          why: 'A shared purpose keeps scope and decisions aligned to the value the project is expected to create.',
          done: 'The sponsor and project manager can state the expected outcome and success measures clearly.',
          connects: 'Planning · scope, priorities, success criteria',
        },
        {
          label: 'Frame high-level scope',
          detail: 'Set the initial boundaries, major constraints, assumptions, and known dependencies before detailed planning starts.',
          why: 'Early boundaries reduce uncontrolled expansion and surface feasibility concerns sooner.',
          done: 'In-scope outcomes, major exclusions, assumptions, and constraints are understood well enough to plan.',
          connects: 'Planning · detailed scope and delivery approach',
        },
        {
          label: 'Identify key stakeholders',
          detail: 'Identify the people who fund, decide, use, influence, deliver, or can materially affect the project.',
          why: 'Missing a critical stakeholder early often creates late approvals, rework, or resistance.',
          done: 'Decision makers, customer or user representatives, delivery leads, and escalation owners are known.',
          connects: 'Planning · communication and engagement',
        },
      ],
      deliverables: [
        {
          label: 'Business case',
          detail: 'A concise justification for why the project should exist, including expected value, major costs or constraints, and feasibility.',
          why: 'It gives decision makers a basis for investing time, money, and capacity.',
          done: 'The sponsor can justify proceeding and explain the value expected from the project.',
          connects: 'Project authorization',
        },
        {
          label: 'Project charter',
          detail: 'The formal authorization that establishes the project, sponsor, project manager authority, objective, and initial boundaries.',
          why: 'It creates a shared starting point and formally empowers the project manager to organize the work.',
          done: 'The project is authorized and accountable leadership is clear.',
          connects: 'Planning · integrated project plan',
        },
      ],
      stakeholders: [
        {
          label: 'Sponsor / business owner',
          detail: 'Owns the business need, champions the project, provides executive direction, and resolves major trade-offs.',
          why: 'The project needs an accountable business voice when priorities or constraints conflict.',
          done: 'A named sponsor accepts accountability for project governance and outcome.',
          connects: 'All phases · governance and escalation',
        },
        {
          label: 'Project manager',
          detail: 'Integrates the project across scope, schedule, risk, people, communication, and decisions.',
          why: 'One integration owner reduces gaps between teams, stakeholders, and governance.',
          done: 'The project manager has clear authority and escalation routes.',
          connects: 'Planning onward · delivery management',
        },
      ],
      approval: [
        {
          label: 'Authorize project',
          detail: 'The sponsor or governing authority confirms that the project should proceed into detailed planning.',
          why: 'It prevents unapproved work from consuming delivery capacity or funding.',
          done: 'A documented go decision exists and the project manager is authorized to plan.',
          connects: 'Planning · plan and baseline development',
        },
      ],
    },
  },
  {
    number: '02',
    name: 'Planning',
    summary: 'Translate the approved intent into a realistic delivery path.',
    categories: {
      activities: [
        {
          label: 'Define scope & work',
          detail: 'Break the authorized outcome into deliverables, requirements, work packages, backlog items, milestones, or releases appropriate to the delivery method.',
          why: 'The team needs a common view of what will be delivered and what work is required.',
          done: 'Scope, major deliverables, sequencing, and acceptance expectations are understood.',
          connects: 'Execution · work to perform',
        },
        {
          label: 'Estimate schedule & cost',
          detail: 'Estimate effort, duration, people, dependencies, procurement, and cost, then shape them into a workable schedule or roadmap.',
          why: 'Realistic estimates expose capacity gaps and trade-offs before commitments become expensive to change.',
          done: 'Key dates, resource needs, dependencies, and budget expectations are agreed at the required level.',
          connects: 'Monitoring & Controlling · baseline comparison',
        },
        {
          label: 'Plan risk, quality & comms',
          detail: 'Define how the team will manage uncertainty, quality expectations, reporting, communication, issues, changes, and escalation.',
          why: 'Projects fail when teams plan the work but not how they will control or communicate it.',
          done: 'Owners, thresholds, quality checks, reporting cadence, and escalation routes are clear.',
          connects: 'Execution + Monitoring & Controlling',
        },
      ],
      deliverables: [
        {
          label: 'Integrated project plan',
          detail: 'The connected plan for delivering and governing the project, tailored to the organization and delivery approach.',
          why: 'It aligns scope, schedule, resources, quality, communication, and governance in one delivery view.',
          done: 'The team and decision makers have a coherent plan they can execute and govern.',
          connects: 'Execution · delivery direction',
        },
        {
          label: 'Baselines & RAID',
          detail: 'Approved reference points for scope, schedule, or cost where needed, plus active risks, assumptions, issues, and dependencies.',
          why: 'Without reference points and visible uncertainty, meaningful control and forecasting are difficult.',
          done: 'Targets are agreed and material RAID items have owners and actions.',
          connects: 'Monitoring & Controlling · performance and variance',
        },
      ],
      stakeholders: [
        {
          label: 'Delivery leads & SMEs',
          detail: 'Technical, design, QA, operations, security, vendor, and subject-matter leads who validate feasibility and delivery needs.',
          why: 'Plans become credible when the people who understand the work help shape estimates and dependencies.',
          done: 'Relevant leads have reviewed the plan and accepted their responsibilities or constraints.',
          connects: 'Execution · coordinated delivery',
        },
        {
          label: 'Product / business owner',
          detail: 'Represents business priority and user value, helping refine scope, acceptance expectations, and trade-offs.',
          why: 'Delivery choices need an accountable value perspective, not only a technical or schedule perspective.',
          done: 'Priorities, acceptance expectations, and decision ownership are clear.',
          connects: 'Execution · acceptance and prioritization',
        },
      ],
      approval: [
        {
          label: 'Approve plan & baselines',
          detail: 'The sponsor, steering group, customer, or delegated authority approves the delivery plan and any formal baselines required by governance.',
          why: 'Approval converts planning assumptions into authorized commitments and control references.',
          done: 'The project is cleared to execute with agreed tolerances and decision authority.',
          connects: 'Execution + Monitoring & Controlling',
        },
      ],
    },
  },
  {
    number: '03',
    name: 'Execution',
    summary: 'Perform the work and produce the agreed project outputs.',
    categories: {
      activities: [
        {
          label: 'Perform planned work',
          detail: 'Design, build, configure, procure, test, implement, or otherwise produce the deliverables defined by the approved plan.',
          why: 'This is where planned intent becomes usable project output and business capability.',
          done: 'Work products meet their current completion and quality criteria and are ready for validation or release.',
          connects: 'Monitoring & Controlling · actual results',
        },
        {
          label: 'Coordinate team & vendors',
          detail: 'Manage day-to-day collaboration, dependencies, decisions, vendor work, communication, and impediments across the delivery network.',
          why: 'Many execution delays happen at handoffs and dependencies rather than inside an individual task.',
          done: 'Owners know current priorities and blockers have a clear path to resolution.',
          connects: 'Monitoring & Controlling · issues and forecasts',
        },
        {
          label: 'Build quality into delivery',
          detail: 'Apply agreed reviews, testing, assurance, acceptance criteria, and corrective work as deliverables are produced.',
          why: 'Finding quality problems during delivery is cheaper and safer than discovering them at handover.',
          done: 'Evidence shows deliverables satisfy the required functional and quality expectations for their stage.',
          connects: 'Acceptance / release decision',
        },
      ],
      deliverables: [
        {
          label: 'Completed deliverables',
          detail: 'The product, service, result, increment, release, configuration, or other output the project exists to create.',
          why: 'Project progress ultimately matters when usable outcomes are being produced.',
          done: 'The output satisfies the relevant completion criteria and can be validated.',
          connects: 'Monitoring & Controlling → Closure',
        },
        {
          label: 'Quality & status evidence',
          detail: 'Test results, review evidence, delivery status, decisions, issue updates, and other information that demonstrates what has happened.',
          why: 'Reliable evidence supports acceptance, forecasting, escalation, and auditability.',
          done: 'Current delivery status can be explained with traceable evidence rather than opinion.',
          connects: 'Monitoring & Controlling · performance analysis',
        },
      ],
      stakeholders: [
        {
          label: 'Delivery team',
          detail: 'The cross-functional people who create, test, integrate, and prepare the project outputs.',
          why: 'Clear ownership and collaboration directly affect throughput, quality, and predictability.',
          done: 'Responsibilities, priorities, dependencies, and decision paths are understood.',
          connects: 'Monitoring & Controlling · actual performance',
        },
        {
          label: 'Customer / product owner',
          detail: 'Reviews outputs against agreed needs, clarifies intent, makes value trade-offs, and accepts deliverables where delegated.',
          why: 'Frequent business validation reduces the risk of delivering technically complete but unsuitable outcomes.',
          done: 'Feedback and acceptance decisions are timely and tied to agreed criteria.',
          connects: 'Acceptance → Closure',
        },
      ],
      approval: [
        {
          label: 'Accept / release output',
          detail: 'The authorized customer, product owner, sponsor, or release authority confirms that an output is acceptable for its intended use or next stage.',
          why: 'A clear acceptance point separates completed work from work that still needs correction or approval.',
          done: 'Acceptance or release readiness is recorded against defined criteria.',
          connects: 'Closure · final acceptance and handover',
        },
      ],
    },
  },
  {
    number: '04',
    name: 'Monitoring & Controlling',
    summary: 'Measure performance, manage variance, and govern change.',
    categories: {
      activities: [
        {
          label: 'Track performance',
          detail: 'Compare actual scope, schedule, cost, quality, progress, and key outcomes with the approved plan, milestones, forecasts, or agreed targets.',
          why: 'Early visibility allows the team to act while recovery options still exist.',
          done: 'Current status, trend, forecast, and significant variance are visible to the right decision makers.',
          connects: 'Planning · replan + Execution · corrective action',
        },
        {
          label: 'Manage risks & issues',
          detail: 'Review uncertainty and active problems, confirm owners and responses, escalate when thresholds are exceeded, and close items when resolved.',
          why: 'Unmanaged uncertainty becomes surprise; unmanaged issues become delay and cost.',
          done: 'Material risks and issues have owners, actions, dates, and appropriate escalation.',
          connects: 'Execution · response actions',
        },
        {
          label: 'Control changes',
          detail: 'Evaluate proposed changes or material deviations for impact before deciding whether to approve, reject, defer, or escalate them.',
          why: 'Change is normal; uncontrolled change is what destabilizes delivery.',
          done: 'The impact and decision are recorded and affected plans or work are updated.',
          connects: 'Planning · update plan + Execution · approved change',
        },
      ],
      deliverables: [
        {
          label: 'Status & forecast',
          detail: 'A concise view of performance, milestone health, key risks or issues, forecast completion, and decisions needed.',
          why: 'Good reporting focuses governance attention on what changed, why it matters, and what action is required.',
          done: 'Stakeholders can understand current health and expected outcome without reconstructing data from multiple sources.',
          connects: 'Sponsor / steering decisions',
        },
        {
          label: 'Change / decision log',
          detail: 'A traceable record of material change requests, impact assessments, approvals, rejections, escalations, and key governance decisions.',
          why: 'Decision traceability protects scope integrity and prevents teams from acting on conflicting verbal direction.',
          done: 'Material decisions have an owner, rationale, date, outcome, and resulting action.',
          connects: 'Planning & Execution · authorized updates',
        },
      ],
      stakeholders: [
        {
          label: 'Sponsor / steering group',
          detail: 'Reviews project health, resolves escalated trade-offs, protects strategic alignment, and decides matters above the project manager’s authority.',
          why: 'Projects need timely senior decisions when recovery requires funding, priority, scope, or organizational trade-offs.',
          done: 'Escalated decisions are made within the project’s governance cadence and tolerances.',
          connects: 'All phases · governance direction',
        },
        {
          label: 'PM / PMO / change authority',
          detail: 'Coordinates performance control and applies the agreed governance path for material changes, exceptions, and escalations.',
          why: 'A defined control path balances governance with delivery speed and consistency.',
          done: 'Material changes and exceptions follow the agreed authority model.',
          connects: 'Planning · updated baselines + Execution',
        },
      ],
      approval: [
        {
          label: 'Approve changes & exceptions',
          detail: 'The authorized decision maker accepts, rejects, or escalates a material change, variance, recovery action, or exception.',
          why: 'Teams should not silently absorb changes that alter committed outcomes, cost, timing, or risk.',
          done: 'The decision is recorded and affected plans or work are updated.',
          connects: 'Planning / Execution · controlled adjustment',
        },
      ],
    },
  },
  {
    number: '05',
    name: 'Closure',
    summary: 'Confirm completion, transfer ownership, and formally close the work.',
    categories: {
      activities: [
        {
          label: 'Confirm completion',
          detail: 'Verify that agreed deliverables, acceptance criteria, obligations, and exit conditions have been satisfied or formally dispositioned.',
          why: 'Projects should close based on evidence and acceptance, not simply because the schedule ended.',
          done: 'Outstanding items are resolved, transferred, or explicitly accepted and final completion is confirmed.',
          connects: 'Closure approval',
        },
        {
          label: 'Handover to operations',
          detail: 'Transfer deliverables, knowledge, documentation, access, support responsibilities, and ongoing ownership to the receiving team.',
          why: 'Value is lost when a completed deliverable cannot be operated, supported, or adopted after the project team leaves.',
          done: 'The receiving owner confirms readiness, responsibilities, documentation, and support arrangements.',
          connects: 'Operations / benefits realization',
        },
        {
          label: 'Capture lessons & close records',
          detail: 'Document key lessons, final performance, decisions, follow-up actions, contract or financial closure, and archive requirements.',
          why: 'Closure converts project experience into reusable knowledge and completes governance obligations.',
          done: 'Records are complete, required accounts or contracts are closed, and lessons are accessible.',
          connects: 'PMO / portfolio + future projects',
        },
      ],
      deliverables: [
        {
          label: 'Closure report & sign-off',
          detail: 'The concise record that summarizes completion, final status, acceptance, unresolved follow-ups, and formal closure authorization.',
          why: 'It provides a clear endpoint for the temporary project organization and a traceable final decision.',
          done: 'The authorized approver confirms that closure criteria have been met.',
          connects: 'Portfolio / records archive',
        },
        {
          label: 'Handover package',
          detail: 'The operational information needed to own the outcome after closure, such as runbooks, support details, documentation, access, and known follow-ups.',
          why: 'A strong handover reduces post-project disruption and dependency on former project team members.',
          done: 'The receiving owner can operate or support the delivered outcome without relying on undocumented project knowledge.',
          connects: 'Operations / support owner',
        },
      ],
      stakeholders: [
        {
          label: 'Sponsor / customer',
          detail: 'Confirms that the agreed outcome has been delivered and that remaining follow-ups are understood.',
          why: 'Final acceptance should come from the party accountable for the business outcome, not only the delivery team.',
          done: 'The sponsor or customer accepts completion and any remaining transferred actions.',
          connects: 'Formal closure',
        },
        {
          label: 'Operations / support owner',
          detail: 'Receives the solution, documentation, knowledge, support responsibilities, and ongoing ownership after the project ends.',
          why: 'Operational acceptance protects continuity once the temporary project structure is dissolved.',
          done: 'The receiving team confirms readiness and ownership.',
          connects: 'Post-project operations and benefits',
        },
      ],
      approval: [
        {
          label: 'Close project',
          detail: 'The authorized sponsor, customer, or governing authority confirms that completion and handover requirements are satisfied and the project can formally close.',
          why: 'Formal closure ends project authority, releases resources, and creates a clear governance endpoint.',
          done: 'Closure is recorded, ownership is transferred, and project resources can be released.',
          connects: 'Operations / portfolio / future initiatives',
        },
      ],
    },
  },
];

export default function ProjectLifecycle({ theme }: { theme: Theme }) {
  const [selected, setSelected] = useState<SelectedItem | null>(null);

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [selected]);

  const vars = {
    '--pl-card': theme.card,
    '--pl-border': theme.cardBorder,
    '--pl-text': theme.text,
    '--pl-muted': theme.muted,
    '--pl-bg2': theme.bg2,
  } as CSSProperties;

  return (
    <section id="project-lifecycle" className="pl-section" style={vars} aria-labelledby="project-lifecycle-title">
      <style>{`
        .pl-section{position:relative;max-width:1200px;margin:0 auto;padding:96px 40px 100px;scroll-margin-top:110px;color:var(--pl-text)}
        .pl-eyebrow{font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#7b93ff}
        .pl-heading{margin:12px 0 10px;font-size:clamp(32px,4.7vw,54px);line-height:1.04;letter-spacing:-.045em}
        .pl-intro{max-width:760px;margin:0;font-size:15px;line-height:1.65;color:var(--pl-muted)}
        .pl-legend{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-top:24px}
        .pl-legend-label{font-size:11px;color:var(--pl-muted);margin-right:3px}.pl-legend-chip{display:inline-flex;align-items:center;gap:7px;padding:7px 10px;border:1px solid var(--pl-border);border-radius:999px;background:var(--pl-card);font-size:10.5px;font-weight:800}.pl-dot{width:7px;height:7px;border-radius:50%}
        .pl-flow{position:relative;margin-top:48px;padding:8px 0 10px}.pl-flow:before{content:"";position:absolute;top:42px;bottom:46px;left:50%;width:2px;transform:translateX(-1px);background:linear-gradient(to bottom,transparent,rgba(123,147,255,.38) 4%,rgba(123,147,255,.38) 96%,transparent)}
        .pl-row{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 112px minmax(0,1fr);align-items:center;min-height:286px}.pl-row-left .pl-card{grid-column:1}.pl-row-left .pl-node{grid-column:2}.pl-row-left .pl-spacer{grid-column:3}.pl-row-right .pl-spacer{grid-column:1}.pl-row-right .pl-node{grid-column:2}.pl-row-right .pl-card{grid-column:3}.pl-card,.pl-node,.pl-spacer{grid-row:1}
        .pl-node{position:relative;z-index:3;justify-self:center;width:88px;height:88px;border-radius:50%;display:grid;place-items:center;text-align:center;border:7px solid var(--pl-bg2);background:linear-gradient(145deg,#f3ca4d,#ffdf72);color:#161922;box-shadow:0 0 0 1px rgba(255,219,104,.45),0 18px 34px -24px rgba(242,201,76,.75)}.pl-node span{display:block;font-size:9px;font-weight:850;letter-spacing:.08em}.pl-node strong{display:block;font-size:25px;line-height:1;font-weight:900}
        .pl-card{position:relative;width:min(100%,520px);padding:22px;border:1px solid var(--pl-border);border-radius:20px;background:var(--pl-card);box-shadow:0 22px 62px -50px rgba(0,0,0,.8);backdrop-filter:blur(14px)}.pl-row-left .pl-card{justify-self:end;margin-right:28px}.pl-row-right .pl-card{justify-self:start;margin-left:28px}.pl-card:after{content:"";position:absolute;top:50%;width:29px;height:2px;background:rgba(123,147,255,.38)}.pl-row-left .pl-card:after{right:-29px}.pl-row-right .pl-card:after{left:-29px}
        .pl-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding-bottom:14px;border-bottom:1px solid var(--pl-border)}.pl-card-head h3{margin:0;font-size:24px;letter-spacing:-.03em}.pl-card-head p{margin:6px 0 0;font-size:12.5px;line-height:1.45;color:var(--pl-muted)}.pl-phase-tag{flex:0 0 auto;padding:6px 9px;border-radius:999px;background:rgba(123,147,255,.12);color:#7b93ff;font-size:9px;font-weight:850;letter-spacing:.08em;text-transform:uppercase}
        .pl-category-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px 20px;margin-top:17px}.pl-category h4{display:flex;align-items:center;gap:7px;margin:0 0 8px;font-size:10px;text-transform:uppercase;letter-spacing:.11em}.pl-category h4:before{content:"";width:7px;height:7px;border-radius:50%;background:currentColor}.pl-items{display:grid;gap:5px}.pl-item{width:max-content;max-width:100%;padding:2px 0;border:0;background:none;color:var(--pl-text);font-size:12px;line-height:1.4;text-align:left;cursor:pointer}.pl-item:after{content:" ↗";font-size:9px;color:var(--pl-muted);opacity:.72}.pl-item:hover{color:#7b93ff}.pl-item:focus-visible,.pl-close:focus-visible{outline:2px solid #7b93ff;outline-offset:3px;border-radius:5px}
        .pl-note{margin:26px auto 0;max-width:820px;padding:15px 18px;border:1px solid var(--pl-border);border-radius:14px;background:var(--pl-card);font-size:12px;line-height:1.6;text-align:center;color:var(--pl-muted)}.pl-note strong{color:var(--pl-text)}
        .pl-modal-layer{position:fixed;inset:0;z-index:1200;display:grid;place-items:center;padding:20px;background:rgba(4,7,17,.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}.pl-modal{width:min(680px,100%);max-height:min(82vh,720px);overflow:auto;border:1px solid var(--pl-border);border-radius:22px;background:var(--pl-bg2);color:var(--pl-text);box-shadow:0 36px 110px -38px rgba(0,0,0,.86)}.pl-modal-head{position:sticky;top:0;z-index:2;display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding:22px 24px 18px;border-bottom:1px solid var(--pl-border);background:var(--pl-bg2)}.pl-modal-crumb{font-size:9.5px;font-weight:850;text-transform:uppercase;letter-spacing:.12em;color:#7b93ff}.pl-modal h2{margin:7px 0 0;font-size:28px;line-height:1.1;letter-spacing:-.035em}.pl-close{flex:0 0 auto;width:38px;height:38px;border-radius:50%;border:1px solid var(--pl-border);background:var(--pl-card);color:var(--pl-text);cursor:pointer;font-size:20px}.pl-modal-body{padding:22px 24px 26px}.pl-modal-summary{margin:0 0 20px;font-size:15px;line-height:1.65;color:var(--pl-muted)}.pl-modal-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.pl-modal-block{padding:15px 16px;border:1px solid var(--pl-border);border-radius:14px;background:var(--pl-card)}.pl-modal-block-wide{grid-column:1/-1}.pl-modal-block h3{margin:0 0 7px;font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--pl-muted)}.pl-modal-block p{margin:0;font-size:12.5px;line-height:1.55}.pl-connect{display:inline-flex;align-items:center;padding:7px 10px;border-radius:999px;background:rgba(123,147,255,.13);color:#7b93ff;font-size:11px;font-weight:800}
        @media(max-width:900px){.pl-flow:before{left:39px}.pl-row{grid-template-columns:78px minmax(0,1fr);min-height:0;margin-bottom:36px;align-items:start}.pl-row-left .pl-card,.pl-row-right .pl-card{grid-column:2;grid-row:1;justify-self:stretch;width:100%;margin:0}.pl-row-left .pl-node,.pl-row-right .pl-node{grid-column:1;grid-row:1;justify-self:start;width:72px;height:72px}.pl-spacer{display:none}.pl-node strong{font-size:21px}.pl-card:after,.pl-row-left .pl-card:after,.pl-row-right .pl-card:after{left:-39px;right:auto;top:35px;width:39px}}
        @media(max-width:640px){.pl-section{padding:78px 20px 80px}.pl-heading{font-size:clamp(34px,11vw,48px)}.pl-flow{margin-top:38px}.pl-flow:before{left:28px}.pl-row{grid-template-columns:57px minmax(0,1fr);margin-bottom:28px}.pl-row-left .pl-node,.pl-row-right .pl-node{width:56px;height:56px;border-width:5px}.pl-node span{font-size:7px}.pl-node strong{font-size:18px}.pl-card{padding:18px 17px 17px;border-radius:17px}.pl-card:after,.pl-row-left .pl-card:after,.pl-row-right .pl-card:after{left:-29px;top:27px;width:29px}.pl-card-head h3{font-size:21px}.pl-phase-tag{display:none}.pl-category-grid{grid-template-columns:1fr;gap:14px}.pl-item{font-size:12.5px}.pl-modal-grid{grid-template-columns:1fr}.pl-modal-block-wide{grid-column:auto}.pl-modal-head,.pl-modal-body{padding-left:18px;padding-right:18px}.pl-modal h2{font-size:24px}}
        @media(prefers-reduced-motion:reduce){.pl-section *{scroll-behavior:auto!important;transition:none!important}}
      `}</style>

      <div className="reveal pl-eyebrow">Project Management · Interactive Flowchart</div>
      <h2 id="project-lifecycle-title" className="reveal pl-heading">Project Management Lifecycle</h2>
      <p className="reveal pl-intro">
        Follow the project from authorization to handover. The flow stays concise—click any activity, deliverable, stakeholder, or approval for the detail.
      </p>

      <div className="pl-legend" aria-label="Lifecycle categories">
        <span className="pl-legend-label">Categories</span>
        {(Object.keys(CATEGORY_META) as CategoryKey[]).map((key) => (
          <span key={key} className="pl-legend-chip">
            <span className="pl-dot" style={{ background: CATEGORY_META[key].color }} />
            {CATEGORY_META[key].label}
          </span>
        ))}
      </div>

      <div className="pl-flow" aria-label="Five-phase project lifecycle flowchart">
        {PHASES.map((phase, phaseIndex) => {
          const side = phaseIndex % 2 === 0 ? 'left' : 'right';
          return (
            <article key={phase.number} className={`pl-row pl-row-${side}`} aria-labelledby={`pl-phase-${phase.number}`}>
              {side === 'right' && <div className="pl-spacer" aria-hidden="true" />}

              <div className="pl-card">
                <div className="pl-card-head">
                  <div>
                    <h3 id={`pl-phase-${phase.number}`}>{phase.name}</h3>
                    <p>{phase.summary}</p>
                  </div>
                  <span className="pl-phase-tag">Phase {phase.number}</span>
                </div>

                <div className="pl-category-grid">
                  {(Object.keys(CATEGORY_META) as CategoryKey[]).map((category) => (
                    <div key={category} className="pl-category">
                      <h4 style={{ color: CATEGORY_META[category].color }}>{CATEGORY_META[category].label}</h4>
                      <div className="pl-items">
                        {phase.categories[category].map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            className="pl-item"
                            onClick={() => setSelected({ phase, category, item })}
                            aria-label={`Open ${item.label} details for ${phase.name}`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pl-node" aria-hidden="true">
                <div><span>PHASE</span><strong>{phase.number}</strong></div>
              </div>

              {side === 'left' && <div className="pl-spacer" aria-hidden="true" />}
            </article>
          );
        })}
      </div>

      <div className="pl-note">
        <strong>Practical governance map.</strong> Exact artifacts and approval authorities should be tailored to the organization, delivery approach, project size, contract, and risk.
      </div>

      {selected && (
        <div
          className="pl-modal-layer"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <div className="pl-modal" role="dialog" aria-modal="true" aria-labelledby="pl-modal-title">
            <div className="pl-modal-head">
              <div>
                <div className="pl-modal-crumb">
                  Phase {selected.phase.number} · {selected.phase.name} · {CATEGORY_META[selected.category].label}
                </div>
                <h2 id="pl-modal-title">{selected.item.label}</h2>
              </div>
              <button type="button" className="pl-close" onClick={() => setSelected(null)} aria-label="Close details">×</button>
            </div>

            <div className="pl-modal-body">
              <p className="pl-modal-summary">{selected.item.detail}</p>
              <div className="pl-modal-grid">
                <div className="pl-modal-block">
                  <h3>Why it matters</h3>
                  <p>{selected.item.why}</p>
                </div>
                <div className="pl-modal-block">
                  <h3>Completion signal</h3>
                  <p>{selected.item.done}</p>
                </div>
                <div className="pl-modal-block pl-modal-block-wide">
                  <h3>Connects to</h3>
                  <span className="pl-connect">{selected.item.connects}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
