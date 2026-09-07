# MediKiosk Frontend - Quick Reference

## 📁 New File Structure

```
src/
├── modules/
│   ├── patient/          # Everything patient-related
│   │   ├── components/   # Patient-specific UI
│   │   ├── pages/        # Patient screens
│   │   ├── hooks/        # Patient hooks
│   │   ├── services/     # Patient API calls
│   │   └── state/        # Patient state
│   │
│   ├── doctor/           # Everything doctor-related
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── state/
│   │
│   └── shared/           # Shared across modules
│       ├── components/   # Reusable UI components
│       ├── contexts/     # React contexts
│       ├── constants/    # Constants & translations
│       ├── services/     # Core services (API, Supabase)
│       └── utils/        # Utility functions
│
├── styles/               # Global styles
├── App.jsx              # Root component
└── main.jsx             # Entry point
```

## 🔄 Import Patterns

### ✅ DO (After Migration)
```javascript
// Shared components
import { Header, ProgressBar, Icons } from '@shared/components'

// Patient pages
import { WelcomePage, PatientLoginPage } from '@patient/pages'

// Doctor pages
import { DoctorDashboardPage } from '@doctor/pages'

// Contexts
import { useLanguage } from '@shared/contexts/LanguageContext'

// Constants
import { PATIENT_FLOW, translations } from '@shared/constants'

// Services
import { patientService } from '@shared/services'
```

### ❌ DON'T (Old Pattern)
```javascript
import Header from '../../../components/Header'
import { useLanguage } from '../../context/LanguageContext'
import { PATIENT_FLOW } from '../constants/patientFlow'
```

## 🎯 Path Aliases

| Alias | Path | Use For |
|-------|------|----------|
| `@` | `src/` | Absolute imports |
| `@shared` | `src/modules/shared` | Shared resources |
| `@patient` | `src/modules/patient` | Patient module |
| `@doctor` | `src/modules/doctor` | Doctor module |

## 📝 File Naming Conventions

### Components
```
ComponentName/
├── index.jsx          # Component logic
└── styles.css         # Component styles
```

### Pages
```
PageName/
├── index.jsx          # Page component
└── styles.css         # Page styles
```

### Services
```
serviceName.js         # Service file
```

## 🚀 Common Tasks

### Add New Patient Page
```bash
# 1. Create folder
mkdir src/modules/patient/pages/NewPage

# 2. Create files
touch src/modules/patient/pages/NewPage/index.jsx
touch src/modules/patient/pages/NewPage/styles.css

# 3. Export from barrel
# Add to src/modules/patient/pages/index.js:
export { default as NewPage } from './NewPage'

# 4. Add route in PatientFlowRouter.jsx
```

### Add New Shared Component
```bash
# 1. Create folder
mkdir src/modules/shared/components/NewComponent

# 2. Create files
touch src/modules/shared/components/NewComponent/index.jsx
touch src/modules/shared/components/NewComponent/styles.css

# 3. Export from barrel
# Add to src/modules/shared/components/index.js:
export { default as NewComponent } from './NewComponent'

# 4. Use it
import { NewComponent } from '@shared/components'
```

### Add New Service
```bash
# 1. Create service file
touch src/modules/shared/services/api/newService.js

# 2. Export from barrel
# Add to src/modules/shared/services/index.js:
export * from './api/newService'

# 3. Use it
import { newService } from '@shared/services'
```

## 🔍 Where to Find Things

| Looking for... | Location |
|----------------|----------|
| UI Components | `@shared/components` |
| Patient Pages | `@patient/pages` |
| Doctor Pages | `@doctor/pages` |
| Translations | `@shared/constants/translations` |
| API Services | `@shared/services/api` |
| Supabase Client | `@shared/services/supabase` |
| Language Context | `@shared/contexts/LanguageContext` |
| Icons | `@shared/components/Icons` |
| Patient Flow Constants | `@shared/constants` |
| Utilities | `@shared/utils` |

## 🎨 Styling Approach

### Current: CSS Files
- Each component has its own `styles.css`
- Import with: `import './styles.css'`
- Scoped by component name classes

### Future: CSS Modules (Recommended)
```javascript
import styles from './styles.module.css'

<div className={styles.container}>
```

## 🧪 Testing Structure

```
__tests__/
├── patient/
│   ├── pages/
│   └── components/
├── doctor/
│   ├── pages/
│   └── components/
└── shared/
    ├── components/
    └── services/
```

## 📦 Module Exports

### Barrel Exports (index.js)
Each module and sub-folder should have an `index.js`:

```javascript
// Good barrel export
export { default as Component1 } from './Component1'
export { default as Component2 } from './Component2'
export * from './utils'

// Usage
import { Component1, Component2, utilFunction } from './components'
```

## 🔧 Migration Checklist

- [ ] Read `MIGRATION_GUIDE.md`
- [ ] Backup code: `git commit -m "Pre-migration backup"`
- [ ] Run migration script: `node migrate-structure.js`
- [ ] Update `vite.config.js` with path aliases
- [ ] Update `App.jsx` imports
- [ ] Update router files imports
- [ ] Test patient flow
- [ ] Test doctor flow
- [ ] Build successfully: `npm run build`
- [ ] Delete old directories (after verification)

## 🐛 Troubleshooting

### Module not found
```bash
# Check vite.config.js has aliases
# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

### Styles not loading
```bash
# Ensure CSS file is named styles.css
# Check import: import './styles.css'
```

### Import errors after migration
```bash
# Update all imports to use aliases
# Search for old patterns: ../.. 
# Replace with: @shared, @patient, @doctor
```

## 📚 Documentation

- `RESTRUCTURE_PLAN.md` - Overview & rationale
- `RESTRUCTURE_IMPLEMENTATION.md` - Detailed implementation
- `MIGRATION_GUIDE.md` - Step-by-step migration
- `migrate-structure.js` - Automation script
- `QUICK_REFERENCE.md` - This file

## 💡 Best Practices

1. **Module Boundaries**: Keep patient and doctor code separate
2. **Shared First**: Put reusable code in shared module
3. **Barrel Exports**: Use index.js for clean imports
4. **Path Aliases**: Always use `@shared`, `@patient`, `@doctor`
5. **Co-location**: Keep CSS with components
6. **Naming**: Be consistent and descriptive
7. **Testing**: Test after each major change
8. **Documentation**: Update docs when structure changes

## 🎯 Code Review Checklist

- [ ] Imports use path aliases
- [ ] No relative imports like `../../../`
- [ ] Files in correct module (patient/doctor/shared)
- [ ] Barrel exports updated
- [ ] CSS files named `styles.css`
- [ ] No unused imports
- [ ] Component in its own folder
- [ ] Tests in `__tests__` folder

## 📞 Getting Help

If stuck:
1. Check this quick reference
2. Read relevant documentation
3. Check migration script logs
4. Review git diff for changes
5. Ask team members

---

**Remember**: This structure makes the codebase:
- ✅ Easier to navigate
- ✅ Easier to maintain
- ✅ Easier to test
- ✅ Easier to scale
- ✅ Easier to onboard new developers
