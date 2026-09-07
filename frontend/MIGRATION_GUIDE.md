# MediKiosk Frontend Migration Guide

## Quick Start

This guide helps you restructure the MediKiosk frontend into a professional, modular architecture.

## Prerequisites

1. **Backup your work**
   ```bash
   git add .
   git commit -m "Pre-migration backup"
   git branch backup-pre-migration
   ```

2. **Review the plan**
   - Read `RESTRUCTURE_PLAN.md` for overview
   - Read `RESTRUCTURE_IMPLEMENTATION.md` for details

## Option 1: Automated Migration (Recommended)

### Step 1: Run the migration script
```bash
cd frontend
node migrate-structure.js
```

### Step 2: Update vite.config.js
Add path aliases to make imports cleaner:

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

### Step 3: Update App.jsx imports

Replace old imports:
```javascript
// OLD
import Header from './components/Header'
import ProgressBar from './components/ProgressBar'
import DemoLanding from './pages/DemoLanding'
import { PATIENT_FLOW } from './constants/patientFlow'
import PatientFlowRouter from './modules/patient/PatientFlowRouter'
import DoctorWorkspaceRouter from './modules/doctor/DoctorWorkspaceRouter'
```

With new imports:
```javascript
// NEW
import { Header, ProgressBar } from '@shared/components'
import { DemoLanding } from '@shared/pages'
import { PATIENT_FLOW } from '@shared/constants'
import { PatientFlowRouter } from '@patient'
import { DoctorWorkspaceRouter } from '@doctor'
```

### Step 4: Update Router Files

**PatientFlowRouter.jsx** - Update imports:
```javascript
import { 
  WelcomePage, 
  LanguageSelectionPage,
  PatientLoginPage,
  PatientInformationPage,
  PatientDetailsPage,
  PatientWorkflowPage,
  SymptomAssessmentPage 
} from '@patient/pages'
import { ChiefComplaint } from '@patient/components'
```

**DoctorWorkspaceRouter.jsx** - Update imports:
```javascript
import { DoctorLoginPage, DoctorDashboardPage } from '@doctor/pages'
```

### Step 5: Test Everything
```bash
npm run dev
```

Test checklist:
- [ ] Application loads without errors
- [ ] Language selection works
- [ ] Patient flow navigation works
- [ ] Doctor login works
- [ ] All styles load correctly
- [ ] No console errors

### Step 6: Clean Up (Only after testing!)

Once everything is verified working:
```bash
# Delete old directories
rm -rf src/pages
rm -rf src/components  
rm -rf src/context
rm -rf src/data
rm -rf src/constants

# Keep these if they have files not migrated
# Check manually first!
```

## Option 2: Manual Migration

If you prefer to migrate manually or the script doesn't work:

### Phase 1: Create Directory Structure

```bash
# Shared components
mkdir -p src/modules/shared/components/Layout/Header
mkdir -p src/modules/shared/components/Layout/ProgressBar
mkdir -p src/modules/shared/components/Layout/ScreenShell
mkdir -p src/modules/shared/components/Navigation/StepNavigation
mkdir -p src/modules/shared/components/Icons
mkdir -p src/modules/shared/components/Workflow

# Shared contexts
mkdir -p src/modules/shared/contexts/LanguageContext

# Shared constants
mkdir -p src/modules/shared/constants/translations

# Shared services
mkdir -p src/modules/shared/services/api
mkdir -p src/modules/shared/services/supabase

# Shared utils
mkdir -p src/modules/shared/utils

# Shared pages
mkdir -p src/modules/shared/pages/DemoLanding

# Patient pages
mkdir -p src/modules/patient/pages/WelcomePage
mkdir -p src/modules/patient/pages/LanguageSelectionPage
mkdir -p src/modules/patient/pages/PatientLoginPage
mkdir -p src/modules/patient/pages/PatientInformationPage
mkdir -p src/modules/patient/pages/PatientDetailsPage
mkdir -p src/modules/patient/pages/PatientWorkflowPage
mkdir -p src/modules/patient/pages/SymptomAssessmentPage

# Patient components
mkdir -p src/modules/patient/components/ChiefComplaint

# Doctor pages
mkdir -p src/modules/doctor/pages/DoctorLoginPage
mkdir -p src/modules/doctor/pages/DoctorDashboardPage
```

### Phase 2: Move Files

#### Shared Components
```bash
# Icons
cp src/components/Icons.jsx src/modules/shared/components/Icons/index.jsx

# Header
cp src/components/Header.jsx src/modules/shared/components/Layout/Header/index.jsx
cp src/components/Header.css src/modules/shared/components/Layout/Header/styles.css

# ProgressBar
cp src/components/ProgressBar.jsx src/modules/shared/components/Layout/ProgressBar/index.jsx
cp src/components/ProgressBar.css src/modules/shared/components/Layout/ProgressBar/styles.css

# ScreenShell
cp src/components/ScreenShell.jsx src/modules/shared/components/Layout/ScreenShell/index.jsx

# StepNavigation
cp src/components/StepNavigation.jsx src/modules/shared/components/Navigation/StepNavigation/index.jsx

# WorkflowComponents
cp src/components/WorkflowComponents.jsx src/modules/shared/components/Workflow/index.jsx
cp src/components/WorkflowComponents.css src/modules/shared/components/Workflow/styles.css
```

#### Shared Contexts
```bash
cp src/context/LanguageContext.jsx src/modules/shared/contexts/LanguageContext/index.jsx
```

#### Shared Constants
```bash
cp src/constants/patientFlow.js src/modules/shared/constants/
cp src/data/translations.js src/modules/shared/constants/translations/index.js
cp src/data/translationsAddition.js src/modules/shared/constants/translations/additions.js
cp src/data/mockData.js src/modules/shared/constants/
```

#### Shared Services
```bash
cp src/services/supabaseClient.js src/modules/shared/services/supabase/client.js
cp src/services/patientService.js src/modules/shared/services/api/
cp src/services/doctorService.js src/modules/shared/services/api/
cp src/services/sessionService.js src/modules/shared/services/api/
cp src/services/questionService.js src/modules/shared/services/api/
cp src/services/documentService.js src/modules/shared/services/api/
cp src/services/medicalHistoryService.js src/modules/shared/services/api/
cp src/services/aiSummaryService.js src/modules/shared/services/api/
```

#### Shared Utils
```bash
cp src/utils/setupVerification.js src/modules/shared/utils/
```

#### Patient Components
```bash
cp src/components/ChiefComplaint.jsx src/modules/patient/components/ChiefComplaint/index.jsx
cp src/components/ChiefComplaint.css src/modules/patient/components/ChiefComplaint/styles.css
```

#### Patient Pages
```bash
cp src/pages/Welcome.jsx src/modules/patient/pages/WelcomePage/index.jsx
cp src/pages/Welcome.css src/modules/patient/pages/WelcomePage/styles.css

cp src/pages/LanguageSelection.jsx src/modules/patient/pages/LanguageSelectionPage/index.jsx
cp src/pages/LanguageSelection.css src/modules/patient/pages/LanguageSelectionPage/styles.css

cp src/pages/PatientLogin.jsx src/modules/patient/pages/PatientLoginPage/index.jsx
cp src/pages/PatientLogin.css src/modules/patient/pages/PatientLoginPage/styles.css

cp src/pages/PatientInformation.jsx src/modules/patient/pages/PatientInformationPage/index.jsx
cp src/pages/PatientInformation.css src/modules/patient/pages/PatientInformationPage/styles.css

cp src/pages/PatientDetails.jsx src/modules/patient/pages/PatientDetailsPage/index.jsx
cp src/pages/PatientDetails.css src/modules/patient/pages/PatientDetailsPage/styles.css

cp src/pages/PatientWorkflow.jsx src/modules/patient/pages/PatientWorkflowPage/index.jsx
cp src/pages/PatientWorkflow.css src/modules/patient/pages/PatientWorkflowPage/styles.css

cp src/pages/SymptomAssessment.jsx src/modules/patient/pages/SymptomAssessmentPage/index.jsx
cp src/pages/SymptomAssessment.css src/modules/patient/pages/SymptomAssessmentPage/styles.css
```

#### Doctor Pages
```bash
cp src/pages/DoctorLogin.jsx src/modules/doctor/pages/DoctorLoginPage/index.jsx
cp src/pages/DoctorLogin.css src/modules/doctor/pages/DoctorLoginPage/styles.css

cp src/pages/DoctorDashboard.jsx src/modules/doctor/pages/DoctorDashboardPage/index.jsx
cp src/pages/DoctorDashboard.css src/modules/doctor/pages/DoctorDashboardPage/styles.css
```

#### Demo Page
```bash
cp src/pages/DemoLanding.jsx src/modules/shared/pages/DemoLanding/index.jsx
cp src/pages/DemoLanding.css src/modules/shared/pages/DemoLanding/styles.css
```

### Phase 3: Update CSS Imports

In each moved component, update CSS imports from:
```javascript
import './ComponentName.css'
```
To:
```javascript
import './styles.css'
```

### Phase 4: Update Import Paths

Go through each moved file and update imports. Common patterns:

**Old:**
```javascript
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../data/translations'
import { PATIENT_FLOW } from '../constants/patientFlow'
import { Icons } from './Icons'
import Header from './Header'
```

**New:**
```javascript
import { useLanguage } from '@shared/contexts/LanguageContext'
import { translations } from '@shared/constants/translations'
import { PATIENT_FLOW } from '@shared/constants'
import { Icons } from '@shared/components/Icons'
import { Header } from '@shared/components'
```

### Phase 5: Create Barrel Exports

Create index.js files for clean imports. See the automated script for examples.

## Common Issues and Solutions

### Issue: Module not found
**Solution:** Check that path aliases are configured in vite.config.js

### Issue: Styles not loading
**Solution:** Ensure CSS files are renamed to `styles.css` and imports are updated

### Issue: Circular dependencies
**Solution:** Check barrel exports, ensure they don't create circular references

### Issue: Build fails
**Solution:** Clear node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

## Verification Checklist

- [ ] All pages load without errors
- [ ] Language switching works
- [ ] Patient registration flow works
- [ ] Patient login works
- [ ] Chief complaint page works
- [ ] Symptom assessment works
- [ ] Document upload works (if implemented)
- [ ] Doctor login works
- [ ] Doctor dashboard loads
- [ ] Patient queue displays
- [ ] All styles are applied correctly
- [ ] Navigation between pages works
- [ ] Progress bar updates correctly
- [ ] Build completes successfully: `npm run build`
- [ ] No console errors or warnings

## Rollback

If something goes wrong:
```bash
git checkout backup-pre-migration
```

## Post-Migration Best Practices

### Adding New Component
```
1. Create folder: src/modules/[module]/components/ComponentName/
2. Add index.jsx and styles.css
3. Export from module's components/index.js
4. Import using: import { ComponentName } from '@[module]/components'
```

### Adding New Page
```
1. Create folder: src/modules/[module]/pages/PageName/
2. Add index.jsx and styles.css
3. Export from module's pages/index.js
4. Add route in module router
5. Import using: import { PageName } from '@[module]/pages'
```

### Adding New Service
```
1. Add file: src/modules/shared/services/api/serviceName.js
2. Export from services/index.js
3. Import using: import { service } from '@shared/services'
```

## Need Help?

Refer to:
- `RESTRUCTURE_PLAN.md` - High-level overview
- `RESTRUCTURE_IMPLEMENTATION.md` - Detailed implementation guide
- `migrate-structure.js` - Automation script

## Success!

Once migration is complete, you'll have:
✅ Clear module boundaries
✅ Scalable architecture
✅ Easy to navigate codebase
✅ Better developer experience
✅ Faster onboarding for new developers
