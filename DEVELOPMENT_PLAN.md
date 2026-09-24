# TECHNICAL DEVELOPMENT PLAN
## SIH26047 — Patient Case-Taking Software

> **Planning Version**: 2.1 (Phase 1 Baseline Complete)  
> **Current Phase**: Phase 1 Scaffolding & Design System COMPLETED — Phase 2 Ready  
> **Date**: September 2026  

---

## 1. Development Philosophy

1. **Safety & Traceability First**: Every feature must maintain an unbroken chain of clinical evidence from raw patient input to doctor verification.
2. **Modularity & Provider Agnosticism**: AI, Voice, and Interoperability engines are isolated behind strict interface adapters.
3. **Dual-Surface Clarity**: Separate optimized interfaces for patients (high accessibility, low literacy) and clinicians (high density, sub-30s glanceability).
4. **Zero-Deception Testing**: Absolute transparency between live execution, synthetic demo cases, and standards validation.

---

## 2. Phased Implementation Roadmap

```text
Phase 0: Architecture & Clinical Protocols ──────────────────► [COMPLETED & REVISED]
Phase 1: Dual-Surface Scaffolding & Design System Foundation ─► [COMPLETED]
Phase 2: Speech, Localization & Conversational Intake ───────► [READY FOR EXECUTION]
Phase 3: Document Processing & Source Truth OCR ─────────────► [PENDING PHASE 2]
Phase 4: Deterministic Triage & Clinical AI Gateway ─────────► [PENDING PHASE 3]
Phase 5: Clinician Cockpit, Verification & Provenance Drawer ─► [PENDING PHASE 4]
Phase 6: FHIR / ABDM Adapter & Hackathon Presentation Polish ─► [FINAL STAGE]
```

---

### Phase 0: Architecture, Clinical Protocols & Review (Completed)
* **Deliverables**:
  - `PROJECT_CONSTITUTION.md`: Master mission, clinical mandates, DPDP compliance, and operational governance.
  - `ARCHITECTURE.md`: Subsystem specifications, interface contracts, evidence schemas, and fallback matrices.
  - `DEVELOPMENT_PLAN.md`: Phased execution roadmap with explicit testing criteria.
* **Review Milestones**:
  - Incorporation of September 2026 architecture review corrections.
  - Strict freeze on implementation pending user confirmation.

---

### Phase 1: Dual-Surface Scaffolding & Design Foundation (On Hold)
> *Prerequisite: Explicit sign-off on Phase 0 documents.*
* **Scope**:
  - Initialize clean project repository using **Next.js 16.x**, **React 19.x**, **TypeScript**, and **Tailwind CSS**.
  - Configure clinical design token system: high-contrast palettes, accessible typography scales, and WCAG AAA compliant targets (minimum 48px).
  - Setup unified domain models (`Patient`, `Encounter`, `ClinicalFact`, `EvidenceCitation`, `TriageAlert`, `DocumentArtifact`).
  - Establish base routing for Dual Surfaces:
    - `/patient`: Kiosk / Mobile PWA surface.
    - `/clinician`: High-density clinical cockpit surface.
  - Configure operational mode state machine (`REAL_DATA`, `DEMO_SYNTHETIC`, `TEST`).
* **Verification & Testing Criteria**:
  - Clean compilation with zero TypeScript errors under strict mode.
  - Responsive layout verified across mobile (360px viewport), tablet kiosk (768px), and desktop cockpit (1440px).

---

### Phase 2: Multimodal Patient Intake & Localization Layer (Upcoming)
* **Scope**:
  - Implement `SpeechService` abstraction with `BrowserSpeechAdapter` and mock fallback.
  - Build `LocalizationLayer` supporting Hindi, English, and transliterated Hinglish.
  - Develop 2D anatomical pain locator (SVG body outline) strictly as an input method with complete voice/text parity.
  - Build conversational intake state machine based on the **OLDCARTS** protocol (Onset, Location, Duration, Character, Aggravating, Relieving, Temporal, Severity).
  - Implement DPDP 2023 compliant audio consent screen with regional audio playback.
* **Verification & Testing Criteria**:
  - Graceful degradation verified when microphone permission is denied.
  - Ability to switch seamlessly between Voice, Touch, and Text mid-interview without state loss.
  - Pain map inputs produce normalized anatomical coordinates without diagnostic inferences.

---

### Phase 3: Document AI & Source Truth Preservation (Upcoming)
* **Scope**:
  - Implement document ingestion module supporting camera capture and PDF upload.
  - Build multi-stage OCR pipeline preserving raw text strings and normalized bounding box coordinates `[x, y, w, h]`.
  - Implement rule-based clinical validation preventing invented dosages or converted lab diagnoses.
  - Create side-by-side document preview component for raw image inspection.
* **Verification & Testing Criteria**:
  - Missing fields in prescriptions (e.g., unspecified dosage) remain strictly null.
  - Lab test values display reference ranges from source documents without injecting automatic diagnostic labels.
  - Every extracted fact carries a valid document ID and page index.

---

### Phase 4: Deterministic Triage Rule Engine & Clinical AI Gateway (Upcoming)
* **Scope**:
  - Implement `ClinicalAIGateway` with `GeminiAdapter`, `MockAdapter`, and pluggable interface.
  - Implement `DeterministicTriageEngine` isolated from generative models.
  - Program standard Indian OPD red flag clinical rules:
    - `RF-CARD-001`: Retrosternal chest pain + diaphoresis / jaw radiation (Rule out STEMI).
    - `RF-NEURO-001`: Sudden onset focal weakness / speech difficulty (FAST Stroke criteria).
    - `RF-RESP-001`: Severe acute dyspnea / stridor / tachypnea.
    - `RF-GI-001`: Acute rigid abdomen / coffee ground emesis.
  - Curate 4 standardized, realistic synthetic demo cases (Cardiology, Respiratory, Gastrointestinal, Diabetic Foot) clearly tagged as `DEMO / SYNTHETIC CASE`.
* **Verification & Testing Criteria**:
  - Unit tests verifying deterministic red flag triggering without network or AI gateway calls.
  - Verified separation between AI-generated case synthesis and hard-coded triage rules.

---

### Phase 5: Clinician Cockpit, Verification & Provenance Drawer (Upcoming)
* **Scope**:
  - Build high-density 30-second clinician dashboard.
  - Implement visual chronological patient timeline (symptom onset $\rightarrow$ progression $\rightarrow$ prior medication changes).
  - Develop interactive `[E]` Evidence Badges linking to the Provenance Drawer:
    - Audio interview quotes with original vernacular and translated clinical representation.
    - Scanned document crops with exact bounding box highlights.
  - Implement inline clinician action controls: **Accept All**, **Accept**, **Edit Inline**, **Reject**, and **Verify**.
  - Generate printable/exportable standard OPD Consultation Chit.
* **Verification & Testing Criteria**:
  - Clinician dashboard achieves sub-30 second full case comprehension in usability walk-through.
  - Clicking any evidence badge opens the correct source quote or document crop in < 100ms.
  - Complete audit trail generated when a clinician edits or rejects an AI-synthesized fact.

---

### Phase 6: FHIR Interoperability, Offline Resilience & Final Polish (Upcoming)
* **Scope**:
  - Implement `FhirR4Mapper` generating standard bundles: `Composition`, `Condition`, `MedicationStatement`, `Observation`, `AllergyIntolerance`.
  - Implement `AbdmAdapter` with mock sandbox endpoint and explicit UI status distinction between local export and external transmission.
  - Implement IndexedDB local caching for zero-network resilience in rural OPD kiosks.
  - Conduct accessibility audits (WCAG 2.1 AAA color contrast, keyboard navigation, screen reader testing).
  - Prepare high-impact hackathon presentation artifacts, clinical walk-through video scripts, and architectural pitch deck.
* **Verification & Testing Criteria**:
  - Validated output against official HL7 FHIR R4 schema validators.
  - Full demo workflow executable with zero internet connectivity in Demo Mode.

---

## 3. ARCHITECTURE REVIEW — SEPTEMBER 2026

The following architectural corrections were incorporated into this development plan:

1. **Next.js 16.x Adopted**: Next.js 16.x is designated as the target framework to align with current Active-LTS standards, React 19 stability, and high-performance Turbopack compilation.
2. **AI Provider Abstraction**: Direct coupling to Gemini is eliminated; all AI tasks flow through the `ClinicalAIGateway` supporting Gemini, OpenAI, Claude, and Mock adapters.
3. **Voice Service Abstraction**: The Web Speech API is moved behind `SpeechService` with complete support for touch/text fallbacks, offline resilience, and future Indian government BHASHINI integration.
4. **Deterministic Triage Isolation**: Clinical red flags are decoupled from generative AI and placed under a strictly deterministic, audited rule engine.
5. **Document Truth Preservation**: OCR extraction mandates raw text and bounding-box preservation with strict prohibitions against hallucinated dosages or inferred lab diagnoses.
6. **DPDP Audio Compliance**: Raw audio is treated as ephemeral with configurable retention; text transcripts and doctor-verified notes serve as permanent clinical records.
7. **Deferral of 3D Graphics**: 3D visual models are deferred to prioritize clinical clarity, low-end device performance, and accessibility.
8. **Honest ABDM Architecture**: Interoperability is architected as an adapter separating local FHIR generation from live external transmission.

---

## 4. Current State: Phase 1 On Hold

In strict accordance with architectural governance:
- **No application scaffolding has been initiated.**
- **No database schemas or UI components have been generated.**
- **All development remains frozen pending formal user review and sign-off.**
