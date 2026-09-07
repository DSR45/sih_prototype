# Frontend Restructuring Implementation Guide

## Overview
This document provides step-by-step instructions to restructure the MediKiosk frontend into a professional, modular architecture.

## Current State Analysis

### Existing Structure Issues
1. **Duplicate Pages**: Pages exist in both `/pages` and `/modules/*/pages`
2. **Mixed Components**: Components in `/components` and module-specific locations
3. **CSS Organization**: CSS files scattered, not following a consistent pattern
4. **Service Duplication**: Services exist in multiple locations
5. **No Clear Boundaries**: Unclear separation between patient, doctor, and shared code

### Files to Migrate

#### Patient Module Files
- `/pages/Welcome.jsx` + `.css` → `/modules/patient/pages/WelcomePage/`
- `/pages/LanguageSelection.jsx` + `.css` → `/modules/patient/pages/LanguageSelectionPage/`
- `/pages/PatientLogin.jsx` + `.css` → `/modules/patient/pages/PatientLoginPage/`
- `/pages/PatientInformation.jsx` + `.css` → `/modules/patient/pages/PatientInformationPage/`
- `/pages/PatientDetails.jsx` + `.css` → `/modules/patient/pages/PatientDetailsPage/`
- `/pages/PatientWorkflow.jsx` + `.css` → `/modules/patient/pages/PatientWorkflowPage/`
- `/pages/SymptomAssessment.jsx` + `.css` → `/modules/patient/pages/SymptomAssessmentPage/`
- `/components/ChiefComplaint.jsx` + `.css` → `/modules/patient/components/ChiefComplaint/`

#### Doctor Module Files
- `/pages/DoctorLogin.jsx` + `.css` → `/modules/doctor/pages/DoctorLoginPage/`
- `/pages/DoctorDashboard.jsx` + `.css` → `/modules/doctor/pages/DoctorDashboardPage/`

#### Shared Module Files
- `/components/Header.jsx` + `.css` → `/modules/shared/components/Layout/Header/`
- `/components/ProgressBar.jsx` + `.css` → `/modules/shared/components/Layout/ProgressBar/`
- `/components/Icons.jsx` → `/modules/shared/components/Icons/`
- `/components/ScreenShell.jsx` → `/modules/shared/components/Layout/ScreenShell/`
- `/components/StepNavigation.jsx` → `/modules/shared/components/Navigation/StepNavigation/`
- `/components/WorkflowComponents.jsx` + `.css` → `/modules/shared/components/Workflow/`
- `/context/LanguageContext.jsx` → `/modules/shared/contexts/LanguageContext/`
- `/data/translations.js` → `/modules/shared/constants/translations/`
- `/constants/patientFlow.js` → `/modules/shared/constants/`

## New Directory Structure

```
frontend/src/
├── modules/
│   ├── patient/
│   │   ├── components/
│   │   │   ├── ChiefComplaint/
│   │   │   │   ├── index.jsx
│   │   │   │   └── styles.css
│   │   │   └── index.js
│   │   ├── pages/
│   │   │   ├── WelcomePage/
│   │   │   │   ├── index.jsx
│   │   │   │   └── styles.css
│   │   │   ├── LanguageSelectionPage/
│   │   │   ├── PatientLoginPage/
│   │   │   ├── PatientInformationPage/
│   │   │   ├── ChiefComplaintPage/
│   │   │   ├── SymptomAssessmentPage/
│   │   │   ├── PatientDetailsPage/
│   │   │   ├── PatientWorkflowPage/
│   │   │   └── index.js (barrel export)
│   │   ├── hooks/
│   │   │   ├── usePatientFlow.js
│   │   │   ├── usePatientSession.js
│   │   │   └── index.js
│   │   ├── services/
│   │   │   ├── patientService.js
│   │   │   ├── mockPatientService.js
│   │   │   └── index.js
│   │   ├── state/
│   │   │   └── patientState.js
│   │   ├── PatientFlowRouter.jsx
│   │   └── index.js
│   │
│   ├── doctor/
│   │   ├── components/
│   │   │   └── index.js
│   │   ├── pages/
│   │   │   ├── DoctorLoginPage/
│   │   │   │   ├── index.jsx
│   │   │   │   └── styles.css
│   │   │   ├── DoctorDashboardPage/
│   │   │   └── index.js
│   │   ├── hooks/
│   │   │   ├── useDoctorWorkspace.js
│   │   │   └── index.js
│   │   ├── services/
│   │   │   ├── doctorService.js
│   │   │   ├── mockDoctorService.js
│   │   │   └── index.js
│   │   ├── state/
│   │   │   └── doctorState.js
│   │   ├── DoctorWorkspaceRouter.jsx
│   │   └── index.js
│   │
│   └── shared/
│       ├── components/
│       │   ├── Layout/
│       │   │   ├── Header/
│       │   │   │   ├── index.jsx
│       │   │   │   └── styles.css
│       │   │   ├── ProgressBar/
│       │   │   ├── ScreenShell/
│       │   │   └── index.js
│       │   ├── Navigation/
│       │   │   ├── StepNavigation/
│       │   │   └── index.js
│       │   ├── Icons/
│       │   │   ├── index.jsx
│       │   │   └── icons.js
│       │   ├── Workflow/
│       │   └── index.js
│       ├── contexts/
│       │   ├── LanguageContext/
│       │   │   └── index.jsx
│       │   └── index.js
│       ├── constants/
│       │   ├── patientFlow.js
│       │   ├── translations/
│       │   │   ├── index.js
│       │   │   ├── en.js
│       │   │   └── hi.js
│       │   └── index.js
│       ├── services/
│       │   ├── api/
│       │   ├── supabase/
│       │   │   ├── supabaseClient.js
│       │   │   └── supabaseAdapter.js
│       │   └── index.js
│       ├── utils/
│       │   ├── setupVerification.js
│       │   └── index.js
│       └── index.js
│
├── styles/
│   ├── index.css (global imports)
│   ├── variables.css (CSS custom properties)
│   ├── reset.css
│   └── global.css
│
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```

## Step-by-Step Migration Process

### Step 1: Backup Current State
```bash
git add .
git commit -m "Pre-restructure backup"
git branch backup-before-restructure
```

### Step 2: Create New Directory Structure
Create all new directories first (empty, to establish structure)

### Step 3: Move Shared Components (High Priority)
These are used by multiple modules, move first to avoid breaking changes.

1. **Icons Component**
   - Move: `/components/Icons.jsx` → `/modules/shared/components/Icons/index.jsx`
   - Create barrel export in `/modules/shared/components/Icons/index.js`

2. **Layout Components**
   - Move Header, ProgressBar, ScreenShell to `/modules/shared/components/Layout/`
   - Each in its own folder with index.jsx and styles.css

3. **Navigation Components**
   - Move StepNavigation to `/modules/shared/components/Navigation/`

4. **Workflow Components**
   - Move WorkflowComponents to `/modules/shared/components/Workflow/`

### Step 4: Move Contexts and Constants
1. **Language Context**
   - Move `/context/LanguageContext.jsx` → `/modules/shared/contexts/LanguageContext/index.jsx`

2. **Constants**
   - Move `/constants/patientFlow.js` → `/modules/shared/constants/patientFlow.js`
   - Move `/data/translations.js` → `/modules/shared/constants/translations/index.js`
   - Consider splitting translations into separate files per language

3. **Services**
   - Move all services to `/modules/shared/services/`
   - Organize by feature (api, supabase, etc.)

### Step 5: Move Patient Module
1. Create component folders in `/modules/patient/components/`
2. Move ChiefComplaint component
3. Move all patient pages to `/modules/patient/pages/`
4. Update imports in PatientFlowRouter.jsx

### Step 6: Move Doctor Module
1. Move doctor pages to `/modules/doctor/pages/`
2. Update imports in DoctorWorkspaceRouter.jsx

### Step 7: Update All Imports
Work through each file and update import paths:

**Before:**
```javascript
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../data/translations'
import { PATIENT_FLOW } from '../constants/patientFlow'
```

**After:**
```javascript
import { useLanguage } from '@/modules/shared/contexts/LanguageContext'
import { translations } from '@/modules/shared/constants/translations'
import { PATIENT_FLOW } from '@/modules/shared/constants'
```

### Step 8: Setup Path Aliases (Recommended)
Update `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/modules/shared'),
      '@patient': path.resolve(__dirname, './src/modules/patient'),
      '@doctor': path.resolve(__dirname, './src/modules/doctor'),
    }
  }
})
```

### Step 9: Create Barrel Exports
Add `index.js` files for clean imports:

**Example: `/modules/shared/components/index.js`**
```javascript
export { default as Header } from './Layout/Header'
export { default as ProgressBar } from './Layout/ProgressBar'
export { default as ScreenShell } from './Layout/ScreenShell'
export { default as StepNavigation } from './Navigation/StepNavigation'
export * from './Icons'
```

### Step 10: Update CSS Strategy
Consider one of these approaches:

**Option A: CSS Modules**
```javascript
import styles from './styles.module.css'
<div className={styles.container}>
```

**Option B: Keep current approach but organize**
- Keep CSS files next to components
- Use consistent naming: `ComponentName.css`

### Step 11: Clean Up Old Directories
After verifying everything works:
```bash
rm -rf frontend/src/pages
rm -rf frontend/src/components
rm -rf frontend/src/context
rm -rf frontend/src/data
rm -rf frontend/src/constants
```

### Step 12: Testing Checklist
- [ ] All pages render correctly
- [ ] Navigation works between pages
- [ ] Language switching works
- [ ] Patient flow completes end-to-end
- [ ] Doctor login and dashboard work
- [ ] All styles load correctly
- [ ] No console errors
- [ ] Build process completes successfully

## Import Pattern Examples

### Old Pattern (Don't Use)
```javascript
import Component from '../../../components/Component'
import { service } from '../../services/service'
```

### New Pattern (Use This)
```javascript
import { Component } from '@shared/components'
import { service } from '@shared/services'
```

## Benefits of New Structure

1. **Clear Module Boundaries**: Easy to understand what belongs where
2. **Scalability**: Easy to add new features without cluttering
3. **Code Splitting**: Modules can be lazy-loaded for better performance
4. **Testing**: Easier to test isolated modules
5. **Collaboration**: Multiple developers can work without conflicts
6. **Maintenance**: Clear structure makes bugs easier to locate and fix
7. **Onboarding**: New developers can understand the codebase quickly

## Common Pitfalls to Avoid

1. **Don't move files and update imports at the same time** - Move first, then update
2. **Don't forget CSS files** - Move them with their components
3. **Don't skip barrel exports** - They make imports much cleaner
4. **Don't forget to test after each major step**
5. **Don't delete old files until new structure is verified working**

## Maintenance Guidelines

### Adding New Patient Page
```
1. Create folder: /modules/patient/pages/NewPage/
2. Create index.jsx and styles.css
3. Export from /modules/patient/pages/index.js
4. Add route in PatientFlowRouter.jsx
```

### Adding New Shared Component
```
1. Create folder: /modules/shared/components/ComponentName/
2. Create index.jsx and styles.css
3. Export from /modules/shared/components/index.js
4. Use via: import { ComponentName } from '@shared/components'
```

## Rollback Plan

If issues arise:
```bash
git checkout backup-before-restructure
```

## Timeline Estimate

- Setup (directories, aliases): 30 minutes
- Move shared components: 1 hour
- Move patient module: 1.5 hours
- Move doctor module: 1 hour
- Update all imports: 2 hours
- Testing and fixes: 1.5 hours
- **Total: ~7.5 hours**

## Next Steps After Restructuring

1. Add TypeScript types
2. Implement proper state management (Zustand/Redux)
3. Add unit tests
4. Set up Storybook for component documentation
5. Implement proper error boundaries
6. Add loading states
7. Improve accessibility
```