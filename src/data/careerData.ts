export type SkillScore = {
  name: string;
  confidence: number;
};

export type SkillCluster = {
  name: string;
  confidence: number;
  tags: string[];
};

export type JobItem = {
  id: number;
  title: string;
  company: string;
  location: string;
  income: string;
  growth: string;
  requiredSkills: string[];
  requiresMobileRepairWorker: boolean;
};

export type UserProfile = {
  name: string;
  location: string;
  educationLevel: string;
  yearsExperience: number;
  currentRole: string;
  identityNote: string;
  professionalSummary: string;
  strengths: string[];
  skillScores: SkillScore[];
  skillClusters: SkillCluster[];
  relatedRoles: string[];
  workNarrative: string;
  taskSummary: string[];
  safeSkills: string[];
  atRiskSkills: string[];
  nextBestActions: { action: string; timeRequired: string; expectedImpact: string }[];
};

export const mobileRepairProfile: UserProfile = {
  name: 'Imran Khan',
  location: 'Lucknow, India',
  educationLevel: 'No formal degree',
  yearsExperience: 10,
  currentRole: 'Mobile Repair Shop Technician',
  identityNote: 'AI Verified Skills Profile',
  professionalSummary:
    'Hands-on mobile repair technician with 10 years of experience diagnosing, repairing, and optimizing smartphones across hardware and software issues. Trusted by repeat customers for high-accuracy fault detection, fast turnaround, and practical problem solving under cost constraints.',
  strengths: [
    'Circuit-level troubleshooting',
    'Micro-soldering and component replacement',
    'Customer issue triage and communication',
    'Inventory planning for spare parts',
  ],
  skillScores: [
    { name: 'Hardware Diagnosis', confidence: 94 },
    { name: 'Soldering & Board Repair', confidence: 90 },
    { name: 'Software Flashing & Recovery', confidence: 85 },
    { name: 'Customer Service', confidence: 88 },
    { name: 'Shop Operations', confidence: 82 },
  ],
  skillClusters: [
    {
      name: 'Mobile Hardware Repair',
      confidence: 93,
      tags: ['Component Testing', 'Battery/Display Replacement', 'Motherboard Diagnostics'],
    },
    {
      name: 'Software & OS Recovery',
      confidence: 84,
      tags: ['ROM Flashing', 'Data Backup', 'Firmware Troubleshooting'],
    },
    {
      name: 'Customer Handling & Sales',
      confidence: 88,
      tags: ['Issue Intake', 'Cost Communication', 'After-Service Support'],
    },
    {
      name: 'Small Business Operations',
      confidence: 81,
      tags: ['Parts Procurement', 'Service Prioritization', 'Daily Workflow Management'],
    },
  ],
  relatedRoles: [
    'Senior Mobile Repair Technician',
    'Device Service Center Lead',
    'Electronics Field Technician',
    'Warranty Support Specialist',
    'Technical Service Advisor',
  ],
  workNarrative:
    'I run daily diagnostics on damaged phones, replace screens and batteries, repair charging and audio faults, and handle software issues like boot loops and locked devices. I manage customer intake, explain repair options, source spare parts, and make sure repairs are delivered on time with quality checks.',
  taskSummary: [
    'Diagnose hardware faults using multimeter and practical testing routines',
    'Repair display, charging, speaker, microphone, and battery-related issues',
    'Perform software flashing, data-safe resets, and basic recovery',
    'Communicate repair timelines, risks, and cost estimates to customers',
    'Track spare-part usage and prioritize repairs for faster turnaround',
  ],
  safeSkills: [
    'Practical hardware troubleshooting',
    'Complex fault isolation',
    'Customer trust and communication',
    'Repair quality judgment',
  ],
  atRiskSkills: [
    'Basic data entry',
    'Standardized billing workflows',
    'Template-based status updates',
  ],
  nextBestActions: [
    {
      action: 'Complete advanced micro-soldering certification',
      timeRequired: '8-10 hours',
      expectedImpact: 'Boost eligibility for premium repair roles',
    },
    {
      action: 'Learn board-level diagnostics for new 5G chipsets',
      timeRequired: '6 hours',
      expectedImpact: 'Increase high-value repair success rate',
    },
    {
      action: 'Take a short customer CRM workflow module',
      timeRequired: '3 hours',
      expectedImpact: 'Improve service center transition readiness',
    },
  ],
};

const baseJobs: Omit<JobItem, 'id'>[] = [
  { title: 'Mobile Repair Technician', company: 'QuickFix Devices', location: 'Lucknow', income: '$18k - $24k', growth: '+18%', requiredSkills: ['Hardware Diagnosis', 'Screen Replacement', 'Customer Service'], requiresMobileRepairWorker: true },
  { title: 'Smartphone Service Engineer', company: 'FixHub Care', location: 'Kanpur', income: '$20k - $27k', growth: '+17%', requiredSkills: ['Board Repair', 'Battery Systems', 'Troubleshooting'], requiresMobileRepairWorker: true },
  { title: 'Device Repair Specialist', company: 'PhonePulse Labs', location: 'Delhi', income: '$21k - $29k', growth: '+16%', requiredSkills: ['Soldering', 'Circuit Testing', 'Repair QA'], requiresMobileRepairWorker: true },
  { title: 'Mobile Service Center Technician', company: 'Urban Device Point', location: 'Noida', income: '$19k - $26k', growth: '+14%', requiredSkills: ['Display Replacement', 'Issue Intake', 'Software Reset'], requiresMobileRepairWorker: true },
  { title: 'Lead Handset Repair Associate', company: 'CareConnect Mobiles', location: 'Jaipur', income: '$23k - $31k', growth: '+15%', requiredSkills: ['Team Coordination', 'Board Diagnostics', 'Customer Handling'], requiresMobileRepairWorker: true },
  { title: 'Refurbishment Technician (Phones)', company: 'RenewCell India', location: 'Pune', income: '$20k - $28k', growth: '+12%', requiredSkills: ['Device Testing', 'Repair Workflow', 'Parts Grading'], requiresMobileRepairWorker: true },
  { title: 'Warranty Repair Technician', company: 'PhoneTrust Services', location: 'Bhopal', income: '$19k - $25k', growth: '+13%', requiredSkills: ['Warranty Process', 'Fault Logging', 'Hardware Repair'], requiresMobileRepairWorker: true },
  { title: 'Mobile Motherboard Repair Tech', company: 'ChipLine Repairs', location: 'Bengaluru', income: '$24k - $35k', growth: '+20%', requiredSkills: ['Micro-Soldering', 'Board Diagnostics', 'Power Line Testing'], requiresMobileRepairWorker: true },
  { title: 'Field Mobile Support Technician', company: 'Doorstep Device Care', location: 'Mumbai', income: '$22k - $30k', growth: '+11%', requiredSkills: ['On-site Repair', 'Customer Service', 'Fault Isolation'], requiresMobileRepairWorker: true },
  { title: 'Senior Phone Repair Expert', company: 'Prime Gadget Lab', location: 'Hyderabad', income: '$26k - $38k', growth: '+19%', requiredSkills: ['Advanced Troubleshooting', 'Mentoring', 'Repair Strategy'], requiresMobileRepairWorker: true },
  { title: 'Consumer Electronics Technician', company: 'ElectroCare', location: 'Lucknow', income: '$21k - $29k', growth: '+9%', requiredSkills: ['Electronics Repair', 'Diagnostics', 'Quality Check'], requiresMobileRepairWorker: false },
  { title: 'Laptop Service Technician', company: 'CoreFix Center', location: 'Delhi', income: '$23k - $32k', growth: '+8%', requiredSkills: ['Hardware Diagnosis', 'Thermal Repair', 'Component Replacement'], requiresMobileRepairWorker: false },
  { title: 'IT Support Technician', company: 'TechAssist Ops', location: 'Remote', income: '$25k - $36k', growth: '+10%', requiredSkills: ['Troubleshooting', 'Ticket Handling', 'Customer Support'], requiresMobileRepairWorker: false },
  { title: 'Network Installation Associate', company: 'NetWave Infra', location: 'Noida', income: '$24k - $34k', growth: '+7%', requiredSkills: ['Cabling', 'Router Setup', 'Client Support'], requiresMobileRepairWorker: false },
  { title: 'Field Service Technician', company: 'ServicePro Systems', location: 'Indore', income: '$22k - $30k', growth: '+8%', requiredSkills: ['On-site Diagnosis', 'Repair Reporting', 'Problem Solving'], requiresMobileRepairWorker: false },
  { title: 'Customer Technical Advisor', company: 'HelpDesk Plus', location: 'Pune', income: '$20k - $27k', growth: '+11%', requiredSkills: ['Issue Intake', 'Communication', 'Technical Guidance'], requiresMobileRepairWorker: false },
  { title: 'Device QA Inspector', company: 'AssureTech', location: 'Chennai', income: '$21k - $28k', growth: '+6%', requiredSkills: ['Device Testing', 'Checklist Audits', 'Quality Assurance'], requiresMobileRepairWorker: false },
  { title: 'Warehouse Electronics Checker', company: 'SupplySure', location: 'Nagpur', income: '$17k - $23k', growth: '+5%', requiredSkills: ['Inventory Check', 'Device Inspection', 'Data Logging'], requiresMobileRepairWorker: false },
  { title: 'Service Desk Coordinator', company: 'FixFlow Services', location: 'Lucknow', income: '$19k - $24k', growth: '+9%', requiredSkills: ['Task Prioritization', 'Customer Calls', 'Repair Scheduling'], requiresMobileRepairWorker: false },
  { title: 'Parts Procurement Assistant', company: 'SpareChain', location: 'Kanpur', income: '$18k - $26k', growth: '+7%', requiredSkills: ['Vendor Coordination', 'Inventory Planning', 'Cost Tracking'], requiresMobileRepairWorker: false },
  { title: 'Electronics Assembly Technician', company: 'BuildCircuit', location: 'Ahmedabad', income: '$20k - $29k', growth: '+8%', requiredSkills: ['Circuit Handling', 'Assembly Tools', 'QA Testing'], requiresMobileRepairWorker: false },
  { title: 'Technical Trainer (Entry)', company: 'SkillForge Labs', location: 'Delhi', income: '$24k - $33k', growth: '+10%', requiredSkills: ['Demonstration', 'Repair Knowledge', 'Communication'], requiresMobileRepairWorker: false },
  { title: 'POS Device Technician', company: 'RetailTech Aid', location: 'Surat', income: '$22k - $31k', growth: '+9%', requiredSkills: ['Device Setup', 'Fault Diagnosis', 'Client Support'], requiresMobileRepairWorker: false },
  { title: 'Appliance Service Assistant', company: 'HomeFix Network', location: 'Jaipur', income: '$19k - $27k', growth: '+6%', requiredSkills: ['Basic Repair', 'Customer Visits', 'Issue Logging'], requiresMobileRepairWorker: false },
  { title: 'Telecom Tower Support Helper', company: 'SignalGrid', location: 'Bhopal', income: '$21k - $30k', growth: '+5%', requiredSkills: ['Field Safety', 'Hardware Checks', 'Reporting'], requiresMobileRepairWorker: false },
  { title: 'Repair Operations Coordinator', company: 'ServiceLoop', location: 'Noida', income: '$25k - $34k', growth: '+12%', requiredSkills: ['Workflow Management', 'Quality Tracking', 'Team Coordination'], requiresMobileRepairWorker: false },
  { title: 'Device Data Recovery Assistant', company: 'RecoverIT', location: 'Mumbai', income: '$23k - $35k', growth: '+10%', requiredSkills: ['Data Recovery', 'Software Handling', 'Privacy Basics'], requiresMobileRepairWorker: false },
  { title: 'Service Counter Executive', company: 'City Gadget Point', location: 'Lucknow', income: '$17k - $23k', growth: '+8%', requiredSkills: ['Customer Intake', 'Billing Workflow', 'Task Queueing'], requiresMobileRepairWorker: false },
  { title: 'Electronics Diagnostics Analyst', company: 'ProbeTek', location: 'Bengaluru', income: '$28k - $40k', growth: '+13%', requiredSkills: ['Diagnostics', 'Pattern Analysis', 'Fault Reports'], requiresMobileRepairWorker: false },
  { title: 'After-Sales Technical Associate', company: 'TrustServe', location: 'Remote', income: '$22k - $31k', growth: '+9%', requiredSkills: ['Support Calls', 'Troubleshooting', 'Resolution Follow-up'], requiresMobileRepairWorker: false },
  { title: 'IoT Device Maintenance Assistant', company: 'SmartNode Works', location: 'Chennai', income: '$24k - $36k', growth: '+15%', requiredSkills: ['Sensor Diagnostics', 'Firmware Basics', 'Field Support'], requiresMobileRepairWorker: false },
  { title: 'Electronics Workshop Supervisor', company: 'RepairWorks Hub', location: 'Kanpur', income: '$27k - $39k', growth: '+11%', requiredSkills: ['Team Supervision', 'Repair Planning', 'Quality Control'], requiresMobileRepairWorker: false },
  { title: 'Service Documentation Specialist', company: 'DocuTech', location: 'Pune', income: '$19k - $26k', growth: '+6%', requiredSkills: ['Reporting', 'Process Compliance', 'Tool Usage'], requiresMobileRepairWorker: false },
  { title: 'Junior Embedded Repair Technician', company: 'ByteBoard Labs', location: 'Hyderabad', income: '$26k - $37k', growth: '+14%', requiredSkills: ['Board Testing', 'Soldering', 'Firmware Basics'], requiresMobileRepairWorker: false },
  { title: 'Tech Support Process Associate', company: 'OpsBridge', location: 'Gurugram', income: '$20k - $29k', growth: '+7%', requiredSkills: ['Ticket Management', 'Issue Categorization', 'Escalation'], requiresMobileRepairWorker: false },
  { title: 'Consumer Device Auditor', company: 'CheckPoint Digital', location: 'Delhi', income: '$22k - $33k', growth: '+8%', requiredSkills: ['Audit Checklists', 'Defect Detection', 'Reporting'], requiresMobileRepairWorker: false },
  { title: 'Spare Parts Catalog Coordinator', company: 'PartMatrix', location: 'Lucknow', income: '$18k - $25k', growth: '+5%', requiredSkills: ['Cataloging', 'Inventory Labels', 'Data Accuracy'], requiresMobileRepairWorker: false },
  { title: 'Service Quality Associate', company: 'QualityRoute', location: 'Noida', income: '$23k - $34k', growth: '+10%', requiredSkills: ['Service Metrics', 'Root Cause Review', 'Communication'], requiresMobileRepairWorker: false },
  { title: 'Technical Call Center Specialist', company: 'ResolveFast', location: 'Remote', income: '$21k - $30k', growth: '+9%', requiredSkills: ['Voice Support', 'Troubleshooting Scripts', 'Customer Calm Handling'], requiresMobileRepairWorker: false },
  { title: 'Electronics Refurb Program Assistant', company: 'Reboot Devices', location: 'Mumbai', income: '$22k - $31k', growth: '+12%', requiredSkills: ['Refurb Pipeline', 'QA Signoff', 'Component Screening'], requiresMobileRepairWorker: false },
];

const normalize = (value: string) => value.toLowerCase().trim();

export const calculateMatchScore = (job: JobItem, profile: UserProfile) => {
  const userSkills = new Set(profile.skillScores.map((skill) => normalize(skill.name)));
  const clusterTags = profile.skillClusters.flatMap((cluster) => cluster.tags).map(normalize);
  clusterTags.forEach((tag) => userSkills.add(tag));

  const matching = job.requiredSkills.filter((skill) => userSkills.has(normalize(skill))).length;
  const base = Math.round((matching / job.requiredSkills.length) * 55);
  const experienceBonus = Math.min(profile.yearsExperience * 2, 25);
  const mobileBonus = job.requiresMobileRepairWorker ? 15 : 5;
  return Math.max(35, Math.min(98, base + experienceBonus + mobileBonus));
};

export const buildJobsForProfile = (profile: UserProfile) =>
  baseJobs.map((job, idx) => ({
    ...job,
    id: idx + 1,
    match: calculateMatchScore({ ...job, id: idx + 1 }, profile),
  }));

