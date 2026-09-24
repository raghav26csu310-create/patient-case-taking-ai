# MASTER PROJECT CONSTITUTION
## SIH26047 — Patient Case-Taking Software

> **Project ID**: SIH26047  
> **Domain**: Smart India Hackathon 2026 / Healthcare & First-Mile Clinical Workflow  
> **Status**: Phase 0 Architecture Approved with Required Corrections (Implementation Frozen Pending Sign-Off)  
> **Revision**: September 2026 Review Revision  

---

## 1. Core Purpose and Mission

High-volume Outpatient Departments (OPDs) in Indian public and private hospitals (e.g., AIIMS, Safdarjung, District Civil Hospitals, Trust and Community Health Centers) routinely handle **60 to 120+ patients per clinician per 4-hour morning shift**, restricting consultation time to **2 to 3 minutes per patient**.

### The First-Mile Problem Space
1. **Unstructured & Fragmented History**: Patients arrive anxious, rushed, speaking diverse regional dialects, with varying health literacy, struggling to articulate symptoms clearly.
2. **Paper Fragmentation**: Previous prescriptions, crumpled handwritten OPD chits, lab reports, and discharge summaries are presented in disorganized physical paper files.
3. **Severe Cognitive Load on Doctors**: Clinicians spend up to 70% of consultation time extracting basic history and handwriting repetitive slips, increasing the risk of missing critical red flags, duplicating drugs, or missing adverse interactions.

### Fundamental Product Mission
The purpose of the system is to improve the first-mile clinical case-taking process in high-volume Indian OPDs by helping patients communicate their history accurately and helping clinicians receive a structured, traceable, clinically useful case summary before consultation.

### Fundamental Product Principle
> **Clinical usefulness first. Immersive design second.**  
> Visual quality and design aesthetics are important for clarity and trust, but visual effects and decorative flourishes must never replace functionality, accessibility, clinical clarity, or safety.

---

## 2. Core Patient Journey

The system strictly enforces the end-to-end journey:

$$\text{IDENTIFY} \longrightarrow \text{CONSENT} \longrightarrow \text{CONVERSE} \longrightarrow \text{SCAN} \longrightarrow \text{SUMMARIZE \& ROUTE} \longrightarrow \text{CONSULT}$$

1. **IDENTIFY**: Fast patient intake via ABHA ID, Mobile OTP, physical OPD token QR code, or assisted walk-in intake.
2. **CONSENT**: DPDP Act 2023 compliant, granular, multilingual informed consent with audio playback option.
3. **CONVERSE**: Multimodal adaptive intake (Voice, Touch, Text) exploring chief complaint, HPI (OLDCARTS / SOCRATES protocol), and review of systems.
4. **SCAN**: Prescription and lab report ingestion with raw OCR extraction, document region indexing, and strict source truth preservation.
5. **SUMMARIZE & ROUTE**: Generation of standardized clinical case sheets, deterministic red flag triage alerts, and department routing.
6. **CONSULT**: High-density 30-second clinician cockpit with chronological timeline, evidence citation badges, inline accept/edit/reject verification, and FHIR export.

---

## 3. Primary User Archetypes & Accessibility Mandate

### The Patient Surface
* **User Profile**: Elderly, low-literacy, first-time digital users, rural/semi-urban populations, non-English speakers, patients in noisy OPD waiting halls, users on low-end Android mobile devices or hospital kiosk tablets.
* **Core Interaction Triad**: The user can interact through **Voice**, **Touch**, or **Text**, and must be able to switch interaction modes at any moment without loss of state:
  - **Voice**: Vernacular speech input and audio readback.
  - **Touch**: Large touch targets (minimum 48px), 2D anatomical pain locator, visual pain scales, symptom chips.
  - **Text**: Bilingual auto-suggest and manual text entry.
* **Core Mandate**: *"Help the patient communicate accurately."*

### The Clinician Surface
* **User Profile**: Overworked OPD doctors, resident medical officers, and triage nurses working under intense 2–3 minute time constraints.
* **Core Needs**:
  - Concise case overview
  - Chief complaint and chronological History of Present Illness (HPI)
  - Past medical, surgical, drug, allergy, family, and personal history
  - Review of systems, prior medications, and lab investigation highlights
  - Evidence/provenance citations for every fact
  - Chronological timeline of clinical events
  - Deterministic red flag alerts and missing information gap analysis
  - Complete control: Ability to **Accept, Edit, Reject, and Verify** any information
* **Core Mandate**: *"Help the clinician understand the patient quickly without losing source evidence."*

---

## 4. Clinical Safety & Medical-Legal Governance

1. **Non-Diagnostic Tool**: The system is strictly a **Clinical History Synthesizer & Case-Taking Assistant**, NOT an autonomous diagnostic machine. Final diagnostic and therapeutic authority rests 100% with the licensed medical practitioner.
2. **Strict Anti-Hallucination Mandate**:
   - The system must never invent missing information (e.g., if a prescription has no dosage, no dosage may be guessed or filled).
   - An abnormal lab value (e.g., $Hb = 9.8\text{ g/dL}$) must remain an abnormal observation against reference ranges; it must NOT be turned into a definitive diagnosis (*"Patient has anemia"*) unless explicitly stated by a physician or approved clinical rule.
3. **Deterministic Triage Isolation**:
   - Predefined clinical red flags (STEMI, stroke, acute abdomen, stridor, shock) must be triggered exclusively by a **deterministic clinical rule engine**, never solely by an opaque LLM prompt.
4. **100% Evidence Grounding (Provenance)**:
   - Every clinical claim must carry an evidence badge $[E]$ linking back to an exact audio transcript quote or a scanned document crop/page/region.
5. **Mode Isolation**:
   - The platform strictly separates **Real Data Mode**, **Demo Mode (Synthetic Cases)**, and **Test Mode**. Demo fallback cases must always be labeled explicitly as `DEMO / SYNTHETIC CASE` and never masquerade as live clinical records.
6. **Data Privacy & Audio Retention (DPDP Act 2023)**:
   - Explicit consent required before recording.
   - Configurable retention periods with automatic cleanup policies.
   - Minimal necessary evidence stored: transcript and metadata are retained without requiring indefinite storage of raw audio files.
7. **ABDM Interoperability Integrity**:
   - The system implements an ABDM-compliant FHIR R4 mapping adapter.
   - The application strictly distinguishes between **"FHIR export generated"** (local standards-compliant bundle) and **"Transmitted to external ABDM ecosystem"** (requires verified live bridge). No false claims of live government sandbox connection.

---

## 5. ARCHITECTURE REVIEW — SEPTEMBER 2026

During the formal architecture review prior to Phase 1 implementation, the following binding corrections were established:

### Decision Log & Architectural Justifications

| Area | Reviewed Decision | Architectural Justification |
| :--- | :--- | :--- |
| **Framework Line** | Adopt **Next.js 16.x** (Active LTS), React 19.x, TypeScript, Tailwind CSS | Avoid technical debt on a greenfield 2026 project. Next.js 16.x represents the stable Active LTS release line offering enhanced Turbopack compilation and React 19 server action stability. |
| **AI Independence** | **Clinical AI Gateway** abstraction layer decoupling from Google Gemini | Prevents vendor lock-in. Allows seamless switching between Gemini, OpenAI, Claude, local open-source models, or mock adapters via configuration. |
| **Voice Independence** | **Speech Service Abstraction** decoupling from Web Speech API | Web Speech API is browser-dependent and fails on mobile webviews or mic denial. Abstraction enables pluggable STT/TTS adapters and future BHASHINI integration. |
| **Triage Architecture** | **Deterministic Clinical Rule Engine** isolated from LLM | LLMs are non-deterministic and can hallucinate triage priorities. Red flags must be triggered by deterministic rules with explicit rule IDs and evidence links. |
| **Document Pipeline** | Multi-stage OCR $\rightarrow$ Raw Text/Regions $\rightarrow$ Clinical Extraction $\rightarrow$ Evidence | Prevents end-to-end "black box" hallucination. Clinicians must always have access to the original document and bounding box regions. |
| **Data Preservation** | Strict Anti-Hallucination: Missing fields stay missing | In healthcare, fabricated dosages or assumed diagnoses cause fatal errors. What is not explicitly stated in source records is left as missing. |
| **Pain Map Purpose** | 2D Anatomical Map defined as an **Input Modality**, not diagnostic | Visual mapping captures anatomical location and severity from the patient; it does not infer underlying pathology. Equal text/voice fallbacks provided. |
| **Audio Privacy** | Controlled audio retention & DPDP Act 2023 compliance | Indefinite raw audio storage introduces severe privacy liabilities. Transcripts and verified metadata suffice for legal provenance; raw audio is ephemeral. |
| **3D Rendering** | **3D deferred**; zero critical workflows dependent on 3D | High-volume OPDs use budget smartphones and low-spec kiosk tablets. Clinical clarity and sub-1.5s load times take precedence over 3D visual overhead. |
| **ABDM Integration** | Implemented as **FHIR Mapper + ABDM Adapter Architecture** | Distinguishes local FHIR compliance from active external sandbox transmission. Avoids fraudulent claims of live government integration in SIH prototypes. |

---

## 6. Implementation Guardrail

> **Phase 1 Prohibition**: No scaffolding, database creation, UI construction, or API integration may commence until this Constitution, ARCHITECTURE.md, and DEVELOPMENT_PLAN.md have received formal review and sign-off.
