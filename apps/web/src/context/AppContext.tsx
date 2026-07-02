import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'bn' | 'ur';
type Theme = 'light' | 'dark';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  membership: {
    plan: string;
    status: string;
    startDate?: string;
    endDate?: string;
  };
}

interface AppContextType {
  language: Language;
  theme: Theme;
  user: User | null;
  token: string | null;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  loginUser: (user: User, token: string) => void;
  logoutUser: () => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    brandName: 'fitnessArena',
    tagline: 'UNLEASH THE BEAST',
    heroTitle: 'UNLEASH YOUR',
    heroAccent: 'INNER BEAST',
    heroDesc: 'Elevate your power, sculpt your physique, and shatter your personal limits in our high-intensity, premium sports facility.',
    joinBtn: 'JOIN THE ARENA',
    exploreBtn: 'EXPLORE CLASSES',
    classesTitle: 'BEAST LEVEL CLASSES',
    classesSubtitle: 'Explore our high-intensity, expert-led training groups designed to forge champions.',
    trainer: 'Trainer',
    duration: 'Duration',
    intensity: 'Intensity',
    schedule: 'Schedule',
    bookBtn: 'BOOK CLASS',
    fullyBooked: 'FULLY BOOKED',
    bookingSuccess: 'Class booked successfully!',
    simulatorTitle: 'INTERACTIVE BEAST BARBELL',
    simulatorDesc: 'Load plates onto the barbell to see it bend under extreme weights. Test your theoretical limits!',
    loadPlate: 'Load 20kg Plate',
    clearPlates: 'Unload Barbell',
    barbellWeight: 'Total Weight',
    plansTitle: 'ARENA MEMBERSHIP PLANS',
    plansSubtitle: 'Choose your tier and commit to the grind. No contracts, cancel anytime.',
    starterPlan: 'Beast Starter',
    lifterPlan: 'Power Lifter',
    proPlan: 'Olympian Pro',
    buyPlan: 'BUY MEMBERSHIP',
    activeMembership: 'ACTIVE MEMBERSHIP',
    athleteZone: 'ATHLETE PROFILE ZONE',
    welcomeBack: 'Welcome back, Athlete',
    notLoggedIn: 'ATHLETE ACCESS SYSTEM',
    emailPlaceholder: 'Email Address',
    passwordPlaceholder: 'Password',
    namePlaceholder: 'Full Name',
    loginBtn: 'ENTER ARENA',
    signupBtn: 'REGISTER ATHLETE',
    toggleToSignup: 'Need athlete registration? Sign Up',
    toggleToLogin: 'Already registered? Log In',
    logoutBtn: 'EXIT SYSTEM',
    loading: 'LOADING ATHLETE DATA...',
    footerRights: 'All Rights Reserved. Engineered for maximum power.',
    gymLocation: 'Barharwa Hatpara, Sahibganj, Jharkhand, India',
    locationTitle: 'THE COMPOUND: SAHIBGANJ POWERHOUSE',
    locationDesc: 'Located at Hatpara, Barharwa, District: Sahibganj, Jharkhand, India (PIN: 816101). fitnessArena is the region\'s benchmark raw hypertrophy and power temple. Built with heavy-duty cast iron and biomechanically engineered tools.',
  },
  hi: {
    brandName: 'फिटनेस एरीना',
    tagline: 'बीस्ट को जगाएं',
    heroTitle: 'अपने अंदर के',
    heroAccent: 'बीस्ट को जगाएं',
    heroDesc: 'हमारी उच्च-तीव्रता वाली, प्रीमियम खेल सुविधा में अपनी शक्ति बढ़ाएं, अपने शरीर को आकार दें और अपनी व्यक्तिगत सीमाओं को तोड़ें।',
    joinBtn: 'एरीना में शामिल हों',
    exploreBtn: 'क्लासेस देखें',
    classesTitle: 'बीस्ट लेवल क्लासेस',
    classesSubtitle: 'चैंपियन बनाने के लिए डिज़ाइन किए गए हमारे उच्च-तीव्रता वाले, विशेषज्ञ-नेतृत्व वाले ट्रेनिंग ग्रुप्स का पता लगाएं।',
    trainer: 'ट्रेनर',
    duration: 'अवधि',
    intensity: 'तीव्रता',
    schedule: 'अनुसूची',
    bookBtn: 'क्लास बुक करें',
    fullyBooked: 'हाउसफुल',
    bookingSuccess: 'क्लास सफलतापूर्वक बुक हो गई!',
    simulatorTitle: 'इंटरैक्टिव बीस्ट बारबेल',
    simulatorDesc: 'अत्यधिक वजन के तहत बारबेल को झुकते हुए देखने के लिए उस पर प्लेट्स लोड करें। अपनी सैद्धांतिक सीमाओं का परीक्षण करें!',
    loadPlate: '20 किलो प्लेट लोड करें',
    clearPlates: 'बारबेल खाली करें',
    barbellWeight: 'कुल वजन',
    plansTitle: 'एरीना सदस्यता योजनाएं',
    plansSubtitle: 'अपना स्तर चुनें और कड़ी मेहनत के लिए प्रतिबद्ध हों। कोई अनुबंध नहीं, कभी भी रद्द करें।',
    starterPlan: 'बीस्ट स्टार्टर',
    lifterPlan: 'पावर लिफ्टर',
    proPlan: 'ओलंपियन प्रो',
    buyPlan: 'सदस्यता खरीदें',
    activeMembership: 'सक्रिय सदस्यता',
    athleteZone: 'एथलीट प्रोफाइल ज़ोन',
    welcomeBack: 'स्वागत है, एथलीट',
    notLoggedIn: 'एथलीट एक्सेस सिस्टम',
    emailPlaceholder: 'ईमेल पता',
    passwordPlaceholder: 'पासवर्ड',
    namePlaceholder: 'पूरा नाम',
    loginBtn: 'एरीना में प्रवेश करें',
    signupBtn: 'एथलीट पंजीकरण',
    toggleToSignup: 'एथलीट पंजीकरण की आवश्यकता है? साइन अप करें',
    toggleToLogin: 'पहले से पंजीकृत हैं? लॉगिन करें',
    logoutBtn: 'सिस्टम से बाहर निकलें',
    loading: 'एथलीट डेटा लोड हो रहा है...',
    footerRights: 'सर्वाधिकार सुरक्षित। अधिकतम शक्ति के लिए निर्मित।',
    gymLocation: 'बरहरवा हाटपाड़ा, साहिबगंज, झारखंड, भारत',
    locationTitle: 'कंपाउंड: साहिबगंज पावरहाउस',
    locationDesc: 'हाटपाड़ा, बरहरवा, जिला: साहिबगंज, झारखंड, भारत (पिन: 816101) में स्थित। फिटनेस एरीना इस क्षेत्र का बेंचमार्क रॉ हाइपरट्रॉफी और पावर टेंपल है। भारी-भरकम ढलवां लोहे और बायोमेकैनिकल रूप से इंजीनियर उपकरणों से निर्मित।',
  },
  bn: {
    brandName: 'ফিটনেস এরিনা',
    tagline: 'বিস্টকে জাগ্রত করুন',
    heroTitle: 'আপনার ভেতরের',
    heroAccent: 'বিস্টকে জাগান',
    heroDesc: 'আমাদের উচ্চ-তীব্রতা সম্পন্ন, প্রিমিয়াম স্পোর্টস ফেসিলিটিতে আপনার শক্তি বৃদ্ধি করুন, শরীরকে সুন্দর আকৃতি দিন এবং নিজের সীমা অতিক্রম করুন।',
    joinBtn: 'এরিনায় যোগ দিন',
    exploreBtn: 'ক্লাসগুলো দেখুন',
    classesTitle: 'বিস্ট লেভেল ক্লাস সমূহ',
    classesSubtitle: 'চ্যাম্পিয়ন তৈরি করার জন্য ডিজাইন করা আমাদের উচ্চ-তীব্রতা সম্পন্ন এবং অভিজ্ঞ ট্রেইনারের ক্লাসগুলো দেখুন।',
    trainer: 'প্রশিক্ষক',
    duration: 'সময়কাল',
    intensity: 'তীব্রতা',
    schedule: 'সময়সূচী',
    bookBtn: 'ক্লাস বুক করুন',
    fullyBooked: 'বুকিং শেষ',
    bookingSuccess: 'ক্লাস বুকিং সফল হয়েছে!',
    simulatorTitle: 'ইন্টারেক্টিভ বিস্ট বারবেল',
    simulatorDesc: 'ভারী ওজনের নিচে বারবেলটি কীভাবে বাঁকে তা দেখতে প্লেট লোড করুন। আপনার ক্ষমতার পরীক্ষা নিন!',
    loadPlate: '২০ কেজি প্লেট লোড করুন',
    clearPlates: 'বারবেল খালি করুন',
    barbellWeight: 'মোট ওজন',
    plansTitle: 'এরিনা মেম্বারশিপ প্ল্যান',
    plansSubtitle: 'আপনার প্ল্যান বেছে নিন এবং কঠোর পরিশ্রমে নিজেকে নিযুক্ত করুন। যেকোনো সময় বাতিল করতে পারবেন।',
    starterPlan: 'বিস্ট স্টার্টার',
    lifterPlan: 'পাওয়ার লিফটার',
    proPlan: 'অলিম্পিয়ান প্রো',
    buyPlan: 'মেম্বারশিপ কিনুন',
    activeMembership: 'সক্রিয় মেম্বারশিপ',
    athleteZone: 'অ্যাথলেট প্রোফাইল জোন',
    welcomeBack: 'স্বাগতম, অ্যাথলেট',
    notLoggedIn: 'অ্যাথলেট অ্যাক্সেস সিস্টেম',
    emailPlaceholder: 'ইমেল ঠিকানা',
    passwordPlaceholder: 'পাসওয়ার্ড',
    namePlaceholder: 'সম্পূর্ণ নাম',
    loginBtn: 'এরিনায় প্রবেশ করুন',
    signupBtn: 'রেজিস্ট্রেশন করুন',
    toggleToSignup: 'অ্যাথলেট রেজিস্ট্রেশন প্রয়োজন? সাইন আপ করুন',
    toggleToLogin: 'ইতিমধ্যে রেজিস্টার্ড? লগ ইন করুন',
    logoutBtn: 'সিস্টেম থেকে প্রস্থান',
    loading: 'অ্যাথলেট ডেটা লোড হচ্ছে...',
    footerRights: 'সর্বস্বত্ব সংরক্ষিত। সর্বোচ্চ শক্তির জন্য নির্মিত।',
    gymLocation: 'বরহরওয়া হাটপাড়া, সাহেবগঞ্জ, ঝাড়খণ্ড, ভারত',
    locationTitle: 'কম্পাউন্ড: সাহেবগঞ্জ পাওয়ারহাউস',
    locationDesc: 'হাটপাড়া, বরহরওয়া, জেলা: সাহেবগঞ্জ, ঝাড়খণ্ড, ভারত (পিন: ৮১৬১০১) এ অবস্থিত। ফিটনেস এরিনা এই অঞ্চলের সেরা হাইপারট্রফি এবং পাওয়ার টেম্পল। ভারী কাস্ট আয়রন এবং বায়োমেকানিক্যালি উন্নত সরঞ্জাম দিয়ে তৈরি।',
  },
  ur: {
    brandName: 'فٹنس ایرینا',
    tagline: 'اپنے اندر کے درندے کو جگائیں',
    heroTitle: 'اپنے اندر کے',
    heroAccent: 'درندے کو آزاد کریں',
    heroDesc: 'ہماری اعلی شدت کی، پریمیم کھیلوں کی سہولت میں اپنی طاقت کو بلند کریں، اپنے جسم کو تراشیں اور اپنی ذاتی حدود کو پاش پاش کریں۔',
    joinBtn: 'ایرینا میں شامل ہوں',
    exploreBtn: 'کلاسز تلاش کریں',
    classesTitle: 'بیسٹ لیول کلاسز',
    classesSubtitle: 'چیمپئنز بنانے کے لیے تیار کردہ ہماری اعلی شدت والی، ماہرین کی زیر نگرانی تربیتی کلاسز دیکھیں۔',
    trainer: 'ٹرینر',
    duration: 'دورانیہ',
    intensity: 'شدت',
    schedule: 'شیڈول',
    bookBtn: 'کلاس بک کریں',
    fullyBooked: 'بکنگ ختم',
    bookingSuccess: 'کلاس کامیابی کے ساتھ بک ہو گئی!',
    simulatorTitle: 'انٹرایکٹو بیسٹ باربل',
    simulatorDesc: 'انتہائی وزن کے تحت باربل کو جھکتے ہوئے دیکھنے کے لیے اس پر پلیٹیں لوڈ کریں۔ اپنی نظریاتی حدود کی جانچ کریں!',
    loadPlate: '20 کلو پلیٹ لوڈ کریں',
    clearPlates: 'باربل خالی کریں',
    barbellWeight: 'کل وزن',
    plansTitle: 'ایرینا ممبرشپ پلانز',
    plansSubtitle: 'اپنا درجہ منتخب کریں اور محنت کے لیے پرعزم رہیں۔ کوئی معاہدہ نہیں، کسی بھی وقت منسوخ کریں۔',
    starterPlan: 'بیسٹ اسٹارٹر',
    lifterPlan: 'پاور لفٹر',
    proPlan: 'اولمپین پرو',
    buyPlan: 'ممبرشپ خریدیں',
    activeMembership: 'فعال ممبرشپ',
    athleteZone: 'ایتھلیٹ پروفائل زون',
    welcomeBack: 'خوش آمدید، ایتھلیٹ',
    notLoggedIn: 'ایتھلیٹ لاگ ان سسٹم',
    emailPlaceholder: 'ای میل کا پتہ',
    passwordPlaceholder: 'پاس ورڈ',
    namePlaceholder: 'پورا نام',
    loginBtn: 'ایرینا میں داخل ہوں',
    signupBtn: 'ایتھلیٹ رجسٹریشن',
    toggleToSignup: 'ایتھلیٹ رجسٹریشن کی ضرورت ہے؟ سائن اپ کریں',
    toggleToLogin: 'پہلے سے رجسٹرڈ ہیں؟ لاگ ان کریں',
    logoutBtn: 'سسٹم سے باہر نکلیں',
    loading: 'ایتھلیٹ ڈیٹا لوڈ ہو رہا ہے...',
    footerRights: 'جملہ حقوق محفوظ ہیں۔ زیادہ سے زیادہ طاقت کے لیے تیار کیا گیا ہے۔',
    gymLocation: 'برہروا ہاٹ پاڑہ، صاحب گنج، جھارکھنڈ، ہندوستان',
    locationTitle: 'کمپاؤنڈ: صاحب گنج پاور ہاؤس',
    locationDesc: 'ہاٹ پاڑہ، برہروا، ضلع: صاحب گنج، جھارکھنڈ، ہندوستان (پن: 816101) میں واقع ہے۔ فٹنس ایرینا اس خطے کا بینچ مارک ہائپر ٹرافی اور پاور ٹیمپل ہے۔ بھاری کاسٹ آئرن اور بائیو مکینیکل آلات سے لیس۔',
  },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('fa_lang') as Language) || 'en';
  });
  
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('fa_theme') as Theme) || 'dark';
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fa_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('fa_token') || null;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('fa_lang', lang);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('fa_theme', newTheme);
  };

  const loginUser = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('fa_user', JSON.stringify(userData));
    localStorage.setItem('fa_token', userToken);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fa_user');
    localStorage.removeItem('fa_token');
  };

  // Sync theme with HTML data attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync language with HTML dir and lang attributes
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    if (language === 'ur') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [language]);

  const t = (key: string): string => {
    return TRANSLATIONS[language][key] || TRANSLATIONS['en'][key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        theme,
        user,
        token,
        setLanguage,
        setTheme,
        loginUser,
        logoutUser,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
