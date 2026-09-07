# Frontend Restructuring Plan

## Current Issues
1. Duplicate pages in `/pages` and `/modules/*/pages`
2. Components scattered between `/components` and modules
3. CSS files mixed with components
4. Services duplicated across modules
5. Inconsistent file organization

## New Structure

```
frontend/src/
├── modules/
│   ├── patient/
│   │   ├── components/          # Patient-specific components
│   │   │   ├── ChiefComplaint/
│   │   │   │   ├── ChiefComplaint.jsx
│   │   │   │   ├── ChiefComplaint.module.css
│   │   │   │   └── index.js
│   │   │   ├── SymptomAssessment/
│   │   │   └── index.js
│   │   ├── pages/               # Patient pages
│   │   │   ├── WelcomePage/
│   │   │   ├── LanguageSelectionPage/
│   │   │   ├── PatientLoginPage/
│   │   │   ├── PatientInformationPage/
│   │   │   ├── ChiefComplaintPage/
│   │   │   ├── SymptomAssessmentPage/
│   │   │   ├── PatientDetailsPage/
│   │   │   ├── PatientWorkflowPage/
│   │   │   └── index.js
│   │   ├── hooks/               # Patient-specific hooks
│   │   ├── services/            # Patient API services
│   │   ├── state/               # Patient state management
│   │   ├── constants/           # Patient constants
│   │   ├── utils/               # Patient utilities
│   │   ├── PatientFlowRouter.jsx
│   │   └── index.js
│   │
│   ├── doctor/
│   │   ├── components/          # Doctor-specific components
│   │   ├── pages/
│   │   │   ├── DoctorLoginPage/
│   │   │   ├── DoctorDashboardPage/
│   │   │   └── index.js
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── state/
│   │   ├── constants/
│   │   ├── utils/
│   │   ├── DoctorWorkspaceRouter.jsx
│   │   └── index.js
│   │
│   └── shared/
│       ├── components/          # Shared UI components
│       │   ├── Layout/
│       │   │   ├── Header/
│       │   │   ├── ProgressBar/
│       │   │   └── index.js
│       │   ├── Navigation/
│       │   ├── Icons/
│       │   └── index.js
│       ├── hooks/              # Shared hooks
│       ├── services/           # Core services
│       │   ├── api/
│       │   ├── supabase/
│       │   └── index.js
│       ├── constants/          # Global constants
│       ├── utils/              # Utility functions
│       ├── contexts/           # React contexts
│       │   ├── LanguageContext/
│       │   └── index.js
│       └── index.js
│
├── styles/
│   ├── global.css              # Global styles
│   ├── variables.css           # CSS variables
│   ├── reset.css               # CSS reset
│   └── themes/                 # Theme files
│
├── assets/                     # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── config/                     # Configuration files
│   ├── app.config.js
│   └── routes.config.js
│
├── types/                      # TypeScript types (future)
│
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```

## Migration Steps

### Phase 1: Create New Structure
1. Create new folder structure
2. Set up index.js barrel exports

### Phase 2: Move Shared Components
1. Move Header, ProgressBar to shared/components/Layout
2. Move Icons to shared/components
3. Move ScreenShell, StepNavigation to shared/components/Navigation

### Phase 3: Move Patient Module
1. Move ChiefComplaint to patient/components
2. Consolidate patient pages
3. Move patient services
4. Organize patient CSS

### Phase 4: Move Doctor Module
1. Consolidate doctor pages
2. Move doctor services
3. Organize doctor CSS

### Phase 5: Shared Resources
1. Move LanguageContext to shared/contexts
2. Move translations to shared/constants
3. Move utilities to shared/utils
4. Consolidate services

### Phase 6: Cleanup
1. Remove old /pages directory
2. Remove old /components directory
3. Update all imports
4. Test all routes

### Phase 7: Styling Strategy
1. Convert to CSS Modules or Styled Components
2. Create design tokens
3. Establish naming conventions

## Benefits
- Clear module boundaries
- Easy to find files
- Scalable architecture
- Better code reusability
- Easier testing
- Better performance (code splitting)
```