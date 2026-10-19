import { SupportedLanguage } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  selectLanguage: string;
  selectDistrict: string;
  selectLocality: string;
  allDivisions: string;
  kashmirDivision: string;
  jammuDivision: string;
  home: string;
  liveMap: string;
  alerts: string;
  emergencySafety: string;
  authority: string;
  aiAssistant: string;
  demoMode: string;
  demoNotice: string;
  resetDemo: string;
  simulatedScenario: string;
  liveData: string;
  staleData: string;
  lastUpdated: string;
  overallStatus: string;
  officialWarning: string;
  elevation: string;
  rivers: string[];
  floodRisk: string;
  landslideRisk: string;
  glofRisk: string;
  extremeWeatherRisk: string;
  riskLevels: {
    low: string;
    moderate: string;
    high: string;
    veryHigh: string;
  };
  actions: {
    viewDetails: string;
    close: string;
    callEmergency: string;
    findShelter: string;
    shareLocation: string;
    askAssistant: string;
    downloadGuide: string;
    triggerTestAlert: string;
    saveLocation: string;
    cancel: string;
  };
  safetyNotice: string;
  sheltersTitle: string;
  contactsTitle: string;
  hourlyPrecipitation: string;
  factorsBehindRisk: string;
  recommendedPrecautions: string;
  exposedLocalities: string;
  officialAdvisoryActive: string;
  sosTitle: string;
  sosSubtitle: string;
  sosEmergencyCall: string;
  sosDisclaimer: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'AquaSense',
    tagline: 'Predict Early. Stay Safe.',
    selectLanguage: 'Select Language',
    selectDistrict: 'Select District',
    selectLocality: 'Select Tehsil / Locality',
    allDivisions: 'All J&K (20 Districts)',
    kashmirDivision: 'Kashmir Division',
    jammuDivision: 'Jammu Division',
    home: 'Home',
    liveMap: 'Live Risk Map',
    alerts: 'Alerts',
    emergencySafety: 'Emergency & Safety',
    authority: 'Authority Console',
    aiAssistant: 'AquaSense AI',
    demoMode: 'Demo Simulation Mode',
    demoNotice: 'DEMO DATA ACTIVE: Simulated hazard scenario for demonstration. Not official government warning.',
    resetDemo: 'Reset to Live Feeds',
    simulatedScenario: 'Active Simulation Scenario',
    liveData: 'Live Environmental Feeds',
    staleData: 'Cached Data (Network Degraded)',
    lastUpdated: 'Last Updated',
    overallStatus: 'Overall District Multi-Hazard Status',
    officialWarning: 'Official IMD / JKSDMA Bulletin',
    elevation: 'Elevation MSL',
    rivers: ['Jhelum Basin', 'Chenab Basin', 'Tawi Basin'],
    floodRisk: 'Riverine & Flash Flood',
    landslideRisk: 'Rain-Triggered Landslides',
    glofRisk: 'Glacial Lake Outburst (GLOF)',
    extremeWeatherRisk: 'Extreme Weather & Gaze',
    riskLevels: {
      low: 'Low Risk',
      moderate: 'Moderate Risk',
      high: 'High Risk',
      veryHigh: 'Very High Risk'
    },
    actions: {
      viewDetails: 'Inspect Details',
      close: 'Close',
      callEmergency: 'Call Emergency 112',
      findShelter: 'Locate Shelters',
      shareLocation: 'Share Coordinates',
      askAssistant: 'Ask AquaSense AI',
      downloadGuide: 'Offline Safety PDF',
      triggerTestAlert: 'Trigger Test Alert',
      saveLocation: 'Save Location',
      cancel: 'Cancel'
    },
    safetyNotice: 'In acute distress, call 112 or local DEOC 1077 immediately. Always follow verified police and district magistrate instructions.',
    sheltersTitle: 'Verified Emergency Relief Shelters',
    contactsTitle: 'Official Disaster Helplines & Control Rooms',
    hourlyPrecipitation: '12-Hour Forecast & Rain Intensity',
    factorsBehindRisk: 'Explanatory Scientific Factors',
    recommendedPrecautions: 'Recommended Safety Precautions',
    exposedLocalities: 'Potentially Exposed Settlements',
    officialAdvisoryActive: 'Official Advisory Active in Area',
    sosTitle: 'Emergency SOS Assistance',
    sosSubtitle: 'Direct connection to J&K Unified Emergency Dispatch (112) and State Disaster Operation Centre.',
    sosEmergencyCall: 'One-Touch Emergency Dial (112)',
    sosDisclaimer: 'Emergency calls connect through your device telephony to national and state dispatchers.'
  },

  hi: {
    appName: 'एक्वासेंस (AquaSense)',
    tagline: 'समय रहते पहचानें। सुरक्षित रहें।',
    selectLanguage: 'भाषा चुनें',
    selectDistrict: 'जिला चुनें',
    selectLocality: 'तहसील / क्षेत्र चुनें',
    allDivisions: 'संपूर्ण जम्मू और कश्मीर (20 जिले)',
    kashmirDivision: 'कश्मीर संभाग',
    jammuDivision: 'जम्मू संभाग',
    home: 'होम',
    liveMap: 'लाइव आपदा मानचित्र',
    alerts: 'चेतावनी',
    emergencySafety: 'आपातकालीन व सुरक्षा',
    authority: 'प्राधिकरण कंसोल',
    aiAssistant: 'एक्वासेंस एआई',
    demoMode: 'डेमो सिमुलेशन मोड',
    demoNotice: 'डेमो डेटा सक्रिय: यह अभ्यास परिदृश्य है, आधिकारिक सरकारी चेतावनी नहीं।',
    resetDemo: 'लाइव डेटा पर वापस जाएं',
    simulatedScenario: 'सक्रिय सिमुलेशन परिदृश्य',
    liveData: 'लाइव मौसम डेटा',
    staleData: 'कैश्ड डेटा (नेटवर्क धीमा)',
    lastUpdated: 'अंतिम अपडेट',
    overallStatus: 'जिले की समग्र बहु-आपदा स्थिति',
    officialWarning: 'आधिकारिक आईएमडी / जेकेएसडीएमए बुलेटिन',
    elevation: 'औसत समुद्र तल ऊंचाई',
    rivers: ['झेलम बेसिन', 'चिनाब बेसिन', 'तवी बेसिन'],
    floodRisk: 'नदी व अचानक बाढ़ जोखिम',
    landslideRisk: 'वर्षा-प्रेरित भूस्खलन',
    glofRisk: 'ग्लेशियल झील विस्फोट (जीएलओएफ)',
    extremeWeatherRisk: 'चरम मौसम व भारी बर्फबारी',
    riskLevels: {
      low: 'कम जोखिम',
      moderate: 'मध्यम जोखिम',
      high: 'उच्च जोखिम',
      veryHigh: 'अति उच्च जोखिम'
    },
    actions: {
      viewDetails: 'विवरण देखें',
      close: 'बंद करें',
      callEmergency: 'आपातकालीन कॉल 112',
      findShelter: 'राहत शिविर खोजें',
      shareLocation: 'स्थान साझा करें',
      askAssistant: 'एआई से पूछें',
      downloadGuide: 'सुरक्षा निर्देशिका',
      triggerTestAlert: 'परीक्षण अलर्ट भेजें',
      saveLocation: 'स्थान सहेजें',
      cancel: 'रद्द करें'
    },
    safetyNotice: 'आपातकाल में तुरंत 112 या जिला नियंत्रण कक्ष 1077 पर संपर्क करें। केवल आधिकारिक प्रशासनिक निर्देशों का पालन करें।',
    sheltersTitle: 'सत्यापित आपातकालीन राहत केंद्र',
    contactsTitle: 'आधिकारिक आपदा हेल्पलाइन व नियंत्रण कक्ष',
    hourlyPrecipitation: '12 घंटे का पूर्वानुमान व वर्षा तीव्रता',
    factorsBehindRisk: 'जोखिम के प्रमुख वैज्ञानिक कारण',
    recommendedPrecautions: 'अनुशंसित सुरक्षा सावधानियां',
    exposedLocalities: 'संभावित संवेदनशील इलाके',
    officialAdvisoryActive: 'क्षेत्र में आधिकारिक चेतावनी सक्रिय',
    sosTitle: 'आपातकालीन एसओएस सहायता',
    sosSubtitle: 'जम्मू-कश्मीर आपातकालीन सेवा (112) और आपदा नियंत्रण कक्ष से सीधा संपर्क।',
    sosEmergencyCall: 'आपातकालीन डायल (112)',
    sosDisclaimer: 'आपातकालीन कॉल सीधे आपके फोन से राष्ट्रीय आपात सेवा 112 से जुड़ती है।'
  },

  ur: {
    appName: 'ایکواسینس (AquaSense)',
    tagline: 'بروقت پیش گوئی، محفوظ زندگی۔',
    selectLanguage: 'زبان منتخب کریں',
    selectDistrict: 'ضلع منتخب کریں',
    selectLocality: 'تحصیل / بستی منتخب کریں',
    allDivisions: 'تمام جموں و کشمیر (20 اضلاع)',
    kashmirDivision: 'کشمیر ڈویژن',
    jammuDivision: 'جموں ڈویژن',
    home: 'صفحۂ اول',
    liveMap: 'لائیو خطرات کا نقشہ',
    alerts: 'انتباہات',
    emergencySafety: 'ایمرجنسی و حفاظت',
    authority: 'مجاز حکام ڈیش بورڈ',
    aiAssistant: 'ایکواسینس اسسٹنٹ',
    demoMode: 'ڈیمو مشق موڈ',
    demoNotice: 'ڈیمو ڈیٹا فعال: یہ صرف مظاہرے کی خاطر فرضی منظرنامہ ہے، سرکاری انتباہ نہیں۔',
    resetDemo: 'لائیو ڈیٹا پر واپس آئیں',
    simulatedScenario: 'فعال نقلی منظرنامہ',
    liveData: 'لائیو ماحولیاتی فیڈ',
    staleData: 'محفوظ شدہ ڈیٹا (کمزور انٹرنیٹ)',
    lastUpdated: 'آخری تجدید',
    overallStatus: 'ضلع کی مجموعی قدرتی خطرات کی صورتحال',
    officialWarning: 'محکمۂ موسمیات و ڈیزاسٹر اتھارٹی کا سرکاری بلیٹن',
    elevation: 'سطح سمندر سے اونچائی',
    rivers: ['دریائے جہلم', 'دریائے چناب', 'دریائے تاوی'],
    floodRisk: 'سیلاب اور طغیانی کا خطرہ',
    landslideRisk: 'بارش سے پیدا ہونے والی پسپائی و تودے گرنا',
    glofRisk: 'گلیشیر جھیل کے پھٹنے کا خطرہ (GLOF)',
    extremeWeatherRisk: 'شدید موسم اور برفانی طوفان',
    riskLevels: {
      low: 'کم خطرہ',
      moderate: 'معتدل خطرہ',
      high: 'زیادہ خطرہ',
      veryHigh: 'انتہائی شدید خطرہ'
    },
    actions: {
      viewDetails: 'تفصیلات دیکھیں',
      close: 'بند کریں',
      callEmergency: 'ایمرجنسی کال 112',
      findShelter: 'پناہ گاہیں تلاش کریں',
      shareLocation: 'مقام شیئر کریں',
      askAssistant: 'اسسٹنٹ سے پوچھیں',
      downloadGuide: 'حفاظتی رہنما اصول',
      triggerTestAlert: 'ٹیسٹ الرٹ جاری کریں',
      saveLocation: 'مقام محفوظ کریں',
      cancel: 'منسوخ کریں'
    },
    safetyNotice: 'کسی بھی ایمرجنسی میں فوری طور پر 112 یا ڈسٹرکٹ کنٹرول روم 1077 پر رابطہ کریں۔ صرف مجاز حکام کی ہدایات پر عمل کریں۔',
    sheltersTitle: 'تصدیق شدہ ایمرجنسی ریلیف شیلٹرز',
    contactsTitle: 'سرکاری ڈیزاسٹر ہیلپ لائنز و کنٹرول رومز',
    hourlyPrecipitation: 'اگلے 12 گھنٹوں میں بارش اور درجہ حرارت کی رفتار',
    factorsBehindRisk: 'خطرہ بڑھنے کی سائنسی وجوہات',
    recommendedPrecautions: 'تجویز کردہ حفاظتی تدابیر',
    exposedLocalities: 'ممکنہ طور پر متاثر ہونے والے علاقے',
    officialAdvisoryActive: 'علاقے میں سرکاری ایڈوائزری لاگو ہے',
    sosTitle: 'ہنگامی مدد (SOS)',
    sosSubtitle: 'جموں و کشمیر ایمرجنسی ڈسپیچ 112 اور ڈیزاسٹر روم سے فوری رابطہ۔',
    sosEmergencyCall: 'ایمرجنسی کال (112)',
    sosDisclaimer: 'ایمرجنسی کال آپ کے فون کے ذریعے براہ راست 112 سے منسلک ہوتی ہے۔'
  },

  ks: {
    appName: 'ایکواسینس (AquaSense)',
    tagline: 'بروقت خبرداری، حِفاظت تہ سلامتی۔',
    selectLanguage: 'زبان ژارِو',
    selectDistrict: 'ضِلہٕ ژارِو',
    selectLocality: 'تحصیل یا علاقہٕ ژارِو',
    allDivisions: 'سۄروے جموں و کشمیر (20 ضِلہٕ)',
    kashmirDivision: 'کشمیر ڈویژن',
    jammuDivision: 'جموں ڈویژن',
    home: 'گھرٕ (ہوم)',
    liveMap: 'لائیو نقژھہٕ',
    alerts: 'وارننگ تہ الرٹ',
    emergencySafety: 'ایمرجنسی تہ بچاو',
    authority: 'افسرانن ہند ڈیش بورڈ',
    aiAssistant: 'ایکواسینس اے آئی',
    demoMode: 'ڈیمو موڈ',
    demoNotice: 'ڈیمو ڈیٹا چالو: یہٕ چھُ مشقی منظرنامہ، اصل سرکاری وارننگ نہٕ۔',
    resetDemo: 'اصل فیڈس پیٹھ واپس گژھِو',
    simulatedScenario: 'مشقی منظرنامہ',
    liveData: 'لائیو موسمی ڈیٹا',
    staleData: 'پرون ڈیٹا',
    lastUpdated: 'پتھِم اپڈیٹ',
    overallStatus: 'ضلعچ کُل آفات صورتحال',
    officialWarning: 'سرکاری موسمیاتی بلیٹن',
    elevation: 'اوسط تھاو',
    rivers: ['وؠتھ (جہلم)', 'چناب', 'تاوی'],
    floodRisk: 'سیلاب تہ کَڈل خطرہٕ',
    landslideRisk: 'پسہٕ وسن تہ کھڈے گرن',
    glofRisk: 'گلیشیر سر پھُٹن ہُنٛد خطرہٕ',
    extremeWeatherRisk: 'طوفانی بارش تہ شدید شِین',
    riskLevels: {
      low: 'کم خطرہٕ',
      moderate: 'درمیانہٕ خطرہٕ',
      high: 'زیادہ خطرہٕ',
      veryHigh: 'واریاہ خطرناک'
    },
    actions: {
      viewDetails: 'تفصیل وُچھِو',
      close: 'بند کٔرِو',
      callEmergency: '112 پیٹھ فون کٔرِو',
      findShelter: 'محفوظ جایہٕ ژھانڈِو',
      shareLocation: 'جائے شیئر کٔرِو',
      askAssistant: 'اے آئی سٟتؠ کتھ کٔرِو',
      downloadGuide: 'حفاظتی کتابچہٕ',
      triggerTestAlert: 'ٹیسٹ وارننگ کٔرِو',
      saveLocation: 'جائے رکھیو',
      cancel: 'رد کٔرِو'
    },
    safetyNotice: 'مصیبتس منٛز دِیو فوراً 112 یا 1077 پیٹھ فون۔ ریڈیو تہ پولیس کنٹرول رومن ہندین حکمن پیٹھ عمل کٔرِو۔',
    sheltersTitle: 'سرکاری محفوظ شیلٹر',
    contactsTitle: 'ایمرجنسی فون نمبر',
    hourlyPrecipitation: 'اگلیین 12 گھنٹن منٛز رُد تہ شِین',
    factorsBehindRisk: 'خطریچ وجوہات',
    recommendedPrecautions: 'احتیاطی تدابیر',
    exposedLocalities: 'خطرناک علاقے',
    officialAdvisoryActive: 'سرکاری ایڈوائزری چالو',
    sosTitle: 'ایمرجنسی ایس او ایس',
    sosSubtitle: '112 تہ ڈیزاسٹر مینجمنٹ سٟتؠ فوری رابطہٕ۔',
    sosEmergencyCall: '112 کال کٔرِو',
    sosDisclaimer: 'کال گژھہِ تۄہندِ فونہٕ پیٹھہٕ براہ راست 112 سینٹرس سٟتؠ رابطہٕ۔'
  },

  dg: {
    appName: 'एक्वासेंस (AquaSense)',
    tagline: 'पहलो सूचना, पूरी सुरक्षा।',
    selectLanguage: 'बोली चुनो',
    selectDistrict: 'जिला चुनो',
    selectLocality: 'तहसील / इलाका चुनो',
    allDivisions: 'सारा जम्मू-कश्मीर (20 जिले)',
    kashmirDivision: 'कश्मीर संभाग',
    jammuDivision: 'जम्मू संभाग',
    home: 'मुक्ख पन्ना',
    liveMap: 'लाइव आपदा नक्शा',
    alerts: 'चेतावनी',
    emergencySafety: 'आपातकाल ते सुरक्षा',
    authority: 'अफसर कंसोल',
    aiAssistant: 'एक्वासेंस एआई',
    demoMode: 'डेमो सिमुलेशन',
    demoNotice: 'डेमो डेटा: ऐ अभ्यास लेई ऐ, कोई असली सरकारी चेतावनी नेईं।',
    resetDemo: 'लाइव डेटा पर मुड़ो',
    simulatedScenario: 'चालू सिमुलेशन',
    liveData: 'लाइव मौसम डेटा',
    staleData: 'पुरानी जानकारी',
    lastUpdated: 'ताजा अपडेट',
    overallStatus: 'जिले दी कुल आपदा स्थिति',
    officialWarning: 'सरकारी आईएमडी बुलेटिन',
    elevation: 'औसत ऊंचाई',
    rivers: ['तवी नदी', 'चिनाब नदी', 'झेलम नदी'],
    floodRisk: 'हढ़ (बाढ़) दा खतरा',
    landslideRisk: 'पहाड़ ढहने (लैंडस्लाइड) दा खतरा',
    glofRisk: 'ग्लेशियर छपड़ी फटने दा खतरा',
    extremeWeatherRisk: 'तेज बरखा ते बर्फबारी',
    riskLevels: {
      low: 'घट्ट खतरा',
      moderate: 'मध्यम खतरा',
      high: 'ज्यादा खतरा',
      veryHigh: 'अति गंभीर खतरा'
    },
    actions: {
      viewDetails: 'विस्तार देखो',
      close: 'बंद करो',
      callEmergency: '112 फोन करो',
      findShelter: 'राहत शिविर लभो',
      shareLocation: 'लोकेशन भेजो',
      askAssistant: 'एआई कन्ने पुच्छो',
      downloadGuide: 'सुरक्षा निर्देशिका',
      triggerTestAlert: 'टेस्ट अलर्ट चलाओ',
      saveLocation: 'स्थान सुरक्षित करो',
      cancel: 'रद्द करो'
    },
    safetyNotice: 'मुसीबत च तुरंत 112 जां 1077 पर फोन करो। सिर्फ प्रशासन दी सलाह मन्नो।',
    sheltersTitle: 'सत्यापित राहत केंद्र',
    contactsTitle: 'सरकारी हेल्पलाइन नंबर',
    hourlyPrecipitation: 'अगलै 12 घेंटें च बरखा दी स्थिति',
    factorsBehindRisk: 'खतरे दे कारण',
    recommendedPrecautions: 'बचाव दे उपाय',
    exposedLocalities: 'संवेदनशील इलाके',
    officialAdvisoryActive: 'इलाके च चेतावनी लागू',
    sosTitle: 'आपातकालीन एसओएस',
    sosSubtitle: '112 सेवा ते आपदा प्रबंधन कन्ने सीधा संपर्क।',
    sosEmergencyCall: '112 डायल करो',
    sosDisclaimer: 'आपातकालीन काल तुंदे फोन थानी सिधी 112 कंट्रोल रूम च लगेगी।'
  }
};
