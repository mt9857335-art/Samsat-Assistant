export interface SatelliteSite {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'frequencies' | 'alignment' | 'sat_operator' | 'community';
  url: string;
  badge: string;
  badgeColor: string;
  description: string;
  keyFeatures: string[];
  recommendedUse: string;
}

export interface SatelliteFrequency {
  id: string;
  satelliteNameAr: string;
  satelliteNameEn: string;
  orbitalPosition: string;
  frequency: string;
  polarity: 'H' | 'V';
  symbolRate: string;
  fec: string;
  standard: 'DVB-S' | 'DVB-S2' | 'Multistream';
  modulation: 'QPSK' | '8PSK';
  channels: string[];
  category: 'sports' | 'lebanese' | 'general' | 'movies' | 'reference_signal' | 'local_sat';
  isStrongSignal: boolean;
  notes: string;
}

export interface CccamSite {
  id: string;
  nameAr: string;
  nameEn: string;
  url: string;
  type: 'generator' | 'tester' | 'daily_keys';
  duration: string;
  badge: string;
  badgeColor: string;
  description: string;
  supportedPackages: string[];
  howToUse: string;
}

export const SATELLITE_SITES: SatelliteSite[] = [
  {
    id: 'flysat',
    nameAr: 'فلاي سات (FlySat)',
    nameEn: 'FlySat Satellite Chart',
    category: 'frequencies',
    url: 'https://www.flysat.com',
    badge: 'المرجع الأول عالمياً للترددات',
    badgeColor: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    description: 'الموقع رقم 1 والأسرع في العالم في رصد وتحديث ترددات الأقمار الصناعية يومياً بالساعة والدقيقة، مع تغطية شاملة لكافة الأقمار من الشرق للغرب وقنوات الفيد (Feeds) والبث 4K.',
    keyFeatures: [
      'تحديث يومي فوري باللون الأصفر للقنوات والترددات الجديدة',
      'فهرس كامل لأقمار النايل سات (7°W)، هوتبيرد (13°E)، أسترا (19.2°E)، وعربسات (26°E)',
      'جداول خاصة بقنوات الفيد الرياضية المشفرة والمفتوحة (Sports Feeds)',
      'بيانات كاملة عن التردد، الاستقطاب، معدل الترميز، ومعامل تصحيح الخطأ (FEC)'
    ],
    recommendedUse: 'أفضل موقع تعتمد عليه لمعرفة أي تردد جديد أو تعديل طرأ على أي قناة رياضية أو عربية.'
  },
  {
    id: 'kingofsat',
    nameAr: 'كينغ أوف سات (KingOfSat)',
    nameEn: 'KingOfSat European Satellite Zapping',
    category: 'frequencies',
    url: 'https://en.kingofsat.net',
    badge: 'الأدق للباقات الأوروبية والمشفرة',
    badgeColor: 'from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/30',
    description: 'الموقع الأوروبي الشهير بدقة تصنيفه للباقات المشفرة والمجانية، مع محرك بحث فائق الدقة عن أي قناة حسب الاسم أو التردد أو الباقة أو نظام التشفير (Irdeto, Viaccess, Nagra).',
    keyFeatures: [
      'محرك بحث مباشر عن اسم أي قناة في العالم مع معرفة القمر والتردد',
      'سجل يومي دقيق بالتغييرات (News & Changes log)',
      'تفاصيل خرائط التغطية (Footprints) وحجم الصحن المطلوب للاستقبال',
      'تصنيف حسب جودة البث (HD, 4K UHD, SD) واللغات'
    ],
    recommendedUse: 'ممتاز للبحث عن قنوات الرياضة على قمر هوتبيرد وأسترا ومعرفة أنظمة التشفير الشغالة.'
  },
  {
    id: 'lyngsat',
    nameAr: 'لينغ سات (LyngSat)',
    nameEn: 'LyngSat Worldwide Database',
    category: 'frequencies',
    url: 'https://www.lyngsat.com',
    badge: 'أعرق قاعدة بيانات للأقمار',
    badgeColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    description: 'الموسوعة التاريخية الكبرى لترددات الأقمار الصناعية منذ عام 1996، يقدم رسومات ومخططات مفصلة لكافة نطاقات الترددات (C-Band / Ku-Band / Ka-Band).',
    keyFeatures: [
      'فهرس مرتب حسب المدار من 180° غرباً إلى 180° شرقاً',
      'أقسام مخصصة لترددات البث التلفزيوني المجاني (FTA Free TV)',
      'صفحات خاصة بكل قمر توضح الشركة المالكة ونطاق التغطية وسنة الإطلاق',
      'فهرس مخصص للأقمار ذات الحزم العريضة الموجهة للشرق الأوسط'
    ],
    recommendedUse: 'الأفضل لمعرفة مواصفات القمر المدارية ومواقع الأقمار الصناعية وتردداتها الأصلية.'
  },
  {
    id: 'dishpointer',
    nameAr: 'ديش بوينتر (DishPointer)',
    nameEn: 'DishPointer Satellite Alignment',
    category: 'alignment',
    url: 'https://www.dishpointer.com',
    badge: 'ضبط زوايا الصحن بالخريطة',
    badgeColor: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30',
    description: 'أداة الخريطة التفاعلية الرائدة عالمياً لضبط اتجاه وتوجيه صحن الستالايت عبر صور الأقمار الصناعية بدقة السنتيمتر في أي منطقة في لبنان والعالم.',
    keyFeatures: [
      'تحديد موقع المنزل والسطح بدقة عبر Google Maps',
      'رسم خط اتجاه القمر مباشرة من موقع الصحن لتفادي العوائق والأبنية المجاورة',
      'حساب زاوية الارتفاع (Elevation Angle)، وزاوية الاتجاه (Azimuth)',
      'حساب زاوية ميلان اللاقط (LNB Skew) بالدرجة الدقيقة'
    ],
    recommendedUse: 'الأداة الأساسية للأستاذ سام والفنيين لتركيب وتوجيه الصحون المتحركة والثابتة بدقة متناهية.'
  },
  {
    id: 'satlex',
    nameAr: 'ساتلكس ديجيتال (SatLex)',
    nameEn: 'SatLex Satellite Calculator',
    category: 'alignment',
    url: 'https://satlex.net',
    badge: 'حاسبة مساطر ومولتيفيد متطورة',
    badgeColor: 'from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30',
    description: 'الموقع الهندسي المتخصص بحسابات الأطباق المتعددة اللواقط (Multifeed) والمساطر لجمع أكثر من قمر (مثل نايل سات + هوتبيرد + عربسات) على صحن واحد.',
    keyFeatures: [
      'حاسبة المسافات بين اللواقط (LNBs) على المسطرة بالسنتيمتر',
      'حساب زوايا الأقمار المشتركة لصحون البيضاوي والـ Toroidal',
      'دليل إعدادات الدايسك (DiSEqC 1.0 / 1.1 / 1.2 / USALS)',
      'متوفر باللغة العربية والإنجليزية ولغات متعددة'
    ],
    recommendedUse: 'حساب المسافة الدقيقة بين لواكب النايل سات وهوتبيرد وعربسات عند تركيب مسطرة 3 أو 4 رؤوس.'
  },
  {
    id: 'satbeams',
    nameAr: 'سات بيمز (SatBeams)',
    nameEn: 'SatBeams Footprints & Dish Size',
    category: 'alignment',
    url: 'https://www.satbeams.com',
    badge: 'خرائط التغطية وحجم الصحن',
    badgeColor: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
    description: 'يقدم خرائط تغطية تفاعلية واقعية (Footprints) لجميع حزم الأقمار، ويبين قطر الصحن المطلوب لاستقبال التردد في لبنان (60 سم، 90 سم، 120 سم أو أكبر).',
    keyFeatures: [
      'معرفة هل القمر يصل إلى لبنان بقوة أم يحتاج صحن كبير',
      'مقارنة قوة الإشارة (EIRP dBW) بمقاس الصحن الفعلي',
      'مكتبة الأقمار الجديدة التي تم إطلاقها ومواعيد دخولها الخدمة'
    ],
    recommendedUse: 'التأكد من إمكانية التقاط أقمار مثل Astra 19.2E أو Hispasat أو Amos في مناطق لبنان المختلفة.'
  },
  {
    id: 'nilesat-official',
    nameAr: 'الموقع الرسمي لقمر نايل سات',
    nameEn: 'Nilesat Official Operator',
    category: 'sat_operator',
    url: 'http://www.nilesat.com.eg',
    badge: 'الجهة الرسمية المشغلة',
    badgeColor: 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/30',
    description: 'الموقع الرسمي للشركة المصرية للأقمار الصناعية (نايل سات 201 و 301)، يقدم الجداول الرسمية للترددات الصادرة عن إدارة القمر.',
    keyFeatures: [
      'بيانات رسمية معتمدة من إدارة النايل سات',
      'جدول ترددات نايل سات 301 الجديد'
    ],
    recommendedUse: 'المصدر الرسمي المعتمد للتأكد من ترددات وباقات النايل سات.'
  }
];

export const TOP_SATELLITE_FREQUENCIES: SatelliteFrequency[] = [
  // Nilesat (7.0°W)
  {
    id: 'freq-leb-pack',
    satelliteNameAr: 'نايل سات 201/301',
    satelliteNameEn: 'Nilesat (7.0°W)',
    orbitalPosition: '7.0°W',
    frequency: '12604',
    polarity: 'V',
    symbolRate: '27500',
    fec: '5/6',
    standard: 'DVB-S2',
    modulation: '8PSK',
    channels: ['MTV Lebanon HD', 'LBCI International HD', 'Al Jadeed HD', 'OTV Lebanon', 'Tele Liban HD', 'NBN HD', 'Al Manar'],
    category: 'lebanese',
    isStrongSignal: true,
    notes: 'الباقة اللبنانية الشاملة - التردد الأهم لجميع الزبائن والمنازل في لبنان.'
  },
  {
    id: 'freq-bein-news',
    satelliteNameAr: 'نايل سات 201/301',
    satelliteNameEn: 'Nilesat (7.0°W)',
    orbitalPosition: '7.0°W',
    frequency: '11258',
    polarity: 'H',
    symbolRate: '27500',
    fec: '2/3',
    standard: 'DVB-S2',
    modulation: '8PSK',
    channels: ['beIN Sports News HD (الإخبارية المفتوحة)', 'beIN Sports HD (المفتوحة)', 'Al Kass One HD'],
    category: 'sports',
    isStrongSignal: true,
    notes: 'قنوات بي إن سبورت المفتوحة للمباريات المجانية وأخبار الرياضة.'
  },
  {
    id: 'freq-mbc-hd',
    satelliteNameAr: 'نايل سات 201/301',
    satelliteNameEn: 'Nilesat (7.0°W)',
    orbitalPosition: '7.0°W',
    frequency: '11747',
    polarity: 'V',
    symbolRate: '27500',
    fec: '3/4',
    standard: 'DVB-S',
    modulation: 'QPSK',
    channels: ['MBC 1', 'MBC 2 (الأفلام الأجنبية)', 'MBC 4', 'MBC Action', 'MBC Max', 'MBC Drama'],
    category: 'movies',
    isStrongSignal: true,
    notes: 'باقة قنوات إم بي سي (MBC) الأساسية للأفلام والمسلسلات العربية والأجنبية.'
  },
  {
    id: 'freq-rotana-hd',
    satelliteNameAr: 'نايل سات 201/301',
    satelliteNameEn: 'Nilesat (7.0°W)',
    orbitalPosition: '7.0°W',
    frequency: '12054',
    polarity: 'V',
    symbolRate: '27500',
    fec: '5/6',
    standard: 'DVB-S',
    modulation: 'QPSK',
    channels: ['Rotana Cinema HD', 'Rotana Classic', 'Rotana Drama', 'Rotana Khalijiah', 'Rotana Music'],
    category: 'movies',
    isStrongSignal: true,
    notes: 'باقة روتانا سينما وكلاسيك وطرب وكوميديا.'
  },
  {
    id: 'freq-nilesat-strong',
    satelliteNameAr: 'نايل سات 201/301',
    satelliteNameEn: 'Nilesat (7.0°W)',
    orbitalPosition: '7.0°W',
    frequency: '11679',
    polarity: 'H',
    symbolRate: '27500',
    fec: '3/4',
    standard: 'DVB-S',
    modulation: 'QPSK',
    channels: ['Nilesat Channel (تردد الضبط المركزي)'],
    category: 'reference_signal',
    isStrongSignal: true,
    notes: 'أقوى تردد إشارة لضبط وتوجيه صحن النايل سات بسرعة للمبتدئين والفنيين.'
  },

  // Hotbird (13.0°E)
  {
    id: 'freq-polsat-sports',
    satelliteNameAr: 'هوتبيرد 13F/13G',
    satelliteNameEn: 'Hotbird (13.0°E)',
    orbitalPosition: '13.0°E',
    frequency: '11278',
    polarity: 'V',
    symbolRate: '27500',
    fec: '3/4',
    standard: 'DVB-S2',
    modulation: '8PSK',
    channels: ['Canal+ Sport 1-4 Poland', 'Eleven Sports 1-4 4K/HD', 'Polsat Sport 1-3'],
    category: 'sports',
    isStrongSignal: true,
    notes: 'أقوى باقة رياضية ناقلة للدوريات الأوروبية ودوري الأبطال مع الشيرينغ وسيرفرات CCcam و Forever.'
  },
  {
    id: 'freq-polsat-premium',
    satelliteNameAr: 'هوتبيرد 13F/13G',
    satelliteNameEn: 'Hotbird (13.0°E)',
    orbitalPosition: '13.0°E',
    frequency: '11488',
    polarity: 'H',
    symbolRate: '27500',
    fec: '3/4',
    standard: 'DVB-S2',
    modulation: '8PSK',
    channels: ['Polsat Sport Premium 1 HD', 'Polsat Sport Premium 2 HD', 'Polsat News'],
    category: 'sports',
    isStrongSignal: true,
    notes: 'باقة دوري أبطال أوروبا الحصرية على البولش (تعمل بثبات كامل على الشيرينغ).'
  },
  {
    id: 'freq-rai-hd',
    satelliteNameAr: 'هوتبيرد 13F/13G',
    satelliteNameEn: 'Hotbird (13.0°E)',
    orbitalPosition: '13.0°E',
    frequency: '10992',
    polarity: 'V',
    symbolRate: '27500',
    fec: '2/3',
    standard: 'DVB-S2',
    modulation: '8PSK',
    channels: ['Rai 1 HD', 'Rai 2 HD', 'Rai 3 HD', 'Rai Sport HD'],
    category: 'sports',
    isStrongSignal: true,
    notes: 'باقة الراي الإيطالية الناقلة لمباريات المنتخب الإيطالي وكأس إيطاليا والبطولات الأوروبية.'
  },
  {
    id: 'freq-hotbird-signal',
    satelliteNameAr: 'هوتبيرد 13F/13G',
    satelliteNameEn: 'Hotbird (13.0°E)',
    orbitalPosition: '13.0°E',
    frequency: '11034',
    polarity: 'V',
    symbolRate: '27500',
    fec: '3/4',
    standard: 'DVB-S',
    modulation: 'QPSK',
    channels: ['تردد الضبط الأساسي لهوتبيرد (قنوات إيطالية مجانية)'],
    category: 'reference_signal',
    isStrongSignal: true,
    notes: 'التردد الذهبي لضبط قمر هوتبيرد والحصول على أعلى إشارة استقبال في لبنان.'
  },

  // Astra (19.2°E)
  {
    id: 'freq-canal-plus-fr',
    satelliteNameAr: 'أسترا 19.2 شرقا',
    satelliteNameEn: 'Astra (19.2°E)',
    orbitalPosition: '19.2°E',
    frequency: '11856',
    polarity: 'V',
    symbolRate: '29700',
    fec: '2/3',
    standard: 'DVB-S2',
    modulation: '8PSK',
    channels: ['Canal+ France HD', 'Canal+ Sport 360', 'Canal+ Foot HD'],
    category: 'sports',
    isStrongSignal: false,
    notes: 'الباقة الفرنسية الخارقة الناقلة لمباريات كرة القدم والبريميرليغ والدوري الفرنسي.'
  },
  {
    id: 'freq-sky-de',
    satelliteNameAr: 'أسترا 19.2 شرقا',
    satelliteNameEn: 'Astra (19.2°E)',
    orbitalPosition: '19.2°E',
    frequency: '11992',
    polarity: 'H',
    symbolRate: '27500',
    fec: '9/10',
    standard: 'DVB-S2',
    modulation: 'QPSK',
    channels: ['Sky Sport Bundesliga HD', 'Sky Sport Premier League', 'Sky Sport F1'],
    category: 'sports',
    isStrongSignal: false,
    notes: 'باقة سكاي الألمانية الرياضية وبطولات الفورمولا 1 والدوري الألماني.'
  },

  // Badr / Arabsat (26.0°E)
  {
    id: 'freq-ssc-sports',
    satelliteNameAr: 'بدر / عربسات (26.0°E)',
    satelliteNameEn: 'Badr / Arabsat (26.0°E)',
    orbitalPosition: '26.0°E',
    frequency: '12523',
    polarity: 'V',
    symbolRate: '27500',
    fec: '5/6',
    standard: 'DVB-S2',
    modulation: '8PSK',
    channels: ['SSC 1-5 HD (قنوات الرياضة السعودية)', 'SSC Open Free'],
    category: 'sports',
    isStrongSignal: true,
    notes: 'قنوات الرياضة السعودية SSC الناقلة لدوري روشن السعودي ودوري أبطال آسيا.'
  },

  // Amos (4.0°W)
  {
    id: 'freq-amos-sports',
    satelliteNameAr: 'عاموس (4.0°W)',
    satelliteNameEn: 'Amos (4.0°W)',
    orbitalPosition: '4.0°W',
    frequency: '11030',
    polarity: 'V',
    symbolRate: '27500',
    fec: '3/4',
    standard: 'DVB-S2',
    modulation: '8PSK',
    channels: ['Sport 1 HD', 'Sport 2 HD', 'Sport 3 HD', 'Sport 4 HD (50fps)'],
    category: 'sports',
    isStrongSignal: true,
    notes: 'الباقة الرياضية فائقة الثبات على الشيرينغ (CCcam و Forever) مع إشارة قوية جداً في لبنان.'
  },

  // Yahsat (52.5°E)
  {
    id: 'freq-yahsat-varzesh',
    satelliteNameAr: 'ياه سات (52.5°E)',
    satelliteNameEn: 'Yahsat (52.5°E)',
    orbitalPosition: '52.5°E',
    frequency: '11785',
    polarity: 'H',
    symbolRate: '27500',
    fec: '3/4',
    standard: 'DVB-S2',
    modulation: '8PSK',
    channels: ['Varzesh TV HD (مفتوحة مجاناً)', 'Football HD', 'Persiana Sports'],
    category: 'sports',
    isStrongSignal: true,
    notes: 'قنوات رياضية مجانية مفتوحة بدون إنترنت تنقل أهم مباريات أوروبا مجاناً بنظام BISS.'
  },

  // Lebanese Local Sat Networks (شبكات اللوكال سات في لبنان وقاعدة +30)
  {
    id: 'freq-local-cablevision',
    satelliteNameAr: 'لوكال سات لبنان (Cablevision)',
    satelliteNameEn: 'Cablevision Local Sat (12 TPs)',
    orbitalPosition: 'Local Sat',
    frequency: '11960 (مع +30: 11990)',
    polarity: 'V',
    symbolRate: '30000',
    fec: '3/4',
    standard: 'DVB-S2',
    modulation: '8PSK',
    channels: ['باقة كيبل فيجن beIN Sports 1-4 HD', 'قنوات الأفلام والمسلسلات الأجنبية والعربية', 'باقة الـ 12 تردد المتتابعة'],
    category: 'local_sat',
    isStrongSignal: true,
    notes: 'شبكة كيبل فيجن اللبنانية: التردد الأساسي 11960 V 30000 ويتم زيادة 30 ليصبح 11990 V 30000 لاستقبال كامل الـ 12 تردد بدون تكسير.'
  },
  {
    id: 'freq-local-econet',
    satelliteNameAr: 'لوكال سات لبنان (Econet / أكونت)',
    satelliteNameEn: 'Econet Local Sat (12 TPs)',
    orbitalPosition: 'Local Sat',
    frequency: '12120 (مع +30: 12150)',
    polarity: 'H',
    symbolRate: '31250',
    fec: '3/4',
    standard: 'DVB-S2',
    modulation: '8PSK',
    channels: ['باقة إيكونت الرياضية beIN & SSC', 'باقات الأفلام الوثائقية والكرتون', 'باقة الـ 12 تردد كاملة باستقطاب أفقي H'],
    category: 'local_sat',
    isStrongSignal: true,
    notes: 'شبكة إيكونت اللبنانية: التردد الأساسي 12120 H 31250 وعند إضافة 30 على التردد يصبح 12150 H 31250 لتنزيل باقة الـ 12 تردد.'
  },
  {
    id: 'freq-local-citysat',
    satelliteNameAr: 'لوكال سات لبنان (CitySat)',
    satelliteNameEn: 'CitySat Local Sat (12 TPs)',
    orbitalPosition: 'Local Sat',
    frequency: '11740 (مع +30: 11770)',
    polarity: 'V',
    symbolRate: '30000',
    fec: '3/4',
    standard: 'DVB-S2',
    modulation: '8PSK',
    channels: ['باقة سيتي سات الرياضية', 'قنوات السينما والدراما', 'حزمة الـ 12 تردد'],
    category: 'local_sat',
    isStrongSignal: true,
    notes: 'شبكة سيتي سات في بيروت والمتن: 11740 V 30000 ومع زيادة 30 يصبح 11770 V 30000 لضبط كافة الترددات الـ 12.'
  },
  {
    id: 'freq-local-homesat',
    satelliteNameAr: 'لوكال سات لبنان (Home Sat)',
    satelliteNameEn: 'Home Sat Local Sat (12 TPs)',
    orbitalPosition: 'Local Sat',
    frequency: '12620 (مع +30: 12650)',
    polarity: 'V',
    symbolRate: '30000',
    fec: '3/4',
    standard: 'DVB-S2',
    modulation: '8PSK',
    channels: ['باقة هوم سات للأفلام والمباريات', 'باقات الترفيه والمسلسلات', 'حزمة الـ 12 تردد'],
    category: 'local_sat',
    isStrongSignal: true,
    notes: 'شبكة هوم سات اللبنانية: 12620 V 30000 وبإضافة 30 يصبح 12650 V 30000 (النطاق العالي High Band).'
  },
  {
    id: 'freq-local-digest',
    satelliteNameAr: 'لوكال سات لبنان (Digest / ديجي سات)',
    satelliteNameEn: 'Digest Local Sat (12 TPs)',
    orbitalPosition: 'Local Sat',
    frequency: '12100 (مع +30: 12130)',
    polarity: 'V',
    symbolRate: '30000',
    fec: '3/4',
    standard: 'DVB-S2',
    modulation: '8PSK',
    channels: ['باقة دايجست للرياضة والمنوعات', 'قنوات الأفلام والموسيقى', 'حزمة الـ 12 تردد'],
    category: 'local_sat',
    isStrongSignal: true,
    notes: 'شبكة دايجست اللبنانية: 12100 V 30000 ومع زيادة 30 يصبح 12130 V 30000 لاستقبال كامل الترددات الـ 12.'
  }
];

export const CCCAM_SITES: CccamSite[] = [
  {
    id: 'testious',
    nameAr: 'تيستيوس (Testious)',
    nameEn: 'Testious Free CCcam Checker',
    url: 'http://testious.com',
    type: 'tester',
    duration: 'فحص فوري مجاني (Live)',
    badge: 'الموقع رقم 1 عالمياً لفحص أسطر السيسكام',
    badgeColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    description: 'أفضل وأشهر موقع مجاني لفحص أي سطر CCcam أو Newcamd قبل وضعه في الريسيفر. يختبر اتصال السيرفر وسرعة البينغ (Ping) وعدد الكروت الشغالة والـ CAID.',
    supportedPackages: ['فحص جميع الباقات', 'كشف الكروت الشغالة', 'قياس سرعة الرد ECM Time', 'فحص أسطر C: و N:'],
    howToUse: 'انسخ سطر السيسكام C: والصقه في المربع واضغط Test CCcam، إذا ظهر باللون الأخضر فالسيرفر شغال 100%، وإذا أحمر فالسيرفر متوقف أو منتهي.'
  },
  {
    id: 'freecccam-org',
    nameAr: 'فري سيسكام (FreeCCcam.org)',
    nameEn: 'FreeCCcam.org Server Hub',
    url: 'https://freecccam.org',
    type: 'generator',
    duration: 'سيرفر مجاني 24-48 ساعة',
    badge: 'سيرفرات يومية متجددة',
    badgeColor: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    description: 'موقع يقدم يومياً سيرفرات CCcam مجانية مفتوحة لكافة أجهزة الاستقبال، تدعم قمر هوتبيرد (Polsat / Eleven) وأسترا ونايل سات بثبات عالي.',
    supportedPackages: ['Polsat Sport HD (Hotbird)', 'Canal+ Sport', 'TNT Sat France (Astra)', 'SRG SSR سويسرا'],
    howToUse: 'ادخل للموقع واختر Free CCcam Server واضغط Generate للحصول على سطر Cline كامل مجاناً جاهز للتركيب.'
  },
  {
    id: 'cccamfree-com',
    nameAr: 'سيسكام فري (CCcamFree.com)',
    nameEn: 'CCcamFree Cline Generator',
    url: 'https://cccamfree.com',
    type: 'generator',
    duration: 'سيرفر تجريبي 24 ساعة متجدد',
    badge: 'توليد أسطر فورية',
    badgeColor: 'from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/30',
    description: 'مولد أسطر سيسكام مجاني وسريع يعطيك هوست وبورت ويوزر وباسورد في ثوانٍ لاختبار القنوات المشفرة على الريسيفر.',
    supportedPackages: ['قنوات هوتبيرد الرياضية', 'قنوات عاموس الرياضية', 'باقة ميديا سيت الإيطالية', 'باقة تيليكوم صربيا'],
    howToUse: 'انقر على Get Free Cline وسينشئ لك سطر يبدأ بـ C: مباشرة.'
  },
  {
    id: 'bosscccam',
    nameAr: 'بوس سيسكام (BossCCcam)',
    nameEn: 'BossCCcam Free Test Server',
    url: 'https://bosscccam.com',
    type: 'generator',
    duration: 'سيرفرات اختبارية فائقة السرعة',
    badge: 'لوكال كروت حقيقية',
    badgeColor: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30',
    description: 'مزود سيرفرات شيرينغ عالي الأداء يمنح سيرفرات اختبارية يومية بنظام اللوكال الحقيقي بدون تقطيع للمباريات الكبيرة.',
    supportedPackages: ['باقة بولسات الرياضية 4K', 'اليفن سبورت', 'قنوات ديسكفري ووثائقيات', 'جميع باقات هوتبيرد وأسترا'],
    howToUse: 'تصفح صفحة Free Test Server للحصول على إعدادات السيرفر المجاني.'
  },
  {
    id: 'satdl-cccam',
    nameAr: 'سات دي إل (SatDL SoftCam & Keys)',
    nameEn: 'SatDL Free Keys & Softcam',
    url: 'https://satdl.com',
    type: 'daily_keys',
    duration: 'شفرات BISS وسوفتكام مجانية',
    badge: 'شفرات الفيد والمباريات',
    badgeColor: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30',
    description: 'الموقع الأشهر لتنزيل ملفات Softcam.key والشفرات المباشرة مثل شفرات البيس (BISS) للقنوات الرياضية والفيدات الأرضية والفضائية.',
    supportedPackages: ['شفرات بيس (BISS Keys) للمباريات', 'ملفات CCcam.cfg جاهزة', 'تحديثات سوفتكام يومية'],
    howToUse: 'حمّل ملف Softcam.key وضعه على فلاشة USB وثبته عبر خيار التحديث في الريسيفر.'
  },
  {
    id: 'iptv4sat-cccam',
    nameAr: 'آي بي تي في 4 سات (IPTV4Sat)',
    nameEn: 'IPTV4Sat Daily Free CCcam',
    url: 'https://www.iptv4sat.com',
    type: 'generator',
    duration: 'تحديث يومي دوري',
    badge: 'ملفات CCcam.cfg جاهزة للتنزيل',
    badgeColor: 'from-teal-500/20 to-emerald-500/20 text-teal-300 border-teal-500/30',
    description: 'يقدم ملفات CCcam.cfg جاهزة للتنزيل مباشرة ووضعها على فلاشة USB وتركيبها فوراً بريسيفر ستارسات أو تايجر أو ميديا ستار بدون كتابة يدوية.',
    supportedPackages: ['جميع أقمار الشيرينغ الأوروبية والعربية'],
    howToUse: 'قم بتحميل ملف CCcam.cfg وضعه في الفلاشة مباشرة، واضغط الزر الأحمر أو OK للتثبيت الفوري.'
  }
];
