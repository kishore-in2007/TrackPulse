export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te' | 'mr' | 'bn';

export interface TranslationDict {
  system_title: string;
  system_subtitle: string;
  sih_badge: string;
  operations_hub: string;
  train_detail: string;
  station_master: string;
  network_propagation: string;
  what_if_simulator: string;
  passenger_planner: string;
  pnr_sms: string;
  active_delay: string;
  predicted_eta: string;
  uncertainty_range: string;
  reliability: string;
  delay_risk: string;
  evidence_reasoning: string;
  high_risk: string;
  medium_risk: string;
  low_risk: string;
  incoming_trains: string;
  outgoing_trains: string;
  turnaround_shortfall: string;
  recalculate: string;
  search_placeholder: string;
  live_telemetry: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDict> = {
  en: {
    system_title: "TrackPulse — Dynamic Coaching Train ETA",
    system_subtitle: "Uncertainty-aware hybrid forecasting and network delay propagation intelligence for Indian Railways",
    sih_badge: "SIH PROBLEM STATEMENT: SIH26028 • MINISTRY OF RAILWAYS",
    operations_hub: "Operations Hub",
    train_detail: "Train Detail",
    station_master: "Station Master Board",
    network_propagation: "Network Delay Propagation",
    what_if_simulator: "What-If Simulator",
    passenger_planner: "Passenger Journey Planner",
    pnr_sms: "PNR & Button-Phone SMS",
    active_delay: "Active Delay",
    predicted_eta: "Dynamic Predicted ETA (P50)",
    uncertainty_range: "Calibrated Range (P10–P90)",
    reliability: "Prediction Reliability",
    delay_risk: "Delay Risk Probability",
    evidence_reasoning: "Structured Evidence Reasoning",
    high_risk: "HIGH RISK",
    medium_risk: "MEDIUM RISK",
    low_risk: "LOW RISK",
    incoming_trains: "Incoming Coaching Trains",
    outgoing_trains: "Coupled Outgoing Departures",
    turnaround_shortfall: "Turnaround Shortfall",
    recalculate: "Recalculate Dynamic Forecast",
    search_placeholder: "Search by train number (e.g. 12952, 12622) or station...",
    live_telemetry: "Live Telemetry Feed"
  },
  hi: {
    system_title: "ट्रैकपल्स — गतिशील कोचिंग ट्रेन आगमन पूर्वानुमान",
    system_subtitle: "भारतीय रेल के लिए अनिश्चितता-जागरूक हाइब्रिड पूर्वानुमान और नेटवर्क विलंब प्रसार प्रणाली",
    sih_badge: "एसआईएच समस्या कथन: SIH26028 • रेल मंत्रालय",
    operations_hub: "परिचालन नियंत्रण केंद्र",
    train_detail: "ट्रेन विवरण",
    station_master: "स्टेशन मास्टर बोर्ड",
    network_propagation: "नेटवर्क विलंब प्रसार",
    what_if_simulator: "संभावित विलंब सिम्युलेटर",
    passenger_planner: "यात्री यात्रा योजनाकार",
    pnr_sms: "पीएनआर एवं फीचर फोन एसएमएस",
    active_delay: "वर्तमान विलंब",
    predicted_eta: "गतिशील अनुमानित आगमन (P50)",
    uncertainty_range: "अंशांकित सीमा (P10–P90)",
    reliability: "पूर्वानुमान विश्वसनीयता",
    delay_risk: "विलंब जोखिम प्रायिकता",
    evidence_reasoning: "प्रमाण-आधारित विश्लेषण",
    high_risk: "उच्च जोखिम",
    medium_risk: "मध्यम जोखिम",
    low_risk: "कम जोखिम",
    incoming_trains: "आगमन कोचिंग ट्रेनें",
    outgoing_trains: "जुड़ी हुई प्रस्थान ट्रेनें",
    turnaround_shortfall: "टर्नअराउंड समय कमी",
    recalculate: "पुनर्गणना करें",
    search_placeholder: "ट्रेन संख्या (उदा. 12952, 12622) या स्टेशन खोजें...",
    live_telemetry: "लाइव टेलीमेट्री फीड"
  },
  ta: {
    system_title: "ட்ராக்பல்ஸ் — ரயில் வருகை நேர கணிப்பு தளம்",
    system_subtitle: "இந்திய ரயில்வேக்கான மாறும் நேர கணிப்பு மற்றும் தாமத பரவல் பகுப்பாய்வு",
    sih_badge: "SIH26028 • ரயில்வே அமைச்சகம்",
    operations_hub: "செயல்பாட்டு மையம்",
    train_detail: "ரயில் விவரம்",
    station_master: "நிலைய பலகை",
    network_propagation: "தாமத பரவல்",
    what_if_simulator: "உருவகப்படுத்துதல்",
    passenger_planner: "பயணத் திட்டம்",
    pnr_sms: "PNR & குறுஞ்செய்தி சேவை",
    active_delay: "தற்போதைய தாமதம்",
    predicted_eta: "கணிக்கப்பட்ட வருகை நேரம் (P50)",
    uncertainty_range: "வரம்பு (P10–P90)",
    reliability: "நம்பகத்தன்மை",
    delay_risk: "தாமத ஆபத்து",
    evidence_reasoning: "காரண பகுப்பாய்வு",
    high_risk: "அதிக ஆபத்து",
    medium_risk: "நடுத்தர ஆபத்து",
    low_risk: "குறைந்த ஆபத்து",
    incoming_trains: "வரும் ரயில்கள்",
    outgoing_trains: "புறப்படும் ரயில்கள்",
    turnaround_shortfall: "நேர பற்றாக்குறை",
    recalculate: "மீண்டும் கணக்கிடு",
    search_placeholder: "ரயில் எண் அல்லது நிலையத்தை தேடுங்கள்...",
    live_telemetry: "நேரலை கண்காணிப்பு"
  },
  te: {
    system_title: "ట్రాక్‌పల్స్ — రైలు రాక సమయ అంచనా వ్యవస్థ",
    system_subtitle: "భారతీయ రైల్వేల కోసం డైనమిక్ రాక సమయం మరియు జాప్యం విస్తరణ విశ్లేషణ",
    sih_badge: "SIH26028 • రైల్వే మంత్రిత్వ శాఖ",
    operations_hub: "ఆపరేషన్స్ హబ్",
    train_detail: "రైలు వివరాలు",
    station_master: "స్టేషన్ మాస్టర్ బోర్డు",
    network_propagation: "నెట్‌వర్క్ జాప్యం విస్తరణ",
    what_if_simulator: "జాప్య సిమ్యులేటర్",
    passenger_planner: "ప్రయాణీకుల ప్రణాళిక",
    pnr_sms: "PNR & SMS సేవ",
    active_delay: "ప్రస్తుత జాప్యం",
    predicted_eta: "అంచనా వేసిన రాక సమయం (P50)",
    uncertainty_range: "పరిధి (P10–P90)",
    reliability: "విశ్వసనీయత",
    delay_risk: "జాప్యం ప్రమాదం",
    evidence_reasoning: "ఆధారిత విశ్లేషణ",
    high_risk: "అధిక ప్రమాదం",
    medium_risk: "మధ్యస్థ ప్రమాదం",
    low_risk: "తక్కువ ప్రమాదం",
    incoming_trains: "వచ్చే రైళ్లు",
    outgoing_trains: "బయలుదేరే రైళ్లు",
    turnaround_shortfall: "సమయ కొరత",
    recalculate: "తిరిగి లెక్కించండి",
    search_placeholder: "రైలు నంబర్ లేదా స్టేషన్‌ను శోధించండి...",
    live_telemetry: "లైవ్ టెలిమెట్రీ"
  },
  mr: {
    system_title: "ट्रॅकप्लस — डायनॅमिक रेल्वे आगमन अंदाज",
    system_subtitle: "भारतीय रेल्वेसाठी अनिश्चितता-जागरूक अंदाज आणि नेटवर्क विलंब प्रसार प्रणाली",
    sih_badge: "SIH26028 • रेल्वे मंत्रालय",
    operations_hub: "ऑपरेशन्स हब",
    train_detail: "ट्रेन तपशील",
    station_master: "स्टेशन मास्टर बोर्ड",
    network_propagation: "नेटवर्क विलंब प्रसार",
    what_if_simulator: "विलंब सिम्युलेटर",
    passenger_planner: "प्रवासी प्रवास नियोजक",
    pnr_sms: "पीएनआर आणि एसएमएस",
    active_delay: "सध्याचा विलंब",
    predicted_eta: "अंदाजित वेळ (P50)",
    uncertainty_range: "अंदाज श्रेणी (P10–P90)",
    reliability: "विश्वासार्हता",
    delay_risk: "विलंब जोखीम",
    evidence_reasoning: "पुरावा-आधारित कारणे",
    high_risk: "उच्च जोखीम",
    medium_risk: "मध्यम जोखीम",
    low_risk: "कमी जोखीम",
    incoming_trains: "येणाऱ्या गाड्या",
    outgoing_trains: "सुटणाऱ्या गाड्या",
    turnaround_shortfall: "वेळेची कमतरता",
    recalculate: "पुन्हा गणना करा",
    search_placeholder: "ट्रेन क्रमांक किंवा स्टेशन शोधा...",
    live_telemetry: "थेट टेलिमेट्री"
  },
  bn: {
    system_title: "ট্র্যাকপালস — গতিশীল ট্রেন পৌঁছানোর সময় পূর্বাভাস",
    system_subtitle: "ভারতীয় রেলের জন্য গতিশীল পূর্বাভাস এবং বিলম্ব বিস্তার বিশ্লেষণ ব্যবস্থা",
    sih_badge: "SIH26028 • রেল মন্ত্রণালয়",
    operations_hub: "অপারেশনস হাব",
    train_detail: "ট্রেনের বিবরণ",
    station_master: "স্টেশন মাস্টার বোর্ড",
    network_propagation: "বিলম্ব বিস্তার বিশ্লেষণ",
    what_if_simulator: "বিলম্ব সিমুলেটর",
    passenger_planner: "যাত্রী ভ্রমণ পরিকল্পনাকারী",
    pnr_sms: "পিএনআর ও এসএমএস সেবা",
    active_delay: "বর্তমান বিলম্ব",
    predicted_eta: "পূর্বাভাসকৃত সময় (P50)",
    uncertainty_range: "পরিসীমা (P10–P90)",
    reliability: "নির্ভরযোগ্যতা",
    delay_risk: "বিলম্ব ঝুঁকি",
    evidence_reasoning: "প্রমাণ-ভিত্তিক যুক্তি",
    high_risk: "উচ্চ ঝুঁকি",
    medium_risk: "মাঝারি ঝুঁকি",
    low_risk: "কম ঝুঁকি",
    incoming_trains: "আগমনী ট্রেনসমূহ",
    outgoing_trains: "বহির্গামী ট্রেনসমূহ",
    turnaround_shortfall: "টার্নঅ্যারাউন্ড ঘাটতি",
    recalculate: "পুনরায় হিসাব করুন",
    search_placeholder: "ট্রেন নম্বর বা স্টেশন খুঁজুন...",
    live_telemetry: "লাইভ টেলিমেট্রি"
  }
};
