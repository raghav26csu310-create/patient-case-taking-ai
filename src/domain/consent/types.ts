/**
 * Patient Informed Consent Domain Models
 * Compliant with India's Digital Personal Data Protection (DPDP) Act 2023
 */

export interface ConsentCategory {
  id: string;
  code: "HEALTH_HISTORY" | "AUDIO_RECORDING" | "DOCUMENT_SCAN" | "CLINICAL_SYNTHESIS";
  title: string;
  titleHindi: string;
  description: string;
  descriptionHindi: string;
  isMandatory: boolean;
  defaultValue: boolean;
}

export const GRANULAR_CONSENT_CATEGORIES: ConsentCategory[] = [
  {
    id: "consent-history",
    code: "HEALTH_HISTORY",
    title: "Health History & Symptoms",
    titleHindi: "स्वास्थ्य इतिहास और लक्षण",
    description: "Allow system to collect and organize your symptom descriptions for your consulting doctor.",
    descriptionHindi: "डॉक्टर के परामर्श हेतु आपके लक्षणों व स्वास्थ्य इतिहास को दर्ज और व्यवस्थित करने की अनुमति।",
    isMandatory: true,
    defaultValue: true,
  },
  {
    id: "consent-audio",
    code: "AUDIO_RECORDING",
    title: "Optional Voice & Audio Processing",
    titleHindi: "आवाज़ व ऑडियो रिकॉर्डिंग (वैकल्पिक)",
    description: "Allow temporary voice capture to generate an accurate transcript. Audio is deleted within 24 hours.",
    descriptionHindi: "सटीक बातचीत दर्ज करने के लिए अस्थायी आवाज़ रिकॉर्डिंग। रिकॉर्डिंग 24 घंटे में स्वतः हटा दी जाती है।",
    isMandatory: false,
    defaultValue: true,
  },
  {
    id: "consent-documents",
    code: "DOCUMENT_SCAN",
    title: "Prior Prescription & Lab Scanning",
    titleHindi: "पुरानी पर्ची व लैब रिपोर्ट स्कैन (वैकल्पिक)",
    description: "Allow scanning of paper prescriptions or lab reports to highlight prior medications for the doctor.",
    descriptionHindi: "पुरानी दवाइयों व जाँच रिपोर्ट को स्कैन कर डॉक्टर के लिए महत्वपूर्ण जानकारी निकालने की अनुमति।",
    isMandatory: false,
    defaultValue: true,
  },
  {
    id: "consent-synthesis",
    code: "CLINICAL_SYNTHESIS",
    title: "AI-Assisted Structuring for Doctor",
    titleHindi: "डॉक्टर के लिए सारांश निर्माण",
    description: "Allow the clinical engine to format your answers into a clear case sheet for your doctor to review.",
    descriptionHindi: "आपके द्वारा दी गई जानकारी को डॉक्टर के तुरंत पढ़ने योग्य केस-शीट में व्यवस्थित करने की अनुमति।",
    isMandatory: true,
    defaultValue: true,
  },
];

export interface ConsentRecord {
  patientId: string;
  hasConsentedToHealthHistory: boolean;
  hasConsentedToAudioRecording: boolean;
  hasConsentedToDocumentProcessing: boolean;
  hasConsentedToClinicalSynthesis: boolean;
  audioPlaybackListened: boolean;
  consentLanguage: string;
  consentedAt: string;
  consentMethod: "VOICE_AFFIRMATION" | "TOUCH_SCREEN_SELECTION" | "ASSISTED_CLINICAL_STAFF";
  dataRetentionHours: number; // Ephemeral default: 24h
  revokedAt?: string;
}
