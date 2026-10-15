# CLINICAL SAFETY & PROVENANCE CONSTITUTION
## SIH26047 — Patient Case-Taking Software

> **Status**: Active Clinical Safety Specification  
> **Applies to**: All AI Gateway Adapters, Triage Engines, Patient Surfaces, and Interoperability Bridges  
> **Regulatory Context**: DPDP Act 2023, National Medical Commission (NMC) Guidelines, ABDM Milestone Specifications (M1/M2/M3), and ISO 14971 Medical Device Risk Management.

---

## 1. Fundamental Principle: Zero Probabilistic Hallucination

In high-volume Indian Outpatient Departments (OPDs), clinical errors propagate rapidly if AI models are treated as sources of clinical truth. This system enforces a non-negotiable rule:

> **The AI model is never the clinical source of truth.**  
> It acts solely as an intake accelerant, organizing unstructured patient narrative into a traceable, doctor-verifiable draft.

Every clinical statement presented in the Clinician Cockpit is explicitly linked to an interactive **Provenance Citation** (`[E1]`, `[E2]`, etc.) containing:
1. **Source Type**: Direct patient voice utterance, touch input, or raw OCR prescription snippet.
2. **Original Verbatim Text**: Raw vernacular Hindi, Bengali, Tamil, Telugu, Marathi, or English utterance before translation.
3. **Capture Timestamp & Session ID**: Cryptographically immutable capture time.
4. **Physician Verification Status**: `UNVERIFIED`, `VERIFIED`, `EDITED`, or `REJECTED`.

---

## 2. Deterministic Red-Flag Triage Engine

Emergency triage detection is **strictly isolated from probabilistic generative models (LLMs)**.

### Architectural Separation
```
+-------------------------------------------------------------+
|                Incoming Patient Symptoms                    |
+-------------------------------------------------------------+
               |                               |
               v                               v
+-------------------------------+   +------------------------+
|  Deterministic Rule Engine    |   |  Clinical AI Gateway   |
|  (Hardcoded Medical Rules)    |   |  (Subject to Physician |
|  - Acute Coronary Syndrome    |   |   Verification)        |
|  - FAST Stroke Signs          |   |  - Translation         |
|  - Severe Airway Distress     |   |  - Summary drafting    |
|  - Anaphylaxis Risk           |   |  - Timeline collation  |
+-------------------------------+   +------------------------+
               |                               |
               v                               v
   Immediate Triage Escalation         Physician Cockpit Review
```

### Active Emergency Rules
- **Rule RF-CARD-001**: Retrosternal chest discomfort radiating to left arm/jaw on exertion in patients with vascular risk factors. Immediate escalation to Resuscitation / ECG Bay within 10 minutes.
- **Rule RF-NEURO-001**: Face-Arm-Speech-Time (FAST) signs indicating suspected acute ischemic stroke. Direct routing to Stroke Emergency.
- **Rule RF-RESP-001**: Severe tachypnea, accessory muscle usage, or oxygen saturation (SpO2) < 92%. Immediate nebulization / oxygenation.
- **Rule RF-ALLERG-001**: Periorbital / laryngeal edema, acute urticaria with dyspnea post antibiotic administration. Immediate IM Epinephrine protocol alert.

**Generative AI is categorically barred from overriding, suppressing, or downgrading these triage classifications.**

---

## 3. Document Intelligence & OCR Source Truth

Paper prescriptions and handwritten OPD tickets represent the majority of patient medical records in Indian civil hospitals.

### Anti-Hallucination OCR Guardrails
1. **Dosage Preservation**: Prescriptions extracted via OCR preserve verbatim text. The system never infers, standardizes, or "corrects" missing drug dosages or frequencies.
2. **Observation vs. Diagnosis**: Abnormal lab values (e.g. Fasting Glucose 240 mg/dL) are classified as **discrete laboratory observations**, never as definitive new medical diagnoses.
3. **Verbatim Provenance Viewer**: The Clinician Cockpit provides one-click inspection of the original raw document crop next to the extracted observation.

---

## 4. DPDP Act 2023 Audio Privacy & Retention Policy

In accordance with India's **Digital Personal Data Protection (DPDP) Act 2023**:

1. **Granular, Revocable Consent**: Before recording commences, patients are presented with 4 distinct consent categories (Health History, Audio Recording, Document OCR, and AI Synthesis).
2. **Vernacular Audio Explanation**: An audio explanation is played in the patient's preferred language (Hindi, Bengali, Tamil, Telugu, Marathi, English) ensuring informed consent for low-literacy users.
3. **24-Hour Ephemeral Audio Auto-Purge**:
   - Raw audio waveforms are retained exclusively in transient ephemeral storage for consultation playback.
   - All audio files are automatically purged within 24 hours of doctor-verified consultation.
   - Transcripts retained in the longitudinal record require separate explicit patient consent.

---

## 5. Anatomical Mapping Boundaries

Both the 2D SVG Anatomical Body Map and the 3D Holographic Spatial Wireframe viewer include permanent, unhideable disclaimers:

> **ANATOMICAL ORIENTATION (PATIENT INPUT ONLY)**  
> This visual tool is an orientation aid for patient symptom localization only. It performs zero diagnostic inference, anatomical segmentation, or automated pathology detection.

All pinned coordinates are recorded as patient self-reported observations.

---

## 6. Doctor as Final Clinical Authority

1. **No Autonomous Clinical Decisions**: The system cannot order medications, discharge patients, or finalize diagnostic codes without physician verification.
2. **One-Click Reconcile & Verify**: The attending physician reviews the 30-second case summary, clicks any citation to inspect source utterances, edits assertions inline if necessary, and digitally signs the OPD Consultation Chit.
3. **Audit Trail**: Every physician edit, fact acceptance, and rejection is recorded with clinician ID, timestamp, and rationale in an exportable JSON audit trail.

---

## 7. ABDM & FHIR Interoperability Honesty

The platform strictly avoids "demo theater" regarding government healthcare APIs:
- All ABDM M1/M2/M3 bridges are honestly marked as **MOCK / SIMULATED SANDBOX MODE**.
- Local FHIR R4 Bundle generation is 100% syntactically valid and complies with NDHM/ABDM Clinical Artifact specifications.
- Live transmission to national gateways is disabled until institutional production credentials and ABDM compliance certifications are granted.
