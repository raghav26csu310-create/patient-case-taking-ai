import { PatientLanguage } from "@/domain/patient/types";
import { PatientCaseGraph } from "@/domain/case-graph/types";

/**
 * Complete Clinical Interview Question Engine
 * Deterministic, structured, multilingual question definitions with adaptive skip logic.
 */

export type ClinicalSection =
  | "CHIEF_COMPLAINT"
  | "PAIN_MAP"
  | "HPI"
  | "PAST_MEDICAL"
  | "SURGICAL"
  | "MEDICATION"
  | "ALLERGY"
  | "FAMILY"
  | "PERSONAL"
  | "ROS"
  | "AYUSH";

export interface QuestionOption {
  value: string;
  label: Record<PatientLanguage, string>;
  isRedFlagTrigger?: boolean;
}

export interface QuestionDefinition {
  id: string;
  section: ClinicalSection;
  pathway?: "PAIN" | "FEVER" | "RESPIRATORY" | "GASTROINTESTINAL" | "NEUROLOGICAL" | "SKIN" | "GENERAL" | "AYUSH";
  title: Record<PatientLanguage, string>;
  subtitle?: Record<PatientLanguage, string>;
  audioPrompt: Record<PatientLanguage, string>;
  inputType:
    | "VOICE_TEXT"
    | "SINGLE_SELECT"
    | "MULTI_SELECT"
    | "PAIN_MAP"
    | "SEVERITY_SCALE"
    | "BOOLEAN";
  options?: QuestionOption[];
  minScale?: number;
  maxScale?: number;
  condition?: (caseGraph: PatientCaseGraph) => boolean;
}

export const CLINICAL_INTERVIEW_QUESTIONS: QuestionDefinition[] = [
  // 1. CHIEF COMPLAINT
  {
    id: "q-cc-primary",
    section: "CHIEF_COMPLAINT",
    title: {
      hi: "आज आप किस मुख्य तकलीफ के लिए अस्पताल आए हैं?",
      en: "What main health issue brings you to the hospital today?",
      hinglish: "Aaj aap kis main takleef ke liye hospital aaye hain?",
      bn: "আজ আপনি কোন প্রধান সমস্যার জন্য হাসপাতালে এসেছেন?",
      ta: "இன்று நீங்கள் எந்த முக்கிய பிரச்சனைக்காக மருத்துவமனைக்கு வந்துள்ளீர்கள்?",
      te: "ఈ రోజు మీరు ఏ ముఖ్యమైన సమస్య కోసం ఆసుపత్రికి వచ్చారు?",
      mr: "आज आपण कोणत्या मुख्य त्रासासाठी रुग्णालयात आला आहात?",
    },
    subtitle: {
      hi: "कृपया मुख्य लक्षण बताएं (जैसे: सीने में दर्द, बुखार, खांसी, घुटने में दर्द)",
      en: "Describe your chief complaint (e.g., chest pain, fever, cough, knee pain)",
      hinglish: "Main symptom batayein (e.g., chest pain, fever, cough)",
      bn: "প্রধান লক্ষণটি বলুন (যেমন: বুকে ব্যথা, জ্বর, কাশি)",
      ta: "முக்கிய அறிகுறியைக் கூறவும் (எ.கா. நெஞ்சு வலி, காய்ச்சல், இருமல்)",
      te: "ప్రధాన లక్షణాన్ని చెప్పండి (ఉదా: ఛాతీ నొప్పి, జ్వరం, దగ్గు)",
      mr: "मुख्य लक्षण सांगा (उदा. छातीत दुखणे, ताप, खोकला)",
    },
    audioPrompt: {
      hi: "आज आप किस मुख्य तकलीफ के लिए अस्पताल आए हैं? कृपया बोलकर या लिखकर बताएं।",
      en: "What main health issue brings you to the hospital today? You may speak or type your answer.",
      hinglish: "Aaj aap kis main takleef ke liye hospital aaye hain? Bolkar ya type karke batayein.",
      bn: "আজ আপনি কোন প্রধান সমস্যার জন্য হাসপাতালে এসেছেন? অনুগ্রহ করে বলুন বা লিখুন।",
      ta: "இன்று நீங்கள் எந்த பிரச்சனைக்காக வந்துள்ளீர்கள்? தயவுசெய்து கூறவும்.",
      te: "ఈ రోజు మీరు ఏ సమస్య కోసం వచ్చారు? దయచేసి చెప్పండి.",
      mr: "आज आपण कोणत्या त्रासासाठी आला आहात? कृपया बोलून किंवा लिहून सांगा.",
    },
    inputType: "VOICE_TEXT",
  },

  // 2. CHIEF COMPLAINT DURATION
  {
    id: "q-cc-duration",
    section: "CHIEF_COMPLAINT",
    title: {
      hi: "यह तकलीफ आपको कितने समय से है?",
      en: "How long have you had this problem?",
      hinglish: "Ye takleef aapko kitne time se hai?",
      bn: "এই সমস্যাটি আপনার কতদিন ধরে হচ্ছে?",
      ta: "இந்த பிரச்சனை உங்களுக்கு எவ்வளவு காலமாக உள்ளது?",
      te: "ఈ సమస్య మీకు ఎంతకాలంగా ఉంది?",
      mr: "हा त्रास आपल्याला किती दिवसांपासून आहे?",
    },
    audioPrompt: {
      hi: "यह तकलीफ आपको कितने समय से हो रही है?",
      en: "How long have you been experiencing this problem?",
      hinglish: "Ye takleef kitne din ya ghante se hai?",
      bn: "এই সমস্যাটি কতদিন ধরে হচ্ছে?",
      ta: "இந்த பிரச்சனை எவ்வளவு நாட்களாக உள்ளது?",
      te: "ఈ సమస్య ఎంతకాలంగా ఉంది?",
      mr: "हा त्रास किती दिवसांपासून आहे?",
    },
    inputType: "SINGLE_SELECT",
    options: [
      {
        value: "FEW_HOURS",
        label: {
          hi: "कुछ घंटों से (अचानक शुरू हुआ)",
          en: "A few hours (Sudden onset)",
          hinglish: "Kuch ghanto se",
          bn: "কয়েক ঘণ্টা ধরে",
          ta: "சில மணிநேரமாக",
          te: "కొన్ని గంటలుగా",
          mr: "काही तासांपासून",
        },
      },
      {
        value: "1_TO_3_DAYS",
        label: {
          hi: "1 से 3 दिन से",
          en: "1 to 3 days",
          hinglish: "1-3 din se",
          bn: "১ থেকে ৩ দিন ধরে",
          ta: "1 முதல் 3 நாட்கள்",
          te: "1 నుండి 3 రోజులు",
          mr: "१ ते ३ दिवस",
        },
      },
      {
        value: "1_TO_2_WEEKS",
        label: {
          hi: "1 से 2 सप्ताह से",
          en: "1 to 2 weeks",
          hinglish: "1-2 hafte se",
          bn: "১ থেকে ২ সপ্তাহ ধরে",
          ta: "1 முதல் 2 வாரங்கள்",
          te: "1 నుండి 2 వారాలు",
          mr: "१ ते २ आठवडे",
        },
      },
      {
        value: "OVER_1_MONTH",
        label: {
          hi: "1 महीने से अधिक समय से (दीर्घकालिक)",
          en: "More than 1 month (Chronic)",
          hinglish: "1 mahine se zyada se",
          bn: "১ মাসের বেশি সময় ধরে",
          ta: "1 மாதத்திற்கும் மேலாக",
          te: "1 నెలకు పైగా",
          mr: "१ महिन्यापेक्षा जास्त",
        },
      },
    ],
  },

  // 3. ANATOMICAL PAIN MAP
  {
    id: "q-pain-map",
    section: "PAIN_MAP",
    title: {
      hi: "शरीर में दर्द या तकलीफ का स्थान चुनें",
      en: "Select the location of pain or discomfort on the body",
      hinglish: "Body mein dard kahan hai select karein",
      bn: "শরীরে ব্যথার স্থানটি নির্বাচন করুন",
      ta: "உடலில் வலி உள்ள இடத்தை தேர்ந்தெடுக்கவும்",
      te: "శరీరంలో నొప్పి ఉన్న ప్రాంతాన్ని ఎంచుకోండి",
      mr: "शरीरात वेदना असलेले ठिकाण निवडा",
    },
    subtitle: {
      hi: "शरीर के चित्र को छूकर सही स्थान और तीव्रता (0 से 10) बताएं",
      en: "Touch the anatomical diagram to indicate location and rate pain from 0 to 10",
      hinglish: "Body diagram par tap karein aur severity batayein",
      bn: "দেহের চিত্রে স্পর্শ করে স্থান ও তীব্রতা নির্ধারণ করুন",
      ta: "உடல் வரைபடத்தில் தொட்டு வலியின் அளவைக் குறிக்கவும்",
      te: "శరీర రేఖాచిత్రంపై తాకి నొప్పి తీవ్రతను తెలపండి",
      mr: "शरीराच्या आकृतीवर स्पर्श करून वेदनेची तीव्रता ठरवा",
    },
    audioPrompt: {
      hi: "स्क्रीन पर दिए गए शरीर के चित्र पर छूकर बताएं कि दर्द कहाँ है और कितना तेज़ है।",
      en: "Please touch the body diagram to indicate where you feel pain and how severe it is.",
      hinglish: "Screen par body diagram ko touch karke dard ki jagah select karein.",
      bn: "স্ক্রিনে দেওয়া দেহের চিত্রে স্পর্শ করে ব্যথার স্থান দেখান।",
      ta: "திரையில் உள்ள வரைபடத்தில் தொட்டு வலி உள்ள இடத்தைக் காட்டவும்.",
      te: "స్క్రీన్‌పై ఉన్న చిత్రంలో నొప్పి ఉన్న స్థలాన్ని ఎంచుకోండి.",
      mr: "स्क्रीनवरील आकृतीवर स्पर्श करून वेदनेची जागा सांगा.",
    },
    inputType: "PAIN_MAP",
  },

  // 4. HPI - SEVERITY SCALE (VAS 0 to 10)
  {
    id: "q-hpi-severity",
    section: "HPI",
    title: {
      hi: "तकलीफ की तीव्रता कितनी है? (0 = बिल्कुल नहीं, 10 = असहनीय दर्द)",
      en: "How severe is your discomfort? (0 = None, 10 = Worst unbearable pain)",
      hinglish: "Takleef kitni tez hai? (0 to 10 scale)",
      bn: "কষ্টের তীব্রতা কতটুকু? (০ = নেই, ১০ = চরম অসহ্য)",
      ta: "வலியின் தீவிரம் எவ்வளவு? (0 = இல்லை, 10 = தாங்க முடியாத வலி)",
      te: "నొప్పి తీవ్రత ఎంత? (0 = లేదు, 10 = భరించలేని నొప్పి)",
      mr: "त्रासाची तीव्रता किती आहे? (० = अजिबात नाही, १० = असह्य)",
    },
    audioPrompt: {
      hi: "शून्य से दस के पैमाने पर बताएं कि यह तकलीफ कितनी गंभीर है।",
      en: "Rate your discomfort on a scale of zero to ten.",
      hinglish: "Zero se ten ke beech mein batayein takleef kitni tez hai.",
      bn: "শূন্য থেকে দশের স্কেলে কষ্টের মাত্রা বলুন।",
      ta: "பூஜ்ஜியம் முதல் பத்து வரை வலியின் அளவைத் தேர்ந்தெடுக்கவும்.",
      te: "సున్నా నుండి పది వరకు నొప్పి తీవ్రతను ఎంచుకోండి.",
      mr: "शून्य ते दहाच्या प्रमाणात वेदना किती आहे ते सांगा.",
    },
    inputType: "SEVERITY_SCALE",
    minScale: 0,
    maxScale: 10,
  },

  // 5. HPI - ASSOCIATED RED FLAGS
  {
    id: "q-hpi-redflags",
    section: "HPI",
    title: {
      hi: "क्या आपको इनमें से कोई गंभीर लक्षण भी महसूस हो रहे हैं?",
      en: "Are you experiencing any of these urgent warning signs?",
      hinglish: "Kya aapko inme se koi serious symptom lag raha hai?",
      bn: "আপনার কি এর মধ্যে কোনো গুরুতর লক্ষণ আছে?",
      ta: "பின்வரும் ஆபத்தான அறிகுறிகள் ஏதேனும் உள்ளதா?",
      te: "కింది ప్రమాదకర లక్షణాలు ఏమైనా ఉన్నాయా?",
      mr: "आपल्याला खालीलपैकी कोणतीही गंभीर लक्षणे जाणवत आहेत का?",
    },
    audioPrompt: {
      hi: "क्या आपको पसीना आना, साँस फूलना, या अचानक कमजोरी जैसे गंभीर लक्षण हैं?",
      en: "Are you experiencing cold sweating, difficulty breathing, or sudden limb weakness?",
      hinglish: "Paseena aana, saans phoolna, ya weakness jaise symptoms hain?",
      bn: "ঘাম হওয়া, শ্বাসকষ্ট বা হঠাৎ দুর্বলতার মতো লক্ষণ আছে কি?",
      ta: "குளிர்ந்த வியர்வை, மூச்சுத்திணறல் அல்லது பலவீனம் உள்ளதா?",
      te: "చెమటలు పట్టడం, శ్వాస తీసుకోవడంలో ఇబ్బంది లేదా బలహీనత ఉందా?",
      mr: "घाम येणे, धाप लागणे किंवा अचानक अशक्तपणा जाणवतो का?",
    },
    inputType: "MULTI_SELECT",
    options: [
      {
        value: "DIAPHORESIS",
        isRedFlagTrigger: true,
        label: {
          hi: "अत्यधिक ठंडा पसीना आना (Cold Sweating)",
          en: "Cold sweating / Diaphoresis",
          hinglish: "Thanda paseena aana",
          bn: "ঠান্ডা ঘাম হওয়া",
          ta: "குளிர்ந்த வியர்வை",
          te: "చల్లని చెమటలు పట్టడం",
          mr: "थंड घाम येणे",
        },
      },
      {
        value: "DYSPNEA",
        isRedFlagTrigger: true,
        label: {
          hi: "साँस लेने में गंभीर कठिनाई (Shortness of Breath)",
          en: "Shortness of breath / Dyspnea",
          hinglish: "Saans lene mein dikkat",
          bn: "শ্বাস নিতে কষ্ট হওয়া",
          ta: "மூச்சுத்திணறல்",
          te: "శ్వాస తీసుకోవడంలో తీవ్ర ఇబ్బంది",
          mr: "श्वास घेण्यास त्रास",
        },
      },
      {
        value: "RADIATION_ARM",
        isRedFlagTrigger: true,
        label: {
          hi: "दर्द बाएँ हाथ, गर्दन या जबड़े की तरफ खिंचना",
          en: "Pain radiating to left arm, neck, or jaw",
          hinglish: "Dard left arm ya gale ki taraf jana",
          bn: "ব্যথা বাঁ হাত বা চোয়ালের দিকে ছড়িয়ে পড়া",
          ta: "வலி இடது கை அல்லது தாடை வரை பரவுதல்",
          te: "నొప్పి ఎడమ చేయి లేదా దవడ వైపు వ్యాపించడం",
          mr: "वेदना डाव्या हाताकडे किंवा जबड्याकडे पसरणे",
        },
      },
      {
        value: "FACIAL_DROOP_WEAKNESS",
        isRedFlagTrigger: true,
        label: {
          hi: "चेहरे का टेढ़ापन या हाथ-पैर में अचानक कमजोरी",
          en: "Sudden facial droop or weakness in arm/leg (Stroke sign)",
          hinglish: "Face tedha hona ya haath mein weakness",
          bn: "মুখ বাঁকা হয়ে যাওয়া বা হাতে হঠাৎ দুর্বলতা",
          ta: "முகம் ஒருபக்கமாக மாறுதல் அல்லது கையில் பலவீனம்",
          te: "ముఖం ఒకవైపు వాలడం లేదా చేతిలో బలహీనత",
          mr: "चेहरा वाकडा होणे किंवा हातात अचानक अशक्तपणा",
        },
      },
      {
        value: "NONE",
        label: {
          hi: "इनमें से कोई नहीं (None of the above)",
          en: "None of the above",
          hinglish: "Inme se kuch nahi",
          bn: "উপরের কোনটিই নয়",
          ta: "மேற்கண்ட எதுவுமில்லை",
          te: "పైవేవీ కావు",
          mr: "यापैकी काहीही नाही",
        },
      },
    ],
  },

  // 6. PAST MEDICAL HISTORY (PMH)
  {
    id: "q-pmh-conditions",
    section: "PAST_MEDICAL",
    title: {
      hi: "क्या आपको पहले से इनमें से कोई बीमारी है?",
      en: "Do you have any existing diagnosed medical conditions?",
      hinglish: "Kya pehle se inme se koi bimari hai?",
      bn: "আপনার কি আগে থেকেই কোনো রোগ আছে?",
      ta: "உங்களுக்கு ஏற்கனவே ஏதேனும் நோய் உள்ளதா?",
      te: "మీకు ఇంతకు ముందు ఏవైనా వ్యాధులు ఉన్నాయా?",
      mr: "आपल्याला पूर्वीपासून खालीलपैकी कोणताही आजार आहे का?",
    },
    audioPrompt: {
      hi: "क्या आपको पहले से डायबिटीज, ब्लड प्रेशर, दमा या दिल की बीमारी है?",
      en: "Do you have existing Diabetes, High Blood Pressure, Asthma, or Heart condition?",
      hinglish: "Pehle se Sugar, BP, Asthma ya Heart ki problem hai?",
      bn: "আগে থেকেই কি ডায়াবেটিস, রক্তচাপ বা হাঁপানির সমস্যা আছে?",
      ta: "சர்க்கரை நோய், ரத்த அழுத்தம் அல்லது ஆஸ்துமா உள்ளதா?",
      te: "డయాబెటిస్, బీపీ లేదా ఆస్తమా ఉన్నాయా?",
      mr: "मधुमेह, रक्तदाब किंवा दम्याचा त्रास आहे का?",
    },
    inputType: "MULTI_SELECT",
    options: [
      {
        value: "DIABETES",
        label: {
          hi: "डायबिटीज / शुगर (Diabetes Mellitus)",
          en: "Diabetes Mellitus",
          hinglish: "Sugar / Diabetes",
          bn: "ডায়াবেটিস / সুগার",
          ta: "சர்க்கரை நோய் (Diabetes)",
          te: "మధుమేహం (Diabetes)",
          mr: "मधुमेह (Diabetes)",
        },
      },
      {
        value: "HYPERTENSION",
        label: {
          hi: "उच्च रक्तचाप / बीपी (Hypertension)",
          en: "High Blood Pressure (Hypertension)",
          hinglish: "High BP",
          bn: "উচ্চ রক্তচাপ (High BP)",
          ta: "உயர் ரத்த அழுத்தம் (BP)",
          te: "రక్తపోటు (High BP)",
          mr: "उच्च रक्तदाब (High BP)",
        },
      },
      {
        value: "HEART_DISEASE",
        label: {
          hi: "हृदय रोग / पुराना दिल का दौरा (Heart Disease / Prior MI)",
          en: "Heart Disease / Prior Heart Attack",
          hinglish: "Heart ki bimari",
          bn: "হৃদরোগ",
          ta: "இதய நோய்",
          te: "గుండె జబ్బులు",
          mr: "हृदयरोग",
        },
      },
      {
        value: "ASTHMA_COPD",
        label: {
          hi: "दमा / सांस की बीमारी (Asthma / Respiratory illness)",
          en: "Asthma / Respiratory condition",
          hinglish: "Asthma / Saans ki dikkat",
          bn: "হাঁপানি / অ্যাজমা",
          ta: "ஆஸ்துமா",
          te: "ఆస్తమా",
          mr: "दमा / श्वासविकार",
        },
      },
      {
        value: "KIDNEY_DISEASE",
        label: {
          hi: "गुर्दे / किडनी की बीमारी (Kidney condition)",
          en: "Kidney Disease (CKD)",
          hinglish: "Kidney problem",
          bn: "কিডনির সমস্যা",
          ta: "சிறுநீரக நோய்",
          te: "కిడ్నీ వ్యాధి",
          mr: "मूत्रपिंड विकार",
        },
      },
      {
        value: "NO_PRIOR_ILLNESS",
        label: {
          hi: "कोई पुरानी बीमारी नहीं है (No known prior medical illness)",
          en: "No known prior medical conditions",
          hinglish: "Pehle se koi bimari nahi hai",
          bn: "পূর্বে কোনো রোগ নেই",
          ta: "முந்தைய நோய்கள் எதுவும் இல்லை",
          te: "మునుపటి అనారోగ్యాలు లేవు",
          mr: "पूर्वीचा कोणताही आजार नाही",
        },
      },
    ],
  },

  // 7. SURGICAL HISTORY (PSH - Screening)
  {
    id: "q-psh-screening",
    section: "SURGICAL",
    title: {
      hi: "क्या आपका कभी कोई ऑपरेशन या सर्जरी हुई है?",
      en: "Have you ever undergone any past surgeries or operations?",
      hinglish: "Kya pehle kabhi koi operation ya surgery hui hai?",
      bn: "আপনার কি আগে কখনও কোনো অস্ত্রোপচার হয়েছে?",
      ta: "உங்களுக்கு இதற்கு முன் அறுவை சிகிச்சை செய்யப்பட்டுள்ளதா?",
      te: "మీకు ఇంతకు ముందు ఏదైనా శస్త్రచికిత్స జరిగిందా?",
      mr: "आपली पूर्वी कधी कोणती शस्त्रक्रिया झाली आहे का?",
    },
    audioPrompt: {
      hi: "क्या आपका पहले कभी कोई ऑपरेशन हुआ है?",
      en: "Have you had any surgery in the past?",
      hinglish: "Kya pehle kabhi koi operation hua hai?",
      bn: "আগে কি কোনো অপারেশন হয়েছিল?",
      ta: "முன்பு அறுவை சிகிச்சை செய்யப்பட்டுள்ளதா?",
      te: "ఇంతకు ముందు ఆపరేషన్ జరిగిందా?",
      mr: "पूर्वी कधी शस्त्रक्रिया झाली आहे का?",
    },
    inputType: "BOOLEAN",
  },

  // 8. SURGICAL HISTORY DETAILS (Condition: Only if q-psh-screening is YES)
  {
    id: "q-psh-details",
    section: "SURGICAL",
    title: {
      hi: "कौन सा ऑपरेशन हुआ था और कितने साल पहले?",
      en: "Which surgery did you have and approximately when?",
      hinglish: "Kaun sa operation hua tha aur kab?",
      bn: "কোন অস্ত্রোপচারটি হয়েছিল এবং কতদিন আগে?",
      ta: "எந்த அறுவை சிகிச்சை மற்றும் எப்போது நடந்தது?",
      te: "ఏ శస్త్రచికిత్స జరిగింది మరియు ఎప్పుడు?",
      mr: "कोणती शस्त्रक्रिया झाली होती आणि कधी?",
    },
    audioPrompt: {
      hi: "कृपया बताएं कि कौन सा ऑपरेशन हुआ था।",
      en: "Please specify the surgery and approximate year.",
      hinglish: "Operation ka naam batayein.",
      bn: "অস্ত্রোপচারের নাম বলুন।",
      ta: "அறுவை சிகிச்சையின் விவரத்தை கூறவும்.",
      te: "శస్త్రచికిత్స వివరాలను చెప్పండి.",
      mr: "शस्त्रक्रियेचे नाव सांगा.",
    },
    inputType: "VOICE_TEXT",
    condition: (cg) => cg.surgicalHistory.length > 0 || cg.pastMedicalHistory.some((m) => m.condition.toLowerCase().includes("surg")),
  },

  // 9. CURRENT MEDICATIONS
  {
    id: "q-med-current",
    section: "MEDICATION",
    title: {
      hi: "क्या आप वर्तमान में कोई नियमित दवाइयाँ ले रहे हैं?",
      en: "Are you currently taking any regular daily medications?",
      hinglish: "Kya aap abhi koi regular medicines le rahe hain?",
      bn: "আপনি কি বর্তমানে কোনো নিয়মিত ওষুধ খাচ্ছেন?",
      ta: "நீங்கள் தற்போது ஏதேனும் வழக்கமான மருந்துகளை எடுத்துக்கொள்கிறீர்களா?",
      te: "మీరు ప్రస్తుతం ఏవైనా రోజువారీ మందులు తీసుకుంటున్నారా?",
      mr: "आपण सध्या नियमितपणे कोणती औषधे घेत आहात का?",
    },
    audioPrompt: {
      hi: "क्या आप अभी बीपी, शुगर या किसी अन्य बीमारी की नियमित दवाई ले रहे हैं?",
      en: "Are you taking regular medications for BP, Sugar, or any other health condition?",
      hinglish: "Kya abhi daily koi medicine lete hain?",
      bn: "আপনি কি প্রতিদিন কোনো ওষুধ খান?",
      ta: "தினமும் ஏதேனும் மருந்து சாப்பிடுகிறீர்களா?",
      te: "రోజూ మందులు వాడుతున్నారా?",
      mr: "दररोज कोणती औषधे घेत आहात का?",
    },
    inputType: "VOICE_TEXT",
  },

  // 10. KNOWN ALLERGIES (Screening with Skip Logic)
  {
    id: "q-alg-screening",
    section: "ALLERGY",
    title: {
      hi: "क्या आपको किसी दवाई से एलर्जी (रिएक्शन) है?",
      en: "Do you have any known drug or medication allergies?",
      hinglish: "Kya kisi medicine se allergy ya reaction hota hai?",
      bn: "কোনো ওষুধের কারণে কি আপনার অ্যালার্জি বা পার্শ্বপ্রতিক্রিয়া হয়?",
      ta: "மருந்துகளால் ஏதேனும் ஒவ்வாமை (Allergy) உள்ளதா?",
      te: "ఏదైనా మందుతో మీకు అలెర్జీ ఉందా?",
      mr: "कोणत्या औषधाची ॲलर्जी किंवा रिॲक्शन होते का?",
    },
    audioPrompt: {
      hi: "क्या आपको पेनिसिलिन, सल्फा या किसी अन्य दवाई से दाने, खुजली या रिएक्शन होता है?",
      en: "Have you ever had an allergic reaction like a rash or swelling to Penicillin or other medications?",
      hinglish: "Kisi medicine se allergy ya reaction hota hai?",
      bn: "কোনো ওষুধে কি চুলকানি বা প্রতিক্রিয়া হয়?",
      ta: "மருந்தினால் ஒவ்வாமை ஏற்பட்டதா?",
      te: "మందులతో ఎప్పుడైనా రియాక్షన్ వచ్చిందా?",
      mr: "कोणत्याही औषधाने ॲलर्जी होते का?",
    },
    inputType: "SINGLE_SELECT",
    options: [
      {
        value: "NO_KNOWN_ALLERGY",
        label: {
          hi: "नहीं, कोई ज्ञात एलर्जी नहीं है (NKDA)",
          en: "No known drug allergies (NKDA)",
          hinglish: "Nahi, koi allergy nahi hai",
          bn: "না, কোনো অ্যালার্জি নেই",
          ta: "இல்லை, ஒவ்வாமை எதுவும் இல்லை",
          te: "లేదు, ఎలాంటి అలెర్జీలు లేవు",
          mr: "नाही, कोणतीही ॲलर्जी नाही",
        },
      },
      {
        value: "PENICILLIN",
        isRedFlagTrigger: true,
        label: {
          hi: "हाँ, पेनिसिलिन / एंटीबायोटिक से (Penicillin)",
          en: "Yes, Penicillin / Antibiotics",
          hinglish: "Haan, Penicillin se",
          bn: "হ্যাঁ, পেনিসিলিন",
          ta: "ஆம், பென்சிலின் (Penicillin)",
          te: "అవును, పెన్సిలిన్",
          mr: "होय, पेनिसिलिन",
        },
      },
      {
        value: "SULFA",
        isRedFlagTrigger: true,
        label: {
          hi: "हाँ, सल्फा दवाओं से (Sulfa Drugs)",
          en: "Yes, Sulfa medications",
          hinglish: "Haan, Sulfa medicines",
          bn: "হ্যাঁ, সালফা ওষুধ",
          ta: "ஆம், சல்பா மருந்துகள்",
          te: "అవును, సల్ఫా మందులు",
          mr: "होय, सल्फा औषधे",
        },
      },
      {
        value: "OTHER_ALLERGY",
        label: {
          hi: "हाँ, अन्य दवाई से (Other Drug)",
          en: "Yes, other drug or food allergy",
          hinglish: "Haan, kisi aur medicine se",
          bn: "অন্যান্য ওষুধ",
          ta: "மற்ற மருந்துகள்",
          te: "ఇతర మందులు",
          mr: "इतर औषध",
        },
      },
    ],
  },

  // 11. PERSONAL / HABITS (Tobacco & Lifestyle)
  {
    id: "q-personal-habits",
    section: "PERSONAL",
    title: {
      hi: "तंबाकू, धूम्रपान या शराब का सेवन?",
      en: "Do you use tobacco, smoke bidi/cigarettes, or drink alcohol?",
      hinglish: "Tambaku, bidi/cigarette ya alcohol lete hain?",
      bn: "তামাক, বিড়ি/সিগারেট বা অ্যালকোহল ব্যবহার করেন কি?",
      ta: "புகையிலை, பீடி/சிகரெட் அல்லது மது அருந்துவது உண்டா?",
      te: "పొగాకు, బీడీ/సిగరెట్ లేదా మద్యం అలవాట్లు ఉన్నాయా?",
      mr: "तंबाखू, विडी/सिगारेट किंवा मद्यपान करता का?",
    },
    audioPrompt: {
      hi: "क्या आप तंबाकू, बीड़ी, सिगरेट या शराब का सेवन करते हैं?",
      en: "Do you use tobacco, smoke, or consume alcohol?",
      hinglish: "Tambaku, bidi, cigarette ya alcohol ka sevan karte hain?",
      bn: "তামাক বা ধূমপানের অভ্যাস আছে কি?",
      ta: "புகைபிடித்தல் அல்லது மதுப்பழக்கம் உள்ளதா?",
      te: "పొగాకు లేదా ధూమపానం అలవాటు ఉందా?",
      mr: "तंबाखू, विडी किंवा सिगारेटचे व्यसन आहे का?",
    },
    inputType: "MULTI_SELECT",
    options: [
      {
        value: "NONE",
        label: {
          hi: "कोई व्यसन नहीं (None)",
          en: "None",
          hinglish: "Kuch nahi",
          bn: "কোনোটিই নয়",
          ta: "எதுவுமில்லை",
          te: "ఏమీ లేవు",
          mr: "काहीही नाही",
        },
      },
      {
        value: "BIDI_CIGARETTE",
        label: {
          hi: "बीड़ी या सिगरेट (Smoking)",
          en: "Bidi / Cigarette Smoker",
          hinglish: "Bidi / Cigarette",
          bn: "বিড়ি বা সিগারেট",
          ta: "பீடி / சிகரெட்",
          te: "బీడీ / సిగరెట్",
          mr: "विडी किंवा सिगारेट",
        },
      },
      {
        value: "GUTKHA_TOBACCO",
        label: {
          hi: "गुटखा या चबाने वाला तंबाकू (Chewing Tobacco)",
          en: "Gutkha / Chewing Tobacco / Khaini",
          hinglish: "Gutkha / Tambaku",
          bn: "গুটখা বা জর্দা",
          ta: "குட்கா / புகையிலை",
          te: "గుట్కా / పొగాకు నమలడం",
          mr: "गुटखा किंवा तंबाखू",
        },
      },
      {
        value: "ALCOHOL",
        label: {
          hi: "शराब (Alcohol consumption)",
          en: "Alcohol consumption",
          hinglish: "Alcohol",
          bn: "অ্যালকোহল",
          ta: "மது அருந்துதல்",
          te: "మద్యపానం",
          mr: "मद्यपान",
        },
      },
    ],
  },

  // 12. OPTIONAL AYUSH ASSESSMENT
  {
    id: "q-ayush-assessment",
    section: "AYUSH",
    title: {
      hi: "आयुष पारंपरिक स्वास्थ्य मूल्यांकन (वैकल्पिक / Optional)",
      en: "AYUSH Holistic Health Profile (Optional)",
      hinglish: "AYUSH Ayurvedic Assessment (Optional)",
      bn: "আয়ুশ ঐতিহ্যবাহী মূল্যায়ন (ঐচ্ছিক)",
      ta: "ஆயுஷ் பாரம்பரிய மதிப்பீடு (விருப்பமானது)",
      te: "ఆయుష్ సంప్రదాయ అంచనా (ఐచ్ఛికం)",
      mr: "आयुष पारंपरिक आरोग्य मूल्यांकन (ऐच्छिक)",
    },
    subtitle: {
      hi: "पाचन शक्ति (अग्नि) और कोष्ठ (मल त्याग) का आत्म-मूल्यांकन",
      en: "Self-reported assessment of digestion (Agni) and bowel tendency (Koshtha)",
      hinglish: "Hazma (Agni) aur pet saaf hone ka assessment",
      bn: "হজম ক্ষমতা এবং কোষ্ঠকাঠিন্যের স্ব-মূল্যায়ন",
      ta: "செரிமான சக்தி மற்றும் மலச்சிக்கல் மதிப்பீடு",
      te: "జీర్ణక్రియ మరియు మలబద్ధకం అంచనా",
      mr: "पचनशक्ती आणि पोट साफ होण्याची प्रवृत्ती",
    },
    audioPrompt: {
      hi: "क्या आप पाचन और जीवनशैली का पारंपरिक आयुष मूल्यांकन जोड़ना चाहते हैं?",
      en: "Would you like to include an optional AYUSH holistic digestion profile?",
      hinglish: "Kya aap AYUSH digestion profile add karna chahte hain?",
      bn: "আপনি কি ঐতিহ্যবাহী আয়ুশ মূল্যায়ন যোগ করতে চান?",
      ta: "பாரம்பரிய ஆயுஷ் மதிப்பீட்டை சேர்க்க விரும்புகிறீர்களா?",
      te: "ఆయుష్ ప్రొఫైల్‌ను జోడించాలనుకుంటున్నారా?",
      mr: "आपण आयुष मूल्यांकन जोडू इच्छिता का?",
    },
    inputType: "SINGLE_SELECT",
    options: [
      {
        value: "SAMA_AGNI",
        label: {
          hi: "समाग्नि (सामान्य व संतुलित पाचन, समय पर भूख)",
          en: "Balanced digestion (Sama Agni) - Good appetite and digestion",
          hinglish: "Normal digestion aur regular bhookh",
          bn: "স্বাভাবিক হজম ক্ষমতা",
          ta: "சீரான செரிமானம்",
          te: "సమతుల్య జీర్ణక్రియ",
          mr: "संतुलित पचनशक्ती",
        },
      },
      {
        value: "MANDA_AGNI",
        label: {
          hi: "मंदाग्नि (धीमा पाचन, भारीपन, भूख कम लगना)",
          en: "Sluggish digestion (Manda Agni) - Heaviness after eating, low appetite",
          hinglish: "Slow digestion, pet bhari rehna",
          bn: "ধীর হজম, পেট ভারী থাকা",
          ta: "மந்தமான செரிமானம்",
          te: "మందకొడి జీర్ణక్రియ",
          mr: "मंद पचन, पोट जड होणे",
        },
      },
      {
        value: "TIKSHNA_AGNI",
        label: {
          hi: "तीक्ष्णाग्नि (अत्यधिक भूख, जलन व एसिडिटी की प्रवृत्ति)",
          en: "Intense digestion (Tikshna Agni) - Frequent hunger, acidity tendency",
          hinglish: "Bohot zyada bhookh, acidity tendency",
          bn: "তীব্র ক্ষুধা ও অম্লতা",
          ta: "அதிக பசி மற்றும் அசிடிட்டி",
          te: "తీవ్రమైన ఆకలి మరియు ఎసిడిటీ",
          mr: "तीव्र भूक आणि ॲसिडिटी",
        },
      },
      {
        value: "SKIP_AYUSH",
        label: {
          hi: "अभी छोड़ें (Skip AYUSH assessment)",
          en: "Skip AYUSH assessment",
          hinglish: "Abhi skip karein",
          bn: "এখন এড়িয়ে যান",
          ta: "தவிர்க்கவும்",
          te: "వదిలివేయండి",
          mr: "आत्ता वगळा",
        },
      },
    ],
  },
];
