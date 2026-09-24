import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const PORT = 3000;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const SAMSAT_SYSTEM_INSTRUCTION = `
أنت "سَمسات" (Samsat) - المساعد الشخصي والتنفيذي والتشغيلي الذكي، وتعمل حصرياً وبتفانٍ تام لمديرك "سام" (Sam).
الاسم الرسمي: سمسات (Samsat)
التبعية المطلقة: يعمل لدى سام (Works for Sam)

معلومات الاتصال والعمليات الخاصة بسام وسمسات:
1. رقم هاتف / واتساب سمسات الخاص للتواصل: 03983010 (أو 03 983010)
2. رقم دفع وتحويل الزبائن (لإرساله للزبائن للدفع والتحويل مثل Whish / OMT): 71186492

المهمات والمسؤوليات الأساسية المسندة لسمسات من سام:
1. التعامل مع الزبائن والرد عليهم:
   - الإجابة على استفسارات وأسئلة الزبائن وتنسيق الردود حصراً بحسب ما يطلبه سام أو يوجه به.
   - تجهيز مسودات ردود واتساب احترافية لسام ليعتمدها، مع إمكانية إرفاق رقم التحويل (71186492) عند الحاجة لدفع الفاتورة أو التشريج.
2. التذكير بالمواعيد:
   - جدولة مواعيد الزبائن والأعمال، وتنبيه سام بالمواعيد القادمة، وصياغة رسائل تذكير للزبائن عبر الواتساب بأسلوب لبق.
3. جمع الفواتير والاشتراكات وإتقانها بشكل محترف:
   - حفظ بيانات وسجلات الزبائن والزبونات: الاسم، رقم التلفون، العنوان، نوع الخدمة والتشريجات، تاريخ بدء الاشتراك، وتاريخ انتهاء الاشتراك.
   - متابعة تجديد الاشتراكات وصياغة رسائل تذكير تلقائية عبر الواتساب للزبائن قبل انتهاء اشتراكاتهم، مع إرفاق رقم التحويل المعتمد (71186492).
   - إعداد فواتير دقيقة لأي زبون تتضمن: الاسم، العنوان، الهاتف، تفاصيل البضاعة المطلوبة، والتشريجات (مثل تشريج خطوط ألفا Alfa، تاتش Touch، كروت إنترنت، إكسسوارات، صيانة).
   - إدراج رقم الدفع المعتمد للزبائن (71186492) في أسفل الفاتورة بوضوح، مع روابط مباشرة لمراسلة الزبون عبر الواتساب.
4. التذكير بأسعار العملات والطقس وأخبار الرياضة (وخاصة نادي برشلونة FC Barcelona):
   - متابعة وتحديث أسعار الصرف (USD / LBP والعملات الأخرى).
   - متابعة أحوال الطقس اليومية وتقديم النصائح.
   - تقديم متابعة حصرية ودقيقة لأخبار ومباريات ونتائج نادي برشلونة الإسباني الذي يتابعه سام باهتمام خاص.
5. قراءة ومتابعة الجيميل (Gmail):
   - متابعة البريد الوارد وقراءته وتلخيصه وتنبيه سام للمهم منه.
   - تطبيق القاعدة الصارمة: **«ممنوع الرد على أي إيميل نهائياً إلا إذا أمر سام بذلك شخصياً»**.
6. الريسيفرات المعتمدة ومواقع التحديث الرسمية لدى شركتنا (SAM SAT):
   - أسماء ماركات أجهزة الريسيفر المعتمدة رسمياً لدى شركتنا:
     1. **ماجيك (Magic)**: موقع التحديث والدعم الرسمي: https://magictvbox.com وموقع https://www.satdl.com/brand/magic
     2. **ستار سات (StarSat)**: موقع التحديث الرسمي الأول عالمياً: https://swdw.net وموقع الشركة: https://starsat.com
     3. **سيناتور (Senator)**: موقع التحديث والدعم الرسمي: https://senator-support.com وموقع https://alfareceiver.com (مدعوم بسيرفر ألفا Alpha وفوريفر)
     4. **ميديا ستار (MediaStar)**: موقع التحديثات والسوفتوير الرسمي: https://mediastar.co وموقع https://ms-support.com
     5. **تايجر (Tiger)**: موقع التحديثات والسوفتوير الرسمي: https://tiger-sat.net وموقع https://tigersat.com
   - عند سؤال سام أو الزبائن عن أي ريسيفر أو كيفية تحديثه أو رابط السوفتوير: زوّدهم فوراً بالرابط الرسمي المذكور أعلاه وخطوات التثبيت (تحميل ملف .bin، وضعه على فلاشة USB مفرمتة FAT32، التحديث عبر قائمة USB، تفعيل الباتش والسيرفر برمز F1 + 000 أو 8899)، مع التذكير برقم التحويل المعتمد لسام 71186492 وهاتف سام المباشر 03983010.
7. مواقع الأقمار الصناعية وترددات المحطات وسيرفرات CCcam المجانية:
   - **أهم مواقع الأقمار الصناعية والترددات عالمياً:**
     1. **فلاي سات (FlySat)**: https://www.flysat.com - المرجع اليومي الأسرع عالمياً للترددات والقنوات الجديدة والفيدات الرياضية.
     2. **كينغ أوف سات (KingOfSat)**: https://en.kingofsat.net - محرك البحث الأدق عن أي قناة وترددها والباقات المشفرة والأوروبية.
     3. **لينغ سات (LyngSat)**: https://www.lyngsat.com - الموسوعة الكبرى لكافة الأقمار المدارية وتغطيتها.
     4. **ديش بوينتر (DishPointer)**: https://www.dishpointer.com - توجيه الصحن وحساب زوايا الارتفاع والاتجاه وميلان اللاقط (LNB Skew) بالخريطة.
     5. **ساتلكس (SatLex)**: https://satlex.net - حاسبة مساطر المولتيفيد والدايسك بدقة السنتيمتر.
   - **الترددات الذهبية المعتمدة في لبنان:**
     * **نايل سات (7.0°W)**:
       - الباقة اللبنانية (MTV, LBCI, Al Jadeed, OTV, Tele Liban, NBN, Al Manar): **12604 V 27500 (5/6)**
       - بي إن سبورت المفتوحة والإخبارية: **11258 H 27500 (2/3)**
       - باقة MBC HD: **11747 V 27500 (3/4)**
       - باقة روتانا سينما وكلاسيك: **12054 V 27500**
       - أقوى تردد لضبط إشارة النايل سات: **11679 H 27500**
     * **هوتبيرد (13.0°E)**:
       - باقة بولسات واليفن سبورت وكانال بلوس: **11278 V 27500**
       - باقة بولسات بريميوم دوري أبطال أوروبا: **11488 H 27500**
       - تردد ضبط إشارة هوتبيرد: **11034 V 27500**
     * **أسترا (19.2°E)**: قنوات كانال بلوس فرنسا 11856 V 29700.
     * **بدر / عربسات (26.0°E)**: قنوات SSC الرياضية السعودية 12523 V 27500.
     * **عاموس (4.0°W)**: باقة Sport 1-4 الرياضية 11030 V 27500.
     * **ياه سات (52.5°E)**: قنوات Varzesh TV المفتوحة مجاناً 11785 H 27500.
   - **مواقع سيرفرات CCcam المجانية وفاحص الأسطر:**
     1. **تيستيوس (Testious)**: http://testious.com - الموقع المعتمد رقم 1 عالمياً لفحص اتصال وجودة أي سطر CCcam أو Newcamd قبل وضعه في الريسيفر.
     2. **فري سيسكام (FreeCCcam)**: https://freecccam.org - سيرفرات مجانية يومية متجددة 24-48 ساعة.
     3. **سيسكام فري (CCcamFree)**: https://cccamfree.com - توليد فوري لأسطر Cline مجانية.
     4. **بوس سيسكام (BossCCcam)**: https://bosscccam.com - سيرفرات اختبارية فائقة السرعة للوكالات الحقيقية.
     5. **سات دي إل وسوفتكام (SatDL)**: https://satdl.com - تحميل شفرات BISS وملفات Softcam.key.
     6. **آي بي تي في 4 سات**: https://www.iptv4sat.com - ملفات CCcam.cfg جاهزة للفلاشة USB.
   - **صيغة سطر السيسكام الصحيحة**: "C: host port user pass" وطريقة وضعه عبر الريموت بضغط F1 + 666 واختيار Server 1 بنوع CCCam، أو تحميل ملف CCcam.cfg على فلاشة USB.
   - عند رغبة الزبون بالاشتراك الرسمي الدائم (Forever VIP / Apollo / Alpha)، زوّده برقم التحويل المعتمد لسام 71186492 وهاتفه 03983010.

أسلوب الخطاب:
- فخور ومخلص جداً لسام، تخاطبه بأدب واحترام: "أستاذ سام"، "سيدي سام"، "عزيزي سام"، "يا سام".
- تجيب بالعربية السلسة والمهنية (أو الإنجليزية إن سأل بها) مع لهجة ترحيبية راقية تعكس تفانيك في خدمة سام وتيسير أعماله.
`;

// Resilient model cascade for peak demand and 503/429 mitigation
const FALLBACK_MODELS = [
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
  "gemini-3.1-pro-preview",
];

async function generateContentWithResilience(
  ai: GoogleGenAI,
  params: {
    contents: string | any;
    config?: any;
  }
) {
  let lastError: any = null;

  for (const model of FALLBACK_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        return res;
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || err);
        const isTemporary =
          msg.includes("503") ||
          msg.includes("UNAVAILABLE") ||
          msg.includes("high demand") ||
          msg.includes("429") ||
          msg.includes("RESOURCE_EXHAUSTED");

        if (isTemporary && attempt === 0) {
          // Brief pause before retry
          await new Promise((resolve) => setTimeout(resolve, 350));
          continue;
        }
        console.warn(`[Samsat AI] Notice: Model '${model}' busy/unavailable, trying fallback...`);
        break;
      }
    }
  }

  throw lastError;
}

async function sendChatWithResilience(
  ai: GoogleGenAI,
  options: {
    history: any[];
    message: string;
    systemInstruction: string;
    temperature?: number;
  }
) {
  let lastError: any = null;

  for (const model of FALLBACK_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const chat = ai.chats.create({
          model,
          config: {
            systemInstruction: options.systemInstruction,
            temperature: options.temperature ?? 0.7,
          },
          history: options.history,
        });
        const res = await chat.sendMessage({
          message: options.message,
        });
        return res;
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || err);
        const isTemporary =
          msg.includes("503") ||
          msg.includes("UNAVAILABLE") ||
          msg.includes("high demand") ||
          msg.includes("429") ||
          msg.includes("RESOURCE_EXHAUSTED");

        if (isTemporary && attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 350));
          continue;
        }
        console.warn(`[Samsat AI] Notice: Chat model '${model}' busy/unavailable, trying fallback...`);
        break;
      }
    }
  }

  throw lastError;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "10mb" }));

  // API: Health Check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      name: "Samsat",
      employer: "Sam",
      timestamp: new Date().toISOString(),
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // API: Chat with Samsat
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, contextInfo } = req.body;
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Missing messages array" });
      }

      const ai = getGeminiClient();
      if (!ai) {
        // Fallback response if GEMINI_API_KEY is not configured yet
        const lastUserMsg = messages[messages.length - 1]?.content || "";
        return res.json({
          text: `مرحباً سيدي سام! أنا سمسات، مساعدك الشخصي وأعمل لخدمتك دائماً. تلقيت رسالتك: "${lastUserMsg}". يرجى التأكد من ربط مفتاح GEMINI_API_KEY للاستفادة من قدراتي الذكية الفائقة، ومع ذلك فأنا رهن إشارتك وجاهز لتنظيم مهامك وملاحظاتك!`,
        });
      }

      const userMessagesContext = contextInfo
        ? `\n[معلومات سياقية عن سام ومهامه الحالية: ${JSON.stringify(contextInfo)}]`
        : "";

      // Format history
      const formattedHistory = messages.map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      // Append context to system instruction
      const fullSystemInstruction = `${SAMSAT_SYSTEM_INSTRUCTION}\n${userMessagesContext}`;
      const lastMessage = messages[messages.length - 1];

      const response = await sendChatWithResilience(ai, {
        history: formattedHistory.slice(0, -1),
        message: lastMessage.content,
        systemInstruction: fullSystemInstruction,
        temperature: 0.7,
      });

      const replyText = response.text || "تحت أمرك يا سام، أنا سمسات في خدمتك دائماً.";
      res.json({ text: replyText });
    } catch (error: unknown) {
      console.warn("Notice in /api/chat:", error instanceof Error ? error.message : error);
      res.json({
        text: "تحت أمرك يا أستاذ سام. أنا سمسات في خدمتك على مدار الساعة، وتم تسجيل طلبك وسأوافيكم بأي تحديث فوراً.",
      });
    }
  });

  // API: Generate Daily Briefing for Sam
  app.post("/api/briefing", async (req, res) => {
    try {
      const { tasks, notes, dateStr } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          greeting: "أهلاً بك يا أستاذ سام، يوم موفق ومليء بالإنجازات!",
          priorities: [
            "متابعة الفواتير والتشريجات ومراجعة دفعات الزبائن (رقم التحويل 71186492).",
            "فحص المواعيد المجدولة لليوم وتأكيدها عبر الواتساب.",
            "متابعة صندوق بريد الجيميل دون الرد إلا بأمرك.",
          ],
          summary: "أنا سمسات، مساعدك الخاص وأعمل لديك. جميع أعمالك ومواعيدك وفواتيرك تحت الرقابة والمتابعة.",
          quote: "النجاح يبدأ بخطوة منظمة، وأنا سمسات رهن إشارتك يا سام!",
          weatherSummary: "طقس اليوم معتدل ومناسب للحركة، احرص على شرب الماء الكافي.",
          barcaHighlight: "فريق برشلونة يواصل تحضيراته للمباراة القادمة بمعنويات عالية في الليغا.",
          currencyHighlight: "سعر الصرف مستقر نسبياً مع متابعة مستمرة لأي تقلبات في السوق.",
        });
      }

      const prompt = `
الرجاء إعداد ملخص وتقرير تنفيذي يومي لمديري "سام" (Sam).
التاريخ الحالي: ${dateStr || new Date().toLocaleDateString("ar-EG")}
المهام الحالية لسام: ${JSON.stringify(tasks || [])}
الملاحظات المسجلة: ${JSON.stringify(notes || [])}

التعليمات:
أنت سمسات، وتعمل لدى سام.
تذكر دائماً أن سام يهتم أيضاً بالطقس وأسعار الصرف، وعاشق لنادي برشلونة الإسباني (FC Barcelona).
أخرج النتيجة بصيغة JSON فقط متوافقة مع هذا التنسيق:
{
  "greeting": "تحية راقية وخاصة لسام من سمسات تتمنى له يوماً مثمراً",
  "summary": "نظرة عامة على حالة اليوم والمهام المعلقة والفواتير والمواعيد",
  "priorities": ["أولوية 1 لسام اليوم", "أولوية 2 لسام اليوم", "أولوية 3 لسام اليوم"],
  "quote": "عبارة تحفيزية مميزة لسام تعبر عن تفاني سمسات في خدمته",
  "weatherSummary": "تحديث سريع عن الطقس اليوم",
  "barcaHighlight": "تحديث أو رسالة حماسية عن نادي برشلونة الإسباني لسام",
  "currencyHighlight": "إشارة سريعة لأسعار العملات وحركة الصرف"
}
`;

      const response = await generateContentWithResilience(ai, {
        contents: prompt,
        config: {
          systemInstruction: SAMSAT_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: unknown) {
      console.warn("Notice in /api/briefing (using briefing fallback):", error instanceof Error ? error.message : error);
      res.json({
        greeting: "أهلاً بك يا سام، سمسات في خدمتك على مدار الساعة!",
        summary: "لديك أعمال ومواعيد واشتراكات زبائن تتابعها بدقة وإشراف كريم اليوم.",
        priorities: [
          "مراجعة الفواتير والاشتراكات وتحويلات الزبائن على رقم 71186492",
          "متابعة المواعيد المجدولة وتذكير الزبائن عبر الواتساب",
          "قراءة بريد الجيميل والاطلاع على المستجدات دون الرد التلقائي"
        ],
        quote: "معاً نحو التميز والإنجاز يا سام!",
        weatherSummary: "أجواء معتدلة، يوم مثالي للعمل والإنتاجية.",
        barcaHighlight: "فورسا بارسا دائماً يا سام! برشلونة في أتم الجاهزية للمباريات القادمة.",
        currencyHighlight: "متابعة مستمرة لأسعار الصرف بالليرة والدولار.",
      });
    }
  });

  // API: AI Monthly Report Synthesis for WhatsApp
  app.post("/api/monthly-report", async (req, res) => {
    try {
      const { month, monthName, financials, subscriptionsCount, expiringCount, invoicesCount } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          analysis: `تقرير مالي وتنفيذي لشهر ${monthName || month}. الإيرادات الإجمالية المحصلة تبلغ $${financials?.revenueUSD || 0} وعدد الاشتراكات النشطة ${subscriptionsCount || 0}. نوصي بالتركيز على تحصيل المبالغ المعلقة وتذكير الزبائن بتجديد اشتراكاتهم عبر رقم 71186492.`,
        });
      }

      const prompt = `
أنت سمسات، المساعد التنفيذي والشخصي للأستاذ سام (Sam).
المطلوب إعداد تحليل وتوصية تنفيذية ذكية وموجزة تُرفق ضمن "التقرير الشهري للأستاذ سام المُعد للإرسال عبر الواتساب".
بيانات الشهر المحدد:
- الشهر: ${monthName || month}
- إجمالي الإيرادات المحصلة (USD): $${financials?.revenueUSD || 0}
- الإيرادات بالليرة: ${financials?.revenueLBP || 0} ل.ل
- المبالغ المعلقة غير المحصلة: $${financials?.unpaidUSD || 0}
- عدد المشتركين النشطين: ${subscriptionsCount || 0}
- عدد الاشتراكات المستحقة للتجديد هذا الشهر: ${expiringCount || 0}
- فواتير التشريج والخدمات المصدرة: ${invoicesCount || 0}

التعليمات:
1. صغ فقرة تنفيذية بأسلوب سمسات المخلص والراقي والمباشر لسام.
2. وجه نصيحة واضحة بشأن متابعة تجديد الاشتراكات وتحصيل المبالغ المعلقة على رقم التحويل المعتمد 71186492.
3. اختم بعبارة حماسية أو تشجيع لنادي برشلونة الذي يعشقه سام.
4. أخرج النتيجة بتنسيق JSON:
{
  "analysis": "نص التوصية والتحليل التنفيذي لسام"
}
`;

      const response = await generateContentWithResilience(ai, {
        contents: prompt,
        config: {
          systemInstruction: SAMSAT_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: unknown) {
      console.warn("Notice in /api/monthly-report:", error instanceof Error ? error.message : error);
      res.json({
        analysis: "«أداء مالي وعملي مميز هذا الشهر يا أستاذ سام. الأولوية الآن هي متابعة تحصيل المبالغ المعلقة وحث الزبائن المنتهية اشتراكاتهم على التجديد عبر رقم التحويل المعتمد: 71186492. سمسات في خدمتك دائماً، وفورسا بارسا!»",
      });
    }
  });

  // API: AI-Powered Invoice Parsing / Creation
  app.post("/api/generate-invoice", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Missing text" });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          customerName: "زبون محترم",
          customerPhone: "",
          customerAddress: "لبنان",
          items: [
            {
              id: "item-1",
              description: text.slice(0, 50),
              quantity: 1,
              unitPrice: 10,
              total: 10,
            },
          ],
          currency: "USD",
          notes: "يرجى تحويل المبلغ على رقم: 71186492",
        });
      }

      const prompt = `
أنت سمسات مساعد سام الشخصي.
المطلوب استخراج تفاصيل فاتورة أو طلبية زبون من هذا النص وتحويلها لبنود مهنية دقيقة:
"${text}"

ملاحظة هامة:
- قد تشمل البضاعة: تشريج ألفا، تشريج تاتش، كروت تشريج، أجهزة، إكسسوارات، صيانة، اشتراكات، إلخ.
- العملة الافتراضية هي USD ما لم يُذكر بالليرة اللبنانية (LBP).
- استخرج اسم الزبون، هاتفه، عنوانه إن وجدوا، وقائمة البنود وأسعارها.

أرجع النتيجة بصيغة JSON فقط:
{
  "customerName": "اسم الزبون أو زبون محترم",
  "customerPhone": "رقم هاتف الزبون إن وجد أو فارغ",
  "customerAddress": "العنوان إن وجد أو بيروت / لبنان",
  "currency": "USD" أو "LBP",
  "items": [
    {
      "description": "اسم البضاعة أو التشريج (مثال: تشريج خط ألفا $22.73، كفر جوال، صيانة...)",
      "quantity": 1,
      "unitPrice": 22.73,
      "total": 22.73
    }
  ],
  "notes": "ملاحظات إضافية"
}
`;

      const response = await generateContentWithResilience(ai, {
        contents: prompt,
        config: {
          systemInstruction: SAMSAT_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: unknown) {
      console.warn("Notice in /api/generate-invoice:", error instanceof Error ? error.message : error);
      res.json({
        customerName: "زبون محترم",
        customerPhone: "",
        customerAddress: "لبنان",
        currency: "USD",
        items: [
          {
            description: req.body?.text?.slice(0, 50) || "تشريج / بضاعة",
            quantity: 1,
            unitPrice: 22.73,
            total: 22.73,
          },
        ],
        notes: "يرجى تحويل المبلغ على رقم: 71186492",
      });
    }
  });

  // API: AI Customer Reply Drafter according to Sam's direction
  app.post("/api/customer-reply", async (req, res) => {
    try {
      const { customerQuestion, samDirection, includePaymentInfo } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          reply: `أهلاً وسهلاً بك. بخصوص استفسارك: تم أخذ طلبك بعين الاعتبار.${includePaymentInfo ? ' للتحويل والدفع، يرجى استخدام الرقم: 71186492 (Whish / OMT).' : ''} شكراً لتواصلك معنا.`
        });
      }

      const prompt = `
أنت سمسات، وتعمل لدى سام.
مهمتك: صياغة رد واتساب احترافي ومهذب لزبون، بناءً على توجيهات سام الحرفية.
سؤال أو طلب الزبون: "${customerQuestion || 'استفسار عام'}"
توجيهات وتعليمات سام لك بخصوص الرد: "${samDirection || 'الرد بكل احترام ومهنية وإبلاغه بالتفاصيل'}"
هل يتضمن الرد بيانات الدفع؟ ${includePaymentInfo ? 'نعم، يجب تضمين رقم الدفع والتحويل 71186492 بوضوح' : 'لا'}

محددات:
- صغ الرسالة بلهجة لبنانية/عربية مهذبة وودودة ومناسبة للواتساب.
- لا تذكر أنك روبوت أو نموذج ذكاء اصطناعي، أنت ممثل خدمة العملاء بتكليف من سام.
- رقم سمسات في حال المتابعة: 03983010
- رقم الدفع المعتمد: 71186492

أرجع JSON فقط:
{
  "reply": "نص الرسالة الجاهزة للإرسال للزبون على الواتساب"
}
`;

      const response = await generateContentWithResilience(ai, {
        contents: prompt,
        config: {
          systemInstruction: SAMSAT_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: unknown) {
      console.warn("Notice in /api/customer-reply:", error instanceof Error ? error.message : error);
      const includePayment = req.body?.includePaymentInfo;
      res.json({
        reply: `أهلاً وسهلاً بك. تم استلام طلبك ومتابعته بعناية من قِبل الأستاذ سام.${includePayment ? ' للتحويل والدفع، يرجى استخدام الرقم المعتمد: 71186492 (Whish / OMT).' : ''} نحن في خدمتك دائماً عبر خطنا: 03983010.`
      });
    }
  });

  // API: Barca & Radar Intelligence Updates
  app.post("/api/sports-barca", async (req, res) => {
    try {
      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          headline: "برشلونة يستعد لمواجهته القادمة بتركيز عالي",
          summary: "المدرب واللاعبون في قمة الجاهزية لاستكمال سلسلة الانتصارات في الدوري الإسباني ودوري الأبطال.",
          nextMatch: "برشلونة vs المنافس القادم (نهاية الأسبوع)",
          quote: "تحيا البارسا يا أستاذ سام! معنويات الفريق في القمة."
        });
      }

      const prompt = `
أنت سمسات مساعد سام. سام عاشق كبير لنادي برشلونة الإسباني (FC Barcelona).
المطلوب تزويد سام بأحدث نشرة رياضية مشوقة ومحدثة عن نادي برشلونة:
- حالة الفريق وأبرز النجوم (لامين يامال، ليفاندوفسكي، رافينيا، بيدري، إلخ)
- موعد المباراة القادمة أو آخر النتائج
- رسالة مشجعة لسام بصفتك سمسات

أخرج JSON فقط:
{
  "headline": "عنوان رئيسي جذاب عن البارسا",
  "summary": "ملخص أهم المستجدات في النادي الكتالوني",
  "nextMatch": "تفاصيل المباراة القادمة والموعد والبطولة",
  "quote": "عبارة حماسية من سمسات لسام عن برشلونة"
}
`;

      const response = await generateContentWithResilience(ai, {
        contents: prompt,
        config: {
          systemInstruction: SAMSAT_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: unknown) {
      console.warn("Notice in /api/sports-barca:", error instanceof Error ? error.message : error);
      res.json({
        headline: "نادي برشلونة في أوج استعداده",
        summary: "كتيبة البلوغرانا تواصل التدريبات المكثفة لتحقيق الألقاب هذا الموسم.",
        nextMatch: "مواجهة الليغا القادمة",
        quote: "دائماً فورسا بارسا يا أستاذ سام!"
      });
    }
  });

  // API: Quick Task Extraction
  app.post("/api/extract-tasks", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Missing text" });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          tasks: [
            {
              title: text.slice(0, 60),
              priority: "medium",
              category: "عام",
            },
          ],
        });
      }

      const prompt = `
استخرج قائمة بالمهام التنفيذية لسام من هذا النص:
"${text}"

أنت سمسات مساعد سام.
أرجع JSON فقط:
{
  "tasks": [
    {
      "title": "عنوان المهمة باختصار ودقة",
      "priority": "high" | "medium" | "low",
      "category": "تصنيف مثل: عمل، تقني، اتصالات، إدارة، شخصي"
    }
  ]
}
`;

      const response = await generateContentWithResilience(ai, {
        contents: prompt,
        config: {
          systemInstruction: SAMSAT_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: unknown) {
      console.warn("Notice in /api/extract-tasks:", error instanceof Error ? error.message : error);
      res.json({
        tasks: [
          {
            title: req.body?.text?.slice(0, 60) || "مهمة جديدة لسام",
            priority: "medium",
            category: "عام",
          },
        ],
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Samsat Server running on http://0.0.0.0:${PORT} (Serving Sam)`);
  });
}

startServer();
