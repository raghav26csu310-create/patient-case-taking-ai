# DEMO GUIDE & HACKATHON JURY WALKTHROUGH
## SIH26047 — Patient Case-Taking Software

Welcome to the SIH26047 live demonstration. This platform is engineered to solve first-mile clinical case-taking bottlenecks in high-volume Indian Outpatient Departments (OPDs).

---

## Quick Navigation: 4 Core Surfaces

| Route | Name | Purpose | Target User |
| :--- | :--- | :--- | :--- |
| **`/`** | **Portal Hub** | 3D neural data network, active case stats, 6-stage journey tracking, 1-click scenario launcher | Hospital OPD Director / Evaluator |
| **`/patient`** | **Patient Surface** | Multimodal intake: Vernacular voice STT/TTS, 2D anatomical map, 3D holographic wireframe, DPDP consent | Patient / Kiosk Attendant |
| **`/clinician`** | **Clinician Cockpit** | High-density 30-sec summary, interactive evidence citations `[E1]`, inline editing, OPD Chit print | Attending Physician |
| **`/triage`** | **Triage Queue** | Deterministic emergency rule engine, red-flag escalation, real-time waiting list | Triage Nurse / RMO |
| **`/admin`** | **Admin & Interop** | DPDP 24h audio purge daemon, FHIR R4 document compiler, ABDM M1/M2/M3 sandbox status | Hospital IT / DPDP Auditor |

---

## 8 Pre-Curated Synthetic Clinical Test Scenarios

Use the **floating "Select Clinical Demo Scenario"** badge at the bottom-right of any screen (or the scenario cards on `/`) to load any of these 8 cases instantly into state:

### 1. Routine Chronic Follow-up (`Kamla Devi`, 58F)
- **Clinical focus**: Type 2 Diabetes & Hypertension 3-month review and medication refill.
- **Key demo feature**: Touch-screen intake, stable HbA1c observation, quick verification.

### 2. Elderly Low-Literacy Bilingual Voice (`Ramswaroop Yadav`, 67M)
- **Clinical focus**: Bilateral knee osteoarthritis with severe walking difficulty.
- **Key demo feature**: Toggle **"आसान / Easy Mode"** in the top accessibility bar. Demonstrates Hindi vernacular audio prompts, simplified icon-driven cards, and VAS 0-10 visual pain slider.

### 3. Acute Chest Pain ACS Red Flag (`Rameshwar Sharma`, 54M) — *Recommended Evaluator Default*
- **Clinical focus**: Retrosternal heaviness radiating to left arm on exertion with vascular risk factors.
- **Key demo feature**: Triggers deterministic rule `RF-CARD-001`. Review the red alert in `/clinician`, and see the immediate escalation in `/triage` recommending a 12-lead ECG.

### 4. Voice-First Acute Respiratory Infection (`Sunil Joshi`, 36M)
- **Clinical focus**: High-grade fever, productive cough with yellow sputum for 4 days.
- **Key demo feature**: Demonstrates Web Speech API voice capture, real-time waveform indicator, and auto-mapping of vernacular audio into SOCRATES structured HPI.

### 5. Document-Heavy Complex Polypharmacy (`Meenakshi Sundaram`, 64F)
- **Clinical focus**: Chronic Kidney Disease (Stage 3), Diabetic Nephropathy, 4 concurrent medications.
- **Key demo feature**: OCR document processing preserving verbatim dosages without AI hallucination. View raw document snippets and crop links.

### 6. Abnormal Lab Investigation Escalation (`Rajesh Patel`, 42M)
- **Clinical focus**: Incidental finding of Fasting Blood Glucose 248 mg/dL and HbA1c 10.4%.
- **Key demo feature**: System captures lab findings as discrete observations rather than making a unilateral diagnosis, cleanly honoring clinical safety boundaries.

### 7. Acute Neurological Emergency FAST Stroke (`Savita Ben`, 69F)
- **Clinical focus**: Sudden onset right-sided facial droop, arm weakness, and dysarthria 45 minutes prior.
- **Key demo feature**: Triggers deterministic emergency rule `RF-NEURO-001`. Triage queue highlights immediate Stroke Bay routing within the 4.5-hour thrombolysis window.

### 8. AYUSH & Traditional Medicine Assessment (`Anand Kulkarni`, 45M)
- **Clinical focus**: Chronic dyspepsia (Amlapitta), Prakriti assessment (Vata-Pitta), Agni (Manda), and concurrent home remedies (Triphala churna, Ajwain).
- **Key demo feature**: Demonstrates holistic AYUSH clinical assessment fields standardized alongside modern allopathic review.

---

## Evaluator Walkthrough Flow (5-Minute Tour)

### Step 1: Open Portal Hub (`/`)
1. Observe the **3D Spatial Neural Data Lattice** rendered in real-time using Three.js with mouse parallax.
2. Review the **Approved 6-Stage Journey Pipeline**: Identify → Consent → Converse → Scan → Summarize → Consult.
3. Select **Scenario 3: Acute Chest Pain (ACS Red Flag)**.

### Step 2: Experience Patient Surface (`/patient`)
1. **Identify**: View patient token `#OPD-1042` and ABHA ID.
2. **Consent**: Listen to the vernacular audio consent explanation. Toggle granular consent permissions.
3. **Converse**:
   - Test **Microphone** voice input or text response.
   - Click **"Anatomical Body Map"** to view the 2D SVG silhouette with pain intensity slider (VAS 0-10).
   - Toggle **"3D Spatial Wireframe"** to inspect the Three.js holographic anatomical model with pulsing markers.
4. **Documents**: Inspect uploaded prescription OCR artifact.
5. **Summary**: Observe completion state ready for the clinician.

### Step 3: Review Clinician Cockpit (`/clinician`)
1. View the **30-second high-density clinical overview** (Demographics, SOCRATES HPI breakdown, Medications, Allergies).
2. Click any **`[E1]` or `[E2]` citation badge** to slide open the **Evidence Provenance Drawer**:
   - Compare the original Hindi utterance with the normalized representation.
   - Click **"Accept & Verify"** to record a cryptographically timestamped clinician verification log.
3. Click **"Edit History"** to test inline physician adjustments.
4. Click **"Print OPD Chit"** to generate a clean, print-ready OPD Consultation Summary with physician signature line.

### Step 4: Inspect Triage Emergency Workspace (`/triage`)
1. Observe real-time queue prioritization: `EMERGENCY` → `URGENT` → `PRIORITY` → `ROUTINE`.
2. Notice the prominent **`RF-CARD-001` Acute Coronary Syndrome alert** with immediate clinical routing recommendation.
3. Click **"Acknowledge"** or switch filters between emergency and routine queues.

### Step 5: Verify Admin, DPDP & Interoperability (`/admin`)
1. **Clinical Audit Trail**: View the tamper-evident log of all doctor verification actions with JSON export.
2. **DPDP Audio Lifecycle**: Click **"Simulate 24h Purge Trigger"** to watch the ephemeral audio daemon zero out raw waveforms in compliance with the DPDP Act 2023.
3. **FHIR R4 & ABDM Sandbox**: Click **"Generate FHIR R4 Bundle"** to compile an authentic, schema-validated FHIR R4 JSON document bundle from the active patient case.
4. **AI Gateway Decoupling**: View the provider-agnostic architecture allowing instant switching between Mock, Google Gemini, and Sovereign Edge LLM adapters.

---

## Technical Highlights for Technical Judges

- **Next.js 16.3.6 Active LTS**: Turbopack compiler, React 19, strict TypeScript 5.7.
- **100% Client-Side State Reactive**: `CaseGraphStore` React Context synchronizes patient, clinician, triage, and admin surfaces simultaneously.
- **Zero External API Lock-in**: All 8 scenarios and mock services run fully offline with zero external cloud dependencies.
- **Accessibility Invariants**: High-contrast ratios, large 44px+ touch targets, screen-reader semantic aria labels, and prefers-reduced-motion support.
- **Production Build**: 0 errors, 0 lint warnings, statically generated routes in < 3 seconds.
