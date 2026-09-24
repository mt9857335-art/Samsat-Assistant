export interface MasterSubscriptionItem {
  id: string;
  name: string;
  category: 'satellite_sharing' | 'iptv';
  typeBadge: string;
  status: 'active' | 'renewed' | 'lifetime';
  expiryDate: string;
  serverUrl?: string;
  host?: string;
  port?: string;
  username?: string;
  password?: string;
  activeCode?: string;
  coverage: string[];
  features: string[];
  supportedDevices: string[];
  officialPrice: {
    month1?: number;
    month3?: number;
    month6?: number;
    year1: number;
    currency: 'USD';
  };
  notes: string;
}

export const SAM_MASTER_SUBSCRIPTIONS: MasterSubscriptionItem[] = [
  {
    id: 'sam-vip2',
    name: 'اشتراك Forever VIP 2 (سيرفر فوريفر VIP الحزمة الثانية)',
    category: 'satellite_sharing',
    typeBadge: 'شيرينغ فضائي ملكي • VIP 2',
    status: 'active',
    expiryDate: '2027-12-31',
    activeCode: 'VIP2-SAMSAT-983010-ACTIVE',
    coverage: [
      'باقة beIN Sports العربية على نايل سات (7.0°W) وسهيل سات (26.0°E)',
      'باقة SuperSport و DSTV جنوب أفريقيا الرياضية',
      'باقة Nova اليونانية على هوتبيرد (13.0°E)',
      'باقة Polsat و Eleven Sports البولندية على هوتبيرد',
      'باقة Canal+ France الفرنسية على أسترا (19.2°E)',
      'باقة Sky Germany & Sky Italia بجودة HD فائقة'
    ],
    features: [
      'سيرفر فوريفر برو 145 / VIP Package 2 رسمي مضمون',
      'فتح قنوات بي إن سبورت الفضائية مباشرة عبر الصحن بدون إنترنت سريع (فقط 50 كيلو بايت لفك الشفرة)',
      'تفعيل صوتيات بين سبورت العربية التلقائية مع تايم شفت احترافي حتى 30 ثانية',
      'ربط بالرقم التسلسلي (SN) للريسيفر مباشرة أونلاين في دقائق معدودة'
    ],
    supportedDevices: [
      'ستارسات: StarSat SR-200HD 4K, T30, Extreme',
      'ميدياستار: MediaStar MS-Diamond, MS-4030, Zenon 4K',
      'تايجر: Tiger T3000 Mega, T8 High Class',
      'سيناتور: Senator Platinum, Captain',
      'ماجيك: Magic 9000 4K Ultra'
    ],
    officialPrice: {
      month1: 10,
      month3: 25,
      month6: 45,
      year1: 75,
      currency: 'USD'
    },
    notes: 'الاشتراك الخاص بالأستاذ سام، وهو الحزمة الأكثر طلباً لعشاق الرياضة والمباريات العالمية في لبنان دون الحاجة لسرعة إنترنت عالية.'
  },
  {
    id: 'sam-shamna',
    name: 'اشتراك شامنا IPTV (Shamna IPTV / شامنا برو)',
    category: 'iptv',
    typeBadge: 'IPTV عائلي ورياضي • سيرفر شامنا المعتمد',
    status: 'active',
    expiryDate: '2027-12-31',
    serverUrl: 'http://shamna-iptv.net:8080',
    host: 'shamna-iptv.net',
    port: '8080',
    username: 'samsat_shamna',
    activeCode: 'SHAMNA-VIP-2026',
    coverage: [
      'باقة القنوات اللبنانية والسورية والعربية كاملة بأعلى جودة',
      'باقة beIN Sports بكل الجودات (Low, SD, HD, FHD, 4K)',
      'باقة قنوات SSC السعودية، أبوظبي الرياضية، دبي الرياضية',
      'مكتبة ضخمة جداً ومحدثة يومياً للمسلسلات الشامية، التركية المدبلجة، والدراما الرمضانية',
      'أفلام السينما العربية والإنجليزية المترجمة'
    ],
    features: [
      'سيرفر مخصص ومثالي لسرعات الإنترنت في لبنان دون تقطيع',
      'يعمل عبر كود تفعيل مباشر أو Xtream API أو M3U',
      'تحديث تلقائي مستمر للمسلسلات اليومية والحلقات فور صدورها',
      'دعم تشغيل شاشاتين في نفس الوقت للباقة العائلية'
    ],
    supportedDevices: [
      'الشاشات الذكية (Samsung Tizen, LG WebOS)',
      'تطبيقات الأندرويد والآيفون (IPTV Smarters Pro, IBO Player, Net IPTV)',
      'ريسيفرات ماجيك وستارسات وميدياستار وتايجر وسيناتور',
      'أجهزة TV Box و Apple TV و Firestick'
    ],
    officialPrice: {
      month3: 15,
      month6: 22,
      year1: 35,
      currency: 'USD'
    },
    notes: 'سيرفر شامنا ممتاز للعائلات في لبنان بفضل جودات البث المنخفضة (SD/Low) التي تعمل حتى في أوقات ضعف الإنترنت.'
  },
  {
    id: 'sam-dh',
    name: 'اشتراك دي إتش IPTV (DH IPTV / DH Plus)',
    category: 'iptv',
    typeBadge: 'ثبات فائق للمباريات • سيرفر DH المعتمد',
    status: 'active',
    expiryDate: '2027-12-31',
    serverUrl: 'http://dh-plus-server.org:8000',
    host: 'dh-plus-server.org',
    port: '8000',
    username: 'samsat_dh',
    activeCode: 'DH-PLUS-983010',
    coverage: [
      'قنوات بي إن سبورت بعدة سيرفرات ومصادر متعددة (Multi-Source) لضمان عدم الانقطاع',
      'باقات الرياضة الأوروبية (Canal+, Eleven, DAZN, TNT Sports)',
      'باقات OSN وشاهد VIP ونتفليكس والترفيه العربي والغربي',
      'مكتبة أفلام وثائقية وقنوات أطفال شاملة'
    ],
    features: [
      'بنية تحتية سحابية متقدمة تضمن استقرار البث حتى 99.9% في قمة مباريات الكلاسيكو والدوري الأوروبي',
      'ميزة البث المباشر بدون تأخير (Ultra Low Latency)',
      'دعم جودات H.265 و 1080p 60fps للمشاهدة الرياضية السلسة'
    ],
    supportedDevices: [
      'تطبيقات Smart IPTV, IBO Player, Smarters Pro, Bob Player',
      'أجهزة Android TV و Mi Box و Chromecast',
      'جميع الريسيفرات الحاملة لتطبيق Xtream IPTV'
    ],
    officialPrice: {
      month3: 18,
      month6: 25,
      year1: 40,
      currency: 'USD'
    },
    notes: 'الخيار المفضل لرواد المقاهي ولعشاق الدوريات الكبرى الذين يبحثون عن سيرفر يتحمل الضغط العالي دون توقف.'
  },
  {
    id: 'sam-marvel',
    name: 'اشتراك مارفل IPTV (Marvel IPTV / Marvel 4K)',
    category: 'iptv',
    typeBadge: 'العملاق العالمي • Marvel 4K VIP',
    status: 'active',
    expiryDate: '2027-12-31',
    serverUrl: 'http://marvel-4k.biz:80',
    host: 'marvel-4k.biz',
    port: '80',
    username: 'samsat_marvel',
    activeCode: 'MARVEL-4K-ULTRA',
    coverage: [
      'أكثر من 15,000 قناة تلفزيونية حية من جميع دول العالم بدقة 4K و FHD حقيقية',
      'أضخم مكتبة أفلام ومسلسلات (VOD) تتجاوز 70,000 فيلم ومسلسل عربي وأجنبي محدثة يومياً',
      'باقات التود (TOD) وشاهد VIP ونتفليكس و HBO Max و Disney+ كاملة',
      'قنوات الدوريات الأوروبية باللغات العربية والإنجليزية والفرنسية والإسبانية'
    ],
    features: [
      'أقوى سيرفر IPTV بمواصفات تقنية عالية ونظام حماية ومقاومة الحجب',
      'جودة 4K أصلية مع صوت محيطي Dolby Digital',
      'سيرفرات CDN عالمية تضمن سرعة استجابة فائقة (Ping منخفض جداً)',
      'تطبيق مارفل المخصص Marvel Player متوفر على كل المنصات'
    ],
    supportedDevices: [
      'Samsung & LG Smart TVs',
      'Android TV, Apple TV 4K, Amazon Fire TV Stick',
      'الهواتف الذكية (iOS & Android)',
      'ريسيفرات 4K (ستارسات 200HD، ماجيك 9000، ميدياستار زينون)'
    ],
    officialPrice: {
      month3: 20,
      month6: 28,
      year1: 45,
      currency: 'USD'
    },
    notes: 'سيرفر مارفل هو الخيار الأكثر فخامة وشهرة عالمياً للزبائن الذين يمتلكون شاشات 4K ويريدون أقصى جودة ونقاء صورة ومكتبة VOD غير محدودة.'
  },
  {
    id: 'sam-magic',
    name: 'اشتراك ماجيك IPTV (Magic IPTV / Magic Pro VIP)',
    category: 'iptv',
    typeBadge: 'معتمد لأجهزة ماجيك والشاشات • Magic Pro',
    status: 'active',
    expiryDate: '2027-12-31',
    serverUrl: 'http://magic-tvbox.com:8080',
    host: 'magic-tvbox.com',
    port: '8080',
    username: 'samsat_magic',
    activeCode: 'MAGIC-PRO-983010',
    coverage: [
      'باقات القنوات الترفيهية والرياضية الكاملة',
      'قنوات بي إن و SSC وقنوات الأطفال والأفلام',
      'مكتبة أفلام ومسلسلات منوعة',
      'قنوات مشفرة أوروبية وعربية'
    ],
    features: [
      'مدمج ومتوافق 100% مع كافة موديلات ريسيفر ماجيك (Magic Box)',
      'تفعيل سهل جداً عبر إدخال كود رقمي مباشر دون الحاجة لروابط طويلة',
      'يعمل بسلاسة حتى على الأجهزة الاقتصادية القديمة وذواكر الرام المحدودة',
      'خوادم سريعة ومستقرة داخل الشرق الأوسط'
    ],
    supportedDevices: [
      'جميع موديلات ريسيفر Magic (T50, 9000 4K, Mini, TV Box)',
      'تطبيق Magic IPTV وتطبيقات Smarters',
      'الشاشات الذكية وأجهزة الموبايل'
    ],
    officialPrice: {
      month3: 15,
      month6: 20,
      year1: 30,
      currency: 'USD'
    },
    notes: 'السيرفر المعتمد والمحبب جداً لمشتري ريسيفرات ماجيك في لبنان لسهولة تشغيله بكود التفعيل السريع وسعره الاقتصادي.'
  }
];

export interface PackagePresetItem {
  id: string;
  name: string;
  shortLabel: string;
  category: 'satellite_vip' | 'iptv' | 'telecom' | 'internet';
  price: number;
  durationDays: number;
  currency: 'USD' | 'LBP';
  popular?: boolean;
}

export const PRESET_SUBSCRIPTION_PLANS: PackagePresetItem[] = [
  // Forever VIP 2
  {
    id: 'plan-vip2-1y',
    name: 'اشتراك Forever VIP 2 سنة كاملة (شيرينغ بين سبورت والأقمار)',
    shortLabel: 'Forever VIP 2 سنة ($75)',
    category: 'satellite_vip',
    price: 75,
    durationDays: 365,
    currency: 'USD',
    popular: true,
  },
  {
    id: 'plan-vip2-6m',
    name: 'اشتراك Forever VIP 2 لمدة 6 أشهر',
    shortLabel: 'Forever VIP 2 ستة أشهر ($45)',
    category: 'satellite_vip',
    price: 45,
    durationDays: 180,
    currency: 'USD',
  },
  {
    id: 'plan-vip2-3m',
    name: 'اشتراك Forever VIP 2 لمدة 3 أشهر',
    shortLabel: 'Forever VIP 2 ثلاثة أشهر ($25)',
    category: 'satellite_vip',
    price: 25,
    durationDays: 90,
    currency: 'USD',
  },

  // Shamna IPTV
  {
    id: 'plan-shamna-1y',
    name: 'اشتراك شامنا IPTV سنة كاملة (Shamna Pro 4K)',
    shortLabel: 'شامنا Shamna سنة ($35)',
    category: 'iptv',
    price: 35,
    durationDays: 365,
    currency: 'USD',
    popular: true,
  },
  {
    id: 'plan-shamna-6m',
    name: 'اشتراك شامنا IPTV لمدة 6 أشهر',
    shortLabel: 'شامنا Shamna ستة أشهر ($22)',
    category: 'iptv',
    price: 22,
    durationDays: 180,
    currency: 'USD',
  },

  // Marvel IPTV
  {
    id: 'plan-marvel-1y',
    name: 'اشتراك مارفل IPTV سنة كاملة (Marvel 4K VIP)',
    shortLabel: 'مارفل Marvel 4K سنة ($45)',
    category: 'iptv',
    price: 45,
    durationDays: 365,
    currency: 'USD',
    popular: true,
  },
  {
    id: 'plan-marvel-6m',
    name: 'اشتراك مارفل IPTV لمدة 6 أشهر',
    shortLabel: 'مارفل Marvel ستة أشهر ($28)',
    category: 'iptv',
    price: 28,
    durationDays: 180,
    currency: 'USD',
  },

  // DH IPTV
  {
    id: 'plan-dh-1y',
    name: 'اشتراك دي إتش IPTV سنة كاملة (DH Plus Ultra)',
    shortLabel: 'دي إتش DH Plus سنة ($40)',
    category: 'iptv',
    price: 40,
    durationDays: 365,
    currency: 'USD',
    popular: true,
  },
  {
    id: 'plan-dh-6m',
    name: 'اشتراك دي إتش IPTV لمدة 6 أشهر',
    shortLabel: 'دي إتش DH Plus ستة أشهر ($25)',
    category: 'iptv',
    price: 25,
    durationDays: 180,
    currency: 'USD',
  },

  // Magic IPTV
  {
    id: 'plan-magic-1y',
    name: 'اشتراك ماجيك IPTV سنة كاملة (Magic Pro VIP)',
    shortLabel: 'ماجيك Magic Pro سنة ($30)',
    category: 'iptv',
    price: 30,
    durationDays: 365,
    currency: 'USD',
    popular: true,
  },
  {
    id: 'plan-magic-6m',
    name: 'اشتراك ماجيك IPTV لمدة 6 أشهر',
    shortLabel: 'ماجيك Magic Pro ستة أشهر ($20)',
    category: 'iptv',
    price: 20,
    durationDays: 180,
    currency: 'USD',
  },

  // Mobile Recharge & Internet
  {
    id: 'plan-alfa-1m',
    name: 'تشريج خط ألفا شهري ($23)',
    shortLabel: 'تشريج خط ألفا شهري ($23)',
    category: 'telecom',
    price: 23,
    durationDays: 30,
    currency: 'USD',
  },
  {
    id: 'plan-touch-1m',
    name: 'تشريج خط تاتش شهري ($23)',
    shortLabel: 'تشريج خط تاتش شهري ($23)',
    category: 'telecom',
    price: 23,
    durationDays: 30,
    currency: 'USD',
  },
  {
    id: 'plan-net-1m',
    name: 'اشتراك باقة إنترنت منزلي فائق السرعة ($15)',
    shortLabel: 'إنترنت منزلي فائق ($15)',
    category: 'internet',
    price: 15,
    durationDays: 30,
    currency: 'USD',
  },
  {
    id: 'plan-net-3m',
    name: 'اشتراك إنترنت فائق 3 أشهر ($40)',
    shortLabel: 'إنترنت 3 أشهر ($40)',
    category: 'internet',
    price: 40,
    durationDays: 90,
    currency: 'USD',
  },
];
