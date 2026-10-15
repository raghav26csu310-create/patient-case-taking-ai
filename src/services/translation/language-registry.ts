import { PatientLanguage } from "@/domain/patient/types";

/**
 * India-First Multilingual Localization Registry
 * Provides UI and clinical question translations across official regional Indian languages.
 */

export interface LocaleStrings {
  appName: string;
  firstMileSub: string;
  startVisit: string;
  chooseLanguage: string;
  chooseModality: string;
  voiceModeTitle: string;
  voiceModeDesc: string;
  touchModeTitle: string;
  touchModeDesc: string;
  textModeTitle: string;
  textModeDesc: string;
  consentTitle: string;
  consentAudioPrompt: string;
  listenToExplanation: string;
  playingAudio: string;
  pauseAudio: string;
  replayAudio: string;
  continueBtn: string;
  backBtn: string;
  needHelp: string;
  speakNow: string;
  listening: string;
  confirmSpeech: string;
  tryAgain: string;
  typeYourAnswer: string;
  lowLiteracyToggle: string;
  mandatoryConsentAlert: string;
  dpdpAssurance: string;
  readyForInterviewTitle: string;
  readyForInterviewDesc: string;
}

export const LOCALES: Record<PatientLanguage, LocaleStrings> = {
  hi: {
    appName: "मरीज़ केस-टेकिंग इंटेलिजेंस",
    firstMileSub: "ओपीडी परामर्श पूर्व स्वचालित नैदानिक इतिहास संकलन",
    startVisit: "आइए आपका ओपीडी परामर्श शुरू करें",
    chooseLanguage: "अपनी पसंदीदा भाषा चुनें (Select Language)",
    chooseModality: "आप जानकारी कैसे देना चाहते हैं?",
    voiceModeTitle: "बोलकर (Voice)",
    voiceModeDesc: "अपनी मातृभाषा में बोलें, सिस्टम रिकॉर्ड व अनुवाद करेगा।",
    touchModeTitle: "छूकर (Touch)",
    touchModeDesc: "स्क्रीन पर बड़े बटनों और शरीर के दर्द नक्शे से चुनें।",
    textModeTitle: "लिखकर (Text)",
    textModeDesc: "कीबोर्ड द्वारा लिखकर विस्तृत जानकारी दें।",
    consentTitle: "डिजिटल सहमति (DPDP Act 2023 के तहत)",
    consentAudioPrompt:
      "यह प्रणाली आपके द्वारा बताए गए लक्षणों को आपके परामर्शदाता डॉक्टर के लिए व्यवस्थित करती है। कृपया नीचे दी गई अनुमतियों की पुष्टि करें।",
    listenToExplanation: "सहमति स्पष्टीकरण सुनें (Listen to Explanation)",
    playingAudio: "ऑडियो चल रहा है...",
    pauseAudio: "रोकें (Pause)",
    replayAudio: "दोबारा सुनें (Replay)",
    continueBtn: "आगे बढ़ें (Continue)",
    backBtn: "पीछे जाएँ (Back)",
    needHelp: "सहायता चाहिए? (Need Help)",
    speakNow: "अब बोलें (Speak Now)",
    listening: "सुन रहे हैं... (Listening)",
    confirmSpeech: "दर्ज की गई आवाज़ की पुष्टि करें",
    tryAgain: "फिर से प्रयास करें",
    typeYourAnswer: "यहाँ अपना उत्तर लिखें...",
    lowLiteracyToggle: "सरल आवाज़ मोड (Easy Audio Mode)",
    mandatoryConsentAlert: "स्वास्थ्य इतिहास और डॉक्टर सारांश की अनुमति अनिवार्य है।",
    dpdpAssurance: "आपकी आवाज़ और डेटा केवल डॉक्टर के लिए उपयोग होगा। ऑडियो 24 घंटे में स्वतः नष्ट हो जाता है।",
    readyForInterviewTitle: "आपकी जानकारी सुरक्षित रूप से दर्ज हो गई है",
    readyForInterviewDesc: "अब सिस्टम आपके लक्षणों व स्वास्थ्य इतिहास के बारे में पूछेगा।",
  },
  en: {
    appName: "Patient Case-Taking Intelligence",
    firstMileSub: "Automated Pre-Consultation Clinical Intake for High-Volume OPDs",
    startVisit: "Let's get your visit started",
    chooseLanguage: "Select your preferred language",
    chooseModality: "How would you prefer to interact?",
    voiceModeTitle: "By Voice",
    voiceModeDesc: "Speak naturally in your language; we will transcribe and format it.",
    touchModeTitle: "By Touch",
    touchModeDesc: "Tap large accessible buttons and the interactive anatomical pain map.",
    textModeTitle: "By Typing",
    textModeDesc: "Type in your responses using standard keyboard input.",
    consentTitle: "Informed Patient Consent (DPDP Act 2023)",
    consentAudioPrompt:
      "This system collects and organizes your health history to help your consulting doctor understand your condition faster. Please review and confirm your permissions.",
    listenToExplanation: "Listen to explanation",
    playingAudio: "Playing explanation audio...",
    pauseAudio: "Pause",
    replayAudio: "Replay",
    continueBtn: "Continue",
    backBtn: "Back",
    needHelp: "Need Assistance?",
    speakNow: "Tap to Speak",
    listening: "Listening...",
    confirmSpeech: "Confirm transcription",
    tryAgain: "Try Again",
    typeYourAnswer: "Type your answer here...",
    lowLiteracyToggle: "Simplified / Low-Literacy Mode",
    mandatoryConsentAlert: "Health history capture and clinical summary permissions are mandatory to proceed.",
    dpdpAssurance: "Your privacy is protected under DPDP Act 2023. Audio is ephemeral and auto-purged within 24 hours.",
    readyForInterviewTitle: "You are ready for your clinical intake",
    readyForInterviewDesc: "The system will now guide you through structured questions about your symptoms.",
  },
  hinglish: {
    appName: "Patient Case-Taking Intelligence",
    firstMileSub: "Doctor consultation se pehle clinical history intake",
    startVisit: "Apna OPD consultation shuru karein",
    chooseLanguage: "Apni language select karein",
    chooseModality: "Aap kaise baat karna chahenge?",
    voiceModeTitle: "Bolkar (Voice)",
    voiceModeDesc: "Apni aawaz mein bole, system automatically note karega.",
    touchModeTitle: "Touch karke",
    touchModeDesc: "Screen par tap karke aur body map se select karein.",
    textModeTitle: "Likhkar (Text)",
    textModeDesc: "Keyboard se type karke batayein.",
    consentTitle: "Patient Consent (DPDP Act 2023)",
    consentAudioPrompt:
      "Ye system aapki bimari ki details doctor ke liye note karta hai taaki consultation jaldi aur accurate ho sake.",
    listenToExplanation: "Audio suniye",
    playingAudio: "Audio play ho raha hai...",
    pauseAudio: "Pause karein",
    replayAudio: "Dobara sunein",
    continueBtn: "Aage badhein",
    backBtn: "Peeche",
    needHelp: "Help chahiye?",
    speakNow: "Boliye",
    listening: "Sun rahe hain...",
    confirmSpeech: "Aawaz confirm karein",
    tryAgain: "Dobara try karein",
    typeYourAnswer: "Yahan type karein...",
    lowLiteracyToggle: "Aasan Mode (Easy Audio Mode)",
    mandatoryConsentAlert: "Health history capture permission zaroori hai.",
    dpdpAssurance: "Aapka data safe hai aur audio 24 hours mein delete ho jayega.",
    readyForInterviewTitle: "Aap interview ke liye ready hain",
    readyForInterviewDesc: "System ab aapke symptoms ke baare mein questions poochega.",
  },
  bn: {
    appName: "রোগীর ক্লিনিক্যাল কেস-টেকিং",
    firstMileSub: "ডাক্তারবাবুর পরামর্শের পূর্বে স্বয়ংক্রিয় ইতিহাস সংগ্রহ",
    startVisit: "আসুন আপনার ওপিডি পরামর্শ শুরু করি",
    chooseLanguage: "আপনার পছন্দের ভাষা নির্বাচন করুন",
    chooseModality: "আপনি কীভাবে তথ্য জানাতে চান?",
    voiceModeTitle: "কথোপকথন (ভয়েস)",
    voiceModeDesc: "আপনার ভাষায় কথা বলুন, সিস্টেম লিপিবদ্ধ করবে।",
    touchModeTitle: "স্পর্শ (টাচ)",
    touchModeDesc: "স্ক্রিনে বড় বোতাম এবং শারীরিক ব্যথার মানচিত্র ব্যবহার করুন।",
    textModeTitle: "টাইপ করে (টেক্সট)",
    textModeDesc: "কীবোর্ডের সাহায্যে উত্তর লিখুন।",
    consentTitle: "ডিজিটাল সম্মতি (DPDP Act 2023)",
    consentAudioPrompt:
      "এই সিস্টেমটি আপনার স্বাস্থ্য সংক্রান্ত তথ্য আপনার ডাক্তারের জন্য সাজিয়ে রাখে। অনুগ্রহ করে অনুমতি নিশ্চিত করুন।",
    listenToExplanation: "ব্যাখ্যা শুনুন",
    playingAudio: "অডিও বাজছে...",
    pauseAudio: "থামান",
    replayAudio: "পুনরায় শুনুন",
    continueBtn: "পরবর্তী ধাপ",
    backBtn: "পূর্ববর্তী",
    needHelp: "সাহায্য প্রয়োজন?",
    speakNow: "কথা বলুন",
    listening: "শুনছি...",
    confirmSpeech: "কথা নিশ্চিত করুন",
    tryAgain: "আবার চেষ্টা করুন",
    typeYourAnswer: "এখানে আপনার উত্তর লিখুন...",
    lowLiteracyToggle: "সহজ অডিও মোড",
    mandatoryConsentAlert: "স্বাস্থ্য ইতিহাস ও সংক্ষিপ্তকরণের সম্মতি আবশ্যক।",
    dpdpAssurance: "আপনার গোপনীয়তা সুরক্ষিত। ২৪ ঘণ্টার মধ্যে অডিও মুছে ফেলা হয়।",
    readyForInterviewTitle: "আপনি সাক্ষাৎকারের জন্য প্রস্তুত",
    readyForInterviewDesc: "এখন সিস্টেম আপনার লক্ষণ সম্পর্কে প্রশ্ন করবে।",
  },
  ta: {
    appName: "நோயாளி மருத்துவ வரலாறு அமைப்பு",
    firstMileSub: "மருத்துவர் ஆலோசனைக்கு முன் மருத்துவ விவரங்கள் சேகரிப்பு",
    startVisit: "உங்கள் ஆலோசனையைத் தொடங்குவோம்",
    chooseLanguage: "உங்கள் மொழியைத் தேர்வுசெய்யவும்",
    chooseModality: "நீங்கள் எவ்வாறு தொடர்பு கொள்ள விரும்புகிறீர்கள்?",
    voiceModeTitle: "பேசி (Voice)",
    voiceModeDesc: "உங்கள் தாய்மொழியில் பேசுங்கள்; கணினி எழுதும்.",
    touchModeTitle: "தொட்டு (Touch)",
    touchModeDesc: "திரையில் உள்ள பொத்தான்கள் மற்றும் உடல் வரைபடத்தைத் தொடவும்.",
    textModeTitle: "டைப் செய்து (Text)",
    textModeDesc: "விசைப்பலகை மூலம் உங்கள் பதிலை உள்ளிடவும்.",
    consentTitle: "நோயாளியின் ஒப்புதல் (DPDP Act 2023)",
    consentAudioPrompt:
      "இந்த அமைப்பு உங்கள் அறிகுறிகளை மருத்துவருக்குப் புரியும் வகையில் ஒழுங்கமைக்கும்.",
    listenToExplanation: "விளக்கத்தைக் கேளுங்கள்",
    playingAudio: "ஆடியோ இயங்குகிறது...",
    pauseAudio: "நிறுத்து",
    replayAudio: "மீண்டும் கேள்",
    continueBtn: "தொடரவும்",
    backBtn: "பின்செல்லவும்",
    needHelp: "உதவி தேவையா?",
    speakNow: "பேச தொடங்குங்கள்",
    listening: "கேட்கிறது...",
    confirmSpeech: "உரையை உறுதிப்படுத்தவும்",
    tryAgain: "மீண்டும் முயற்சிக்கவும்",
    typeYourAnswer: "இங்கே தட்டச்சு செய்யவும்...",
    lowLiteracyToggle: "எளிய ஒலி முறை",
    mandatoryConsentAlert: "சுகாதார வரலாறு அனுமதி கட்டாயமாகும்.",
    dpdpAssurance: "உங்கள் தரவு பாதுகாப்பானது. ஆடியோ 24 மணிநேரத்தில் அழிக்கப்படும்.",
    readyForInterviewTitle: "நீங்கள் தயாராகிவிட்டீர்கள்",
    readyForInterviewDesc: "அடுத்ததாக அறிகுறிகள் பற்றிய கேள்விகள் தொடங்கும்.",
  },
  te: {
    appName: "రోగి క్లినికల్ కేస్-టేకింగ్ సిస్టమ్",
    firstMileSub: "డాక్టర్ సంప్రదింపులకు ముందు ఆరోగ్య చరిత్ర సేకరణ",
    startVisit: "మీ ఓపీడీ సందర్శనను ప్రారంభిద్దాం",
    chooseLanguage: "మీ భాషను ఎంచుకోండి",
    chooseModality: "మీరు ఎలా సమాచారం ఇవ్వాలనుకుంటున్నారు?",
    voiceModeTitle: "మాట్లాడి (Voice)",
    voiceModeDesc: "మీ భాషలో మాట్లాడండి, సిస్టమ్ నమోదు చేస్తుంది.",
    touchModeTitle: "తాకి (Touch)",
    touchModeDesc: "స్క్రీన్‌పై బటన్‌లు మరియు శరీర నొప్పి మ్యాప్‌ను ఎంచుకోండి.",
    textModeTitle: "టైప్ చేసి (Text)",
    textModeDesc: "కీబోర్డ్ ద్వారా సమాధానం రాయండి.",
    consentTitle: "డిజిటల్ సమ్మతి (DPDP Act 2023)",
    consentAudioPrompt: "ఈ వ్యవస్థ మీ లక్షణాలను డాక్టర్‌కు సులభంగా అర్థమయ్యేలా చేస్తుంది.",
    listenToExplanation: "వివరణ వినండి",
    playingAudio: "ఆడియో ప్లే అవుతోంది...",
    pauseAudio: "ఆపండి",
    replayAudio: "మళ్ళీ వినండి",
    continueBtn: "ముందుకు సాగండి",
    backBtn: "వెనుకకు",
    needHelp: "సహాయం కావాలా?",
    speakNow: "ఇప్పుడు మాట్లాడండి",
    listening: "వింటోంది...",
    confirmSpeech: "ధృవీకరించండి",
    tryAgain: "మళ్ళీ ప్రయత్నించండి",
    typeYourAnswer: "ఇక్కడ టైప్ చేయండి...",
    lowLiteracyToggle: "సరళమైన ఆడియో మోడ్",
    mandatoryConsentAlert: "ఆరోగ్య చరిత్ర అనుమతి తప్పనిసరి.",
    dpdpAssurance: "మీ డేటా సురక్షితం. ఆడియో 24 గంటల్లో తొలగించబడుతుంది.",
    readyForInterviewTitle: "మీరు సిద్ధంగా ఉన్నారు",
    readyForInterviewDesc: "ఇప్పుడు మీ లక్షణాలపై ప్రశ్నలు ప్రారంభమవుతాయి.",
  },
  mr: {
    appName: "रुग्ण केस-टेकिंग इंटेलिजन्स",
    firstMileSub: "डॉक्टरांच्या सल्ल्यापूर्वी स्वयंचलित वैद्यकीय इतिहास नोंदणी",
    startVisit: "आपली ओपीडी भेट सुरू करूया",
    chooseLanguage: "आपली भाषा निवडा",
    chooseModality: "तुम्ही माहिती कशी देऊ इच्छिता?",
    voiceModeTitle: "बोलून (Voice)",
    voiceModeDesc: "आपल्या भाषेत बोला, प्रणाली नोंद करेल.",
    touchModeTitle: "स्क्रीन स्पर्श (Touch)",
    touchModeDesc: "मोठ्या बटणांवरून आणि शरीराच्या वेदना नकाशावरून निवडा.",
    textModeTitle: "टाइप करून (Text)",
    textModeDesc: "कीबोर्डने आपले उत्तर लिहा.",
    consentTitle: "रुग्ण संमती (DPDP Act 2023)",
    consentAudioPrompt: "ही प्रणाली आपल्या लक्षणांची माहिती डॉक्टरांसाठी योग्य स्वरूपात तयार करते.",
    listenToExplanation: "स्पष्टीकरण ऐका",
    playingAudio: "ऑडिओ वाजत आहे...",
    pauseAudio: "थांबवा",
    replayAudio: "पुन्हा ऐका",
    continueBtn: "पुढे चला",
    backBtn: "मागे",
    needHelp: "मदत हवी आहे?",
    speakNow: "आता बोला",
    listening: "ऐकत आहे...",
    confirmSpeech: "खात्री करा",
    tryAgain: "पुन्हा प्रयत्न करा",
    typeYourAnswer: "येथे टाइप करा...",
    lowLiteracyToggle: "सोपे ऑडिओ मोड",
    mandatoryConsentAlert: "आरोग्य इतिहास नोंदणीची संमती अनिवार्य आहे.",
    dpdpAssurance: "आपला डेटा सुरक्षित आहे. ऑडिओ २४ तासांत नष्ट केला जाईल.",
    readyForInterviewTitle: "आपण मुलाखतीसाठी तयार आहात",
    readyForInterviewDesc: "आता प्रणाली आपल्या लक्षणांबद्दल प्रश्न विचारेल.",
  },
};
