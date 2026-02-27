export const techStack = {
  ai: [
    { name: 'Claude (Anthropic)', category: 'AI & LLMs' },
    { name: 'GPT-4o', category: 'AI & LLMs' },
    { name: 'Gemini', category: 'AI & LLMs' },
    { name: 'Prompt Engineering', category: 'AI & LLMs' },
    { name: 'Atlassian ROVO', category: 'AI & LLMs' },
  ],
  automation: [
    { name: 'Python', category: 'Automação' },
    { name: 'n8n', category: 'Automação' },
    { name: 'Google Apps Script', category: 'Automação' },
    { name: 'JIRA Automations', category: 'Automação' },
  ],
  apis: [
    { name: 'GitHub/GitLab APIs', category: 'APIs & Infra' },
    { name: 'Vercel (Serverless)', category: 'APIs & Infra' },
    { name: 'Slack API', category: 'APIs & Infra' },
    { name: 'Docker', category: 'APIs & Infra' },
  ],
  metrics: [
    { name: 'Monte Carlo Simulations', category: 'Métricas' },
    { name: 'Flow Metrics', category: 'Métricas' },
    { name: 'JIRA/Nave', category: 'Métricas' },
  ],
  frontend: [
    { name: 'HTML', category: 'Frontend' },
    { name: 'CSS', category: 'Frontend' },
    { name: 'JavaScript', category: 'Frontend' },
    { name: 'Bootstrap', category: 'Frontend' },
    { name: 'WordPress', category: 'Frontend' },
  ],
  management: [
    { name: 'Kanban', category: 'Gestão' },
    { name: 'OKRs', category: 'Gestão' },
    { name: 'ProductOps', category: 'Gestão' },
    { name: 'Micro SaaS', category: 'Gestão' },
  ],
};

export const getAllTechnologies = () => {
  return Object.values(techStack).flat();
};
