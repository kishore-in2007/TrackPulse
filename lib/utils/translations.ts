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
  ai_model: string;
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
  find_trains: string;
  pnr_status: string;
  live_station: string;
  search_trains_btn: string;
  get_dynamic_eta: string;
  get_pnr_status: string;
  open_station_board: string;
  from_station: string;
  to_station: string;
  journey_date: string;
  live_train_running_eta: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDict> = {
  en: {
    system_title: "TrackPulse — Dynamic Coaching Train ETA",
    system_subtitle: "Uncertainty-aware hybrid forecasting and network delay propagation intelligence for Indian Railways",
    sih_badge: "SIH PROBLEM STATEMENT: SIH26028 • MINISTRY OF RAILWAYS",
    operations_hub: "Dashboard",
    train_detail: "Train ETA",
    station_master: "Station Board",
    network_propagation: "Network Map",
    what_if_simulator: "What-If Simulation",
    passenger_planner: "Passenger Planner",
    pnr_sms: "PNR & SMS",
    ai_model: "AI Model",
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
    recalculate: "Recalculate Forecast",
    search_placeholder: "Search train (e.g. 12952, Kovai Express)...",
    live_telemetry: "Live Telemetry Feed",
    find_trains: "FIND TRAINS BETWEEN STATIONS",
    pnr_status: "PNR JOURNEY FORECAST",
    live_station: "LIVE STATION BOARD",
    search_trains_btn: "SEARCH TRAINS",
    get_dynamic_eta: "GET DYNAMIC ETA",
    get_pnr_status: "GET PNR STATUS",
    open_station_board: "OPEN STATION BOARD",
    from_station: "From Station",
    to_station: "To Station",
    journey_date: "Date of Journey",
    live_train_running_eta: "LIVE TRAIN RUNNING ETA"
  },
  hi: {
    system_title: "ट्रैकपल्स — गतिशील कोचिंग ट्रेन आगमन पूर्वानुमान",
    system_subtitle: "भारतीय रेल के लिए अनिश्चितता-जागरूक हाइब्रिड पूर्वानुमान और नेटवर्क विलंब प्रसार प्रणाली",
    sih_badge: "एसआईएच समस्या कथन: SIH26028 • रेल मंत्रालय",
    operations_hub: "डैशबोर्ड",
    train_detail: "ट्रेन ईटीए",
    station_master: "स्टेशन बोर्ड",
    network_propagation: "नेटवर्क मानचित्र",
    what_if_simulator: "संभावित सिमुलेशन",
    passenger_planner: "यात्री योजनाकार",
    pnr_sms: "पीएनआर एवं एसएमएस",
    ai_model: "एआई मॉडल",
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
    search_placeholder: "ट्रेन संख्या (उदा. 12952, 12622) खोजें...",
    live_telemetry: "लाइव टेलीमेट्री फीड",
    find_trains: "स्टेशनों के बीच ट्रेनें खोजें",
    pnr_status: "पीएनआर यात्रा पूर्वानुमान",
    live_station: "लाइव स्टेशन बोर्ड",
    search_trains_btn: "ट्रेनें खोजें",
    get_dynamic_eta: "गतिशील ईटीए प्राप्त करें",
    get_pnr_status: "पीएनआर स्थिति देखें",
    open_station_board: "स्टेशन बोर्ड खोलें",
    from_station: "प्रस्थान स्टेशन",
    to_station: "गंतव्य स्टेशन",
    journey_date: "यात्रा तिथि",
    live_train_running_eta: "लाइव ट्रेन रनिंग ईटीए"
  },
  ta: {
    system_title: "ட்ராக்பல்ஸ் — ரயில் வருகை நேர கணிப்பு தளம்",
    system_subtitle: "இந்திய ரயில்வேக்கான மாறும் நேர கணிப்பு மற்றும் தாமத பரவல் பகுப்பாய்வு",
    sih_badge: "SIH26028 • ரயில்வே அமைச்சகம்",
    operations_hub: "முதன்மை பலகை",
    train_detail: "ரயில் நேரம்",
    station_master: "நிலைய பலகை",
    network_propagation: "வலைப்பின்னல் வரைபடம்",
    what_if_simulator: "உருவகப்படுத்துதல்",
    passenger_planner: "பயணத் திட்டம்",
    pnr_sms: "PNR & SMS",
    ai_model: "AI மாதிரி",
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
    search_placeholder: "ரயில் எண் (उदा. 12675, Kovai) தேடுங்கள்...",
    live_telemetry: "நேரலை கண்காணிப்பு",
    find_trains: "நிலையங்களுக்கு இடையே ரயில்கள்",
    pnr_status: "PNR பயண கணிப்பு",
    live_station: "நேரலை நிலைய பலகை",
    search_trains_btn: "ரயில்களை தேடுங்கள்",
    get_dynamic_eta: "வருகை நேரம் பெறுக",
    get_pnr_status: "PNR நிலை காண்க",
    open_station_board: "நிலைய பலகை திறக்கவும்",
    from_station: "புறப்படும் நிலையம்",
    to_station: "சேரும் நிலையம்",
    journey_date: "பயண தேதி",
    live_train_running_eta: "நேரலை ரயில் இயங்கும் நேரம்"
  },
  te: {
    system_title: "ట్రాక్‌పల్స్ — రైలు రాక సమయ అంచనా వ్యవస్థ",
    system_subtitle: "భారతీయ రైల్వేల కోసం డైనమిక్ రాక సమయం మరియు జాప్యం విస్తరణ విశ్లేషణ",
    sih_badge: "SIH26028 • రైల్వే మంత్రిత్వ శాఖ",
    operations_hub: "డ్యాష్‌బోర్డ్",
    train_detail: "రైలు సమయం",
    station_master: "స్టేషన్ బోర్డు",
    network_propagation: "నెట్‌వర్క్ మ్యాప్",
    what_if_simulator: "సిమ్యులేషన్",
    passenger_planner: "ప్రయాణ ప్రణాళిక",
    pnr_sms: "PNR & SMS",
    ai_model: "AI మోడల్",
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
    live_telemetry: "లైవ్ టెలిమెట్రీ",
    find_trains: "స్టేషన్ల మధ్య రైళ్లు కనుగొనండి",
    pnr_status: "PNR ప్రయాణ అంచనా",
    live_station: "లైవ్ స్టేషన్ బోర్డు",
    search_trains_btn: "రైళ్లను శోధించండి",
    get_dynamic_eta: "డైనమిక్ ETA పొందండి",
    get_pnr_status: "PNR స్థితి చూడండి",
    open_station_board: "స్టేషన్ బోర్డు తెరవండి",
    from_station: "ప్రారంభ స్టేషన్",
    to_station: "గమ్యస్థాన స్టేషన్",
    journey_date: "ప్రయాణ తేదీ",
    live_train_running_eta: "లైవ్ రైలు రన్నింగ్ సమయం"
  },
  mr: {
    system_title: "ट्रॅकप्लस — डायनॅमिक रेल्वे आगमन अंदाज",
    system_subtitle: "भारतीय रेल्वेसाठी अनिश्चितता-जागरूक अंदाज आणि नेटवर्क विलंब प्रसार प्रणाली",
    sih_badge: "SIH26028 • रेल्वे मंत्रालय",
    operations_hub: "डॅशबोर्ड",
    train_detail: "ट्रेन वेळ",
    station_master: "स्टेशन बोर्ड",
    network_propagation: "नेटवर्क नकाशा",
    what_if_simulator: "सिम्युलेशन",
    passenger_planner: "प्रवासी नियोजक",
    pnr_sms: "पीएनआर आणि एसएमएस",
    ai_model: "एआय मॉडेल",
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
    live_telemetry: "थेट टेलिमेट्री",
    find_trains: "स्थानकांदरम्यान गाड्या शोधा",
    pnr_status: "पीएनआर प्रवास अंदाज",
    live_station: "थेट स्टेशन बोर्ड",
    search_trains_btn: "गाड्या शोधा",
    get_dynamic_eta: "डायनॅमिक ETA मिळवा",
    get_pnr_status: "पीएनआर स्थिती पहा",
    open_station_board: "स्टेशन बोर्ड उघडा",
    from_station: "प्रारंभिक स्थानक",
    to_station: "गंतव्य स्थानक",
    journey_date: "प्रवासाची तारीख",
    live_train_running_eta: "थेट ट्रेन धावण्याची वेळ"
  },
  bn: {
    system_title: "ট্র্যাকপালস — গতিশীল ট্রেন পৌঁছানোর সময় পূর্বাভাস",
    system_subtitle: "ভারতীয় রেলের জন্য গতিশীল পূর্বাভাস এবং বিলম্ব বিস্তার বিশ্লেষণ ব্যবস্থা",
    sih_badge: "SIH26028 • রেল মন্ত্রণালয়",
    operations_hub: "ড্যাশবোর্ড",
    train_detail: "ট্রেন সময়",
    station_master: "স্টেশন বোর্ড",
    network_propagation: "নেটওয়ার্ক ম্যাপ",
    what_if_simulator: "সিমুলেশন",
    passenger_planner: "ভ্রমণ পরিকল্পনাকারী",
    pnr_sms: "পিএনআর ও এসএমএস",
    ai_model: "এআই মডেল",
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
    live_telemetry: "লাইভ টেলিমেট্রি",
    find_trains: "স্টেশনসমূহের মাঝে ট্রেন খুঁজুন",
    pnr_status: "পিএনআর যাত্রা পূর্বাভাস",
    live_station: "লাইভ স্টেশন বোর্ড",
    search_trains_btn: "ট্রেন খুঁজুন",
    get_dynamic_eta: "ডায়নামিক ইটিএ পান",
    get_pnr_status: "পিএনআর স্ট্যাটাস দেখুন",
    open_station_board: "স্টেশন বোর্ড খুলুন",
    from_station: "যাত্রা শুরুর স্টেশন",
    to_station: "গন্তব্য স্টেশন",
    journey_date: "ভ্রমণের তারিখ",
    live_train_running_eta: "লাইভ ট্রেন রানিং সময়"
  }
};
