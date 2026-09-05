# MediKiosk Backend

## Overview

This directory contains the backend database schema, migrations, SQL scripts, and OCR processing logic for MediKiosk.

---

## Directory Structure

```text
backend/
├── supabase/
│   ├── migrations/           # Supabase migration files (timestamped)
│   ├── client.js            # Supabase client configuration
│   ├── queries.js           # Reusable database queries
│   └── config.toml          # Supabase configuration
├── sql/
│   ├── complete_schema.sql       # Complete database schema (reference)
│   ├── row_level_security.sql    # RLS policies
│   ├── seed_demo_data.sql        # Demo data for testing
│   ├── policies.sql              # (Legacy/backup)
│   ├── schema.sql                # (Legacy/backup)
│   └── triggers.sql              # (Legacy/backup)
├── ocr/
│   └── extractText.js       # OCR text extraction logic
└── README.md                # This file
```

---

## Database Schema

### Core Tables

| Table | Purpose | Relationship |
|---|---|---|
| `patients` | Permanent patient identity | 1:M with sessions |
| `sessions` | One visit/consultation per session | Belongs to patient |
| `medical_history` | Structured history for a session | 1:1 with session |
| `question_responses` | Guided symptom questions/answers | M:1 with session |
| `documents` | Uploaded medical documents | M:1 with session |
| `medicines` | OCR-extracted medicines | M:1 with document |
| `doctors` | Doctor profiles | Links to Supabase Auth |
| `ai_summaries` | AI draft + doctor-reviewed summary | 1:1 with session |
| `ayush_assessments` | Optional AYUSH extension | 0/1:1 with session |

### Key Relationships

```text
patients (1) ─── (M) sessions
sessions (1) ─── (1) medical_history
sessions (1) ─── (M) question_responses
sessions (1) ─── (M) documents
documents (1) ─── (M) medicines
sessions (1) ─── (1) ai_summaries
doctors (1) ─── (M) ai_summaries (approved_by)
sessions (1) ─── (0/1) ayush_assessments
```

---

## Migrations

Migrations are located in `supabase/migrations/` and should be applied in order:

1. `20260903141917_initial_schema.sql` — patients table
2. `20260903170216_create_sessions_table.sql` — sessions table
3. `20260903171217_create_medical_history.sql` — medical_history table
4. `20260903171513_create_ayush_assessment_table.sql` — ayush_assessments table
5. `20260903171653_create_documents_table.sql` — documents table
6. `20260903171804_create_medicines_table.sql` — medicines table
7. `20260903172209_create_doctors_table.sql` — doctors table
8. `20260903172357_create_ai_summary_table.sql` — ai_summaries table
9. `20260904000000_create_question_responses_table.sql` — question_responses table
10. `20260904000001_add_indexes.sql` — performance indexes

### Apply Migrations

Using Supabase CLI:

```bash
supabase db reset
```

Or apply manually through Supabase dashboard SQL editor.

---

## Important Schema Rules

### Session Status Values

Only these database values are allowed:

```text
in_progress  — Patient is completing intake
submitted    — Patient submitted, waiting for doctor review
reviewed     — Doctor has approved the summary
```

### Patient ID Format

Patient IDs are auto-generated:

```text
MK-10001
MK-10002
MK-10003
...
```

### Age Constraint

```text
0 <= age <= 130
```

### Gender Values

```text
Male
Female
Other
```

### Document Types

```text
Prescription
Lab Report
Discharge Summary
```

### Supported File Formats

```text
JPG
JPEG
PNG
PDF
```

---

## Row Level Security (RLS)

RLS policies are defined in `sql/row_level_security.sql`.

### Key Principles

1. **Patient/Kiosk Access:**
   - Can create patients
   - Can create and update `in_progress` sessions
   - Can insert medical history, questions, documents
   - Cannot access other patients' data

2. **Doctor Access:**
   - Can view `submitted` and `reviewed` sessions
   - Can read all related patient data for assigned sessions
   - Can update session status from `submitted` to `reviewed`
   - Can edit and approve AI summaries
   - Can only view their own doctor profile

3. **AI/System Access:**
   - Can create AI summaries
   - Can extract and store OCR data
   - Can insert medicines from OCR

### Enable RLS

```sql
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
-- ... (apply to all tables)
```

Then apply policies from `sql/row_level_security.sql`.

---

## Supabase Storage

### Bucket Configuration

**Bucket Name:** `medical-documents`

**Privacy:** Private

**Path Format:**

```text
medical-documents/{session_id}/{document_id}-{filename}
```

### Storage Policies

1. **Upload Policy:**
   - Allow authenticated users (kiosk sessions) to upload files to their own session folder

2. **Download Policy:**
   - Allow authenticated doctors to download files for sessions they are reviewing

3. **Delete Policy:**
   - Restrict deletion (manual admin only for MVP)

---

## Demo Data

Seed demo data using:

```bash
psql -h <supabase-host> -U postgres -d postgres -f sql/seed_demo_data.sql
```

Or copy-paste into Supabase SQL editor.

### Demo Accounts

**Patients:**
- MK-10001: Rahul Sharma (Headache case, submitted)
- MK-10002: Priya Verma (Fever case, in progress)
- MK-10003: Amit Kumar (Cough case, reviewed)

**Doctors:**
- Dr. Anjali Singh (General Medicine)
- Dr. Rajesh Patel (Internal Medicine)

**Note:** Doctor `auth_user_id` must be populated after creating Supabase Auth users.

---

## Environment Variables

Create `.env` file in the root or frontend directory:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Important:** Never commit `.env` files. Never expose the service role key in frontend code.

---

## OCR Processing

### Location

`ocr/extractText.js`

### Purpose

Extract text from uploaded medical documents (prescriptions, lab reports, discharge summaries).

### Integration

OCR processing should be triggered after document upload:

```text
Document Upload
      ↓
Store in Supabase Storage
      ↓
Create document record
      ↓
Trigger OCR processing
      ↓
Store OCR text in documents.ocr_text
      ↓
Extract medicines (if applicable)
      ↓
Store in medicines table
```

### Fallback Strategy

If OCR fails:

1. Keep original document accessible
2. Set `ocr_confidence` to 0 or NULL
3. Store error message in `ocr_text`
4. Doctor can still review original document

---

## API/Service Layer

The frontend should interact with Supabase through a service layer:

```text
frontend/src/services/
├── patientService.js
├── sessionService.js
├── questionService.js
├── medicalHistoryService.js
├── documentService.js
├── aiSummaryService.js
├── doctorService.js
└── supabaseClient.js
```

### Example Service Function

```javascript
import { supabase } from './supabaseClient';

export async function createPatient(patientData) {
  const { data, error } = await supabase
    .from('patients')
    .insert([patientData])
    .select();
  
  if (error) throw error;
  return data[0];
}
```

---

## Testing

### Database Tests

1. **Patient creation:**
   - Valid data creates patient with auto-generated ID
   - Invalid age (negative or >130) is rejected
   - Invalid gender is rejected

2. **Session flow:**
   - New session starts with `in_progress`
   - Submission changes status to `submitted`
   - Doctor approval changes status to `reviewed`

3. **Relationships:**
   - One patient can have multiple sessions
   - One session has one medical_history
   - One session can have multiple documents
   - One document can have multiple medicines

4. **RLS:**
   - Unauthenticated users cannot view doctor-only data
   - Doctors cannot access data without proper authentication
   - Medical documents are not publicly accessible

---

## Common Issues

### Issue: Patient ID not auto-generating

**Solution:** Ensure the trigger is created:

```sql
CREATE TRIGGER patient_id_trigger
BEFORE INSERT ON patients
FOR EACH ROW
EXECUTE FUNCTION generate_patient_id();
```

### Issue: RLS blocking legitimate access

**Solution:** Check if:
- User is properly authenticated
- `auth.uid()` matches `doctors.auth_user_id`
- Session status allows the operation

### Issue: Storage upload fails

**Solution:** Check:
- Bucket exists and is private
- Upload policy allows the operation
- File path format is correct
- File size is within limits

---

## Security Checklist

- [ ] RLS enabled on all tables
- [ ] Storage bucket is private
- [ ] Service role key never exposed in frontend
- [ ] Only anon key used in frontend
- [ ] Doctor routes protected
- [ ] Sensitive operations require authentication
- [ ] `.env` file in `.gitignore`
- [ ] No secrets committed to repository

---

## Next Steps

1. Configure Supabase project
2. Apply migrations
3. Enable RLS and apply policies
4. Create storage bucket
5. Create demo doctor auth users
6. Link doctor auth users to doctor records
7. Load seed data
8. Test patient flow
9. Test doctor flow
10. Test OCR integration

---

## References

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

---

**Last Updated:** 2026-09-04