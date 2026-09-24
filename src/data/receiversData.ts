import { ApprovedReceiver, CustomerDeviceRecord } from '../types';

export const APPROVED_RECEIVERS: ApprovedReceiver[] = [
  {
    id: 'rec-magic',
    brandKey: 'magic',
    nameAr: 'ماجيك',
    nameEn: 'Magic',
    badge: 'سريع • مستقر • اقتصادي',
    badgeColor: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30',
    description: 'أجهزة ماجيك (Magic Box) المعتمدة من شركة SAM SAT، تمتاز بالسرعة والاستقرار الممتاز وخيارات الميني المخفية ودعم تطبيقات البث وسيرفرات الشيرينغ الحديثة.',
    officialUpdateUrl: 'https://magictvbox.com',
    backupUpdateUrl: 'https://www.satdl.com/brand/magic',
    officialWebsiteUrl: 'https://magictvbox.com',
    channelListUrl: 'https://www.satdl.com/brand/magic',
    serverSupportUrl: 'https://magictvbox.com/support',
    defaultServers: ['Apollo IPTV', 'Magic Pro VIP', 'Forever SE / Funcam', 'Nashare'],
    serverActivationCode: 'F1 + 000 أو رمز 8899 لتفعيل الباتش والشيرينغ',
    topModels: [
      {
        model: 'Magic T50 Full HD',
        resolution: 'Full HD 1080p',
        server: 'سيرفر فوريفر + واي فاي مدمج',
        specs: 'جهاز ميني أنيق، يدعم قنوات بي إن والصوتيات الرياضية بدقة ممتازة.',
      },
      {
        model: 'Magic 9000 4K Ultra',
        resolution: '4K Ultra HD',
        server: 'سيرفر فوريفر برو + اشتراك ماجيك IPTV',
        specs: 'معالج سريع رباعي النواة، وضوح فائق 4K مع تيليبورت USB مزدوج.',
      },
      {
        model: 'Magic TV Box Android 4K',
        resolution: 'Android 4K',
        server: 'نظام أندرويد + متجر Google Play',
        specs: 'يدعم جميع تطبيقات البث (YouTube, Netflix, Shahid, IPTV) ورام 2GB/4GB.',
      },
      {
        model: 'Magic Mini T-Series',
        resolution: 'Full HD 1080p',
        server: 'Funcam / Nashare',
        specs: 'جهاز استقبال ميني يختفي كلياً خلف التلفاز مع عدسة ريموت خارجية.',
      }
    ],
    updateMethodSteps: [
      'قم بتنزيل ملف السوفتوير الرسمي الأخير بامتداد (.bin) من موقع الدعم الرسمي.',
      'احرص على فك الضغط عن الملف إذا كان بصيغة (.rar أو .zip) ونقله مباشرة إلى فلاشة USB مفرمتة بنظام FAT32.',
      'أدخل الفلاشة في مدخل USB بالريسيفر، ثم اضغط على زر القائمة (Menu) في الريموت.',
      'توجه إلى قسم التحديث (USB / Upgrade) وحدد ملف السوفتوير واضغط على زر (OK).',
      'انتظر حتى يكتمل شريط التحديث إلى 100% ويقوم الجهاز بإعادة التشغيل تلقائياً (تحذير: لا تفصل الكهرباء نهائياً أثناء التحديث).',
      'بعد الإقلاع، اضغط F1 + 000 أو 8899 لتفعيل الباتش، ثم أعد ربط شبكة الواي فاي لتشغيل السيرفر.'
    ],
    keyFeatures: [
      'واجهة مستخدم عربية سهلة وسريعة الاستجابة',
      'حجم مدمج مناسب للشاشات الجدارية',
      'دعم كامل لشبكات الواي فاي والإنترنت',
      'تشغيل الصوتيات والقنوات المشفرة باستقرار عالي'
    ],
    tipsForSam: 'أجهزة ماجيك مناسبة جداً للزبائن الذين يطلبون جهاز ميني خفيف وسهل الاستخدام بسعر اقتصادي ممتاز مع أداء ثابت.',
    isPopularInLebanon: true,
  },
  {
    id: 'rec-starsat',
    brandKey: 'starsat',
    nameAr: 'ستار سات',
    nameEn: 'StarSat',
    badge: 'الأوسع انتشاراً • سيرفر فوريفر VIP • دعم دولي',
    badgeColor: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    description: 'الماركة العملاقة والرائدة في الشرق الأوسط وشمال أفريقيا، مدعومة رسمياً من سيرفر Forever العالمي، وتحديثاتها البرمجية متواصلة ودورية.',
    officialUpdateUrl: 'https://swdw.net',
    backupUpdateUrl: 'https://satdl.com/brand/starsat',
    officialWebsiteUrl: 'https://starsat.com',
    channelListUrl: 'https://swdw.net',
    serverSupportUrl: 'https://tpsup.com',
    defaultServers: ['Forever VIP / Forever Pro', 'Apollo 5 IPTV', 'Funcam 135', 'G-Share'],
    serverActivationCode: 'F1 + 000 لتفعيل الباتش، ثم F1 + 111 لاختيار Enable Internet، ثم F1 + 666 لضبط السيرفر',
    topModels: [
      {
        model: 'StarSat SR-200HD 4K Extreme',
        resolution: '4K Ultra HD',
        server: 'سيرفر Forever VIP (15 شهر) + Apollo',
        specs: 'الجهاز الملكي لستارسات، تيونر فائق الحساسية Multistream، دقة حقيقية 4K 60fps.',
      },
      {
        model: 'StarSat SR-T30 Pro Extreme',
        resolution: 'Full HD 1080p',
        server: 'Forever 140 + Apollo IPTV',
        specs: 'الأكثر مبيعاً وطلباً، ثبات أسطوري في الشيرينغ والصوتيات التايم شفت.',
      },
      {
        model: 'StarSat SR-90000HD Extreme',
        resolution: 'Full HD / Dongle',
        server: 'تيونر ثنائي + شيرينغ فضائي ودونجل وفوريفر',
        specs: 'مناسب للأماكن التي تفتقر لإنترنت سريع بفضل الدونجل الفضائي W6 / Yahsat.',
      },
      {
        model: 'StarSat SR-7060 / 4080 HD',
        resolution: 'Full HD 1080p',
        server: 'Funcam Server + Apollo',
        specs: 'جهاز استقبال ميني عملي جداً وداعم لخدمات الشيرينغ الأساسية.',
      }
    ],
    updateMethodSteps: [
      'الدخول إلى موقع التحديثات الرسمي الأول لستارسات عالمياً: (swdw.net).',
      'البحث عن موديل الريسيفر الدقيق (مثال: SR-200HD Extreme) وتحميل أحدث سوفتوير مطروح.',
      'فك الضغط عن الملف ووضع ملف السوفتوير بصيغة (.bin) داخل فلاشة USB.',
      'توصيل الفلاشة بالرسيفر والدخول إلى: Menu > USB > ثم اختيار الملف والضغط على OK.',
      'تظهر رسالة (Do you want to update software/database?) اختر نعم (Yes).',
      'انتظر إعادة التشغيل التلقائية، ثم اضغط على زر F1 + 000 لتفعيل الباتش، ثم F1 + 666 واضغط زر رقم 3 للتحميل التلقائي للسيرفر.'
    ],
    keyFeatures: [
      'دعم كامل لسيرفر Forever VIP وتشغيل القنوات الرياضية العالمية',
      'تايم شفت وصوتيات BeIN Sports مع مزامنة سريعة',
      'مكتبة تحديثات رسمية أسبوعية وشهرية عبر موقع swdw.net',
      'قنوات وموجات الملتستريم الأرضية (Multistream)'
    ],
    tipsForSam: 'ستارسات هو الخيار الأول لزبائن مباريات كرة القدم ومتابعي الدوريات العالمية ونادي برشلونة نظراً لقوة سيرفر Forever وصوتياته الدقيقة.',
    isPopularInLebanon: true,
  },
  {
    id: 'rec-senator',
    brandKey: 'senator',
    nameAr: 'سيناتور',
    nameEn: 'Senator',
    badge: 'سيرفر ألفا Alpha • أداء قوي • فوريفر',
    badgeColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    description: 'أجهزة سيناتور الحديثة المشهورة بقوتها الفائقة واحتوائها على سيرفر ألفا (Alpha IPTV) الحصري، بالإضافة إلى سيرفرات فوريفر وتحديثاتها الأونلاين السريعة.',
    officialUpdateUrl: 'https://senator-support.com',
    backupUpdateUrl: 'https://satdl.com/brand/senator',
    officialWebsiteUrl: 'https://alfareceiver.com',
    channelListUrl: 'https://senator-support.com',
    serverSupportUrl: 'https://senator-support.com',
    defaultServers: ['Alpha IPTV (سيرفر ألفا الحصري)', 'Forever Pro', 'MI-Share', 'Nashare Pro'],
    serverActivationCode: 'الدخول إلى Menu > الضبط > إعدادات السيرفر أو الضغط على F1 + 111 / 8899',
    topModels: [
      {
        model: 'Senator Octapad 4K Android',
        resolution: 'Android 4K Ultra HD',
        server: 'Forever Pro + Alpha IPTV',
        specs: 'جهاز أندرويد متكامل بمواصفات جبارة يدعم التطبيقات والشيرينغ بآن واحد.',
      },
      {
        model: 'Senator Captain 4K',
        resolution: '4K Ultra HD',
        server: 'سيرفر ألفا لمدة سنتين + فوريفر',
        specs: 'كابتن أجهزة الستالايت، تيونر فائق الحساسية، نظام صوتي دولبي متطور.',
      },
      {
        model: 'Senator A10 / S3040',
        resolution: 'Full HD 1080p',
        server: 'Forever SE + Alpha VIP',
        specs: 'جهاز ميني عالي الاستقرار، مفضل في السوق العربي لسرعته في فتح القنوات.',
      },
      {
        model: 'Senator Platinum Prime',
        resolution: 'Full HD 1080p',
        server: 'MI Share + سيرفر ألفا',
        specs: 'ريموت بلوتوث + ريموت عادي، يدعم التحديث الهوائي المباشر (Online Update).',
      }
    ],
    updateMethodSteps: [
      'التحديث الأونلاين المباشر: Menu > Network Apps > Update Online أو الترقية عبر الإنترنت بدون فلاشة.',
      'التحديث عبر الفلاشة: تحميل السوفتوير من موقع (senator-support.com) بصيغة .bin.',
      'توصيل فلاشة USB بالريسيفر، والذهاب إلى Menu > الضبط > تحديث البرنامج (USB Upgrade).',
      'اختيار ملف السوفتوير والضغط على OK للموافقة.',
      'الانتظار حتى يعيد الجهاز التشغيل، ثم الدخول لتطبيقات الشبكة وتفعيل كود سيرفر ألفا أو فوريفر.'
    ],
    keyFeatures: [
      'سيرفر ألفا (Alpha IPTV) المعروف بثباته الهائل في أوقات الذروة والمباريات',
      'ريموت بلوتوث متطور يعمل من أي زاوية دون الحاجة لتوجيهه للرسيفر',
      'دعم التحديثات التلقائية المباشرة عبر الإنترنت (Online Update)',
      'صوتيات تايم شفت مدمجة جاهزة'
    ],
    tipsForSam: 'زبائن سيناتور يعشقون سيرفر ألفا لجودته العالية في البث المباشر للأفلام والمباريات، وميزة ريموت البلوتوث تعطي راحة تامة للزبون.',
    isPopularInLebanon: true,
  },
  {
    id: 'rec-mediastar',
    brandKey: 'mediastar',
    nameAr: 'ميديا ستار',
    nameEn: 'MediaStar',
    badge: 'دقة تصنيع خيالية • Forever Pro VIP • جودة 4K',
    badgeColor: 'from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/30',
    description: 'شركة ميديا ستار (MediaStar) العالمية معروفة بصناعتها الفاخرة، معالجاتها المتطورة وتوافقها التام مع سيرفرات فوريفر برو وأبولو وتحديثاتها المنتظمة والموثوقة.',
    officialUpdateUrl: 'https://mediastar.co',
    backupUpdateUrl: 'https://satdl.com/brand/mediastar',
    officialWebsiteUrl: 'https://mediastar.co',
    channelListUrl: 'https://ms-support.com',
    serverSupportUrl: 'https://mediastar.co/support',
    defaultServers: ['Forever Pro VIP', 'Forever 143', 'Apollo IPTV (سنتين)', 'M-Share'],
    serverActivationCode: 'الوقوف على أي قناة ثم F1 + 000 (تفعيل الباتش) ثم F1 + 111 (Enable Internet) ثم F1 + 666',
    topModels: [
      {
        model: 'MediaStar MS-Diamond Z2 4K',
        resolution: 'Android 4K Ultra HD',
        server: 'Forever Pro VIP + Apollo IPTV',
        specs: 'من أقوى أجهزة الستالايت والأندرويد في العالم، تيونر ثنائي، شاشة VFD، رامات ضخمة.',
      },
      {
        model: 'MediaStar Zenon 4K',
        resolution: 'Android 4K Ultra HD',
        server: 'Forever Pro + سيرفر أبولو',
        specs: 'جهاز 4K متكامل يدعم تشغيل أحدث الشاشات OLED و QLED بدقة خيالية.',
      },
      {
        model: 'MediaStar MS-Mini 2727 Forever',
        resolution: 'Full HD 1080p',
        server: 'سيرفر فوريفر 15 شهر + أبولو',
        specs: 'جهاز ميني عالي المتانة، هيكل معدني ممتاز لتبريد أفضل أثناء الاستخدام الطويل.',
      },
      {
        model: 'MediaStar MS-Titanium 15000',
        resolution: 'Full HD Multistream',
        server: 'Forever Server + IPTV',
        specs: 'جهاز كلاسيكي كبير الحجم ومجهز بشاشة تحكم كاملة ومنافذ توصيل متعددة.',
      }
    ],
    updateMethodSteps: [
      'الدخول إلى البوابة الرسمية: (mediastar.co) أو (ms-support.com).',
      'اختيار الموديل وتحميل السوفتوير الأحدث بصيغة .bin.',
      'وضع السوفتوير على فلاشة USB مفروغة ومفرمتة بصيغة FAT32.',
      'توصيل الفلاشة بالرسيفر ثم الدخول إلى: Menu > Expansion > USB Menu.',
      'تحديد ملف السوفتوير والضغط على OK ثم الموافقة على التحميل.',
      'بعد إعادة تشغيل الجهاز، الضغط على F1 + 000 لتفعيل الباتش، ثم F1 + 111 واختيار Enable Internet.'
    ],
    keyFeatures: [
      'جودة خامات وتبريد عالي يضمن عمر افتراضي أطول للجهاز',
      'توافق استثنائي مع شاشات 4K الحديثة وتقنيات HDR10 و Dolby',
      'تحديثات مستمرة وملفات قنوات مرتبة بشكل ممتاز للدول العربية',
      'دعم كامل لجميع تقنيات التشفير الحديثة'
    ],
    tipsForSam: 'ميديا ستار هو الجهاز المفضل للزبائن الباحثين عن أعلى نقاء للصورة وجودة صناعة وتبريد، خاصة موديلات Diamond و Zenon و Mini 2727.',
    isPopularInLebanon: true,
  },
  {
    id: 'rec-tiger',
    brandKey: 'tiger',
    nameAr: 'تايجر',
    nameEn: 'Tiger',
    badge: 'تاريخ عريق • دعم فني دائم • سيرفرات متعددة',
    badgeColor: 'from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30',
    description: 'أجهزة تايجر (Tiger Sat) الشهيرة بعراقتها وجودتها عبر عقود، تتميز بموقع تحديثات مباشر وشامل (tiger-sat.net) وموديلات متنوعة تناسب كافة المتطلبات.',
    officialUpdateUrl: 'https://tiger-sat.net',
    backupUpdateUrl: 'https://satdl.com/brand/tiger',
    officialWebsiteUrl: 'https://tigersat.com',
    channelListUrl: 'https://tiger-sat.net',
    serverSupportUrl: 'https://tiger-sat.net/downloads',
    defaultServers: ['Forever Pro VIP', 'Apollo IPTV', 'Tiger IPTV', 'Top Ten Cinema', 'Cobra'],
    serverActivationCode: 'F1 + 000 لتفعيل الباتش أو إدخال الكود 8899 أو الدخول لقائمة Tiger Server',
    topModels: [
      {
        model: 'Tiger T3000 Mega 4K Android',
        resolution: 'Android 4K Ultra HD',
        server: 'سيرفر فوريفر برو VIP + سيرفرات تايجر الترفيهية',
        specs: 'جهاز أندرويد خارق المواصفات، دقة 4K حقيقية، دعم فك تشفير القنوات الرياضية.',
      },
      {
        model: 'Tiger T8 High Class',
        resolution: 'Full HD 1080p',
        server: 'سيرفر فوريفر + أبولو',
        specs: 'الجهاز الكلاسيكي الأكثر شهرة، ثبات جبار، ذاكرة قنوات تتسع لآلاف المحطات.',
      },
      {
        model: 'Tiger Forever Ultimate',
        resolution: 'Full HD 1080p',
        server: 'Forever 140 + صوتيات بي إن',
        specs: 'مخصص للمتابعين الرياضيين مع خاصية الصوتيات الرياضية التايم شفت السريعة.',
      },
      {
        model: 'Tiger Z400 Pro / Tiger One',
        resolution: 'Full HD Mini',
        server: 'سيرفرات IPTV متعددة (Cobra, Top Ten)',
        specs: 'جهاز استقبال ميني سريع وخفيف يدعم مكتبات ضخمة من الأفلام والمسلسلات.',
      }
    ],
    updateMethodSteps: [
      'الدخول إلى الموقع الرسمي لتحديثات تايجر المعتمد: (tiger-sat.net).',
      'اختيار فئة الموديل (T-Series أو Z-Series أو موديلات 4K) وتنزيل السوفتوير الحديث.',
      'نقل الملف بعد فك الضغط عنه بصيغة .bin إلى فلاشة USB.',
      'توصيل الفلاشة بريسيفر تايجر والدخول إلى: Menu > Upgrade > USB Upgrade.',
      'اختيار ملف السوفتوير والضغط على زر OK للبدء في التحديث.',
      'الانتظار حتى يعيد الجهاز تشغيل نفسه ثم تفعيل الباتش بالضغط على F1 + 000.'
    ],
    keyFeatures: [
      'الموقع الرسمي (tiger-sat.net) دائم التحديث وموثوق منذ سنوات طويلة',
      'حزم اشتراكات ترفيهية غنية تشمل الأفلام والمسلسلات والرياضة',
      'توافق كبير مع كروت التشريج وسيرفرات الشيرينغ الدولية',
      'قطع غيار وريموتات متوفرة بسهولة في كافة الأسواق والمحلات'
    ],
    tipsForSam: 'تايجر من أسهل الأجهزة صيانة وتوفراً لقطع الغيار والريموتات، وتحديثاته عبر tiger-sat.net تعتبر من الأسهل تنزيلاً للزبائن.',
    isPopularInLebanon: true,
  }
];

// Initial default registered customer receiver devices
export const INITIAL_CUSTOMER_DEVICES: CustomerDeviceRecord[] = [
  {
    id: 'dev-1',
    customerName: 'فادي نجم',
    customerPhone: '70891234',
    brand: 'starsat',
    model: 'StarSat SR-200HD 4K Extreme',
    serverType: 'Forever VIP',
    serverExpireDate: '2025-11-20',
    lastUpdatedDate: '2025-02-15',
    notes: 'تم تحديث السوفتوير v2.94 وتفعيل الصوتيات الرياضية والمزامنة بنجاح.',
  },
  {
    id: 'dev-2',
    customerName: 'زياد كرم',
    customerPhone: '71123456',
    brand: 'mediastar',
    model: 'MediaStar MS-Diamond Z2 4K',
    serverType: 'Forever Pro VIP',
    serverExpireDate: '2025-09-10',
    lastUpdatedDate: '2025-01-28',
    notes: 'جهاز أندرويد مركب في الصالون، يحتاج ملف قنوات نايل سات وهوتبيرد حديث.',
  },
  {
    id: 'dev-3',
    customerName: 'طارق عبد الله',
    customerPhone: '03456789',
    brand: 'magic',
    model: 'Magic T50 Full HD',
    serverType: 'Apollo IPTV',
    serverExpireDate: '2025-06-30',
    lastUpdatedDate: '2025-02-10',
    notes: 'تم تزويده برابط التحديث الرسمي وتفعيل الواي فاي.',
  },
  {
    id: 'dev-4',
    customerName: 'مؤسسة الأفق',
    customerPhone: '03765432',
    brand: 'tiger',
    model: 'Tiger T3000 Mega 4K',
    serverType: 'Tiger IPTV + Forever',
    serverExpireDate: '2025-12-31',
    lastUpdatedDate: '2025-02-01',
    notes: 'جهاز صالة الاستقبال - مشبوك مع شاشة 75 بوصة.',
  },
  {
    id: 'dev-5',
    customerName: 'عمر المصري',
    customerPhone: '76112233',
    brand: 'senator',
    model: 'Senator Octapad 4K',
    serverType: 'Alpha IPTV + Forever',
    serverExpireDate: '2025-10-15',
    lastUpdatedDate: '2025-02-18',
    notes: 'تم تثبيت ريموت البلوتوث وتفعيل اشتراك ألفا لعامين.',
  }
];
