

# 1. User Roles

The MVP has two primary user roles:

1. Patient
    
2. Doctor
    

---

# 2. Patient User Requirements

## 2.1 Language Selection

As a patient, I want to select my preferred language so that I can understand and interact with the system comfortably.

### MVP Requirements

The patient should be able to select:

- English
    
- Hindi
    
---

## 2.2 Patient Registration

As a patient, I want to enter my basic information so that the hospital system can identify my case.

### Required Information

The system should collect:

- Full Name
    
- Age
    
- Gender
    
- Mobile Number
    
- Patient ID
    

---

## 2.3 Chief Complaint

As a patient, I want to describe the main problem that brought me to the hospital.

The patient should be able to provide the complaint using:

- Voice input
    
- Text input
    
- Touch-based options where applicable
    

Example:

"I have had a headache for three days."

---

## 2.4 AI-Guided Case Taking

As a patient, I want the system to ask me relevant follow-up questions based on my complaint so that I do not have to understand medical terminology.

The system should guide the patient through relevant questions.

### Supported Complaint Categories

The MVP will initially support:

- Fever
    
- Headache
    
- Cough
    
- Abdominal Pain
    
- General Weakness
    

The system does not need to support every possible disease or complaint.

---

## 2.5 Structured Follow-Up Questions

As a patient, I want to answer simple questions about my symptoms.

The questions may collect information such as:

- When did the symptoms begin?
    
- How long have the symptoms been present?
    
- How severe are the symptoms?
    
- Where is the discomfort?
    
- Are there associated symptoms?
    
- Have any medicines already been taken?
    

Questions should be relevant to the selected or detected complaint category.

---

## 2.6 Medical History

As a patient, I want to provide my previous medical information so that the doctor can understand my health background.

The system should collect information about:

### Previous Medical Conditions

Examples:

- Diabetes
    
- Hypertension
    
- Asthma
    
- Heart Disease
    
- Other
    
- None
    

### Current Medications

The patient should be able to enter currently used medicines.

---

## 2.7 Medical Document Upload

As a patient, I want to upload my previous medical documents so that the doctor can review my previous medical information.

The system should allow the upload of:

- Prescription images
    
- Laboratory reports
    
- Discharge summaries
    

Supported formats may include:

- JPG
    
- JPEG
    
- PNG
    
- PDF
    

---

## 2.8 Document Information Review

As a patient, I should be able to see that my document has been successfully uploaded and processed.

The system should display:

- Document name
    
- Document type
    
- Upload status
    
- Extracted information where appropriate
    

---

# 3. Doctor User Requirements

## 3.1 Patient List

As a doctor, I want to see patients who have completed the MediKiosk intake process.

The doctor should see:

- Patient Name
    
- Patient ID
    
- Age
    
- Gender
    
- Chief Complaint
    
- Intake Status
    

Example statuses:

- Intake Completed
    
- Waiting for Review
    
- Reviewed
    

---

## 3.2 Patient Clinical Summary

As a doctor, I want to view a structured summary of the patient's information before consultation.

The summary should include:

### Patient Information

- Name
    
- Age
    
- Gender
    
- Patient ID
    

### Chief Complaint

The primary reason for the visit.

### History of Present Illness

A structured summary of the patient's current symptoms.

### Past Medical History

Previously reported medical conditions.

### Current Medications

Medicines reported by the patient.

### Allergies

Reported allergies.

### Previous Surgeries

Reported surgical history.

### Family History

Relevant family medical information.

### Uploaded Documents

A list of uploaded medical documents.

---

## 3.3 AI-Generated Summary

As a doctor, I want the system to generate a concise clinical summary so that I can quickly understand the patient's reported information.

The AI-generated summary must clearly be treated as a draft.

The system should not present AI output as a confirmed diagnosis.

---

## 3.4 Edit Patient Summary

As a doctor, I want to edit the generated summary so that incorrect or incomplete information can be corrected.

The doctor should be able to modify:

- Chief complaint
    
- Patient history
    
- Medical conditions
    
- Medication information
    
- Allergy information
    
- Other summary information
    

---

## 3.5 Approve Summary

As a doctor, I want to approve the final patient summary after reviewing it.

When approved:

- The patient record status should change to Reviewed.
    
- The approved summary should be stored in the system.
    

---

# 4. Core User Journey

## Patient Journey

Start  
↓  
Select Language  
↓  
Enter Basic Information  
↓  
Describe Chief Complaint  
↓  
Answer Guided Questions  
↓  
Provide Medical History  
↓  
Upload Medical Documents  
↓  
System Processes Information  
↓  
AI Generates Structured Summary  
↓  
Submit Case

---

## Doctor Journey

Login  
↓  
View Patient List  
↓  
Select Patient  
↓  
View Structured Clinical Summary  
↓  
Review Uploaded Documents  
↓  
Edit Information if Required  
↓  
Approve Summary  
↓  
Patient Ready for Consultation

---

# 5. Important User Experience Requirements

The system should be:

- Easy to understand
    
- Accessible for first-time users
    
- Simple enough for non-technical users
    
- Designed with large buttons
    
- Designed with clear instructions
    
- Capable of supporting both voice and touch/text interaction
    
- Clear about what information is being collected
    

The patient should not need medical knowledge to complete the intake process.

---

# 6. MVP Scope Boundary

The following features are outside the initial MVP:

- Autonomous diagnosis
    
- Prescription generation
    
- Full hospital HIS integration
    
- Real ABDM integration
    
- Real ABHA authentication
    
- Aadhaar authentication
    
- Blockchain
    
- Full EMR system
    
- All Indian languages
    
- Perfect handwritten prescription recognition
    

The MVP focuses only on collecting, structuring, and presenting patient information for doctor review.
