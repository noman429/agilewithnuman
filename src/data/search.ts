import { DOC_DATA } from './docs';
import { METHOD_DATA } from './methodologies';
import { PROJECT_DATA } from './projects';
import { ROLES } from './profile';
import { TOOL_GROUPS } from './tools';

export const SEARCH_CATEGORY_KEYS = [
  'DOCUMENTATION', 'PROJECTS', 'AGILE', 'SCRUM', 'PROJECT_MANAGEMENT',
  'BUSINESS_ANALYSIS', 'QA', 'TOOLS', 'KNOWLEDGE', 'EXPERIENCE', 'PROFILE', 'CONTACT',
] as const;

export type SearchCategoryKey = (typeof SEARCH_CATEGORY_KEYS)[number];

export interface SearchCategory {
  key: SearchCategoryKey;
  label: string;
  icon: string;
  badgeClass: string;
  searchPriority: number;
  defaultVisibility: boolean;
  searchable: boolean;
  accessibleLabel: string;
}

const category = (key: SearchCategoryKey, label: string, icon: string, searchPriority: number, defaultVisibility = true): SearchCategory => ({
  key, label, icon, searchPriority, defaultVisibility, searchable: true,
  badgeClass: `search-badge-${key.toLowerCase().replace('_', '-')}`,
  accessibleLabel: `${label} category`,
});

export const SEARCH_CATEGORIES: Record<SearchCategoryKey, SearchCategory> = {
  DOCUMENTATION: category('DOCUMENTATION', 'Documentation', '▤', 18),
  PROJECTS: category('PROJECTS', 'Projects', '◇', 17),
  AGILE: category('AGILE', 'Agile', '↻', 17),
  SCRUM: category('SCRUM', 'Scrum', '◎', 18),
  PROJECT_MANAGEMENT: category('PROJECT_MANAGEMENT', 'Project Management', '◆', 16),
  BUSINESS_ANALYSIS: category('BUSINESS_ANALYSIS', 'Business Analysis', '⌁', 16),
  QA: category('QA', 'Quality Assurance', '✓', 16),
  TOOLS: category('TOOLS', 'Tools & Workflows', '⚙', 16),
  KNOWLEDGE: category('KNOWLEDGE', 'Knowledge & Guides', '◫', 15),
  EXPERIENCE: category('EXPERIENCE', 'Experience', '◉', 0, false),
  PROFILE: category('PROFILE', 'Profile', '●', 0, false),
  CONTACT: category('CONTACT', 'Contact', '✉', 0, false),
};

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  category: SearchCategoryKey;
  subcategory?: string;
  route: string;
  tags: string[];
  keywords: string[];
  icon?: string;
  defaultPriority: number;
  searchPriority: number;
}

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const makeItem = (data: Omit<SearchItem, 'id' | 'icon' | 'searchPriority'> & { id?: string; searchPriority?: number }): SearchItem => ({
  ...data,
  id: data.id ?? `${data.category.toLowerCase()}-${slug(data.title)}`,
  icon: SEARCH_CATEGORIES[data.category].icon,
  searchPriority: data.searchPriority ?? SEARCH_CATEGORIES[data.category].searchPriority,
});

const docCategory = (name: string, group: string, subgroup = ''): SearchCategoryKey => {
  const value = `${name} ${group} ${subgroup}`.toLowerCase();
  if (/^(brd|frd|prd|user story)$/.test(name.toLowerCase())) return 'DOCUMENTATION';
  if (/test|qa|uat|quality|bug/.test(value)) return 'QA';
  if (/scrum|sprint|backlog|velocity|burndown|definition of/.test(value)) return 'SCRUM';
  if (/user story|acceptance criteria|requirement|brd|frd|prd|process|use case|traceability/.test(value)) return 'BUSINESS_ANALYSIS';
  if (/project|risk|stakeholder|resource|scope|status report|communication/.test(value)) return 'PROJECT_MANAGEMENT';
  return 'DOCUMENTATION';
};

const defaultPriorities: Record<string, number> = {
  'User Story': 100, 'BRD': 98, 'Sprint Retrospective': 96, 'Backlog Refinement': 94,
  'Real Estate Sales & CRM Platform': 92, 'Risk Register': 90, 'Acceptance Criteria': 88, 'QA Test Plan': 86,
};

const docItems = DOC_DATA.map((doc) => {
  const categoryKey = docCategory(doc.name, doc.category, doc.subgroup);
  return makeItem({
    title: doc.name,
    description: doc.oneLiner,
    category: categoryKey,
    subcategory: doc.category,
    route: '#docs',
    tags: [doc.category, doc.subgroup ?? '', doc.name].filter(Boolean),
    keywords: [doc.example ?? '', doc.name === 'BRD' ? 'business requirement document' : '', doc.name === 'FRD' ? 'functional requirement document' : '', doc.name === 'PRD' ? 'product requirement document' : '', doc.name === 'Acceptance Criteria' ? 'AC given when then UAT' : ''].filter(Boolean),
    defaultPriority: defaultPriorities[doc.name] ?? 0,
  });
});

const methodologyItems = METHOD_DATA.map((method) => {
  const categoryKey: SearchCategoryKey = method.name === 'Scrum' ? 'SCRUM' : method.name === 'Agile' ? 'AGILE' : method.name === 'Business Analysis' ? 'BUSINESS_ANALYSIS' : method.name === 'SDLC' ? 'TOOLS' : 'KNOWLEDGE';
  return makeItem({
    title: method.name,
    description: method.tagline,
    category: categoryKey,
    subcategory: 'Delivery methodology',
    route: '#practices',
    tags: [...method.roles, ...method.artifacts],
    keywords: [method.intro, method.workflow, method.bestFor, method.name === 'Scrum' ? 'SM sprint ceremonies' : '', method.name === 'Business Analysis' ? 'BA requirements elicitation BRD FRD' : ''].filter(Boolean),
    defaultPriority: 0,
  });
});

const projectItems = PROJECT_DATA.map((project, index) => makeItem({
  title: project.name,
  description: `${project.industry} · ${project.status}`,
  category: 'PROJECTS',
  subcategory: project.industry,
  route: '#projects',
  tags: [...project.roles, project.methodology, project.industry],
  keywords: [project.summary, ...project.modules],
  defaultPriority: index === 0 ? 92 : 0,
}));

const toolItems = TOOL_GROUPS.flatMap((group) => group.items.map((tool) => makeItem({
  title: tool.name,
  description: tool.tagline,
  category: 'TOOLS',
  subcategory: group.category,
  route: '#tools',
  tags: [group.category, 'workflow'],
  keywords: [group.desc, tool.name === 'Jira' ? 'sprint scrum backlog issue tracking project dashboard' : '', tool.name === 'ClickUp' ? 'task workflow project management' : ''].filter(Boolean),
  defaultPriority: tool.name === 'Jira' ? 84 : 0,
})));

const knowledgeItems: SearchItem[] = [
  makeItem({
    title: 'Project Management Lifecycle Flowchart',
    description: 'Interactive five-phase flowchart with clickable activities, deliverables, stakeholders, and approvals.',
    category: 'PROJECT_MANAGEMENT',
    subcategory: 'Lifecycle guide',
    route: '#project-lifecycle',
    tags: ['project lifecycle', 'flowchart', 'initiation', 'planning', 'execution', 'monitoring and controlling', 'closure'],
    keywords: ['project management lifecycle flow chart initiation planning execution monitoring controlling closure approval stakeholders deliverables governance'],
    defaultPriority: 95,
  }),
];

const personalItems: SearchItem[] = [
  makeItem({ title: 'About Muhammad Numan', description: 'Project Manager, Scrum Master and Business Analyst based in Lahore.', category: 'PROFILE', route: '#about', tags: ['Muhammad Numan', 'about', 'profile'], keywords: ['availability languages location'], defaultPriority: 0 }),
  ...ROLES.map((role) => makeItem({ title: role.title, description: `${role.company} · ${role.dates}`, category: 'EXPERIENCE', subcategory: role.company, route: '#experience', tags: ['employment', 'role', role.company], keywords: role.bullets, defaultPriority: 0 })),
  makeItem({ title: 'Contact Muhammad', description: 'Connect by WhatsApp or email about opportunities and collaborations.', category: 'CONTACT', route: '#contact', tags: ['contact', 'hire'], keywords: ['message email whatsapp get in touch'], defaultPriority: 0 }),
];

export const SEARCH_ITEMS: SearchItem[] = [...docItems, ...methodologyItems, ...projectItems, ...toolItems, ...knowledgeItems, ...personalItems];

export const normalizeSearchText = (value: string) => value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');

const scoreItem = (entry: SearchItem, normalizedQuery: string): number | null => {
  const terms = normalizedQuery.split(' ').filter(Boolean);
  const title = normalizeSearchText(entry.title);
  const tags = entry.tags.map(normalizeSearchText);
  const keywords = entry.keywords.map(normalizeSearchText);
  const categoryLabel = normalizeSearchText(SEARCH_CATEGORIES[entry.category].label);
  const description = normalizeSearchText(entry.description);
  const searchable = [title, ...tags, ...keywords, categoryLabel, description].join(' ');
  if (!terms.every((term) => searchable.includes(term))) return null;
  let score = entry.searchPriority;
  if (title === normalizedQuery) score += 1000;
  else if (title.startsWith(normalizedQuery)) score += 800;
  else if (title.includes(normalizedQuery)) score += 600;
  else if (tags.some((value) => value === normalizedQuery) || keywords.some((value) => value === normalizedQuery)) score += 450;
  else if ([...tags, ...keywords].some((value) => value.includes(normalizedQuery))) score += 300;
  else if (categoryLabel.includes(normalizedQuery)) score += 200;
  else if (description.includes(normalizedQuery)) score += 100;
  score += terms.reduce((total, term) => total + (title.includes(term) ? 30 : tags.some((value) => value.includes(term)) ? 20 : 5), 0);
  return score;
};

export const getSearchResults = (query: string): SearchItem[] => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    const categoryCounts = new Map<SearchCategoryKey, number>();
    return SEARCH_ITEMS
      .filter((entry) => SEARCH_CATEGORIES[entry.category].defaultVisibility && entry.defaultPriority > 0)
      .sort((a, b) => b.defaultPriority - a.defaultPriority)
      .filter((entry) => {
        const count = categoryCounts.get(entry.category) ?? 0;
        if (count >= 2) return false;
        categoryCounts.set(entry.category, count + 1);
        return true;
      })
      .slice(0, 8);
  }
  const unique = new Map<string, { entry: SearchItem; score: number }>();
  SEARCH_ITEMS.forEach((entry) => {
    const score = scoreItem(entry, normalizedQuery);
    if (score === null) return;
    const previous = unique.get(entry.id);
    if (!previous || score > previous.score) unique.set(entry.id, { entry, score });
  });
  return [...unique.values()].sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title)).map(({ entry }) => entry);
};
