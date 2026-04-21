export const defaultCV = {
  personal: { name: '', title: '', email: '', phone: '', address: '', website: '', photo: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
}

export const demoCV = {
  personal: {
    name: 'Alexandra Chen',
    title: 'Senior Product Designer',
    email: 'alex.chen@email.com',
    phone: '+1 (415) 555-0172',
    address: 'San Francisco, CA',
    website: 'linkedin.com/in/alexchen',
    photo: '',
  },
  summary: 'Product designer with 8+ years of experience crafting user-centred digital products across fintech and SaaS. Passionate about bridging business goals with intuitive interfaces.',
  experience: [
    {
      id: 'exp1', company: 'Stripe', role: 'Senior Product Designer',
      start: '2021-03', end: '', current: true,
      description: '• Led redesign of merchant dashboard, reducing support tickets by 34%.\n• Managed a team of 4 designers across 3 product squads.',
    },
    {
      id: 'exp2', company: 'Figma', role: 'Product Designer',
      start: '2018-06', end: '2021-02', current: false,
      description: '• Owned end-to-end design for commenting system.\n• Increased user activation rate by 22% through onboarding improvements.',
    },
  ],
  education: [
    { id: 'edu1', institution: 'Carnegie Mellon University', degree: "Master's", field: 'Human-Computer Interaction', start: '2016-09', end: '2018-05', gpa: '3.92' },
    { id: 'edu2', institution: 'UC Berkeley', degree: "Bachelor's", field: 'Cognitive Science', start: '2012-09', end: '2016-05', gpa: '3.78' },
  ],
  skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems', 'React', 'SQL', 'A/B Testing'],
  languages: [
    { id: 'lang1', name: 'English', level: 'Native' },
    { id: 'lang2', name: 'Mandarin', level: 'Fluent' },
  ],
}