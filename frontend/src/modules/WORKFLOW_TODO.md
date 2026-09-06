# MediKiosk Frontend Workflow Todo

## Completed
- Clean architecture split by feature
- Patient and doctor module boundaries created
- Shared service adapters scaffolded for Supabase-ready integration
- Mock patient/doctor data normalized into reusable state contracts
- App router delegated to feature routers
- Reusable shell/navigation primitives added

## Final MVP Workflow
1. Welcome / language choice
2. Patient registration
3. Session creation
4. Chief complaint capture
5. Guided symptom assessment
6. Medical history form
7. Document upload
8. OCR / extraction fallback
9. AI draft summary generation
10. Doctor login
11. Doctor queue dashboard
12. Review patient record
13. Review extracted information
14. Compare data and summary
15. Edit and approve final summary
16. Mark session reviewed

## Module breakdown
### Patient module
- Onboarding / welcome
- Profile / registration
- Intake form flow
- Clinical assessment flow
- Document upload and review
- Submission and completion state

### Doctor module
- Login
- Queue dashboard
- Patient record review
- Extracted-data review
- Clinical summary approval

### Shared module
- Supabase adapters
- Reusable UI shell
- Shared constants
- Service contracts for future backend replacement

## Backend integration plan
- Replace mockPatientService with Supabase patient queries
- Replace mockDoctorService with doctor queue and auth queries
- Replace supabaseAdapter with actual Supabase client calls
- Map domain objects to tables: patients, sessions, medical_history, question_responses, documents, ai_summary, doctors

## Final QA checklist
- Validate end-to-end patient flow
- Validate doctor review and approval flow
- Validate required field rules
- Validate upload and OCR fallback states
- Validate bilingual text rendering
- Validate protected doctor access
- Validate storage and approval flow

## Next implementation actions
- Move screen components into their module folders
- Add real provider/store state management
- Introduce service abstraction for Supabase and mocks
- Add a real data mapper layer
- Connect final screens to the service layer
