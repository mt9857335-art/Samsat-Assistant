export interface LocalSatTransponder {
  index: number;
  baseFreq: number;
  plus30Freq: number;
  polarity: 'V' | 'H';
  symbolRate: number;
  fec: string;
  channelsSummary: string;
}

export interface LocalSatNetwork {
  id: string;
  nameAr: string;
  nameEn: string;
  providerCode: string;
  badge: string;
  badgeColor: string;
  baseFrequency: number;
  offsetFrequency: number; // Base + 30
  polarity: 'V' | 'H';
  symbolRate: number;
  fec: string;
  standard: 'DVB-S2' | 'DVB-S';
  modulation: '8PSK' | 'QPSK';
  totalTranspondersCount: number;
  coverageAreas: string[];
  description: string;
  offsetRuleExplanation: string;
  transponders: LocalSatTransponder[];
  recommendedReceivers: string[];
  lnbSettings: {
    lnbType: string;
    lowFreq: number;
    highFreq: number;
    power: string;
    diseqc: string;
  };
}

export const LEBANESE_LOCAL_SAT_NETWORKS: LocalSatNetwork[] = [
  {
    id: 'cablevision',
    nameAr: 'شبكة كيبل فيجن (Cablevision Local Sat)',
    nameEn: 'Cablevision Lebanon',
    providerCode: 'CABLEVISION-LB',
    badge: 'الشبكة الأوسع انتشاراً في لبنان • 12 تردد',
    badgeColor: 'from-blue-600/20 to-sky-500/20 text-sky-400 border-sky-500/40',
    baseFrequency: 11960,
    offsetFrequency: 11990, // 11960 + 30
    polarity: 'V',
    symbolRate: 30000,
    fec: '3/4',
    standard: 'DVB-S2',
    modulation: '8PSK',
    totalTranspondersCount: 12,
    coverageAreas: ['بيروت الكبرى', 'المتن الشمالي والجنوبي', 'كسروان', 'طرابلس والشمال', 'صيدا والجنوب', 'البقاع'],
    description: 'شبكة الكابل واللوكال سات الرائدة في لبنان، تبث باقة قنوات رياضية وترفيهية وأفلام مشفرة عبر منظومة البث المحلي الفضائي والميكروويف.',
    offsetRuleExplanation: 'التردد الأساسي 11960 V 30000، وعند ضبط التيونر أو اللواقط الخاصة باللوكال سات يتم زيادة 30 ميغاهرتز (+30 MHz) ليصبح 11990 V 30000 لضبط كافة الترددات الـ 12 المتتابعة بدقة متناهية وبدون تكسير.',
    recommendedReceivers: ['ريسيفرات ستارسات (StarSat)', 'ريسيفرات ماجيك (Magic)', 'ريسيفرات تايجر (Tiger)', 'أجهزة التيونر DVB-S2 الحساسة'],
    lnbSettings: {
      lnbType: 'Universal (عادي / محلي)',
      lowFreq: 9750,
      highFreq: 10600,
      power: '13V/18V شغال',
      diseqc: 'حسب مخرج الدايسك أو مباشر LNB1'
    },
    transponders: Array.from({ length: 12 }, (_, i) => {
      const step = i * 30; // 30 MHz spacing per transponder
      const base = 11960 + step;
      const plus30 = base + 30;
      const channelLabels = [
        'باقة beIN Sports الرياضية 1 & 2 HD المحلية',
        'باقة beIN Sports 3 & 4 HD وقنوات الدوري الإنجليزي',
        'باقة SSC السعودية وقنوات الرياضة العربية',
        'باقة قنوات الأفلام والسينما الأجنبية HD المترجمة',
        'باقة قنوات دراما ومسلسلات شوتايم و OSN',
        'باقة قنوات الأطفال والكرتون والوثائقيات',
        'باقة القنوات اللبنانية المحلية فائقة الجودة FHD',
        'باقة قنوات الكأس والدوريات الأوروبية المفتوحة',
        'باقة الأفلام العربية الحصرية والمسرحيات',
        'باقة المصارعة وقنوات الأكشن والرياضات القتالية',
        'باقة المنوعات والموسيقى والترفيه العائلي',
        'باقة الطوارئ وتحديث معلومات شبكة كيبل فيجن'
      ];
      return {
        index: i + 1,
        baseFreq: base,
        plus30Freq: plus30,
        polarity: 'V',
        symbolRate: 30000,
        fec: '3/4',
        channelsSummary: channelLabels[i] || `باقة قنوات كيبل فيجن رقم ${i + 1}`
      };
    })
  },
  {
    id: 'econet',
    nameAr: 'شبكة إيكونت (Econet / أكونت)',
    nameEn: 'Econet Wireless Cable Sat',
    providerCode: 'ECONET-LB',
    badge: 'باقة إيكونت الكبرى • 12120 H 31250 • 12 تردد',
    badgeColor: 'from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/40',
    baseFrequency: 12120,
    offsetFrequency: 12150, // 12120 + 30
    polarity: 'H',
    symbolRate: 31250,
    fec: '3/4',
    standard: 'DVB-S2',
    modulation: '8PSK',
    totalTranspondersCount: 12,
    coverageAreas: ['جبل لبنان', 'بيروت', 'الشوف وعاليه', 'الجنوب', 'النبطية', 'البقاع الأوسط'],
    description: 'شبكة إيكونت الشهيرة جداً في لبنان التي تبث باستقطاب أفقي (H) ومعدل ترميز مميز 31250 على 12 تردداً مخصصاً لخدمة المشتركين.',
    offsetRuleExplanation: 'التردد الأساسي 12120 H 31250، ويتم إضافة 30 على التردد (+30 MHz) ليصبح 12150 H 31250 ومن ثم تنزيل الترددات الـ 12 المتتالية لتفعيل واستقبال كامل قنوات وباقات إيكونت.',
    recommendedReceivers: ['ريسيفرات سيناتور (Senator)', 'ستارسات إكستريم', 'ميدياستار', 'ماجيك بوكس'],
    lnbSettings: {
      lnbType: 'Universal 9750/10600',
      lowFreq: 9750,
      highFreq: 10600,
      power: '18V (أفقي Horizontal)',
      diseqc: 'LNB أو DiSEqC 1.0 Port 2'
    },
    transponders: Array.from({ length: 12 }, (_, i) => {
      const step = i * 30;
      const base = 12120 + step;
      const plus30 = base + 30;
      const channelLabels = [
        'إيكونت باقة الرياضة 1 (beIN 1, 2, 3 HD)',
        'إيكونت باقة الرياضة 2 (beIN 4, 5, 6 HD)',
        'إيكونت باقة SSC و أبوظبي الرياضية المشفرة',
        'إيكونت باقة أفلام هوليوود مترجمة Box Office',
        'إيكونت باقة نتفليكس وشاهد VIP المعادة',
        'إيكونت باقة الأطفال وناشيونال جيوغرافيك وثائقي',
        'إيكونت باقة الدراما والمسلسلات التركية والعربية',
        'إيكونت باقة القنوات اللبنانية والعربية العامة',
        'إيكونت باقة الطرب والمنوعات',
        'إيكونت باقة المصارعة WWE والأكشن 24/7',
        'إيكونت باقة قنوات الرعب والتشويق',
        'إيكونت باقة التحديث والترددات الاحتياطية'
      ];
      return {
        index: i + 1,
        baseFreq: base,
        plus30Freq: plus30,
        polarity: 'H',
        symbolRate: 31250,
        fec: '3/4',
        channelsSummary: channelLabels[i] || `باقة قنوات إيكونت رقم ${i + 1}`
      };
    })
  },
  {
    id: 'citysat',
    nameAr: 'شبكة سيتي سات (CitySat)',
    nameEn: 'CitySat Network Lebanon',
    providerCode: 'CITYSAT-LB',
    badge: 'سيتي سات • 11740 V 30000 • 12 تردد',
    badgeColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/40',
    baseFrequency: 11740,
    offsetFrequency: 11770, // 11740 + 30
    polarity: 'V',
    symbolRate: 30000,
    fec: '3/4',
    standard: 'DVB-S2',
    modulation: '8PSK',
    totalTranspondersCount: 12,
    coverageAreas: ['بيروت وضواحيها', 'المتن', 'ساحل المتن وكسروان', 'مناطق جبل لبنان'],
    description: 'شبكة سيتي سات المحلية المتخصصة في بث باقات المباريات والقنوات الفضائية المشفرة بجودة عالية واستقرار ممتاز.',
    offsetRuleExplanation: 'التردد المعتمد 11740 V 30000، ومع تطبيق قاعدة زيادة 30 يصبح التردد 11770 V 30000 لتغذية التيونر بـ 12 تردداً متكاملاً.',
    recommendedReceivers: ['أجهزة ماجيك', 'ستارسات HD/4K', 'تايجر'],
    lnbSettings: {
      lnbType: 'Universal',
      lowFreq: 9750,
      highFreq: 10600,
      power: '13V (عمودي Vertical)',
      diseqc: 'Off / Direct'
    },
    transponders: Array.from({ length: 12 }, (_, i) => {
      const step = i * 30;
      const base = 11740 + step;
      const plus30 = base + 30;
      return {
        index: i + 1,
        baseFreq: base,
        plus30Freq: plus30,
        polarity: 'V',
        symbolRate: 30000,
        fec: '3/4',
        channelsSummary: `باقة سيتي سات ${i + 1} (قنوات الرياضة والترفيه والأفلام)`
      };
    })
  },
  {
    id: 'homesat',
    nameAr: 'شبكة هوم سات (Home Sat)',
    nameEn: 'Home Sat Lebanon',
    providerCode: 'HOMESAT-LB',
    badge: 'هوم سات • 12620 V 30000 • 12 تردد',
    badgeColor: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/40',
    baseFrequency: 12620,
    offsetFrequency: 12650, // 12620 + 30
    polarity: 'V',
    symbolRate: 30000,
    fec: '3/4',
    standard: 'DVB-S2',
    modulation: '8PSK',
    totalTranspondersCount: 12,
    coverageAreas: ['جبل لبنان', 'الضاحية الجنوبية', 'عاليه وبحمدون', 'الجنوب'],
    description: 'شبكة هوم سات الواسعة، تردد عالي على النطاق العلوي (High Band) لتفادي التداخل مع إشارات الأقمار التقليدية.',
    offsetRuleExplanation: 'التردد الأساسي 12620 V 30000، وبإضافة 30 يصبح 12650 V 30000 لضبط كامل الترددات الـ 12 للشبكة.',
    recommendedReceivers: ['كافة موديلات الريسيفرات الحاملة لتيونر DVB-S2 عالي الحساسية'],
    lnbSettings: {
      lnbType: 'Universal 9750/10600 (High Band 22KHz Tone ON)',
      lowFreq: 9750,
      highFreq: 10600,
      power: '13V',
      diseqc: 'Port 1 / Direct'
    },
    transponders: Array.from({ length: 12 }, (_, i) => {
      const step = i * 30;
      const base = 12620 + step;
      const plus30 = base + 30;
      return {
        index: i + 1,
        baseFreq: base,
        plus30Freq: plus30,
        polarity: 'V',
        symbolRate: 30000,
        fec: '3/4',
        channelsSummary: `باقة هوم سات ${i + 1} (باقات الرياضة والأفلام والدراما)`
      };
    })
  },
  {
    id: 'digest',
    nameAr: 'شبكة دايجست (Digest / ديجي سات)',
    nameEn: 'Digest Local Sat (DigiSat)',
    providerCode: 'DIGEST-LB',
    badge: 'دايجست • 12100 V 30000 • 12 تردد',
    badgeColor: 'from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/40',
    baseFrequency: 12100,
    offsetFrequency: 12130, // 12100 + 30
    polarity: 'V',
    symbolRate: 30000,
    fec: '3/4',
    standard: 'DVB-S2',
    modulation: '8PSK',
    totalTranspondersCount: 12,
    coverageAreas: ['المتن', 'بيروت', 'جونيه وكسروان', 'جبيل والمناطق المجاورة'],
    description: 'شبكة دايجست اللبنانية، تتميز بنقاء الصوت والصورة وبثها المستقر على التردد 12100 العمودي بمعدل 30000.',
    offsetRuleExplanation: 'التردد الأساسي 12100 V 30000، وعند زيادة 30 يصبح 12130 V 30000 لاستقبال حزمة الـ 12 تردد الكاملة.',
    recommendedReceivers: ['ريسيفرات ستارسات وميدياستار وماجيك وسيناتور'],
    lnbSettings: {
      lnbType: 'Universal',
      lowFreq: 9750,
      highFreq: 10600,
      power: '13V (عمودي Vertical)',
      diseqc: 'Direct'
    },
    transponders: Array.from({ length: 12 }, (_, i) => {
      const step = i * 30;
      const base = 12100 + step;
      const plus30 = base + 30;
      return {
        index: i + 1,
        baseFreq: base,
        plus30Freq: plus30,
        polarity: 'V',
        symbolRate: 30000,
        fec: '3/4',
        channelsSummary: `باقة دايجست ${i + 1} (قنوات الرياضة والمنوعات)`
      };
    })
  }
];
