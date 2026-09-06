# Backend Changelog

## 2026-09-04 - Schema Corrections and Documentation

### Changes Made

#### 1. Database Schema Corrections

**patients table (20260903141917_initial_schema.sql):**
- ✅ Added age constraint: `CHECK (age >= 0 AND age <= 130)`
- ✅ Added gender constraint: `CHECK (gender IN ('Male', 'Female', 'Other'))`
- ✅ Fixed patient_id trigger to handle empty strings

**sessions table (20260903170216_create_sessions_table.sql):**
- ✅ Changed default status from `'Pending'` to `'in_progress'`
- ✅ Added status constraint: `CHECK (status IN ('in_progress', 'submitted', 'reviewed'))`
- ✅ Added `consent_timestamp` field
- ✅ Added `red_flag_reason` field

**medical_history table (20260903171217_create_medical_history.sql):**
- ✅ Added UNIQUE constraint on `session_id` (1:1 relationship)
- ✅ Added missing `current_medications` field

**doctors table (20260903172209_create_doctors_table.sql):**
- ✅ Added `auth_user_id UUID UNIQUE` for Supabase Auth integration

**ai_summaries table (20260903172357_create_ai_summary_table.sql):**
- ✅ Renamed table from `ai_summary` to `ai_summaries` (plural)
- ✅ Added UNIQUE constraint on `session_id` (1:1 relationship)

#### 2. New Migrations Added

**20260904000000_create_question_responses_table.sql:**
- Created missing `question_responses` table
- Added index on `session_id`

**20260904000001_add_indexes.sql:**
- Added performance indexes on:
  - `sessions.patient_id`
  - `sessions.status`
  - `sessions.visit_date`
  - `documents.session_id`
  - `medicines.document_id`
  - `ai_summaries.approved_by`

#### 3. New SQL Reference Files

**sql/complete_schema.sql:**
- Consolidated complete schema in one file
- Includes all tables, constraints, indexes
- Reference for new deployments

**sql/row_level_security.sql:**
- Comprehensive RLS policies for all tables
- Patient/kiosk access policies
- Doctor access policies
- System/AI access policies
- Storage bucket policy notes

**sql/seed_demo_data.sql:**
- Demo patients (3)
- Demo doctors (2)
- Demo sessions (3 states: in_progress, submitted, reviewed)
- Demo medical history
- Demo question responses
- Demo AI summaries

#### 4. Documentation Added

**backend/README.md:**
- Complete backend documentation
- Directory structure
- Database schema overview
- Migration order
- RLS policies explanation
- Storage configuration
- Demo data instructions
- Testing guidelines
- Security checklist
- Troubleshooting guide

**backend/CHANGELOG.md:**
- This file

---

### Migration Path

If you have an existing Supabase database:

1. **Backup existing data:**
   ```bash
   supabase db dump -f backup.sql
   ```

2. **Apply corrected migrations:**
   - Drop and recreate tables if needed
   - Or use `ALTER TABLE` commands to add missing fields/constraints

3. **Update existing data:**
   ```sql
   -- Update old session status values
   UPDATE sessions SET status = 'in_progress' WHERE status = 'Pending';
   ```

4. **Apply new migrations:**
   ```bash
   supabase db push
   ```

5. **Enable RLS:**
   ```bash
   psql -f sql/row_level_security.sql
   ```

6. **Load demo data:**
   ```bash
   psql -f sql/seed_demo_data.sql
   ```

---

### Breaking Changes

1. **Session status values changed:**
   - Old: `'Pending'`
   - New: `'in_progress'`, `'submitted'`, `'reviewed'`
   - **Action Required:** Update frontend code to use new status values

2. **Table renamed:**
   - Old: `ai_summary`
   - New: `ai_summaries`
   - **Action Required:** Update all queries referencing this table

3. **New required field:**
   - `medical_history.current_medications` now exists
   - **Action Required:** Update frontend medical history form

4. **Doctor authentication:**
   - `doctors.auth_user_id` must be populated for RLS to work
   - **Action Required:** Link doctor records to Supabase Auth users

---

### Frontend Impact

Frontend code should be updated to:

1. Use correct status values:
   ```javascript
   // Old
   status === 'Pending'
   
   // New
   status === 'in_progress'
   status === 'submitted'
   status === 'reviewed'
   ```

2. Use correct table name:
   ```javascript
   // Old
   .from('ai_summary')
   
   // New
   .from('ai_summaries')
   ```

3. Include current_medications field:
   ```javascript
   const medicalHistory = {
     history_present_illness: '...',
     past_medical_history: '...',
     current_medications: '...', // NEW
     allergies: '...',
     // ...
   };
   ```

---

### Schema Validation Checklist

- [x] All tables follow plural naming convention (except legacy)
- [x] All foreign keys have proper constraints
- [x] All 1:1 relationships have UNIQUE constraints
- [x] All enum-like fields have CHECK constraints
- [x] All numeric constraints are properly bounded
- [x] All tables have proper indexes for common queries
- [x] All tables have created_at timestamps
- [x] All sensitive tables have RLS policies defined
- [x] Storage bucket policies are documented
- [x] Demo data covers all major workflows

---

### Next Steps

1. Review and approve changes
2. Test migrations on dev Supabase project
3. Update frontend service layer
4. Test patient workflow end-to-end
5. Test doctor workflow end-to-end
6. Test RLS policies
7. Test storage upload/download
8. Load production demo data

---

### Notes

- All changes follow the MediKiosk Final MVP Build Guide
- Schema now matches the documentation exactly
- RLS policies provide appropriate security for MVP
- Demo data supports presentation and testing
- No breaking changes to existing correct implementations