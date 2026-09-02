# BUSINESS_RULES.md

# MediKiosk Business Rules

**Project:** MediKiosk -- AI-Powered Pre-Consultation Patient
Case-Taking Software

**Version:** MVP 1.0

**Purpose:** Define the business rules that govern how MediKiosk
collects, stores, processes, and presents patient information during the
pre-consultation workflow.

------------------------------------------------------------------------

# 1. Core Business Principles

1.  MediKiosk is a **pre-consultation information collection system**,
    not a diagnostic system.
2.  AI may organize and summarize patient information but **must never
    make medical decisions**.
3.  The doctor is the final authority for reviewing, editing, and
    approving every clinical summary.
4.  Every patient visit is treated as a separate consultation case.
5.  All patient information must remain linked to the correct patient
    record.

------------------------------------------------------------------------

# 2. Patient Registration Rules

## BR-001 Patient Registration

Every patient must complete registration before starting case-taking.

Required fields:

-   Full Name
-   Age
-   Gender
-   Mobile Number

The system automatically generates a unique Patient ID.

Example: `MK-10001`

## BR-002 Mobile Number Validation

-   Mobile number must contain only digits.
-   Length should be 10 digits (MVP validation).
-   Duplicate mobile numbers are allowed because multiple family members
    may share one phone.

## BR-003 Age Validation

-   Age cannot be negative.
-   Acceptable MVP range:
    -   Minimum: 0
    -   Maximum: 120

------------------------------------------------------------------------

# 3. Language Rules

## BR-004 Supported Languages

The MVP supports only:

-   English
-   Hindi

Language selection occurs before patient registration.

------------------------------------------------------------------------

# 4. Patient Case Rules

## BR-005 One Visit = One Case

Each consultation creates a new Patient Case.

Previous cases remain accessible.

## BR-006 Chief Complaint Required

A patient cannot continue without providing a primary complaint.

Accepted input methods:

-   Voice
-   Text
-   Touch options

## BR-007 Complaint Categories

Supported MVP categories:

-   Fever
-   Headache
-   Cough
-   Abdominal Pain
-   General Weakness

Other complaints may be stored as free text.

------------------------------------------------------------------------

# 5. AI Case-Taking Rules

## BR-008 Follow-Up Questions

The system asks structured follow-up questions based on the selected
complaint.

Example questions:

-   When did symptoms begin?
-   How long have they lasted?
-   How severe are they?
-   Where is the discomfort?
-   Associated symptoms?
-   Medication already taken?

## BR-009 AI Scope

AI may:

-   Understand patient responses
-   Ask relevant follow-up questions
-   Structure collected information
-   Generate a draft clinical summary

AI must not:

-   Diagnose diseases
-   Recommend treatments
-   Prescribe medicines
-   Replace a doctor's judgment

------------------------------------------------------------------------

# 6. Medical History Rules

## BR-010 Medical History Collection

Patients may provide:

-   Previous medical conditions
-   Current medications
-   Allergies
-   Previous surgeries
-   Family medical history

Supported predefined conditions:

-   Diabetes
-   Hypertension
-   Asthma
-   Heart Disease
-   Other
-   None

## BR-011 Optional Fields

Medical history fields are optional.

------------------------------------------------------------------------

# 7. Document Upload Rules

## BR-012 Supported File Types

Allowed uploads:

-   JPG
-   JPEG
-   PNG
-   PDF

## BR-013 Storage Rule

Uploaded files must be stored securely.

The database stores:

-   Document type
-   File location
-   OCR text
-   Extracted information
-   Upload timestamp

------------------------------------------------------------------------

# 8. OCR Rules

## BR-014 OCR Processing

OCR runs only after successful document upload.

OCR extracts available information from laboratory reports and
prescriptions.

## BR-015 Verification Rule

Doctors must always be able to compare:

-   Original document
-   OCR text
-   Extracted information

The original document takes precedence.

------------------------------------------------------------------------

# 9. Clinical Summary Rules

## BR-016 Summary Generation

A clinical summary is generated after the patient completes:

-   Registration
-   Complaint entry
-   Follow-up questions
-   Medical history
-   Document upload (if provided)

The summary includes patient information, complaint, history,
medications, allergies, surgeries, family history, and document summary.

## BR-017 Draft Status

Every new summary starts with **Pending** status.

Only doctors may change approval status.

------------------------------------------------------------------------

# 10. Doctor Rules

## BR-018 Doctor Authentication

Only authenticated doctors may access patient records and approval
functions.

## BR-019 Doctor Permissions

Doctors may:

-   View patient information
-   View uploaded documents
-   Review OCR output
-   Edit AI summaries
-   Approve summaries

## BR-020 Approval Rule

Only doctors may mark a summary as **Approved**.

Approval records include:

-   Doctor
-   Timestamp
-   Action performed

------------------------------------------------------------------------

# 11. Workflow Rules

## BR-021 Patient Workflow

1.  Welcome
2.  Language Selection
3.  Patient Registration
4.  Chief Complaint
5.  AI Questions
6.  Medical History
7.  Document Upload
8.  Processing
9.  Review Information
10. Submit

## BR-022 Doctor Workflow

1.  Login
2.  Patient Queue
3.  Review Patient
4.  Review Documents
5.  Edit
6.  Approve

------------------------------------------------------------------------

# 12. Database Rules

## BR-023 Unique Patient Identifier

Every patient receives a unique Patient ID that cannot be edited
manually.

## BR-024 Case Ownership

Each Patient Case belongs to exactly one Patient.

## BR-025 Document Ownership

Each uploaded document belongs to one Patient Case.

## BR-026 Summary Ownership

Each Patient Case has one Clinical Summary.

------------------------------------------------------------------------

# 13. Security Rules

## BR-027 Patient Privacy

Patients may access only their own information.

## BR-028 File Protection

Medical documents must not be publicly accessible.

## BR-029 Auditability

Important actions should be traceable, including uploads, edits, and
approvals.

------------------------------------------------------------------------

# 14. MVP Constraints

Excluded from the MVP:

-   ABHA authentication
-   Aadhaar integration
-   Full HIS integration
-   Blockchain
-   Autonomous diagnosis
-   Prescription generation
-   Perfect handwritten prescription recognition
-   Support for all Indian languages

------------------------------------------------------------------------

# 15. Success Criteria

The MVP succeeds when the complete workflow works end-to-end:

-   Patient registers.
-   Language selection works.
-   Complaint is recorded.
-   AI asks follow-up questions.
-   Medical history is collected.
-   Documents are uploaded.
-   OCR extracts available information.
-   AI generates a structured summary.
-   Doctor reviews, edits, and approves the summary.

------------------------------------------------------------------------

## Business Rule Summary Table

  Rule Area            Primary Responsibility
  -------------------- ------------------------
  Registration         Patient
  Language Selection   Patient
  Complaint Entry      Patient
  AI Question Flow     System
  Medical History      Patient
  Document Upload      Patient
  OCR Extraction       System
  Clinical Summary     AI
  Review               Doctor
  Edit                 Doctor
  Approval             Doctor
  Data Security        System
  Audit Logging        System

This document establishes the functional constraints and
responsibilities for the MediKiosk MVP and should be followed during
database design, backend implementation, and frontend workflow
development.
