export interface HeroBadge {
  label: string;
  pos: string;
  anim: string;
}

const G = 'calc(100% + clamp(8px,1.2vw,32px))';

export const HERO_BADGES: HeroBadge[] = [
  { label: 'Project Manager', pos: 'top:calc(-1 * clamp(20px,3vw,50px));left:50%;transform:translateX(-50%);', anim: 'floatBob1 5s ease-in-out infinite' },
  { label: 'Jira · ClickUp', pos: `top:16%;right:${G};`, anim: 'floatBob2 6.2s ease-in-out infinite' },
  { label: 'Scrum Master', pos: `top:16%;left:${G};`, anim: 'floatBob1 6.5s ease-in-out infinite' },
  { label: 'Sprint Planning', pos: `top:50%;right:${G};transform:translateY(-50%);`, anim: 'floatBob2 6s ease-in-out infinite' },
  { label: 'Business Analyst', pos: `top:50%;left:${G};transform:translateY(-50%);`, anim: 'floatBob1 5.8s ease-in-out infinite' },
  { label: 'Waterfall', pos: `top:84%;right:${G};`, anim: 'floatBob2 7s ease-in-out infinite' },
  { label: 'Stakeholder Management', pos: `top:84%;left:${G};`, anim: 'floatBob1 6.8s ease-in-out infinite' },
  { label: 'Agile · Kanban', pos: 'bottom:calc(-1 * clamp(20px,3vw,50px));left:50%;transform:translateX(-50%);', anim: 'floatBob2 5.5s ease-in-out infinite' },
];

export const HERO_STATS = [
  { label: 'Experience', value: '6+ Yrs', accent: '#5b7cfa' },
  { label: 'Teams Managed', value: 'Cross-team', accent: '#9b6bfa' },
  { label: 'Organizations', value: '4+', accent: '#f45fb0' },
  { label: 'Certifications', value: '2', accent: '#ffb020' },
];

export const ABOUT_FACTS = [
  { label: 'Location', value: 'Johar Town, Lahore' },
  { label: 'Availability', value: 'On-site / Remote' },
  { label: 'Languages', value: 'English, Urdu, Punjabi' },
  { label: 'Education', value: 'BS CS, UET Lahore' },
];

export interface Role {
  dates: string;
  title: string;
  company: string;
  bullets: string[];
}

export const ROLES: Role[] = [
  { dates: 'Dec 2025 to Present', title: 'Project Manager / Scrum Master', company: 'WaxonIT Solutions, Lahore', bullets: [
    'Coordinate workflows and deliverables across development, QA, and design teams, keeping milestones, owners, and priorities on schedule.',
    'Act as communication bridge between technical teams and clients, translating requirements into user stories, workflows, and actionable tasks.',
    'Use AI as a delivery copilot for requirement analysis, backlog refinement, user story and acceptance-criteria drafting, dependency reviews, and risk exploration, while manually validating outputs before project use.',
    'Apply AI-assisted summarization to meeting notes, stakeholder updates, status reports, and release documentation, then verify actions, dates, scope, and commitments against the live project record.',
    'Track project progress and risks using Jira dashboards, flagging blockers before they affect delivery.',
  ] },
  { dates: 'Jun 2023 to Dec 2025', title: 'Project Manager / Scrum Master / SQA Lead', company: 'Visnext Software Solutions, Lahore', bullets: [
    'Coordinated cross-functional onsite and remote teams (UI/UX, frontend, backend, mobile, QA) across multiple concurrent projects.',
    'Managed end-to-end delivery from requirement gathering through release, keeping timelines, budgets, and quality standards on track.',
    'Collaborated with international clients and Product Owners to define scope, prioritize features, and build delivery roadmaps.',
    'Integrated AI-assisted workflows into sprint preparation, requirements clarification, backlog refinement, edge-case and test-scenario ideation, and project documentation to improve delivery readiness.',
    'Used AI to accelerate first drafts of stakeholder summaries, meeting actions, release notes, and project updates, with PM review retained for accuracy, tone, ownership, and commitments.',
  ] },
  { dates: 'Aug 2021 to Jun 2023', title: 'Associate Project Manager / Project Manager', company: '3S Solutions (Pvt.) Ltd., Lahore', bullets: [
    'Led cross-functional Agile teams delivering Web, iOS, and Android applications within scope, timeline, and budget.',
    'Worked closely with UI/UX, development, and QA teams on wireframes, user flows, and actionable development tasks.',
    'Managed Jira boards, Confluence documentation, sprint reports, and release notes to keep teams and stakeholders aligned.',
    'From late 2022, began using generative AI as an assistive tool for requirement drafting, test-scenario ideation, documentation structuring, and research, manually reviewing outputs before incorporating them into delivery work.',
  ] },
  { dates: 'Jan 2021 to Aug 2021', title: 'Project Coordinator & Solution Designer', company: 'Eyrox, Lahore', bullets: [
    'Evaluated business requirements and workflows to support solution development and coordination across teams.',
    'Supported sprint planning, documentation, and coordination between users, designers, and engineering teams.',
  ] },
];

export const EDUCATION = [
  { title: 'BS, Computer Science', detail: 'UET Lahore · 2016–2020' },
  { title: 'Intermediate, Computer Science', detail: 'Garrison College, Muridke · 2014–2016' },
  { title: 'The Basics of Scrum', detail: 'Project Management Institute (PMI)' },
  { title: 'JIRA by Atlassian', detail: 'Coursera' },
];
