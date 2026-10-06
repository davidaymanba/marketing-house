/**
 * Seed content — mirrors supabase/seed.sql. Used as the fallback data source
 * when Supabase isn't configured (local dev / first deploy).
 * Projects, testimonials, clients and team are PLACEHOLDERS (isPlaceholder: true).
 */
import type {
  Branch,
  Client,
  Project,
  ProjectCategory,
  Service,
  SiteSettings,
  TeamMember,
  Testimonial,
} from "./types";

const sharedProcess = [
  { title: { ar: "اكتشاف", en: "Discover" }, text: { ar: "نفهم البيزنس والسوق والجمهور قبل أي خطوة.", en: "We learn your business, market and audience before anything else." } },
  { title: { ar: "تخطيط", en: "Plan" }, text: { ar: "نحوّل اللي فهمناه لاستراتيجية واضحة بأهداف قابلة للقياس.", en: "We turn insight into a clear strategy with measurable goals." } },
  { title: { ar: "تنفيذ", en: "Create" }, text: { ar: "فريقنا ينفذ بجودة عالية وفي المواعيد المتفق عليها.", en: "Our team executes with craft, on schedule." } },
  { title: { ar: "قياس وتطوير", en: "Measure & grow" }, text: { ar: "نتابع الأرقام ونحسّن باستمرار عشان النتيجة تكبر.", en: "We track the numbers and keep optimising so results compound." } },
];

export const seedServices: Service[] = [
  {
    id: "svc-branding",
    slug: "branding",
    icon: "palette",
    hue: 268,
    cover: null,
    title: { ar: "البراندنج والهوية البصرية", en: "Branding & Visual Identity" },
    short: { ar: "هوية بصرية متكاملة تخلي البراند بتاعك يتشاف ويتفتكر.", en: "A complete identity that makes your brand seen and remembered." },
    description: {
      ar: "من اسم البراند والشعار لحد دليل الهوية الكامل — بنبني شخصية بصرية متسقة تعبر عنك وتفرقك عن المنافسين في كل نقطة تواصل.",
      en: "From naming and logo to a full brand book — we build a consistent visual personality that expresses who you are and sets you apart at every touchpoint.",
    },
    tags: [
      { ar: "لوجو", en: "Logo" },
      { ar: "دليل الهوية", en: "Brand book" },
      { ar: "تغليف", en: "Packaging" },
    ],
    deliverables: [
      { title: { ar: "تصميم الشعار", en: "Logo design" }, text: { ar: "شعار أساسي ونسخ بديلة لكل الاستخدامات.", en: "Primary mark plus variations for every use." } },
      { title: { ar: "دليل الهوية", en: "Brand guidelines" }, text: { ar: "ألوان وخطوط وقواعد استخدام واضحة.", en: "Colours, type and clear usage rules." } },
      { title: { ar: "المطبوعات", en: "Stationery" }, text: { ar: "كروت شخصية وأوراق رسمية وملفات تعريفية.", en: "Business cards, letterheads and profiles." } },
      { title: { ar: "التغليف", en: "Packaging" }, text: { ar: "تغليف يبيع المنتج من على الرف.", en: "Packaging that sells from the shelf." } },
    ],
    process: sharedProcess,
    faqs: [
      { q: { ar: "المشروع بياخد وقت قد إيه؟", en: "How long does a branding project take?" }, a: { ar: "غالباً من ٣ لـ ٦ أسابيع حسب حجم الهوية والمراجعات.", en: "Usually 3–6 weeks depending on scope and revisions." } },
      { q: { ar: "هستلم الملفات المفتوحة؟", en: "Do I get the source files?" }, a: { ar: "أيوه، بتستلم كل الملفات المفتوحة وبكل الصيغ.", en: "Yes — you receive every source file in all formats." } },
      { q: { ar: "ممكن تطوروا هوية موجودة؟", en: "Can you refresh an existing identity?" }, a: { ar: "أكيد، بنعمل Rebranding كامل أو تحديث خفيف حسب احتياجك.", en: "Absolutely — from a light refresh to a full rebrand." } },
    ],
  },
  {
    id: "svc-social",
    slug: "social-media",
    icon: "share",
    hue: 282,
    cover: null,
    title: { ar: "إدارة السوشيال ميديا", en: "Social Media Management" },
    short: { ar: "حضور يومي مدروس يبني مجتمع حوالين البراند بتاعك.", en: "A consistent, strategic presence that builds community." },
    description: {
      ar: "خطة محتوى شهرية، تصميمات، كتابة، نشر، ورد على الجمهور — بندير صفحاتك كأنها صفحاتنا وبنقيس كل حاجة.",
      en: "Monthly content plans, design, copy, publishing and community management — we run your pages like our own and measure everything.",
    },
    tags: [
      { ar: "خطة محتوى", en: "Content plan" },
      { ar: "إدارة مجتمع", en: "Community" },
      { ar: "تقارير", en: "Reporting" },
    ],
    deliverables: [
      { title: { ar: "خطة محتوى شهرية", en: "Monthly content plan" }, text: { ar: "أفكار وتواريخ وأهداف لكل بوست.", en: "Ideas, dates and goals for every post." } },
      { title: { ar: "تصميم وكتابة", en: "Design & copy" }, text: { ar: "بوستات وستوريز وريلز بهوية ثابتة.", en: "Posts, stories and reels on-brand." } },
      { title: { ar: "إدارة التعليقات والرسائل", en: "Community management" }, text: { ar: "رد سريع ومحترف على جمهورك.", en: "Fast, professional replies to your audience." } },
      { title: { ar: "تقرير شهري", en: "Monthly report" }, text: { ar: "أرقام واضحة وتوصيات للشهر الجاي.", en: "Clear numbers and next-month recommendations." } },
    ],
    process: sharedProcess,
    faqs: [
      { q: { ar: "بتديروا أنهي منصات؟", en: "Which platforms do you manage?" }, a: { ar: "فيسبوك، إنستجرام، تيك توك، لينكدإن وغيرهم حسب جمهورك.", en: "Facebook, Instagram, TikTok, LinkedIn and more — wherever your audience is." } },
      { q: { ar: "كام بوست في الشهر؟", en: "How many posts per month?" }, a: { ar: "حسب الباقة، من ١٢ لـ ٣٠ بوست بالإضافة للستوريز.", en: "Depending on the package, 12–30 posts plus stories." } },
      { q: { ar: "هل الإعلانات ضمن الإدارة؟", en: "Are ads included?" }, a: { ar: "الإعلانات خدمة منفصلة ويمكن دمجها في باقة واحدة.", en: "Ads are a separate service and can be bundled." } },
    ],
  },
  {
    id: "svc-content",
    slug: "content-creation",
    icon: "pen",
    hue: 255,
    cover: null,
    title: { ar: "صناعة المحتوى", en: "Content Creation" },
    short: { ar: "محتوى يتقري ويتشير — مكتوب ومرئي بلغة جمهورك.", en: "Content people read and share — written and visual, in your audience's language." },
    description: {
      ar: "كتابة إعلانية، سكريبتات فيديو، مقالات، وأفكار ريلز — محتوى مبني على فهم الجمهور ومصمم عشان يحرك أرقام حقيقية.",
      en: "Copywriting, video scripts, articles and reel concepts — content grounded in audience insight and built to move real numbers.",
    },
    tags: [
      { ar: "كوبي رايتنج", en: "Copywriting" },
      { ar: "سكريبتات", en: "Scripts" },
      { ar: "ريلز", en: "Reels" },
    ],
    deliverables: [
      { title: { ar: "كتابة إعلانية", en: "Ad copy" }, text: { ar: "نصوص بتقنع وبتبيع.", en: "Copy that persuades and converts." } },
      { title: { ar: "سكريبتات فيديو", en: "Video scripts" }, text: { ar: "قصص قصيرة بتشد من أول ثانية.", en: "Short stories that hook from second one." } },
      { title: { ar: "محتوى المواقع", en: "Web copy" }, text: { ar: "صفحات واضحة ومهيأة لمحركات البحث.", en: "Clear, SEO-ready pages." } },
      { title: { ar: "أفكار حملات", en: "Campaign concepts" }, text: { ar: "أفكار كبيرة قابلة للتنفيذ.", en: "Big ideas that can actually ship." } },
    ],
    process: sharedProcess,
    faqs: [
      { q: { ar: "بتكتبوا بالعامية ولا الفصحى؟", en: "Do you write in Egyptian Arabic or MSA?" }, a: { ar: "الاتنين، حسب جمهورك وطبيعة البراند.", en: "Both — depending on your audience and brand voice." } },
      { q: { ar: "بتكتبوا إنجليزي؟", en: "Do you write in English?" }, a: { ar: "أيوه، عندنا كتّاب عربي وإنجليزي.", en: "Yes, we have Arabic and English writers." } },
      { q: { ar: "عدد المراجعات؟", en: "How many revisions?" }, a: { ar: "مراجعتين على كل قطعة محتوى ضمن السعر.", en: "Two revisions per piece are included." } },
    ],
  },
  {
    id: "svc-production",
    slug: "photo-video-production",
    icon: "camera",
    hue: 292,
    cover: null,
    title: { ar: "التصوير وإنتاج الفيديو", en: "Photography & Video Production" },
    short: { ar: "تصوير منتجات وفيديوهات إعلانية بجودة سينمائية.", en: "Product shoots and ad films with cinematic quality." },
    description: {
      ar: "من الفكرة والسكريبت للتصوير والمونتاج والموشن جرافيك — فريق إنتاج كامل بيطلع صورة البراند بأفضل شكل.",
      en: "From concept and script to shooting, editing and motion graphics — a full production crew that shows your brand at its best.",
    },
    tags: [
      { ar: "تصوير منتجات", en: "Product shoots" },
      { ar: "إعلانات", en: "Commercials" },
      { ar: "موشن", en: "Motion" },
    ],
    deliverables: [
      { title: { ar: "تصوير منتجات", en: "Product photography" }, text: { ar: "صور نظيفة للمتاجر والسوشيال.", en: "Clean shots for stores and social." } },
      { title: { ar: "فيديو إعلاني", en: "Ad films" }, text: { ar: "إعلانات قصيرة بتحكي قصة.", en: "Short commercials that tell a story." } },
      { title: { ar: "ريلز وتيك توك", en: "Reels & TikTok" }, text: { ar: "محتوى عمودي سريع ومؤثر.", en: "Fast, punchy vertical content." } },
      { title: { ar: "موشن جرافيك", en: "Motion graphics" }, text: { ar: "شرح الأفكار بحركة جذابة.", en: "Ideas explained through motion." } },
    ],
    process: sharedProcess,
    faqs: [
      { q: { ar: "عندكم استوديو؟", en: "Do you have a studio?" }, a: { ar: "بنصور في الاستوديو أو في موقعك حسب طبيعة المشروع.", en: "We shoot in-studio or on location depending on the project." } },
      { q: { ar: "التسليم بياخد قد إيه؟", en: "What's the turnaround?" }, a: { ar: "الصور خلال أسبوع والفيديو من أسبوع لـ ٣ أسابيع.", en: "Photos within a week; video in 1–3 weeks." } },
      { q: { ar: "بتوفروا موديلز؟", en: "Can you provide models?" }, a: { ar: "أيوه، بنرشح ونجهز الموديلز والمكان.", en: "Yes — we cast talent and scout locations." } },
    ],
  },
  {
    id: "svc-media-buying",
    slug: "media-buying",
    icon: "megaphone",
    hue: 262,
    cover: null,
    title: { ar: "شراء الميديا والإعلانات الممولة", en: "Media Buying / Paid Ads" },
    short: { ar: "كل جنيه في الإعلانات يروح للجمهور الصح.", en: "Every pound of ad spend reaches the right people." },
    description: {
      ar: "حملات ممولة على ميتا وجوجل وتيك توك — استهداف دقيق، اختبارات مستمرة، وتقارير شفافة بالعائد الحقيقي.",
      en: "Paid campaigns on Meta, Google and TikTok — precise targeting, constant testing and transparent reporting on real return.",
    },
    tags: [
      { ar: "ميتا", en: "Meta" },
      { ar: "جوجل", en: "Google" },
      { ar: "تيك توك", en: "TikTok" },
    ],
    deliverables: [
      { title: { ar: "خطة ميديا", en: "Media plan" }, text: { ar: "توزيع الميزانية على المنصات الصح.", en: "Budget split across the right channels." } },
      { title: { ar: "إعداد الحملات", en: "Campaign setup" }, text: { ar: "بكسل وتتبع وجماهير مخصصة.", en: "Pixels, tracking and custom audiences." } },
      { title: { ar: "اختبار A/B", en: "A/B testing" }, text: { ar: "اختبار الإعلانات للوصول لأفضل أداء.", en: "Creative testing to find the winners." } },
      { title: { ar: "تقارير أسبوعية", en: "Weekly reports" }, text: { ar: "تكلفة النتيجة والعائد بوضوح.", en: "Cost per result and ROAS, clearly." } },
    ],
    process: sharedProcess,
    faqs: [
      { q: { ar: "أقل ميزانية كام؟", en: "What's the minimum budget?" }, a: { ar: "بنحدد الميزانية حسب الهدف، ونقدر نبدأ بميزانيات صغيرة ونكبر.", en: "It depends on the goal — we can start small and scale." } },
      { q: { ar: "الميزانية بتتدفع لمين؟", en: "Who pays the ad platforms?" }, a: { ar: "الميزانية بتتدفع مباشرة للمنصة من حسابك أو عن طريقنا.", en: "Directly from your account or through us — your choice." } },
      { q: { ar: "إمتى أشوف نتايج؟", en: "When will I see results?" }, a: { ar: "مؤشرات أولية خلال أول أسبوعين، والتحسين مستمر.", en: "Early signals within two weeks; optimisation is ongoing." } },
    ],
  },
  {
    id: "svc-performance",
    slug: "performance-marketing",
    icon: "trending",
    hue: 275,
    cover: null,
    title: { ar: "التسويق بالأداء", en: "Performance Marketing" },
    short: { ar: "تسويق مبني على الأرقام — مبيعات وعملاء مش مجرد لايكات.", en: "Numbers-driven marketing — sales and leads, not just likes." },
    description: {
      ar: "بنربط كل نشاط تسويقي بهدف تجاري: قمع مبيعات، صفحات هبوط، تتبع تحويلات، وتحسين مستمر لتكلفة العميل.",
      en: "We tie every activity to a business goal: funnels, landing pages, conversion tracking and continuous CAC optimisation.",
    },
    tags: [
      { ar: "قمع المبيعات", en: "Funnels" },
      { ar: "تحويلات", en: "Conversions" },
      { ar: "تحليلات", en: "Analytics" },
    ],
    deliverables: [
      { title: { ar: "تصميم قمع المبيعات", en: "Funnel design" }, text: { ar: "رحلة واضحة من أول تفاعل لحد الشراء.", en: "A clear path from first touch to purchase." } },
      { title: { ar: "صفحات هبوط", en: "Landing pages" }, text: { ar: "صفحات سريعة مصممة للتحويل.", en: "Fast pages built to convert." } },
      { title: { ar: "تتبع التحويلات", en: "Conversion tracking" }, text: { ar: "قياس دقيق لكل عملية بيع.", en: "Accurate measurement of every sale." } },
      { title: { ar: "لوحة أرقام", en: "Dashboards" }, text: { ar: "كل مؤشراتك في مكان واحد.", en: "All your KPIs in one place." } },
    ],
    process: sharedProcess,
    faqs: [
      { q: { ar: "إيه الفرق بينه وبين الإعلانات؟", en: "How is this different from paid ads?" }, a: { ar: "الإعلانات جزء؛ التسويق بالأداء بيشمل القمع والصفحات والتتبع والتحسين.", en: "Ads are one part; performance covers funnels, pages, tracking and optimisation." } },
      { q: { ar: "بتضمنوا نتايج؟", en: "Do you guarantee results?" }, a: { ar: "بنلتزم بأهداف واضحة ومؤشرات بنراجعها معاك أسبوعياً.", en: "We commit to clear targets reviewed with you weekly." } },
      { q: { ar: "محتاج موقع؟", en: "Do I need a website?" }, a: { ar: "مش شرط — ممكن نبدأ بصفحة هبوط واحدة.", en: "Not necessarily — a single landing page can be enough to start." } },
    ],
  },
  {
    id: "svc-web",
    slug: "web-development",
    icon: "code",
    hue: 250,
    cover: null,
    title: { ar: "تصميم وتطوير المواقع", en: "Web Design & Development" },
    short: { ar: "مواقع سريعة وجميلة بتحوّل الزوار لعملاء.", en: "Fast, beautiful websites that turn visitors into customers." },
    description: {
      ar: "مواقع تعريفية ومتاجر إلكترونية بتصميم مخصص، أداء عالي، ولوحة تحكم سهلة — مبنية بأحدث التقنيات.",
      en: "Corporate sites and e-commerce stores with custom design, top performance and an easy admin — built on modern tech.",
    },
    tags: [
      { ar: "مواقع تعريفية", en: "Websites" },
      { ar: "متاجر", en: "E-commerce" },
      { ar: "UI/UX", en: "UI/UX" },
    ],
    deliverables: [
      { title: { ar: "تصميم UI/UX", en: "UI/UX design" }, text: { ar: "تجربة استخدام واضحة وجذابة.", en: "Clear, engaging user experience." } },
      { title: { ar: "تطوير", en: "Development" }, text: { ar: "كود نظيف وسريع ومتجاوب.", en: "Clean, fast, responsive code." } },
      { title: { ar: "لوحة تحكم", en: "Admin panel" }, text: { ar: "تعديل المحتوى بنفسك بسهولة.", en: "Edit your content yourself, easily." } },
      { title: { ar: "استضافة ودعم", en: "Hosting & support" }, text: { ar: "إطلاق ومتابعة بعد التسليم.", en: "Launch and ongoing care." } },
    ],
    process: sharedProcess,
    faqs: [
      { q: { ar: "الموقع بياخد وقت قد إيه؟", en: "How long does a website take?" }, a: { ar: "من ٣ لـ ٨ أسابيع حسب عدد الصفحات والمميزات.", en: "3–8 weeks depending on pages and features." } },
      { q: { ar: "الموقع هيبقى عربي وإنجليزي؟", en: "Will it be bilingual?" }, a: { ar: "أيوه، بنبني مواقع ثنائية اللغة بالكامل.", en: "Yes — fully bilingual builds are our default." } },
      { q: { ar: "أقدر أعدل المحتوى بنفسي؟", en: "Can I edit content myself?" }, a: { ar: "أكيد، من لوحة تحكم بسيطة.", en: "Of course, from a simple admin panel." } },
    ],
  },
  {
    id: "svc-seo",
    slug: "seo",
    icon: "search",
    hue: 286,
    cover: null,
    title: { ar: "تحسين محركات البحث SEO", en: "SEO" },
    short: { ar: "تظهر في أول نتايج جوجل لما عميلك يدور عليك.", en: "Show up first on Google when customers search for you." },
    description: {
      ar: "تحسين تقني ومحتوى وروابط — خطة SEO طويلة المدى بتجيب زيارات مجانية ومستمرة من عملاء بيدوروا على خدمتك.",
      en: "Technical, content and link SEO — a long-term plan that brings free, compounding traffic from people searching for what you sell.",
    },
    tags: [
      { ar: "SEO تقني", en: "Technical SEO" },
      { ar: "كلمات مفتاحية", en: "Keywords" },
      { ar: "SEO محلي", en: "Local SEO" },
    ],
    deliverables: [
      { title: { ar: "تدقيق تقني", en: "Technical audit" }, text: { ar: "إصلاح كل اللي بيعطل ظهورك.", en: "Fix everything holding rankings back." } },
      { title: { ar: "بحث كلمات", en: "Keyword research" }, text: { ar: "الكلمات اللي عملاءك بيدوروا بيها.", en: "The words your customers actually search." } },
      { title: { ar: "محتوى محسّن", en: "Optimised content" }, text: { ar: "صفحات ومقالات بتتصدر.", en: "Pages and articles that rank." } },
      { title: { ar: "SEO محلي", en: "Local SEO" }, text: { ar: "ظهور على خرايط جوجل في مدينتك.", en: "Visibility on Google Maps in your city." } },
    ],
    process: sharedProcess,
    faqs: [
      { q: { ar: "إمتى النتايج تبان؟", en: "When do results show?" }, a: { ar: "غالباً من ٣ لـ ٦ شهور للنتايج القوية.", en: "Usually 3–6 months for strong results." } },
      { q: { ar: "بتضمنوا المركز الأول؟", en: "Do you guarantee #1?" }, a: { ar: "محدش يقدر يضمن ده بأمانة، لكن بنضمن شغل منهجي وتقارير شفافة.", en: "No one honestly can — we guarantee methodical work and transparent reporting." } },
      { q: { ar: "محتاج أكتب مقالات؟", en: "Do I need to blog?" }, a: { ar: "إحنا بنكتب المحتوى المطلوب ضمن الخطة.", en: "We write the content as part of the plan." } },
    ],
  },
];

export const seedCategories: ProjectCategory[] = [
  { id: "cat-branding", slug: "branding", name: { ar: "براندنج", en: "Branding" } },
  { id: "cat-social", slug: "social", name: { ar: "سوشيال ميديا", en: "Social Media" } },
  { id: "cat-production", slug: "production", name: { ar: "إنتاج", en: "Production" } },
  { id: "cat-ads", slug: "ads", name: { ar: "إعلانات", en: "Ads" } },
  { id: "cat-web", slug: "web", name: { ar: "مواقع", en: "Web" } },
];

const placeholderNote = { ar: "مشروع تجريبي (Placeholder)", en: "Placeholder project" };

export const seedProjects: Project[] = [
  {
    id: "prj-1", slug: "nile-roastery", hue: 268, featured: true, isPlaceholder: true, year: 2025,
    title: { ar: "محمصة النيل", en: "Nile Roastery" }, client: placeholderNote, categorySlug: "branding",
    serviceSlugs: ["branding", "photo-video-production"],
    summary: { ar: "هوية بصرية كاملة لمحمصة قهوة محلية بتتوسع.", en: "A full identity for a growing local coffee roastery." },
    challenge: { ar: "براند محلي محتاج يبان premium وينافس السلاسل الكبيرة.", en: "A local brand needing to feel premium and compete with big chains." },
    solution: { ar: "هوية مستوحاة من النيل، تغليف مميز، وتصوير منتجات دافي.", en: "A Nile-inspired identity, distinctive packaging and warm product photography." },
    results: [
      { value: 140, suffix: "%", label: { ar: "زيادة المبيعات", en: "Sales increase" } },
      { value: 3, suffix: "x", label: { ar: "تفاعل السوشيال", en: "Social engagement" } },
      { value: 2, suffix: "", label: { ar: "فروع جديدة", en: "New branches" } },
    ],
    cover: null, gallery: [],
  },
  {
    id: "prj-2", slug: "pulse-fitness", hue: 290, featured: true, isPlaceholder: true, year: 2025,
    title: { ar: "بلس فيتنس", en: "Pulse Fitness" }, client: placeholderNote, categorySlug: "ads",
    serviceSlugs: ["media-buying", "performance-marketing"],
    summary: { ar: "حملة اشتراكات لسلسلة جيمات.", en: "A membership campaign for a gym chain." },
    challenge: { ar: "تكلفة العميل عالية وموسم الصيف قرب.", en: "High cost per lead with summer season approaching." },
    solution: { ar: "قمع مبيعات جديد، إعلانات فيديو قصيرة، واستهداف حسب المنطقة.", en: "A new funnel, short-form video ads and geo-targeting." },
    results: [
      { value: 62, suffix: "%", label: { ar: "انخفاض تكلفة العميل", en: "Lower cost per lead" } },
      { value: 1800, suffix: "+", label: { ar: "اشتراك جديد", en: "New members" } },
      { value: 5, suffix: "x", label: { ar: "عائد الإعلانات", en: "ROAS" } },
    ],
    cover: null, gallery: [],
  },
  {
    id: "prj-3", slug: "saha-clinics", hue: 252, featured: true, isPlaceholder: true, year: 2024,
    title: { ar: "عيادات صحة", en: "Saha Clinics" }, client: placeholderNote, categorySlug: "web",
    serviceSlugs: ["web-development", "seo"],
    summary: { ar: "موقع حجز ثنائي اللغة لمجموعة عيادات.", en: "A bilingual booking site for a clinic group." },
    challenge: { ar: "الحجوزات كلها بالتليفون وضغط كبير على الاستقبال.", en: "All bookings by phone, overwhelming reception." },
    solution: { ar: "موقع سريع بنظام حجز أونلاين وSEO محلي لكل فرع.", en: "A fast site with online booking and local SEO per branch." },
    results: [
      { value: 70, suffix: "%", label: { ar: "حجوزات أونلاين", en: "Online bookings" } },
      { value: 4, suffix: "x", label: { ar: "زيارات من جوجل", en: "Google traffic" } },
      { value: 98, suffix: "", label: { ar: "تقييم الأداء", en: "Performance score" } },
    ],
    cover: null, gallery: [],
  },
  {
    id: "prj-4", slug: "dahab-jewelry", hue: 300, featured: true, isPlaceholder: true, year: 2024,
    title: { ar: "ذهب للمجوهرات", en: "Dahab Jewelry" }, client: placeholderNote, categorySlug: "production",
    serviceSlugs: ["photo-video-production", "social-media"],
    summary: { ar: "تصوير وفيديوهات لكولكشن جديد.", en: "Photo and film for a new collection launch." },
    challenge: { ar: "إطلاق كولكشن في وقت قصير جداً.", en: "Launching a collection on a very tight timeline." },
    solution: { ar: "يوم تصوير سينمائي وسلسلة ريلز للإطلاق.", en: "A cinematic shoot day and a launch reel series." },
    results: [
      { value: 2.4, suffix: "M", label: { ar: "مشاهدة", en: "Views" } },
      { value: 85, suffix: "%", label: { ar: "نفاد الكولكشن", en: "Collection sold" } },
      { value: 12, suffix: "K", label: { ar: "متابع جديد", en: "New followers" } },
    ],
    cover: null, gallery: [],
  },
  {
    id: "prj-5", slug: "baladi-bakery", hue: 275, featured: true, isPlaceholder: true, year: 2024,
    title: { ar: "مخبز بلدي", en: "Baladi Bakery" }, client: placeholderNote, categorySlug: "social",
    serviceSlugs: ["social-media", "content-creation"],
    summary: { ar: "إدارة سوشيال ميديا لمخبز عائلي.", en: "Social media management for a family bakery." },
    challenge: { ar: "صفحة خاملة وجمهور مش متفاعل.", en: "A dormant page with an unengaged audience." },
    solution: { ar: "محتوى يومي بيحكي قصة العيلة والمنتج الطازة.", en: "Daily content telling the family story and fresh-baked craft." },
    results: [
      { value: 320, suffix: "%", label: { ar: "نمو التفاعل", en: "Engagement growth" } },
      { value: 25, suffix: "K", label: { ar: "متابع", en: "Followers" } },
      { value: 40, suffix: "%", label: { ar: "طلبات أونلاين", en: "Online orders" } },
    ],
    cover: null, gallery: [],
  },
  {
    id: "prj-6", slug: "tamar-realestate", hue: 258, featured: false, isPlaceholder: true, year: 2023,
    title: { ar: "تمار العقارية", en: "Tamar Real Estate" }, client: placeholderNote, categorySlug: "branding",
    serviceSlugs: ["branding", "web-development"],
    summary: { ar: "إعادة بناء هوية شركة تطوير عقاري.", en: "A rebrand for a real-estate developer." },
    challenge: { ar: "هوية قديمة مش بتعكس حجم المشاريع.", en: "An outdated identity that undersold their projects." },
    solution: { ar: "هوية معمارية حديثة وموقع لعرض الوحدات.", en: "A modern architectural identity and a units showcase site." },
    results: [
      { value: 2, suffix: "x", label: { ar: "استفسارات", en: "Enquiries" } },
      { value: 45, suffix: "%", label: { ar: "مدة أطول في الموقع", en: "Longer sessions" } },
      { value: 1, suffix: "", label: { ar: "هوية موحدة", en: "Unified identity" } },
    ],
    cover: null, gallery: [],
  },
];

export const seedTestimonials: Testimonial[] = [
  {
    id: "tst-1", rating: 5, photo: null, isPlaceholder: true,
    name: { ar: "أحمد سمير", en: "Ahmed Samir" }, role: { ar: "المدير التنفيذي", en: "CEO" }, company: { ar: "عميل تجريبي", en: "Placeholder client" },
    quote: { ar: "فريق ماركتنج هاوس فهم البيزنس بتاعنا من أول اجتماع. المبيعات زادت بشكل واضح في أول ٣ شهور.", en: "The Marketing House team understood our business from the first meeting. Sales grew noticeably within three months." },
  },
  {
    id: "tst-2", rating: 5, photo: null, isPlaceholder: true,
    name: { ar: "منى عادل", en: "Mona Adel" }, role: { ar: "مديرة التسويق", en: "Marketing Manager" }, company: { ar: "عميل تجريبي", en: "Placeholder client" },
    quote: { ar: "الهوية الجديدة غيرت نظرة العملاء لينا تماماً. شغل محترف ومواعيد مظبوطة.", en: "The new identity completely changed how customers see us. Professional work, always on time." },
  },
  {
    id: "tst-3", rating: 5, photo: null, isPlaceholder: true,
    name: { ar: "كريم فؤاد", en: "Karim Fouad" }, role: { ar: "صاحب مشروع", en: "Founder" }, company: { ar: "عميل تجريبي", en: "Placeholder client" },
    quote: { ar: "أول مرة أشوف تقارير إعلانات واضحة كده. كل جنيه عارف راح فين وجاب إيه.", en: "First time I've seen ad reports this clear. I know where every pound went and what it brought back." },
  },
  {
    id: "tst-4", rating: 5, photo: null, isPlaceholder: true,
    name: { ar: "سارة حسن", en: "Sara Hassan" }, role: { ar: "مديرة العمليات", en: "Operations Director" }, company: { ar: "عميل تجريبي", en: "Placeholder client" },
    quote: { ar: "الموقع الجديد خفف الضغط على فريقنا والحجوزات الأونلاين بقت أغلب الشغل.", en: "The new site took pressure off our team — online bookings are now most of our volume." },
  },
];

export const seedClients: Client[] = [
  "NILE CO.", "PULSE", "SAHA", "DAHAB", "BALADI", "TAMAR", "NOVA", "ATLAS", "ZEIN", "ORBIT", "LUMA", "KAYAN",
].map((name, i) => ({ id: `cl-${i + 1}`, name, logo: null, isPlaceholder: true }));

export const seedTeam: TeamMember[] = [
  { id: "tm-1", photo: null, isPlaceholder: true, socials: { linkedin: "#" }, name: { ar: "نبيل (مثال)", en: "Nabil (placeholder)" }, role: { ar: "المؤسس والمدير التنفيذي", en: "Founder & CEO" } },
  { id: "tm-2", photo: null, isPlaceholder: true, socials: { linkedin: "#" }, name: { ar: "عضو فريق", en: "Team member" }, role: { ar: "مدير إبداعي", en: "Creative Director" } },
  { id: "tm-3", photo: null, isPlaceholder: true, socials: { linkedin: "#" }, name: { ar: "عضو فريق", en: "Team member" }, role: { ar: "رئيس قسم الإعلانات", en: "Head of Paid Media" } },
  { id: "tm-4", photo: null, isPlaceholder: true, socials: { linkedin: "#" }, name: { ar: "عضو فريق", en: "Team member" }, role: { ar: "مدير المحتوى", en: "Content Lead" } },
];

const hours = { ar: "السبت – الخميس: ١٠ ص – ٨ م", en: "Sat – Thu: 10 AM – 8 PM" };

export const seedBranches: Branch[] = [
  {
    id: "br-giza", key: "giza", isMain: false, mapX: 49.5, mapY: 27,
    name: { ar: "فرع الجيزة", en: "Giza Branch" }, city: { ar: "الجيزة", en: "Giza" },
    address: { ar: "مساكن دهشور، حدائق أكتوبر – الجيزة", en: "Dahshur Housing, Hadayek October – Giza" },
    phone: "01283495495", whatsapp: "201283495495", workingHours: hours,
    mapEmbedUrl: "https://www.google.com/maps?q=Hadayek+October+Giza&output=embed",
    mapLink: "https://maps.google.com/?q=Hadayek+October+Giza",
  },
  {
    id: "br-cairo", key: "cairo", isMain: true, mapX: 54.5, mapY: 23.5,
    name: { ar: "فرع القاهرة", en: "Cairo Branch" }, city: { ar: "القاهرة", en: "Cairo" },
    address: { ar: "٢٠ شارع الحجاز، مصر الجديدة – القاهرة", en: "20 El Hegaz St., Heliopolis – Cairo" },
    phone: "01283495495", whatsapp: "201283495495", workingHours: hours,
    mapEmbedUrl: "https://www.google.com/maps?q=20+El+Hegaz+St+Heliopolis+Cairo&output=embed",
    mapLink: "https://maps.google.com/?q=20+El+Hegaz+St+Heliopolis+Cairo",
  },
  {
    id: "br-assiut", key: "assiut", isMain: false, mapX: 52.5, mapY: 48.8,
    name: { ar: "فرع أسيوط", en: "Assiut Branch" }, city: { ar: "أسيوط", en: "Assiut" },
    address: { ar: "١٤ شارع الجمهورية – أسيوط", en: "14 El Gomhoreya St. – Assiut" },
    phone: "01283495495", whatsapp: "201283495495", workingHours: hours,
    mapEmbedUrl: "https://www.google.com/maps?q=El+Gomhoreya+St+Assiut&output=embed",
    mapLink: "https://maps.google.com/?q=El+Gomhoreya+St+Assiut",
  },
];

export const seedSettings: SiteSettings = {
  phone: "01283495495",
  whatsapp: "201283495495",
  email: "marketinghouse969@gmail.com",
  facebook: "https://facebook.com/marketinghouse",
  instagram: "https://instagram.com/marketinghouse",
  linkedin: "https://linkedin.com/company/marketinghouse",
  commercialRegNo: "",
  taxCardNo: "",
  stats: { projects: 250, clients: 120, years: 8, campaigns: 500 },
  seoTitle: { ar: "ماركتنج هاوس | وكالة تسويق متكاملة في مصر", en: "Marketing House | Full-Service Marketing Agency in Egypt" },
  seoDescription: {
    ar: "وكالة تسويق متكاملة ومسجلة رسمياً بثلاث فروع في الجيزة والقاهرة وأسيوط.",
    en: "An officially registered full-service marketing agency with branches in Giza, Cairo and Assiut.",
  },
};
