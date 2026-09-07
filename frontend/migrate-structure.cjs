/**
 * Frontend Structure Migration Script
 * 
 * This script helps migrate the MediKiosk frontend to a modular architecture.
 * Run with: node migrate-structure.js
 * 
 * WARNING: This script moves files. Make sure you have a backup!
 * Recommended: git commit before running
 */

const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  step: (msg) => console.log(`\n${colors.cyan}▶${colors.reset} ${msg}`)
};

const srcPath = path.join(__dirname, 'src');

// Define the migration map
const migrations = {
  // Shared components
  'components/Icons.jsx': 'modules/shared/components/Icons/index.jsx',
  'components/Header.jsx': 'modules/shared/components/Layout/Header/index.jsx',
  'components/Header.css': 'modules/shared/components/Layout/Header/styles.css',
  'components/ProgressBar.jsx': 'modules/shared/components/Layout/ProgressBar/index.jsx',
  'components/ProgressBar.css': 'modules/shared/components/Layout/ProgressBar/styles.css',
  'components/ScreenShell.jsx': 'modules/shared/components/Layout/ScreenShell/index.jsx',
  'components/StepNavigation.jsx': 'modules/shared/components/Navigation/StepNavigation/index.jsx',
  'components/WorkflowComponents.jsx': 'modules/shared/components/Workflow/index.jsx',
  'components/WorkflowComponents.css': 'modules/shared/components/Workflow/styles.css',
  
  // Shared contexts
  'context/LanguageContext.jsx': 'modules/shared/contexts/LanguageContext/index.jsx',
  
  // Shared constants
  'constants/patientFlow.js': 'modules/shared/constants/patientFlow.js',
  'data/translations.js': 'modules/shared/constants/translations/index.js',
  'data/translationsAddition.js': 'modules/shared/constants/translations/additions.js',
  'data/mockData.js': 'modules/shared/constants/mockData.js',
  
  // Shared utils
  'utils/setupVerification.js': 'modules/shared/utils/setupVerification.js',
  
  // Shared services
  'services/supabaseClient.js': 'modules/shared/services/supabase/client.js',
  'services/aiSummaryService.js': 'modules/shared/services/api/aiSummaryService.js',
  'services/documentService.js': 'modules/shared/services/api/documentService.js',
  'services/medicalHistoryService.js': 'modules/shared/services/api/medicalHistoryService.js',
  'services/questionService.js': 'modules/shared/services/api/questionService.js',
  'services/sessionService.js': 'modules/shared/services/api/sessionService.js',
  'services/patientService.js': 'modules/shared/services/api/patientService.js',
  'services/doctorService.js': 'modules/shared/services/api/doctorService.js',
  
  // Patient components
  'components/ChiefComplaint.jsx': 'modules/patient/components/ChiefComplaint/index.jsx',
  'components/ChiefComplaint.css': 'modules/patient/components/ChiefComplaint/styles.css',
  
  // Patient pages
  'pages/Welcome.jsx': 'modules/patient/pages/WelcomePage/index.jsx',
  'pages/Welcome.css': 'modules/patient/pages/WelcomePage/styles.css',
  'pages/LanguageSelection.jsx': 'modules/patient/pages/LanguageSelectionPage/index.jsx',
  'pages/LanguageSelection.css': 'modules/patient/pages/LanguageSelectionPage/styles.css',
  'pages/PatientLogin.jsx': 'modules/patient/pages/PatientLoginPage/index.jsx',
  'pages/PatientLogin.css': 'modules/patient/pages/PatientLoginPage/styles.css',
  'pages/PatientInformation.jsx': 'modules/patient/pages/PatientInformationPage/index.jsx',
  'pages/PatientInformation.css': 'modules/patient/pages/PatientInformationPage/styles.css',
  'pages/PatientDetails.jsx': 'modules/patient/pages/PatientDetailsPage/index.jsx',
  'pages/PatientDetails.css': 'modules/patient/pages/PatientDetailsPage/styles.css',
  'pages/PatientWorkflow.jsx': 'modules/patient/pages/PatientWorkflowPage/index.jsx',
  'pages/PatientWorkflow.css': 'modules/patient/pages/PatientWorkflowPage/styles.css',
  'pages/SymptomAssessment.jsx': 'modules/patient/pages/SymptomAssessmentPage/index.jsx',
  'pages/SymptomAssessment.css': 'modules/patient/pages/SymptomAssessmentPage/styles.css',
  
  // Doctor pages
  'pages/DoctorLogin.jsx': 'modules/doctor/pages/DoctorLoginPage/index.jsx',
  'pages/DoctorLogin.css': 'modules/doctor/pages/DoctorLoginPage/styles.css',
  'pages/DoctorDashboard.jsx': 'modules/doctor/pages/DoctorDashboardPage/index.jsx',
  'pages/DoctorDashboard.css': 'modules/doctor/pages/DoctorDashboardPage/styles.css',
  
  // Demo page
  'pages/DemoLanding.jsx': 'modules/shared/pages/DemoLanding/index.jsx',
  'pages/DemoLanding.css': 'modules/shared/pages/DemoLanding/styles.css',
};

// Create directory if it doesn't exist
function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    log.success(`Created directory: ${dir}`);
  }
}

// Copy file
function copyFile(from, to) {
  const fromPath = path.join(srcPath, from);
  const toPath = path.join(srcPath, to);
  
  if (!fs.existsSync(fromPath)) {
    log.warn(`Source file not found: ${from}`);
    return false;
  }
  
  ensureDir(toPath);
  fs.copyFileSync(fromPath, toPath);
  log.success(`Copied: ${from} → ${to}`);
  return true;
}

// Update import statements in a file
function updateImports(filePath) {
  const fullPath = path.join(srcPath, filePath);
  
  if (!fs.existsSync(fullPath)) {
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let updated = false;
  
  // Update common import patterns
  const importUpdates = {
    "from '../context/LanguageContext'": "from '@shared/contexts/LanguageContext'",
    "from '../../context/LanguageContext'": "from '@shared/contexts/LanguageContext'",
    "from '../../../context/LanguageContext'": "from '@shared/contexts/LanguageContext'",
    "from '../data/translations'": "from '@shared/constants/translations'",
    "from '../../data/translations'": "from '@shared/constants/translations'",
    "from '../constants/patientFlow'": "from '@shared/constants'",
    "from '../../constants/patientFlow'": "from '@shared/constants'",
    "from './Icons'": "from '@shared/components/Icons'",
    "from '../components/Icons'": "from '@shared/components/Icons'",
    "from './Header'": "from '@shared/components/Layout/Header'",
    "from './ProgressBar'": "from '@shared/components/Layout/ProgressBar'",
    "from './ScreenShell'": "from '@shared/components/Layout/ScreenShell'",
    "from './StepNavigation'": "from '@shared/components/Navigation/StepNavigation'",
    "from '../services/": "from '@shared/services/api/",
    "'./ChiefComplaint.css'": "'./styles.css'",
    "'./Header.css'": "'./styles.css'",
    "'./ProgressBar.css'": "'./styles.css'",
    "'./WorkflowComponents.css'": "'./styles.css'",
  };
  
  for (const [oldImport, newImport] of Object.entries(importUpdates)) {
    if (content.includes(oldImport)) {
      content = content.replace(new RegExp(oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newImport);
      updated = true;
    }
  }
  
  if (updated) {
    fs.writeFileSync(fullPath, content, 'utf8');
    log.success(`Updated imports in: ${filePath}`);
  }
}

// Main migration function
function migrate() {
  console.log('\n' + '='.repeat(60));
  console.log('  MediKiosk Frontend Structure Migration');
  console.log('='.repeat(60) + '\n');
  
  log.warn('⚠️  IMPORTANT: Make sure you have committed your changes!');
  log.info('This script will copy files to new locations.\n');
  
  // Step 1: Copy files
  log.step('Step 1: Copying files to new structure...');
  let copiedCount = 0;
  for (const [from, to] of Object.entries(migrations)) {
    if (copyFile(from, to)) {
      copiedCount++;
    }
  }
  log.info(`Copied ${copiedCount} files\n`);
  
  // Step 2: Update imports in new files
  log.step('Step 2: Updating imports in migrated files...');
  for (const to of Object.values(migrations)) {
    updateImports(to);
  }
  
  // Step 3: Create barrel exports
  log.step('Step 3: Creating barrel exports...');
  createBarrelExports();
  
  // Step 4: Instructions
  log.step('Migration complete! Next steps:');
  console.log('\n1. Update vite.config.js with path aliases (see RESTRUCTURE_IMPLEMENTATION.md)');
  console.log('2. Update imports in App.jsx and router files');
  console.log('3. Test the application thoroughly');
  console.log('4. Once verified, delete old directories:');
  console.log('   - frontend/src/pages');
  console.log('   - frontend/src/components');
  console.log('   - frontend/src/context');
  console.log('   - frontend/src/data');
  console.log('   - frontend/src/constants\n');
  
  log.warn('⚠️  Do NOT delete old files until you verify everything works!\n');
}

// Create barrel export files
function createBarrelExports() {
  const barrelExports = [
    {
      path: 'modules/shared/components/index.js',
      content: `// Barrel export for shared components
export { default as Header } from './Layout/Header'
export { default as ProgressBar } from './Layout/ProgressBar'
export { default as ScreenShell } from './Layout/ScreenShell'
export { default as StepNavigation } from './Navigation/StepNavigation'
export * from './Icons'
export { default as WorkflowComponents } from './Workflow'
`
    },
    {
      path: 'modules/shared/contexts/index.js',
      content: `// Barrel export for shared contexts
export { LanguageProvider, useLanguage } from './LanguageContext'
`
    },
    {
      path: 'modules/shared/constants/index.js',
      content: `// Barrel export for shared constants
export { PATIENT_FLOW } from './patientFlow'
export { translations } from './translations'
export * from './mockData'
`
    },
    {
      path: 'modules/shared/services/index.js',
      content: `// Barrel export for shared services
export * from './api/patientService'
export * from './api/doctorService'
export * from './api/sessionService'
export * from './api/questionService'
export * from './api/documentService'
export * from './api/medicalHistoryService'
export * from './api/aiSummaryService'
export { supabase } from './supabase/client'
`
    },
    {
      path: 'modules/patient/pages/index.js',
      content: `// Barrel export for patient pages
export { default as WelcomePage } from './WelcomePage'
export { default as LanguageSelectionPage } from './LanguageSelectionPage'
export { default as PatientLoginPage } from './PatientLoginPage'
export { default as PatientInformationPage } from './PatientInformationPage'
export { default as PatientDetailsPage } from './PatientDetailsPage'
export { default as PatientWorkflowPage } from './PatientWorkflowPage'
export { default as SymptomAssessmentPage } from './SymptomAssessmentPage'
`
    },
    {
      path: 'modules/patient/components/index.js',
      content: `// Barrel export for patient components
export { default as ChiefComplaint } from './ChiefComplaint'
`
    },
    {
      path: 'modules/doctor/pages/index.js',
      content: `// Barrel export for doctor pages
export { default as DoctorLoginPage } from './DoctorLoginPage'
export { default as DoctorDashboardPage } from './DoctorDashboardPage'
`
    },
  ];
  
  barrelExports.forEach(({ path: filePath, content }) => {
    const fullPath = path.join(srcPath, filePath);
    ensureDir(fullPath);
    fs.writeFileSync(fullPath, content, 'utf8');
    log.success(`Created barrel export: ${filePath}`);
  });
}

// Run migration
if (require.main === module) {
  migrate();
}

module.exports = { migrate };
