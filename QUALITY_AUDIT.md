# SAATHI Quality Audit and Repair Summary

## Executive summary
This audit found a few systematic issues rather than isolated UI bugs: localization state was fragmented, the browser speech adapter was silently fabricating transcripts, and the demo scenario catalog was cluttered with stale synthetic entries. These were repaired inside the existing application without introducing a new codebase or breaking the intended patient workflow.

## Phase 1 — Application audit

### 1) Language switching and localization
Severity: Critical

Problems:
- Language preference existed only in partial local state and not consistently across the full app.
- The app header/navigation used hardcoded English labels, so changing language did not update the dashboard and navigation reliably.
- `document.documentElement.lang` was not synchronized with the active patient language.

Root cause:
- The app used a mix of `caseGraph.session.language` and hardcoded strings in the landing page and navigation without a centralized application-wide state sync.

Affected files:
- `src/domain/case-graph/case-graph-store.tsx`
- `src/components/layout/navbar.tsx`
- `src/app/page.tsx`
- `src/components/accessibility/accessibility-bar.tsx`

Fixes implemented:
- Added persistent language preference storage in the app-level context and synchronized it with the document language metadata.
- Updated the primary navigation to respond to the active language immediately.
- Updated the home page copy to reflect the active language and to avoid untranslated fallback text in translated screens.

### 2) Voice interaction reliability
Severity: Critical

Problems:
- Browser speech recognition could silently generate a transcript even when the browser did not support speech recognition.
- Errors such as microphone denial, unsupported browsers and network failures were not separated cleanly.
- The system lacked clear fallback messaging for unsupported environments.

Root cause:
- `BrowserSpeechAdapter.startListening()` “emulated” transcript data when speech recognition was missing, which created a false positive rather than a real transcript.

Affected files:
- `src/services/speech/browser-speech-adapter.ts`
- `src/services/speech/speech-service.ts`

Fixes implemented:
- Unsupported browsers now surface an explicit error instead of inventing recognition results.
- Permission, network, no-speech and unsupported-browser failures are handled separately.
- Recognition lifecycle cleanup is more robust, and stale listeners are cleared when the session ends.

### 3) Synthetic data quality and demo cleanup
Severity: High

Problems:
- Demo scenario catalog was too large and included stale or unnecessary synthetic cases.
- It was not clear which scenarios were genuinely useful for product demonstration.
- Reset actions did not make the safety boundary explicit.

Root cause:
- The synthetic scenario catalog was kept broad rather than curated for real product demos and user guidance.

Affected files:
- `src/mocks/scenarios/synthetic-scenarios.ts`
- `src/components/scenarios/scenario-switcher.tsx`

Fixes implemented:
- Kept a curated subset of demonstration scenarios rather than the entire historical set.
- Reset to blank patient intake now uses an explicit confirmation step before clearing demo session state.
- The reset flow explicitly states that real patient records are not deleted.

## Language coverage audit
The app now responds to the supported patient languages through the shared case graph state: English, Hindi, Hinglish, Bengali, Tamil, Telugu and Marathi. The main screens that must respond to language changes include:
- Home dashboard
- Patient onboarding
- Navigation and patient sidebar
- Settings / accessibility bar
- Interview and onboarding prompts
- Empty state and error messaging

Verification criteria:
- Switch the language from the accessibility bar and verify that the app updates without a page refresh.
- Confirm the HTML `lang` attribute updates and persists after refresh.
- Confirm key patient-facing labels update for all supported languages.
- Ensure unsupported browsers still provide a text fallback path rather than fake transcriptions.

## Verification summary
- `npm run typecheck` ✅
- `npm run build` ✅

## Proposed future hardening
- Add a single reusable translation hook for all remaining hardcoded strings across all app screens.
- Add browser automation tests that validate the English/Hindi/Hinglish switching and microphone permission flows.
- Include explicit synthetic-data inventory and deletion confirmation in any future admin or clinician workflow.
