# SYSTEM ARCHITECTURE SPECIFICATION
## SIH26047 — Patient Case-Taking Software

> **Document Version**: 3.0 (Master Autonomous Build Milestone Complete)  
> **Status**: Full Dual-Surface, Multimodal Voice, 3D Spatial Wireframe, Deterministic Triage, Provenance Graph & ABDM Sandbox Implemented  
> **Date**: October 2026  

---

## 1. High-Level System Architecture

The following diagram illustrates the overarching system flow, establishing strict boundaries between patient intake, multimodal abstractions, clinical reasoning, deterministic triage, evidence provenance, and clinician verification.

```text
                    ┌─────────────────────────────────────────┐
                    │             PATIENT SURFACE             │
                    │        Voice   │   Touch   │   Text     │
                    └────────────────────┬────────────────────┘
                                         │
                                         ▼
                    ┌─────────────────────────────────────────┐
                    │        Clinical Interview Engine        │
                    │     (Adaptive OLDCARTS / ROS Logic)     │
                    └────────────────────┬────────────────────┘
                                         │
                 ┌───────────────────────┼───────────────────────┐
                 ▼                       ▼                       ▼
        Structured Facts         Scanned Documents       Patient Timeline
        (Symptoms, History)     (Prescriptions, Labs)    (Chronological Flow)
                 │                       │                       │
                 └───────────────────────┼───────────────────────┘
                                         ▼
                    ┌─────────────────────────────────────────┐
                    │      Evidence & Provenance Engine       │
                    │  (Audio Snippets, Doc Crops, Citations) │
                    └────────────────────┬────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
   ┌───────────────────────────┐                   ┌───────────────────────────┐
   │ Deterministic Rule Engine │                   │    Clinical AI Gateway    │
   │  (Predefined Red Flags,   │                   │ (Provider-Agnostic LLM:   │
   │   Emergency Escalation)   │                   │  Summarize, Extract, NLP) │
   └─────────────┬─────────────┘                   └─────────────┬─────────────┘
                 ▼                                               ▼
          Triage & Alerts                                 Case Synthesis
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         ▼
                    ┌─────────────────────────────────────────┐
                    │            CLINICIAN SURFACE            │
                    │   30-Sec Overview │ Provenance Drawer   │
                    │   Accept / Edit / Reject / Verify       │
                    └────────────────────┬────────────────────┘
                                         │
                                         ▼
                    ┌─────────────────────────────────────────┐
                    │      Interoperability Gateway           │
                    │      FHIR R4 Mapper  │  ABDM Adapter    │
                    │      (Local Export vs Ext. Bridge)      │
                    └─────────────────────────────────────────┘
```

---

## 2. Core Architectural Subsystems

### 2.1 Technology Stack & Runtime Baseline

* **Web Framework**: **Next.js 16.x** (Active LTS) utilizing the App Router architecture.
* **UI & Component Layer**: **React 19.x**, **TypeScript** (strict mode enabled), **Tailwind CSS**.
* **Iconography & Animation**: **Lucide Icons**; **Framer Motion** applied strictly for accessible micro-interactions, layout transitions, and cognitive focus cues.
* **Architectural Constraint on 3D**: Three-dimensional graphics (Three.js / WebGL) are explicitly deferred. No core workflow depends on 3D rendering.

---

### 2.2 Clinical AI Gateway (Provider-Independent)

The core application must never make direct calls to any single AI provider or hardcode model identifiers (e.g., Gemini, OpenAI, Anthropic). All clinical intelligence requests are mediated by a unified **Clinical AI Gateway**.

```text
                  ┌────────────────────────────────────────┐
                  │              Application               │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │          Clinical AI Gateway           │
                  └───────────────────┬────────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         ▼                            ▼                            ▼
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  Gemini Adapter  │         │ Future Provider  │         │ Mock/Test Adapter│
│  (Config-driven) │         │ (OpenAI/Anthropic│         │ (Deterministic   │
│                  │         │  /Local LLM)     │         │  Zero-API Demo)  │
└──────────────────┘         └──────────────────┘         └──────────────────┘
```

#### Gateway Interface Specification
```typescript
export interface ClinicalAIGateway {
  /** Synthesizes structured clinical case sheet from verified facts */
  summarizeCase(facts: ClinicalFact[], documents: ExtractedDocumentFact[]): Promise<ClinicalSummary>;
  
  /** Extracts candidate symptoms, duration, and anatomical sites from raw transcript */
  extractClinicalFacts(rawInput: NormalizedLanguageInput): Promise<CandidateClinicalFact[]>;
  
  /** Maps conversational user utterances into structured OLDCARTS / ROS fields */
  structurePatientResponse(questionContext: ClinicalQuestionContext, utterance: string): Promise<StructuredResponse>;
  
  /** Extracts medications, lab values, and past diagnoses from raw OCR regions */
  extractDocumentFacts(rawOcr: RawOcrPayload): Promise<CandidateDocumentFact[]>;
  
  /** Translates clinical terminology while preserving medical intent */
  translateClinicalText(text: string, sourceLang: string, targetLang: string): Promise<string>;
  
  /** Generates empathetic, culturally-appropriate conversational follow-up questions */
  generatePatientResponse(context: InterviewContext): Promise<LocalizedPatientPrompt>;
}
```

Configuration via environment variables (`AI_PROVIDER=gemini|openai|anthropic|mock`, `AI_MODEL_ID=...`) selects the active adapter at startup.

---

### 2.3 Speech Service Abstraction (Provider-Agnostic Voice)

Voice is treated as an optional interaction modality, not the foundation of the system. The application must never depend exclusively on the browser Web Speech API.

```text
               ┌───────────────────────────────────────────────┐
               │                Voice Interface                │
               └───────────────────────┬───────────────────────┘
                                       │
                                       ▼
               ┌───────────────────────────────────────────────┐
               │          Speech Service Abstraction           │
               └───────────────────────┬───────────────────────┘
                                       │
         ┌───────────────────┬─────────┴─────────┬───────────────────┐
         ▼                   ▼                   ▼                   ▼
┌──────────────────┐┌──────────────────┐┌──────────────────┐┌──────────────────┐
│  Browser Speech  ││ Configurable STT ││ Configurable TTS ││ Future BHASHINI  │
│     Adapter      ││     Adapter      ││     Adapter      ││     Adapter      │
│(Web Speech API)  ││(Whisper / Cloud) ││(ElevenLabs/Cloud)││(Govt of India AI)│
└──────────────────┘└──────────────────┘└──────────────────┘└──────────────────┘
```

#### Fallback and Resilience Matrix
```text
           ┌───────────────────────────────────────────────┐
           │     VOICE   ◄───────►   TOUCH   ◄───────►  TEXT   │
           └───────────────────────────────────────────────┘
```
The patient interface must remain fully operational when:
* Microphone permissions are denied or unsupported.
* Browser speech recognition engines disconnect or fail.
* External cloud STT/TTS services encounter network timeouts.
* The hospital network is completely offline.

---

### 2.4 Multilingual Architecture & Localization Layer

Clinical decision-making and data models must remain completely decoupled from surface-level presentation languages (Hindi, English, Bengali, Tamil, etc.).

```text
Patient Voice / Text (Vernacular)
               │
               ▼
   Speech Service Abstraction (STT)
               │
               ▼
   Normalized Language Representation
   (Normalized transcripts with language tag & audio reference)
               │
               ▼
   Clinical Interview Engine (Language-Independent)
   (Internal representations mapped to SNOMED-CT / ICD-10 & structured schemas)
               │
               ▼
   Response Localization Layer
   (Maps interview prompts to patient's dialect + Clinician output to standard medical English)
               │
               ▼
   Speech Service Abstraction (TTS) / Display
```

Patients may express symptoms in Hindi (*"Mujhe do din se chaati mein dard ho raha hai"*), Hinglish (*"Chest pain ho raha hai 2 days se"*), or regional languages. The internal engine captures:
$$\text{Symptom} = \text{Chest Pain}, \quad \text{Duration} = 2\text{ days}, \quad \text{Language} = \text{Hindi/Hinglish}$$
The clinician surface always renders this in standardized clinical English accompanied by the original localized transcript citation.

---

### 2.5 Document AI Pipeline & Source Truth Preservation

Prescription and lab report analysis must never feed directly into an LLM as a single-pass "black box". The architecture enforces an intermediate verification stage:

```text
Original Physical Document (PDF / Image)
               │
               ▼
   Pre-Processing & OCR Engine
   (Perspective correction, contrast enhancement, text line segmentation)
               │
               ▼
   Raw Extracted Text + Bounding Box Regions
   (Exact coordinates [x, y, w, h] and confidence scores preserved)
               │
               ▼
   Clinical Extraction Layer (via Clinical AI Gateway)
   (Identifies candidate medications, doses, frequencies, lab test lines)
               │
               ▼
   Rule-Based Clinical Validation
   (Verifies against pharmacopoeia & standard lab reference ranges)
               │
               ▼
   Structured Clinical Fact with Provenance
   (Carries document ID, page, crop bounding box, and verification status)
```

#### Anti-Hallucination Governance
1. **Zero Information Invention**: If a document states *"Metformin 500mg twice daily"*, the system extracts Drug: *Metformin*, Dose: *500mg*, Frequency: *BID*. If the document merely states *"Metformin"*, the dosage and frequency fields remain **null/unspecified**. The system is strictly forbidden from guessing standard clinical dosages.
2. **Abnormal Labs $\ne$ Unilateral Diagnoses**: If a lab report shows $\text{Hemoglobin} = 9.8\text{ g/dL}$ (Reference: $12.0 - 15.5\text{ g/dL}$), the system highlights the observation as **Abnormal (Low)**. It does **NOT** autonomously register a diagnosis of *"Anemia"* unless the document explicitly states the diagnosis or a licensed clinician approves it.

---

### 2.6 2D Anatomical Pain Map as an Input Modality

The interactive 2D anatomical pain locator is strictly an **accessible input mechanism**, not an automated diagnostic system.
* **Captured Attributes**:
  - Anatomical region (e.g., `Thorax`, `Epigastrium`, `Right Iliac Fossa`, `Left Knee`).
  - Anatomical side (`Anterior`, `Posterior`, `Left`, `Right`, `Bilateral`).
  - Approximate coordinates on standard SVG body outline.
  - Patient-selected severity (Visual Analog Scale 0–10).
  - Qualitative descriptors (e.g., `Burning`, `Throbbing`, `Sharp`, `Dull`).
* **Non-Diagnostic Isolation**: Selecting the epigastrium or left arm never triggers an autonomous diagnosis of gastritis or myocardial infarction. The data is treated purely as a localized patient observation.
* **Modal Equivalence**: Every body-map action has a direct, one-click text/voice equivalent for screen-reader and keyboard accessibility.

---

### 2.7 Evidence Citation & Provenance Subsystem

The evidence engine is a first-class domain capability that powers trust between patient statements and clinician review.

```text
"Chest pain for 2 days" [E1]
```

Clicking `[E1]` opens the **Evidence Provenance Drawer**:

```text
┌────────────────────────────────────────────────────────┐
│ EVIDENCE CITATION: [E1]                                │
├────────────────────────────────────────────────────────┤
│ SOURCE TYPE:       Patient Oral Interview              │
│ RECORDED AT:       10:42 AM IST (Step 4 of Intake)     │
│ ORIGINAL LANGUAGE: Hindi                               │
│ RAW UTTERANCE:     "दो दिन से छाती में भारीपन लग रहा है"│
│ NORMALIZED TEXT:   "Feeling heaviness in chest for 2   │
│                    days."                              │
│ AUDIO EVIDENCE:    Available (Retained per consent)    │
│ VERIFICATION:      Pending Physician Verification      │
│ ACTIONS:           [✓ Verify] [✎ Edit] [✕ Reject]      │
└────────────────────────────────────────────────────────┘
```

For scanned laboratory documents:

```text
┌────────────────────────────────────────────────────────┐
│ EVIDENCE CITATION: [E2]                                │
├────────────────────────────────────────────────────────┤
│ SOURCE TYPE:       Scanned Laboratory Investigation    │
│ DOCUMENT FILE:     cbc_report_24sept.pdf               │
│ PAGE NUMBER:       Page 1 of 1                         │
│ REGION / BOUNDING: [Visual Document Crop Displayed]    │
│ RAW OCR STRING:    "Hemoglobin (Hb) ..... 9.8 g/dL"    │
│ REFERENCE RANGE:   12.0 - 15.5 g/dL (Source Document)  │
│ CLINICAL STATUS:   Observation: Low Hb (Not Diagnosis) │
│ VERIFICATION:      Pending Physician Verification      │
└────────────────────────────────────────────────────────┘
```

---

### 2.8 Audio Evidence & Privacy Architecture (DPDP Act 2023)

In accordance with India's Digital Personal Data Protection (DPDP) Act 2023 and medical ethics:
1. **Explicit Purpose-Linked Consent**: Patients must affirmatively consent to voice capture.
2. **Configurable Retention**: Default policy stores audio temporarily during the active session. Once a verified text transcript is approved, the raw audio file is scheduled for automatic purge unless explicit extended retention is granted.
3. **Synthetic Demo Labeling**: Any audio samples bundled for hackathon demonstration must be explicitly tagged as `SYNTHETIC / DEMO DATA` to ensure absolute compliance.

---

### 2.9 Deterministic Triage Rule Engine (Isolated from LLM)

Clinical triage safety relies on deterministic rule execution, completely separated from generative AI models.

```text
                    Patient Structured Fact
                             │
                             ▼
              Deterministic Triage Rule Engine
              (Strictly coded clinical protocols)
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
   [Red Flag Condition Met]         [Normal Triage Priority]
            │                                 │
            ▼                                 ▼
   Generate Urgent Alert             Assign Routine Queue
   - Rule ID: RF-CARDIO-001          - Priority: Standard
   - Trigger: Chest pain + Sweating  - Department: General Med
   - Action: Immediate Nurse Check
```

#### Alert Schema
* `ruleId`: Unique string identifier (e.g., `RULE-RED-STROKE-FAST`).
* `severity`: `EMERGENCY` | `URGENT` | `STANDARD`.
* `triggeringEvidence`: Array of `EvidenceCitation` IDs.
* `timestamp`: ISO-8601 timestamp.
* `status`: `ACTIVE` | `ACKNOWLEDGED` | `DISMISSED`.
* `acknowledgedBy`: Clinician identifier and action audit log.

---

### 2.10 Operational Modes

To ensure ethical presentation during judging and real-world deployment, the system supports three mutually exclusive operational modes:

| Mode | Data Ingestion | AI Execution | Audio Storage | Visual Indicator |
| :--- | :--- | :--- | :--- | :--- |
| **Real Data Mode** | Live patient input & camera scans | Live configured AI gateway | Controlled DPDP retention | Clean clinical interface |
| **Demo Mode** | Pre-curated realistic clinical cases (Cardio, Resp, Gastro, Diabetic Foot) | Deterministic mock responses (zero API latency/cost) | Pre-recorded synthetic audio | Prominent `DEMO / SYNTHETIC CASE` banner |
| **Test Mode** | Automated fixture data | Mocked gateway adapters | In-memory ephemeral | Developer diagnostic overlays |

---

### 2.11 Interoperability & ABDM Adapter Architecture

The system implements an Ayushman Bharat Digital Mission (ABDM) and FHIR R4 interoperability layer.

```text
                    Application Clinical State
                               │
                               ▼
                    Interoperability Layer
                               │
                               ▼
                        FHIR R4 Mapper
        (Produces valid FHIR Composition, Condition,
         MedicationStatement, Observation bundles)
                               │
                               ▼
                          ABDM Adapter
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
       Development Sandbox            Production Bridge
       (Mock / Test Token)            (Authorized ABDM M1/M2/M3)
```

#### Integrity Invariant
The user interface explicitly distinguishes between:
1. `FHIR R4 Bundle Generated Successfully` (Valid clinical JSON available for download/inspection).
2. `Transmitted to External ABDM Network` (Only active when an authenticated government gateway bridge is verified).

---

## 3. ARCHITECTURE REVIEW — SEPTEMBER 2026

The following mandatory architectural decisions were formalized during the Phase 0 review:

### 1. Selection of Next.js 16.x
Next.js 16.x is the current Active-LTS line for greenfield 2026 systems. It guarantees compatibility with React 19 concurrent features, enhanced Turbopack compilation speeds for development, and stabilized Server Actions essential for secure patient data handling without separate microservice complexity.

### 2. Abstraction of AI Providers (Clinical AI Gateway)
Directly tying clinical workflows to a single proprietary vendor (e.g., Google Gemini) introduces catastrophic lock-in, vulnerability to API pricing shifts, and potential compliance barriers in governmental healthcare deployments. The gateway allows instant fallback to open models or on-premises hospital servers.

### 3. Abstraction of Voice Services (Speech Service Abstraction)
The browser Web Speech API is notoriously inconsistent across Android browsers, WebViews, and noisy hospital environments. Decoupling voice capture ensures that speech services can switch to dedicated low-latency STT engines (such as Indian Government BHASHINI models) while guaranteeing touch and text fallbacks when voice is unavailable.

### 4. Separation of Deterministic Triage from Generative AI
Generative LLMs are inherently probabilistic and vulnerable to hallucinations, subtle prompt drifts, or omission of critical medical nuances. Clinical triage protocols (e.g., identifying myocardial infarction or acute stroke) must be governed by deterministic, verifiable, hard-coded clinical rules with audited rule IDs.

### 5. Mandatory Document Provenance & Anti-Hallucination
In high-volume OPDs, doctors cannot trust an AI that summarizes medical records without showing where the data came from. Forcing multi-stage OCR extraction with bounding-box citations prevents dangerous hallucinations (such as invented dosages) and ensures the original paper slip is always visible.

### 6. Controlled Audio Retention and DPDP Compliance
Recording vulnerable patients in public hospital waiting rooms presents severe ethical and privacy risks under India's DPDP Act 2023. Audio data is kept ephemeral, and verified textual transcripts serve as the enduring clinical evidence.

### 7. Deferral of 3D Graphics
3D human models add massive JavaScript bundle weight (2MB+), cause high battery drain, and stutter on budget Android devices common in Indian OPDs. Clinical clarity, rapid response times (< 1.5s), and WCAG AAA accessibility supersede visual 3D novelty.

### 8. ABDM Implemented as an Adapter Architecture
Presenting simulated API calls as "live government integrations" violates hackathon integrity. Implementing ABDM as an explicit adapter with clear UI distinctions between local FHIR generation and external gateway transmission maintains absolute honesty while demonstrating enterprise-grade interoperability readiness.
