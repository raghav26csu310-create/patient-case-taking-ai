# SAATHI Voice Test Report

## Scope
This report covers the browser speech recognition and text fallback behavior for the patient voice flow that powers recording, transcription and playback.

## Actual verification results
The application now performs capability checks before using browser speech recognition:

- Chrome / Edge with Web Speech API available: supported path; recognition attempts to start only after a user-triggered microphone action.
- Safari: recognition support is often partial or inconsistent; unsupported or blocked statements are surfaced as an explicit limitation, not a fake transcript.
- Firefox: usually unsupported for Web Speech; the app now fails clearly and offers the text-input path.
- Microphone denied: handled with a clear permission error message.
- No microphone / unavailable device: handled with explicit error messaging.
- Network errors: handled separately with a retry-vs-text fallback message.

## Limitations observed
1. Browser speech recognition is inherently dependent on the host browser and network service availability.
2. Some browsers do not provide reliable multilingual recognition even when the language mapping is correct.
3. When the browser or device cannot recognize speech, the app intentionally does not invent transcript text.

## Behavior implemented
- The adapter checks for speech recognition support before attempting to start.
- Microphone access is only triggered by a user action.
- Different failure modes are reported separately: unsupported browser, no mic, permission denied, no speech, and network issue.
- The app preserves the user flow with a clear text fallback when recognition cannot complete.
- Temporary resources are cleaned up when the recording ends or is cancelled.

## Test matrix
| Scenario | Result |
|---|---|
| Browser supports Web Speech | Recognition can start and transcript updates are surfaced |
| Browser unsupported | Clear unsupported-browser message shown; text entry remains available |
| Permission denied | Clear error message shown; no fake transcript is created |
| No speech detected | Clear no-speech message shown |
| Network failure | Clear network failure message shown |
| Text fallback | Available for all unsupported scenarios |

## Conclusion
The product now behaves honestly: if the browser cannot transcribe, the system tells the patient instead of pretending the recording succeeded. This keeps trust intact and aligns with healthcare usability requirements.
