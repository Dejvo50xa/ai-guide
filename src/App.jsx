import { useState, useCallback } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  accent:   "#F59E0B",
  accentLo: "rgba(245,158,11,0.12)",
  accentMd: "rgba(245,158,11,0.25)",
  teal:     "#2DD4BF",
  tealLo:   "rgba(45,212,191,0.08)",
  purple:   "#A78BFA",
  purpleLo: "rgba(167,139,250,0.08)",
  bg:       "#06060A",
  surface:  "rgba(255,255,255,0.038)",
  surfaceHover: "rgba(255,255,255,0.06)",
  border:   "rgba(255,255,255,0.07)",
  borderHover: "rgba(245,158,11,0.45)",
  text:     "#F1F0EE",
  muted:    "#8A8A9A",
  faint:    "#4A4A5A",
  green:    "#10B981",
  red:      "#EF4444",
};

// ─── STYLE CONSTANTS (outside component — no per-render allocations) ─────────
const S = {
  tipBox: {
    fontSize: 13, color: T.accent, marginBottom: 4,
    padding: "7px 11px", background: T.accentLo,
    borderRadius: 8, border: `1px solid rgba(245,158,11,0.18)`,
    lineHeight: 1.55,
  },
  mvBox: {
    padding: "10px 14px", borderRadius: 10,
    background: T.accentLo, marginBottom: 12,
    fontSize: 13, color: T.accent, lineHeight: 1.6,
    border: `1px solid rgba(245,158,11,0.18)`,
  },
  ptipBox: {
    fontSize: 13, color: T.accent,
    padding: "9px 13px", background: T.accentLo,
    borderRadius: 10, border: `1px solid rgba(245,158,11,0.18)`,
    marginBottom: 14, lineHeight: 1.6,
  },
};

// ─── STRINGS ─────────────────────────────────────────────────────────────────
const L = {
  cs: {
    title: "AI Průvodce", sub: "Vaše příručka do světa umělé inteligence",
    pick: "Vyberte svou úroveň",
    beg: "Začátečník", begD: "Pro ty, kteří s AI teprve začínají. Jednoduchý průvodce krok za krokem.",
    mid: "Mírně pokročilý", midD: "Už víte, co AI je. Čas na pokročilejší nástroje a techniky.",
    adv: "Pokročilý", advD: "SEO, byznys, vývoj a pokročilé AI workflow.",
    tools: "AI Nástroje", prompts: "Prompty",
    byTask: "Podle úkolu", byModel: "Podle modelu",
    pLang: "Jazyk promptů", cs2: "Čeština", en2: "English",
    back: "← Zpět", open: "Otevřít →",
    how: "Jak na to:", tip: "💡 Tip:", tips: "Tipy:", models: "Modely:",
    free: "Zdarma", paid: "Placený", freemium: "Freemium",
    copy: "Kopírovat", copied: "✓ Zkopírováno",
    guide: "📖 Průvodce pro tuto úroveň", guideIntro: "Přečtěte si, než začnete s nástroji.",
    mv: "Verze modelů", promptTip: "💡 Tip k promptu:",
    noResults: "Žádné výsledky", noResultsSub: "Zkuste jiný výraz.",
    searchPlaceholder: "Hledat nástroje…", comingSoon: "Brzy přidáme",
    breadcrumb: "Úroveň:", copyAriaLabel: "Kopírovat prompt",
  },
  en: {
    title: "AI Guide", sub: "Your guide to the world of artificial intelligence",
    pick: "Choose your level",
    beg: "Beginner", begD: "For those just starting with AI. Simple step-by-step guide.",
    mid: "Intermediate", midD: "You know what AI is. Time for advanced tools and techniques.",
    adv: "Advanced", advD: "SEO, business, development and advanced AI workflows.",
    tools: "AI Tools", prompts: "Prompts",
    byTask: "By task", byModel: "By model",
    pLang: "Prompt language", cs2: "Čeština", en2: "English",
    back: "← Back", open: "Open →",
    how: "How to:", tip: "💡 Tip:", tips: "Tips:", models: "Models:",
    free: "Free", paid: "Paid", freemium: "Freemium",
    copy: "Copy", copied: "✓ Copied",
    guide: "📖 Guide for this level", guideIntro: "Read before starting with tools.",
    mv: "Model versions", promptTip: "💡 Prompt tip:",
    noResults: "No results", noResultsSub: "Try a different search term.",
    searchPlaceholder: "Search tools…", comingSoon: "Coming soon",
    breadcrumb: "Level:", copyAriaLabel: "Copy prompt",
  },
};

// ─── GUIDE DATA ───────────────────────────────────────────────────────────────
const GUIDE = {
  beginner: {
    cs: [
      { title: "🤔 Co je umělá inteligence?", text: "AI je počítačový program, který umí porozumět tomu, co mu napíšete, a odpovědět vám. Není to robot — je to chytrý software.\n\nPředstavte si to jako asistenta, kterému píšete zprávy. Podobně jako SMS, ale místo člověka odpovídá počítač, který toho hodně ví.\n\nAI umí:\n• Odpovídat na otázky (jako encyklopedie vlastními slovy)\n• Psát texty (emaily, články, dopisy)\n• Překládat jazyky\n• Vytvářet obrázky podle popisu\n• Shrnout dlouhé dokumenty\n• Pomoci s plánováním" },
      { title: "💰 Kolik to stojí?", text: "Většina nástrojů má bezplatnou verzi, která stačí.\n\n🟢 Zdarma:\n• ChatGPT — chat.openai.com\n• Gemini — gemini.google.com\n• Claude — claude.ai\n• DeepSeek — chat.deepseek.com\n• NotebookLM — notebooklm.google.com\n\n🟡 Více za předplatné (~500 Kč/měs.):\n• ChatGPT Plus, Claude Pro, Gemini Advanced\n\nPro začátek bezplatné verze bohatě stačí." },
      { title: "🔐 Jak se zaregistrovat?", text: "1. Otevřete prohlížeč (Chrome, Edge, Safari)\n2. Napište adresu (např. chat.openai.com)\n3. Klikněte 'Registrovat' / 'Sign up'\n4. Zadejte email + heslo\n5. Na email přijde potvrzení — klikněte na odkaz\n6. Hotovo!\n\n💡 U Gemini stačí Google účet. U mnohých nástrojů jde přihlásit přes Google jedním kliknutím.\n\n⚠️ Nemusíte zadávat platební kartu." },
      { title: "💬 Jak psát dotazy (prompty)?", text: "❌ Špatně: 'Napiš něco o vaření'\n\n✅ Dobře: 'Napiš jednoduchý recept na svíčkovou pro 4 osoby. Ingredience z běžného supermarketu. Postup krok za krokem.'\n\nPravidla:\n1. Buďte konkrétní\n2. Řekněte pro koho — 'vysvětli jednoduše'\n3. Určete délku — 've 3 větách'\n4. Určete styl — 'formálně', 'přátelsky'\n5. Opravujte — 'zkrať to', 'víc detailů'" },
      { title: "🔒 Je to bezpečné?", text: "✅ Bezpečné: otázky, psaní textů, překlady, učení\n\n⚠️ Pozor:\n• Nezadávejte citlivé údaje (rodná čísla, hesla, karty)\n• AI může chybovat — důležité info ověřte\n• AI nemá přístup k vašemu počítači\n\n💡 Berte to jako radu od chytrého kamaráda — užitečná, ale důležitá rozhodnutí konzultujte s odborníkem." },
      { title: "📱 Na čem to funguje?", text: "🖥️ Počítač — přes prohlížeč\n📱 Telefon — prohlížeč nebo aplikace (App Store / Google Play)\n📱 Tablet — stejně jako telefon\n\nStačí internet a prohlížeč.\n\n💡 Na telefonu doporučuji stáhnout si aplikaci ChatGPT nebo Gemini." },
      { title: "🆚 Který nástroj vybrat?", text: "🟢 ChatGPT — nejuniverzálnější, nejlepší pro začátek\n🟠 Claude — nejlepší na dlouhé texty, přesný\n🔵 Gemini — hledá aktuální info, propojený s Googlem\n🟤 DeepSeek — zdarma, ukazuje jak přemýšlí\n📘 NotebookLM — pro učení z dokumentů\n🔴 Kimi — extrémně dlouhé dokumenty\n\n💡 Začněte s ChatGPT. Pokud nesedí, zkuste Claude nebo Gemini." },
    ],
    en: [
      { title: "🤔 What is AI?", text: "AI is a computer program that understands your text and responds. It's not a robot — it's smart software.\n\nThink of it as a smart assistant you text. Like texting, but a very knowledgeable computer answers.\n\nAI can:\n• Answer questions (like an encyclopedia in your own words)\n• Write texts (emails, articles, letters)\n• Translate languages\n• Create images from descriptions\n• Summarize long documents\n• Help with planning" },
      { title: "💰 How much does it cost?", text: "Most tools have a free version that's enough.\n\n🟢 Free: ChatGPT, Gemini, Claude, DeepSeek, NotebookLM\n\n🟡 More with subscription (~$20/mo): ChatGPT Plus, Claude Pro, Gemini Advanced\n\nFree versions are more than enough to start." },
      { title: "🔐 How to register?", text: "1. Open browser\n2. Go to the tool (e.g. chat.openai.com)\n3. Click 'Sign up'\n4. Enter email + password\n5. Confirm via email link\n6. Done!\n\n💡 Many tools let you sign in with Google. No credit card needed." },
      { title: "💬 How to write prompts?", text: "❌ Bad: 'Write something about cooking'\n✅ Good: 'Write a simple beef stew recipe for 4. Grocery store ingredients. Step-by-step.'\n\nRules:\n1. Be specific\n2. Say who it's for\n3. Set length\n4. Set style\n5. Correct: 'shorten', 'more detail'" },
      { title: "🔒 Is it safe?", text: "✅ Safe: questions, writing, translations, learning\n⚠️ Caution: don't enter sensitive data, verify important info\n💡 Treat AI advice like advice from a smart friend." },
      { title: "📱 What devices?", text: "Computer, phone, tablet — just a browser and internet. Apps available for phone.\n\n💡 On phone, download the ChatGPT or Gemini app." },
      { title: "🆚 Which tool?", text: "🟢 ChatGPT — most universal\n🟠 Claude — best for long texts\n🔵 Gemini — current info, Google\n🟤 DeepSeek — free, shows thinking\n📘 NotebookLM — learning from documents\n\n💡 Start with ChatGPT." },
    ],
  },
  intermediate: {
    cs: [
      { title: "🎯 Pokročilé promptování", text: "Na této úrovni už nestačí jednoduché dotazy. Naučte se techniky:\n\n1. Role prompting — dejte AI konkrétní roli:\n'Jsi zkušený copywriter s 10 lety praxe v e-commerce. Napiš produktový popis pro...'\n\n2. Řetězení (chain) — rozdělte složitý úkol na kroky:\n'Nejdřív analyzuj cílovou skupinu. Pak navrhni 3 varianty nadpisu. Nakonec napiš text.'\n\n3. Few-shot — dejte příklady:\n'Tady je příklad dobrého popisu: [příklad]. Teď napiš podobný pro...'\n\n4. Formát výstupu:\n'Odpověz ve formátu: Problém → Příčina → 3 řešení → Doporučení. Použij odrážky.'\n\n5. Iterace:\n'Dobrý základ. Přidej konkrétní čísla a statistiky. Tón udělej energičtější.'" },
      { title: "🔄 Jak fungují různé modely?", text: "Každý AI model má jiné silné stránky:\n\n🟢 GPT-4o — nejuniverzálnější, dobrý ve všem\n🟢 o1 — přemýšlí hluboko, nejlepší pro logiku a matematiku\n🟠 Claude Sonnet — výborný poměr rychlost/kvalita, skvělý na kód\n🟠 Claude Opus — nejchytřejší Claude, nejlepší analýzy\n🔵 Gemini Pro — přístup k internetu\n🟤 DeepSeek R1 — reasoning model, zdarma!\n\n💡 Pro analytické úkoly: Claude Opus nebo o1. Pro rychlé psaní: GPT-4o nebo Sonnet." },
      { title: "⚡ Automatizace a workflow", text: "Na této úrovni můžete začít automatizovat:\n\n1. Custom GPTs — vlastní AI asistent v ChatGPT\n2. Projekty v Claude — sdílený kontext napříč konverzacemi\n3. Zapier/Make — propojte AI s dalšími aplikacemi:\n   Email přijde → AI shrne → Notifikace na Slack\n4. Šablony promptů pro opakující se úkoly\n\n💡 Začněte jednoduše: Custom GPT pro nejčastější úkol." },
      { title: "📊 Práce s daty a soubory", text: "AI umí pracovat se soubory:\n\n• PDF, Word, Excel, CSV — nahrajte do ChatGPT nebo Claude\n• ChatGPT Code Interpreter — napíše a spustí Python kód, vytvoří grafy\n• Claude Artifacts — interaktivní vizualizace\n• NotebookLM — analyzuje až 50 dokumentů najednou\n\n💡 'Analyzuj tento Excel. Najdi top 10 produktů podle tržeb a vytvoř graf porovnávající Q1 vs Q2.'" },
      { title: "🖼️ Pokročilá tvorba obrázků", text: "Od jednoduchých popisů k profesionálním promptům:\n\n1. Struktura: [subjekt], [styl], [osvětlení], [kompozice], [detaily]\n   'Portrait of a woman, oil painting style, soft golden light, rule of thirds'\n\n2. Negative prompting: --no text, blurry, low quality\n\n3. Parametry Midjourney:\n   --ar 16:9 (poměr stran)\n   --style raw (realističtější)\n   --chaos 30 (variabilita)\n   --stylize 200 (míra stylizace)\n\n4. img2img — nahrajte referenční obrázek a popište změny.\n\n💡 Prompt pište vždy anglicky — lepší výsledky ve všech nástrojích." },
    ],
    en: [
      { title: "🎯 Advanced Prompting", text: "At this level, simple queries aren't enough. Learn key techniques:\n\n1. Role prompting: 'You are an experienced copywriter with 10 years in e-commerce...'\n2. Chaining: break complex tasks into sequential steps\n3. Few-shot: give examples of desired output\n4. Output format: specify exactly what structure you want\n5. Iteration: 'Good base. Now add specific numbers. Make tone more energetic.'" },
      { title: "🔄 How Different Models Work", text: "Each AI model has different strengths:\n\n🟢 GPT-4o — most universal, good at everything\n🟢 o1 — deep thinking, best for logic and math\n🟠 Claude Sonnet — excellent speed/quality, great for code\n🟠 Claude Opus — smartest Claude, best analyses\n🔵 Gemini Pro — internet access\n🟤 DeepSeek R1 — free reasoning model!\n\n💡 Analytics: Claude Opus or o1. Fast writing: GPT-4o or Sonnet." },
      { title: "⚡ Automation & Workflow", text: "At this level you can start automating:\n\n1. Custom GPTs — your own AI assistant\n2. Projects in Claude — shared context across conversations\n3. Zapier/Make — connect AI with apps:\n   Email arrives → AI summarizes → Slack notification\n4. Prompt templates for recurring tasks\n\n💡 Start simple: create a Custom GPT for your most frequent task." },
      { title: "📊 Working with Data & Files", text: "AI can work with files:\n\n• PDF, Word, Excel, CSV — upload to ChatGPT or Claude\n• ChatGPT Code Interpreter — Python analysis + charts\n• Claude Artifacts — interactive visualizations\n• NotebookLM — 50 documents at once\n\n💡 'Analyze this Excel. Find top 10 products by revenue and create a chart comparing Q1 vs Q2.'" },
      { title: "🖼️ Advanced Image Creation", text: "From simple descriptions to professional prompts:\n\n1. Structure: [subject], [style], [lighting], [composition]\n   'Portrait of a woman, oil painting style, soft golden light, rule of thirds'\n\n2. Negative prompting: --no text, blurry, low quality\n\n3. Midjourney params: --ar 16:9, --style raw, --chaos 30, --stylize 200\n\n4. img2img — upload reference image + describe changes\n\n💡 Always write image prompts in English." },
    ],
  },
  advanced: {
    cs: [
      { title: "🏆 Výběr modelu pro pokročilé úkoly", text: "Volba modelu přímo ovlivňuje kvalitu výstupu:\n\nHluboká analýza a strategie:\n→ Claude Opus — nejsilnější reasoning, byznys úkoly\n→ o1 — chain-of-thought, matematika a logika\n\nRychá iterace a kódování:\n→ Claude Sonnet — nejlepší poměr rychlost/výkon\n→ GPT-4o — multimodální, různorodé úkoly\n\nResearch a aktuální data:\n→ Perplexity Pro — cituje zdroje\n→ Gemini Pro — real-time internet\n\n💡 Pravidlo: Správný model šetří čas. Nepoužívejte Opus na jednoduché shrnutí." },
      { title: "🏷️ XML promptování", text: "Pokročilí uživatelé používají XML tagy:\n\n<role>Jsi zkušený finanční analytik</role>\n<context>Analyzuji startup v SaaS segmentu</context>\n<task>Vytvoř finanční projekci na 3 roky</task>\n<constraints>Konzervativní odhady, sensitivity analysis</constraints>\n<format>Tabulka + komentář v bodech</format>\n\nProč XML funguje:\n• Jasně odděluje roli, kontext, úkol a omezení\n• Snižuje ambiguitu\n• Claude byl trénován s XML strukturou\n\n💡 Pro složité prompty vždy <context> + <task>." },
      { title: "⚙️ Návrh systémových promptů", text: "Systémový prompt je základ každého AI produktu:\n\n1. Definuje roli a osobnost\n2. Vymezuje znalostní bázi\n3. Definuje formát výstupů\n4. Obsahuje few-shot příklady (2–3)\n5. Řeší edge cases\n6. Obsahuje safety guardrails\n\n💡 Testujte s 10 různými vstupy včetně adversariálních před nasazením." },
      { title: "🔌 API a automatizace", text: "Přímé API volání otevírá nové možnosti:\n\nClaude API:\n• claude-opus-4 pro hluboký reasoning\n• Batched API — 50% sleva\n• 200K tokenů context window\n\nOpenAI API:\n• GPT-4o, JSON mode, Function calling\n\nAutomatizace:\n• Make — vizuální workflow + HTTP modul\n• n8n — open-source, self-host\n\n💡 Make + HTTP → Claude API. Za odpoledne automatizace na emails." },
      { title: "🤖 Agentické nástroje", text: "AI agenti vykonávají akce autonomně:\n\nClaude Code (CLI):\n• npm install -g @anthropic-ai/claude-code\n• Edituje soubory, spouští testy\n• Vy schvalujete, AI vykonává\n\nCursor IDE:\n• Composer — editace napříč soubory\n• .cursorrules — kontext projektu\n\nCrewAI:\n• Týmy agentů: Researcher → Writer → Editor\n• Každý má nástroje a předává výsledky\n\n💡 Začněte Claude Code pro kódovací projekty." },
    ],
    en: [
      { title: "🏆 Model Selection for Advanced Tasks", text: "Model choice directly affects output quality:\n\nDeep analysis and strategy:\n→ Claude Opus — strongest reasoning\n→ o1 — chain-of-thought, math and logic\n\nFast iteration and coding:\n→ Claude Sonnet — best speed/performance ratio\n→ GPT-4o — multimodal, diverse tasks\n\nResearch and current data:\n→ Perplexity Pro — cites sources\n→ Gemini Pro — real-time internet\n\n💡 Rule: Right model saves time. Don't use Opus for simple summaries." },
      { title: "🏷️ XML Prompting", text: "Advanced users use XML tags to structure prompts:\n\n<role>You are an experienced financial analyst</role>\n<context>I'm analyzing a SaaS startup</context>\n<task>Create a 3-year financial projection</task>\n<constraints>Conservative estimates, sensitivity analysis</constraints>\n<format>Table + bullet-point commentary</format>\n\nWhy XML works:\n• Clearly separates role, context, task, constraints\n• Reduces ambiguity\n• Claude was trained with XML structure\n\n💡 For complex prompts always use <context> + <task>." },
      { title: "⚙️ System Prompt Design", text: "A system prompt is the foundation of every AI product:\n\n1. Define role and personality\n2. Define knowledge base\n3. Define output format\n4. Include few-shot examples (2–3)\n5. Handle edge cases\n6. Include safety guardrails\n\n💡 Test with 10 different inputs including adversarial ones before deploying." },
      { title: "🔌 API & Automation", text: "Direct API calls unlock new possibilities:\n\nClaude API:\n• claude-opus-4 for deepest reasoning\n• Batched API — 50% discount\n• 200K token context window\n\nOpenAI API:\n• GPT-4o, JSON mode, Function calling\n\nAutomation:\n• Make — visual workflows + HTTP module\n• n8n — open-source, self-hostable\n\n💡 Make + HTTP → Claude API. Build email automation in an afternoon." },
      { title: "🤖 Agentic Tools", text: "AI agents perform actions autonomously:\n\nClaude Code (CLI):\n• npm install -g @anthropic-ai/claude-code\n• Edits files, runs tests, you approve\n\nCursor IDE:\n• Composer — edit across files\n• .cursorrules — project context\n\nCrewAI:\n• Agent teams: Researcher → Writer → Editor\n• Each has tools and passes results\n\n💡 Start with Claude Code for coding projects." },
    ],
  },
};

// ─── TOOLS ───────────────────────────────────────────────────────────────────
const TOOLS = {
  beginner: [
    { cat: { cs: "Konverzace s AI", en: "Chat with AI" }, icon: "💬", desc: { cs: "Ptejte se AI na cokoliv.", en: "Ask AI anything." }, items: [
      { name: "ChatGPT", url: "https://chat.openai.com", price: "freemium", d: { cs: "Nejpopulárnější AI chatbot.", en: "Most popular AI chatbot." }, h: { cs: "Přihlaste se, napište otázku, Enter.", en: "Sign in, type question, press Enter." }, tip: { cs: "'Pokračuj' nebo 'zkrať to' pro úpravu délky.", en: "Say 'continue' or 'shorten it' to adjust length." } },
      { name: "Claude", url: "https://claude.ai", price: "freemium", d: { cs: "AI od Anthropic. Velmi přesný.", en: "AI by Anthropic. Very precise, careful." }, h: { cs: "Výborný pro delší texty a přesné odpovědi.", en: "Excellent for long texts and precise answers." }, tip: { cs: "Claude zvládne celé PDF dokumenty.", en: "Claude handles entire PDFs — upload and ask." } },
      { name: "Gemini", url: "https://gemini.google.com", price: "freemium", d: { cs: "AI od Googlu. Hledá aktuální info.", en: "Google AI. Searches current info." }, h: { cs: "Přihlaste se Google účtem.", en: "Sign in with Google." }, tip: { cs: "Ideální na aktuální události.", en: "Ideal for current events." } },
      { name: "DeepSeek", url: "https://chat.deepseek.com", price: "free", d: { cs: "Úplně zdarma! R1 ukazuje myšlenkový postup.", en: "Completely free! R1 shows thinking process." }, h: { cs: "R1 ukazuje jak přemýšlí, než odpoví.", en: "R1 shows its thinking before answering." }, tip: { cs: "Na rozdíl od ostatních úplně zdarma.", en: "Unlike others, completely free. R1 is great for math." } },
      { name: "Grok", url: "https://grok.com", price: "freemium", d: { cs: "AI od xAI. Propojený s X.", en: "AI by xAI. Connected to X." }, h: { cs: "Přihlaste se přes X účet.", en: "Sign in with X account." }, tip: { cs: "Dobrý na trendy, čte X v reálném čase.", en: "Good for trends, reads X posts in real time." } },
    ]},
    { cat: { cs: "Učení a studium", en: "Learning & Study" }, icon: "📚", desc: { cs: "AI jako váš osobní učitel.", en: "AI as your personal teacher." }, items: [
      { name: "NotebookLM", url: "https://notebooklm.google.com", price: "free", d: { cs: "Pro práci s dokumenty. Zdarma.", en: "Google AI for documents. Free." }, h: { cs: "Nahrajte dokumenty a ptejte se. Umí podcast!", en: "Upload documents and ask. Can create podcasts!" }, tip: { cs: "'Vytvoř podcast' — vytvoří audio diskuzi!", en: "Upload materials and say 'create a podcast'!" } },
      { name: "Perplexity", url: "https://perplexity.ai", price: "freemium", d: { cs: "AI vyhledávač s citacemi zdrojů.", en: "AI search engine with citations." }, h: { cs: "Ptejte se jako v Googlu, dostanete odpověď se zdroji.", en: "Ask like Google, get answer with sources." }, tip: { cs: "Každá odpověď má čísla — klikněte pro ověření.", en: "Every answer has numbers — click to verify sources." } },
      { name: "Kimi", url: "https://kimi.moonshot.cn", price: "free", d: { cs: "Zvládá extrémně dlouhé dokumenty.", en: "Handles extremely long documents." }, h: { cs: "Nahrajte dlouhé dokumenty — miliony znaků.", en: "Upload long documents. Handles millions of characters." }, tip: { cs: "Ideální pro celé knihy, které jiné AI nezvládnou.", en: "Ideal for entire books that other AIs can't handle." } },
    ]},
    { cat: { cs: "Generování obrázků", en: "Image Generation" }, icon: "🎨", desc: { cs: "AI vytvoří obrázek z popisu.", en: "AI creates images from description." }, items: [
      { name: "DALL-E 3 (ChatGPT)", url: "https://chat.openai.com", price: "freemium", d: { cs: "Generátor obrázků přímo v ChatGPT.", en: "Image generator built into ChatGPT." }, h: { cs: "Napište 'Vytvoř obrázek...' a popište.", en: "Type 'Create an image of...' and describe." }, tip: { cs: "Čím víc detailů, tím lepší obrázek.", en: "More details (colors, style, mood) = better image." } },
      { name: "Ideogram", url: "https://ideogram.ai", price: "freemium", d: { cs: "Výborný pro obrázky s textem.", en: "Great for images with text (logos, posters)." }, h: { cs: "Přihlaste se, popište obrázek anglicky.", en: "Sign in, describe image in English." }, tip: { cs: "Spolehlivý na text v obrázcích — skvělý na loga.", en: "Only reliable generator for text in images — great for logos." } },
      { name: "Microsoft Designer", url: "https://designer.microsoft.com", price: "free", d: { cs: "Jednoduchý, úplně zdarma.", en: "Simple, completely free." }, h: { cs: "Microsoft účet → popište nebo vyberte šablonu.", en: "Microsoft account → describe or choose template." }, tip: { cs: "Nejjednodušší na použití. Ideální pro sociální sítě.", en: "Easiest to use. Ideal for social media." } },
    ]},
    { cat: { cs: "Psaní textů", en: "Writing" }, icon: "✍️", desc: { cs: "Emaily, články, dopisy.", en: "Emails, articles, letters." }, items: [
      { name: "ChatGPT", url: "https://chat.openai.com", price: "freemium", d: { cs: "Univerzální pomocník na psaní.", en: "Universal writing helper." }, h: { cs: "'Napiš formální email o...'", en: "'Write a formal email about...'" }, tip: { cs: "Vždy řekněte pro koho a jaký tón chcete.", en: "Always say who it's for and what tone you want." } },
      { name: "Claude", url: "https://claude.ai", price: "freemium", d: { cs: "Nejlepší pro delší texty.", en: "Best for long texts. Very careful." }, h: { cs: "Popište text, pro koho, tón a délku.", en: "Describe text, who it's for, tone and length." }, tip: { cs: "Claude nepřidává zbytečnosti.", en: "Claude doesn't add fluff — gives exactly what you ask." } },
    ]},
    { cat: { cs: "Překlad", en: "Translation" }, icon: "🌐", desc: { cs: "Kvalitní překlad textů.", en: "Quality text translation." }, items: [
      { name: "DeepL", url: "https://deepl.com", price: "freemium", d: { cs: "Nejkvalitnější AI překladač.", en: "Highest quality AI translator." }, h: { cs: "Vložte text vlevo, vyberte jazyk vpravo.", en: "Paste left, select language right." }, tip: { cs: "Překládá přirozeněji než Google Translate.", en: "Translates more naturally than Google Translate." } },
    ]},
    { cat: { cs: "Shrnutí dokumentů", en: "Summarization" }, icon: "📝", desc: { cs: "AI shrne dlouhé texty.", en: "AI summarizes long texts." }, items: [
      { name: "Claude", url: "https://claude.ai", price: "freemium", d: { cs: "Zvládne 200+ stran.", en: "Handles 200+ pages." }, h: { cs: "Nahrajte PDF nebo vložte text.", en: "Upload PDF or paste text." }, tip: { cs: "'Shrň pro člověka bez času' — nejdůležitější body.", en: "Say 'summarize for someone with no time' — key points only." } },
      { name: "NotebookLM", url: "https://notebooklm.google.com", price: "free", d: { cs: "Zdarma. Až 50 zdrojů najednou.", en: "Free. Up to 50 sources." }, h: { cs: "Nahrajte dokumenty, ptejte se.", en: "Upload docs, ask questions." }, tip: { cs: "Nahrajte více dokumentů a ptejte se na propojení.", en: "Upload multiple docs and ask about connections." } },
    ]},
  ],
  intermediate: [
    { cat: { cs: "Pokročilé obrázky", en: "Advanced Images" }, icon: "🎨", desc: { cs: "Profesionální generování s plnou kontrolou.", en: "Professional generation with full control." }, items: [
      { name: "Midjourney", url: "https://midjourney.com", price: "paid", d: { cs: "Nejkvalitnější generátor.", en: "Top quality generator." }, h: { cs: "Parametry --ar, --style raw, --chaos.", en: "Params --ar, --style raw, --chaos." }, tip: { cs: "'cinematic portrait, golden hour lighting, shallow depth of field'", en: "English prompt: 'cinematic portrait, golden hour lighting, shallow depth of field'" } },
      { name: "Leonardo.ai", url: "https://leonardo.ai", price: "freemium", d: { cs: "Webový nástroj s mnoha modely.", en: "Web tool with many models." }, h: { cs: "Vyberte model, napište prompt.", en: "Choose model, write prompt." }, tip: { cs: "DreamShaper pro fotorealistické výsledky.", en: "DreamShaper for photorealistic results." } },
      { name: "Flux (Replicate)", url: "https://replicate.com/black-forest-labs/flux-schnell", price: "freemium", d: { cs: "Excelentní kvalita, dobrá práce s textem.", en: "Excellent quality, good text handling." }, h: { cs: "Flux Schnell = rychlý. Flux Pro = kvalitnější.", en: "Flux Schnell = fast, free. Flux Pro = higher quality." }, tip: { cs: "Open-source — lokálně přes ComfyUI.", en: "Open-source — run locally via ComfyUI." } },
    ]},
    { cat: { cs: "Video tvorba", en: "Video Creation" }, icon: "🎬", desc: { cs: "Generování videí, AI avatary.", en: "Text-to-video, AI avatars." }, items: [
      { name: "Runway", url: "https://runwayml.com", price: "freemium", d: { cs: "Profesionální AI video.", en: "Professional AI video." }, h: { cs: "Text to Video nebo Image to Video.", en: "Text to Video or Image to Video." }, tip: { cs: "Začněte s Image to Video — nahrajte Midjourney obrázek.", en: "Start with Image to Video — upload a Midjourney image." } },
      { name: "HeyGen", url: "https://heygen.com", price: "freemium", d: { cs: "AI avatary pro prezentace.", en: "AI avatars for presentations." }, h: { cs: "Vyberte avatara, napište skript.", en: "Choose avatar, write script." }, tip: { cs: "Skvělé pro firemní videa a onboarding.", en: "Great for company and onboarding videos." } },
      { name: "CapCut", url: "https://capcut.com", price: "freemium", d: { cs: "Video editor s AI. Auto-titulky.", en: "Video editor with AI. Auto-captions." }, h: { cs: "Nahrajte video, použijte auto-titulky.", en: "Upload video, use auto-captions." }, tip: { cs: "Auto-titulky ušetří hodiny práce.", en: "Auto-captions save hours of work." } },
    ]},
    { cat: { cs: "Hudba a zvuky", en: "Music & Audio" }, icon: "🎵", desc: { cs: "Celé písně, klonování hlasu.", en: "Full songs, voice cloning." }, items: [
      { name: "Suno", url: "https://suno.com", price: "freemium", d: { cs: "Generuje kompletní písně z textu.", en: "Generates complete songs from text." }, h: { cs: "Popište žánr, náladu, téma.", en: "Describe genre, mood, topic." }, tip: { cs: "Napište vlastní text a specifikujte žánr přesně.", en: "Write your own lyrics and specify genre precisely." } },
      { name: "ElevenLabs", url: "https://elevenlabs.io", price: "freemium", d: { cs: "Nejkvalitnější AI hlas a klonování.", en: "Top quality AI voice and cloning." }, h: { cs: "Vložte text, vyberte hlas nebo naklonujte vlastní.", en: "Paste text, select or clone your voice." }, tip: { cs: "30s nahrávka → ElevenLabs čte vaším hlasem.", en: "30s recording → ElevenLabs reads in your voice." } },
    ]},
    { cat: { cs: "Analýza dat", en: "Data Analysis" }, icon: "📊", desc: { cs: "Tabulky, grafy bez programování.", en: "Tables, charts — no coding." }, items: [
      { name: "ChatGPT (Code Interpreter)", url: "https://chat.openai.com", price: "freemium", d: { cs: "CSV/Excel → Python kód → grafy.", en: "Upload CSV/Excel, GPT writes Python and creates charts." }, h: { cs: "'Analyzuj, najdi trendy, vytvoř 3 grafy.'", en: "Upload file. 'Analyze, find trends, create 3 charts.'" }, tip: { cs: "Říkejte přesně jak má graf vypadat.", en: "Be specific about how the chart should look." } },
      { name: "Julius AI", url: "https://julius.ai", price: "freemium", d: { cs: "Specializovaný na analýzu. Bez kódu.", en: "Specialized in analysis. No code." }, h: { cs: "Nahrajte dataset, ptejte se přirozeně.", en: "Upload dataset, ask naturally." }, tip: { cs: "Ideální pokud nechcete vidět kód.", en: "Ideal if you don't want to see code." } },
    ]},
    { cat: { cs: "Automatizace", en: "Automation" }, icon: "⚡", desc: { cs: "Propojte aplikace bez programování.", en: "Connect apps without coding." }, items: [
      { name: "Zapier", url: "https://zapier.com", price: "freemium", d: { cs: "Tisíce aplikací. Trigger → akce.", en: "Thousands of apps. Trigger → action." }, h: { cs: "Když X → udělej Y. Email → Drive → Slack.", en: "When X → do Y. Email → Drive → Slack." }, tip: { cs: "Začněte jednoduše a přidávejte kroky.", en: "Start simple and gradually add steps." } },
      { name: "Make", url: "https://make.com", price: "freemium", d: { cs: "Vizuální automatizace. Pokročilejší.", en: "Visual automation. More advanced." }, h: { cs: "Přetahujte moduly na plátno.", en: "Drag modules onto canvas." }, tip: { cs: "Má AI modul pro volání ChatGPT/Claude.", en: "Has AI module for calling ChatGPT/Claude." } },
    ]},
    { cat: { cs: "Programování s AI", en: "Coding with AI" }, icon: "💻", desc: { cs: "AI píše, opravuje a testuje kód.", en: "AI writes, fixes and tests code." }, items: [
      { name: "Cursor", url: "https://cursor.sh", price: "freemium", d: { cs: "AI-first editor kódu.", en: "AI-first code editor." }, h: { cs: "Cmd+K pro inline, Cmd+I pro Composer.", en: "Cmd+K for inline, Cmd+I for Composer." }, tip: { cs: ".cursorrules definuje pravidla pro AI.", en: ".cursorrules file defines rules AI always follows." } },
      { name: "Claude (Sonnet)", url: "https://claude.ai", price: "freemium", d: { cs: "Excelentní na kód. Python, JS, TS.", en: "Excellent at code. Python, JS, TS." }, h: { cs: "Vložte kód: 'oprav', 'vysvětli', 'optimalizuj'.", en: "Paste code and say 'fix', 'explain' or 'optimize'." }, tip: { cs: "Sonnet je v benchmarcích nejlepší na kód.", en: "Sonnet often ranks #1 in code benchmarks." } },
      { name: "DeepSeek R1", url: "https://chat.deepseek.com", price: "free", d: { cs: "Zdarma! Silný v kódu a matematice.", en: "Free! Strong in code and math." }, h: { cs: "R1 ukazuje reasoning — skvělé pro učení.", en: "R1 shows reasoning — great for learning." }, tip: { cs: "Ukazuje celý myšlenkový postup.", en: "Shows full thinking process — better than textbooks." } },
    ]},
  ],
  advanced: [
    { cat: { cs: "SEO optimalizace", en: "SEO" }, icon: "🔍", desc: { cs: "AI nástroje pro vyhledávače.", en: "AI for search engines." }, items: [
      { name: "Surfer SEO", url: "https://surferseo.com", price: "paid", d: { cs: "AI analýza obsahu a doporučení.", en: "AI content analysis and recommendations." }, h: { cs: "Klíčové slovo → analýza → doporučení.", en: "Keyword → analysis → recommendations." }, tip: { cs: "Content Editor: držte skóre nad 70.", en: "Content Editor: stay above 70 score." } },
      { name: "SEMrush", url: "https://semrush.com", price: "paid", d: { cs: "Komplexní SEO platforma.", en: "Comprehensive SEO platform." }, h: { cs: "Keyword Magic, Site Audit, AI Writing.", en: "Keyword Magic, Site Audit, AI Writing." }, tip: { cs: "Keyword Gap — klíčová slova konkurence.", en: "Keyword Gap — competitor keywords." } },
      { name: "Ahrefs", url: "https://ahrefs.com", price: "paid", d: { cs: "Zpětné odkazy, klíčová slova.", en: "Backlinks, keywords." }, h: { cs: "Site Explorer, Content Explorer.", en: "Site Explorer, Content Explorer." }, tip: { cs: "Content Explorer: témata s potenciálem, nízká konkurence.", en: "Content Explorer: high potential, low competition topics." } },
    ]},
    { cat: { cs: "Tvorba webů", en: "Web Development" }, icon: "🌐", desc: { cs: "Celé weby s AI.", en: "Full websites with AI." }, items: [
      { name: "Cursor", url: "https://cursor.sh", price: "freemium", d: { cs: "AI editor pro profesionální vývoj.", en: "AI editor for pro development." }, h: { cs: "Composer pro multi-file, @ reference pro docs.", en: "Composer for multi-file, @ references for docs." }, tip: { cs: "@ reference zahrne dokumentaci do kontextu.", en: "@ references include docs in context." } },
      { name: "v0 (Vercel)", url: "https://v0.dev", price: "freemium", d: { cs: "React komponenty z textu.", en: "React components from text." }, h: { cs: "Popište → Shadcn/Tailwind kód.", en: "Describe → Shadcn/Tailwind code." }, tip: { cs: "Rychlý prototyp → dopracovat v Cursoru.", en: "Quick prototype → refine in Cursor." } },
      { name: "Bolt", url: "https://bolt.new", price: "freemium", d: { cs: "Full-stack v prohlížeči.", en: "Full-stack in browser." }, h: { cs: "Popište → celý projekt.", en: "Describe → full project frontend + backend." }, tip: { cs: "Ideální pro MVP — celá app za hodinu.", en: "Ideal for MVP — full app in an hour." } },
    ]},
    { cat: { cs: "Byznys a strategie", en: "Business & Strategy" }, icon: "💼", desc: { cs: "Plánování, analýza trhu.", en: "Planning, market analysis." }, items: [
      { name: "Claude (Opus)", url: "https://claude.ai", price: "freemium", d: { cs: "Nejchytřejší pro hlubokou analýzu.", en: "Smartest for deep analysis." }, h: { cs: "SWOT, finanční modely, byznys plány.", en: "SWOT, financial models, business plans." }, tip: { cs: "XML: <context>váš byznys</context><task>úkol</task>", en: "XML: <context>your business</context><task>task</task>" } },
      { name: "Perplexity Pro", url: "https://perplexity.ai", price: "freemium", d: { cs: "AI search s aktuálními daty.", en: "AI search with current data." }, h: { cs: "Trendy, konkurence, tržní data.", en: "Trends, competition, market data." }, tip: { cs: "Pro Mode dá hlubší analýzu.", en: "Pro Mode gives deeper analysis." } },
    ]},
    { cat: { cs: "AI agenti", en: "AI Agents" }, icon: "🤖", desc: { cs: "Autonomní AI.", en: "Autonomous AI." }, items: [
      { name: "Claude Code", url: "https://docs.anthropic.com/en/docs/claude-code", price: "paid", d: { cs: "CLI pro agentické kódování.", en: "CLI for agentic coding." }, h: { cs: "Terminál. Edituje soubory, spouští příkazy.", en: "Terminal. Edits files, runs commands." }, tip: { cs: "Prochází celý projekt, najde bug a opraví.", en: "Browses entire project, finds bug and fixes — you just approve." } },
      { name: "CrewAI", url: "https://crewai.com", price: "freemium", d: { cs: "Týmy AI agentů.", en: "Teams of AI agents." }, h: { cs: "Definujte role, úkoly, nástroje.", en: "Define roles, tasks, tools." }, tip: { cs: "Researcher → Writer → Editor: agenti spolupracují.", en: "Researcher → Writer → Editor: agents collaborate." } },
    ]},
    { cat: { cs: "Obsah ve velkém", en: "Content at Scale" }, icon: "📝", desc: { cs: "Škálování obsahu.", en: "Scale content." }, items: [
      { name: "ChatGPT API", url: "https://platform.openai.com", price: "paid", d: { cs: "GPT-4o přes API.", en: "GPT-4o via API." }, h: { cs: "API klíč → automatizace.", en: "API key → automation." }, tip: { cs: "Batch API: 50% sleva pro tisíce dokumentů.", en: "Batch API: 50% discount for thousands of docs." } },
      { name: "Claude API", url: "https://console.anthropic.com", price: "paid", d: { cs: "Claude přes API.", en: "Claude via API." }, h: { cs: "Batched API pro velké objemy.", en: "Batched API for large volumes." }, tip: { cs: "200K tokenů — celá kniha v jednom volání.", en: "200K tokens — entire book in one API call." } },
    ]},
  ],
};

// ─── PROMPTS ──────────────────────────────────────────────────────────────────
const PROMPTS = {
  beginner: [
    { task: { cs: "Napsat email", en: "Write email" }, icon: "📧", mods: ["ChatGPT", "Claude", "Gemini"],
      promptTip: { cs: "Vždy řekněte komu email je, tón a délku.", en: "Always say who the email is for, tone and length." },
      ps: [
        { label: { cs: "Omluva šéfovi", en: "Apologize to boss" }, p: { cs: "Napiš formální email mému šéfovi, omlouvám se za zpoždění projektu. Důvod nemoc. Profesionální ale lidský tón. Max 100 slov.", en: "Write formal email to my boss apologizing for project delay due to illness. Professional but human. Max 100 words." }},
        { label: { cs: "Žádost o schůzku", en: "Meeting request" }, p: { cs: "Napiš zdvořilý email kolegovi, navrhuji schůzku příští týden. Téma: [téma]. Nabídni 2-3 termíny.", en: "Write polite email to colleague suggesting meeting next week. Topic: [topic]. Offer 2-3 slots." }},
        { label: { cs: "Reklamace", en: "Complaint" }, p: { cs: "Napiš reklamační email. Koupil/a jsem [produkt], vada: [popis]. Chci [výměnu/vrácení]. Formální, ne agresivní.", en: "Write complaint email. I bought [product], defect: [desc]. I want [exchange/refund]. Formal, not aggressive." }},
      ]},
    { task: { cs: "Napsat článek", en: "Write article" }, icon: "📝", mods: ["ChatGPT", "Claude"],
      promptTip: { cs: "Řekněte pro koho, jak dlouhý, jestli chcete tipy nebo příběhy.", en: "Tell AI who it's for, how long, and if you want tips or stories." },
      ps: [
        { label: { cs: "Blog post", en: "Blog post" }, p: { cs: "Napiš blogový článek o [téma]. Cílovka: začátečníci. 500 slov. 3 tipy. Poutavý úvod s otázkou. Závěr s CTA.", en: "Blog post about [topic]. Target: beginners. 500 words. 3 tips. Engaging intro with question. CTA conclusion." }},
        { label: { cs: "Informativní článek", en: "Informative article" }, p: { cs: "Napiš informativní článek o [téma]. Přístupný styl. Sekce s podnadpisy. 600 slov. Shrnutí na konci.", en: "Informative article about [topic]. Accessible style. Sections with subheadings. 600 words. Summary at end." }},
      ]},
    { task: { cs: "Shrnout dokument", en: "Summarize" }, icon: "📋", mods: ["Claude", "NotebookLM"],
      promptTip: { cs: "Řekněte JAK chcete shrnutí — body, odstavec, pro šéfa.", en: "Say HOW you want it — bullets, paragraph, for boss or layperson." },
      ps: [
        { label: { cs: "5 bodů", en: "5 points" }, p: { cs: "Shrň do 5 hlavních bodů. Každý bod jednou větou. Jednovětý závěr.\n\n[vložte text nebo nahrajte PDF]", en: "Summarize into 5 key points. One sentence each. One-sentence conclusion.\n\n[paste text or upload PDF]" }},
        { label: { cs: "Pro šéfa", en: "For the boss" }, p: { cs: "Shrň tak, abych ho mohl/a prezentovat šéfovi za 2 minuty. Max 150 slov. Začni nejdůležitějším zjištěním.\n\n[dokument]", en: "Summarize to present to boss in 2 minutes. Max 150 words. Start with most important finding.\n\n[document]" }},
      ]},
    { task: { cs: "Sociální sítě", en: "Social media" }, icon: "📱", mods: ["ChatGPT"],
      promptTip: { cs: "Specifikujte platformu — každá má jiný styl.", en: "Specify platform — each has different style and length." },
      ps: [
        { label: { cs: "Instagram", en: "Instagram" }, p: { cs: "Vytvoř Instagram příspěvek o [téma]. Poutavý popisek (max 150 slov), 15 hashtagů a návrh obrázku.", en: "Instagram post about [topic]. Caption (max 150 words), 15 hashtags and image suggestion." }},
        { label: { cs: "LinkedIn", en: "LinkedIn" }, p: { cs: "Napiš LinkedIn příspěvek o [téma]. Profesionální ale osobní. Začni příběhem nebo statistikou. 150 slov. Otázka pro diskuzi.", en: "LinkedIn post about [topic]. Professional but personal. Start with story or stat. 150 words. Discussion question." }},
      ]},
    { task: { cs: "Plánování", en: "Planning" }, icon: "🗓️", mods: ["ChatGPT", "Gemini"],
      promptTip: { cs: "Čím víc detailů (budget, zájmy, omezení), tím lepší plán.", en: "More details (budget, interests, constraints) = more useful plan." },
      ps: [
        { label: { cs: "Výlet", en: "Trip" }, p: { cs: "Naplánuj 5denní výlet do [město]. Budget [částka] Kč. Zájmy: [zájmy]. Itinerář s časy, cenami, tipy na jídlo a dopravu.", en: "Plan 5-day trip to [city]. Budget [amount]. Interests: [interests]. Itinerary with times, prices, food tips, transport." }},
        { label: { cs: "Jídelníček", en: "Meal plan" }, p: { cs: "Jídelníček na týden. Omezení: [dietní]. Budget [částka] Kč. Recepty do 30 minut. Nákupní seznam.", en: "Weekly meal plan. Restrictions: [dietary]. Budget [amount]. Recipes under 30 min. Shopping list by store section." }},
      ]},
    { task: { cs: "Učení", en: "Learning" }, icon: "🎓", mods: ["ChatGPT", "Claude"],
      promptTip: { cs: "Řekněte AI ať vysvětluje jednoduše s příklady.", en: "Tell AI to explain simply with examples." },
      ps: [
        { label: { cs: "Jednoduché vysvětlení", en: "Simple explanation" }, p: { cs: "Vysvětli mi [téma] jednoduše. Příklady z běžného života. Shrnutí 3 hlavních bodů.", en: "Explain [topic] simply. Everyday examples. Summary of 3 key points." }},
        { label: { cs: "Interaktivní učení", en: "Interactive learning" }, p: { cs: "Chci se naučit [téma]. Buď můj učitel. Postupuj po malých krocích. Po každém kroku polož otázku.", en: "I want to learn [topic]. Be my teacher. Go step by step. Ask me a question after each step." }},
      ]},
  ],
  intermediate: [
    { task: { cs: "Copywriting", en: "Copywriting" }, icon: "✏️", mods: ["ChatGPT", "Claude"],
      promptTip: { cs: "Specifikujte framework (AIDA, PAS), cílovou skupinu a USP.", en: "Always specify framework (AIDA, PAS), target audience and USP." },
      ps: [
        { label: { cs: "AIDA prodejní text", en: "AIDA sales copy" }, p: { cs: "Prodejní text pro [produkt]. Cílovka: [popis]. AIDA framework. 300 slov. 3 varianty nadpisu. USP: [výhoda].", en: "Sales copy for [product]. Target: [desc]. AIDA framework. 300 words. 3 headlines. USP: [advantage]." }},
        { label: { cs: "PAS email", en: "PAS email" }, p: { cs: "Prodejní email PAS (Problem, Agitate, Solution). Produkt: [produkt]. Subject: 3 varianty. Max 200 slov.", en: "PAS email (Problem, Agitate, Solution). Product: [product]. Subject: 3 variants. Max 200 words." }},
      ]},
    { task: { cs: "Analýza dat", en: "Data analysis" }, icon: "📊", mods: ["ChatGPT", "Claude"],
      promptTip: { cs: "Řekněte přesně co chcete zjistit a jaký typ vizualizace.", en: "Say exactly what you want to find and what visualization type." },
      ps: [
        { label: { cs: "Kompletní analýza", en: "Full analysis" }, p: { cs: "Analyzuj dataset:\n1) Základní statistiky\n2) Top 3 trendy\n3) Anomálie\n4) Korelace\n5) 3 vizualizace\n6) Akční kroky\n\n[nahrajte soubor]", en: "Analyze dataset:\n1) Basic stats\n2) Top 3 trends\n3) Anomalies\n4) Correlations\n5) 3 visualizations\n6) Action items\n\n[upload file]" }},
      ]},
    { task: { cs: "Psaní kódu", en: "Coding" }, icon: "💻", mods: ["Claude Sonnet", "ChatGPT", "DeepSeek R1"],
      promptTip: { cs: "Specifikujte jazyk, kvalitu a ukažte příklad vstupu/výstupu.", en: "Specify language, quality requirements and example input/output." },
      ps: [
        { label: { cs: "Nová funkce", en: "New function" }, p: { cs: "Napiš [jazyk] funkci: [popis].\n1) Ošetření chyb\n2) Typové anotace\n3) Komentáře\n4) 3 unit testy\n\nVstup: [příklad]\nVýstup: [příklad]", en: "Write [language] function: [desc].\n1) Error handling\n2) Type annotations\n3) Doc comments\n4) 3 unit tests\n\nInput: [example]\nOutput: [example]" }},
        { label: { cs: "Debug a oprava", en: "Debug and fix" }, p: { cs: "Kód nefunguje:\n\n```\n[kód]\n```\n\nChyba: [popis]\n\n1) Najdi bug\n2) Vysvětli proč\n3) Navrhni vylepšení", en: "Code doesn't work:\n\n```\n[code]\n```\n\nError: [desc]\n\n1) Find bug\n2) Explain why\n3) Suggest improvements" }},
      ]},
    { task: { cs: "Brainstorming", en: "Brainstorming" }, icon: "💡", mods: ["ChatGPT", "Claude"],
      promptTip: { cs: "Požádejte o hodně nápadů a pak nechte AI vybrat nejlepší.", en: "Ask for many ideas (even wild) then let AI pick best." },
      ps: [
        { label: { cs: "20 nápadů → top 5", en: "20 ideas → top 5" }, p: { cs: "Kreativní nápady na [téma]:\n1) 20 nápadů (včetně neobvyklých)\n2) Vyber 5 nejlepších\n3) Pro každý: proč dobrý, jak realizovat, překážky", en: "Creative ideas for [topic]:\n1) 20 ideas (including unusual)\n2) Pick 5 best\n3) For each: why good, how to implement, obstacles" }},
        { label: { cs: "Více perspektiv", en: "Multiple perspectives" }, p: { cs: "Přemýšlej o [problém] z 5 perspektiv:\n1) Zákazník\n2) Konkurence\n3) Technologie\n4) Finance\n5) Sociální dopad\n\n3 řešení pro každou perspektivu.", en: "Think about [problem] from 5 perspectives:\n1) Customer\n2) Competition\n3) Technology\n4) Finance\n5) Social impact\n\n3 solutions per perspective." }},
      ]},
    { task: { cs: "Research", en: "Research" }, icon: "🔎", mods: ["Perplexity", "Claude"],
      promptTip: { cs: "Pro research Perplexity (cituje). Pro hlubokou analýzu Claude.", en: "Use Perplexity for research (cites). For deep analysis send to Claude." },
      ps: [
        { label: { cs: "Kompletní rešerše", en: "Full research" }, p: { cs: "Rešerše: [téma]\n1) Současný stav\n2) Hlavní hráči\n3) Trendy (2 roky)\n4) Výzvy\n5) Predikce 2-3 roky\n6) Závěry\n\nUveď zdroje.", en: "Research: [topic]\n1) Current state\n2) Key players\n3) Trends (2 years)\n4) Challenges\n5) 2-3 year predictions\n6) Conclusions\n\nCite sources." }},
        { label: { cs: "Srovnávací analýza", en: "Comparative analysis" }, p: { cs: "Porovnej [A] vs [B] vs [C]:\n• Výhody a nevýhody\n• Cena/hodnota\n• Pro koho vhodné\n\nSrovnávací tabulka + doporučení.", en: "Compare [A] vs [B] vs [C]:\n• Pros and cons\n• Price/value\n• Best for whom\n\nComparison table + recommendation." }},
      ]},
  ],
  advanced: [
    { task: { cs: "SEO obsah", en: "SEO content" }, icon: "🔍", mods: ["Claude Opus", "ChatGPT"],
      promptTip: { cs: "Specifikujte search intent a LSI klíčová slova.", en: "Always specify search intent and LSI keywords." },
      ps: [
        { label: { cs: "SEO článek", en: "SEO article" }, p: { cs: "SEO článek '[keyword]':\n• H1 s keyword\n• Hook intro\n• FAQ sekce (5 otázek)\n• Meta title (max 60 znaků)\n• Meta description (max 155 znaků)\n• 2000+ slov\n• LSI: [seznam]", en: "SEO article '[keyword]':\n• H1 with keyword\n• Hook intro\n• FAQ (5 PAA questions)\n• Meta title (max 60ch)\n• Meta description (max 155ch)\n• 2000+ words\n• LSI: [list]" }},
        { label: { cs: "SEO brief", en: "SEO brief" }, p: { cs: "SEO brief pro '[keyword]':\n1) Search intent\n2) H1-H3 struktura\n3) LSI keywords\n4) Internal linking\n5) Featured snippet\n6) Schema markup\n7) Competitor gap", en: "SEO brief for '[keyword]':\n1) Search intent\n2) H1-H3 structure\n3) LSI keywords\n4) Internal linking\n5) Featured snippet\n6) Schema markup\n7) Competitor gap" }},
      ]},
    { task: { cs: "Byznys plán", en: "Business plan" }, icon: "💼", mods: ["Claude Opus"],
      promptTip: { cs: "Použijte XML tagy: <business>, <market>, <goals>.", en: "Use XML tags: <business>, <market>, <goals>." },
      ps: [
        { label: { cs: "Kompletní plán", en: "Full plan" }, p: { cs: "<business>[popis]</business>\n<market>[trh]</market>\n<goals>[cíle]</goals>\n\n1) Executive summary\n2) Analýza trhu (TAM/SAM/SOM)\n3) Konkurence\n4) BMC\n5) GTM strategie\n6) Finanční projekce 3 roky\n7) Rizika\n8) KPIs", en: "<business>[desc]</business>\n<market>[market]</market>\n<goals>[goals]</goals>\n\n1) Executive summary\n2) Market analysis (TAM/SAM/SOM)\n3) Competition\n4) BMC\n5) GTM strategy\n6) 3-year financials\n7) Risks\n8) KPIs" }},
      ]},
    { task: { cs: "Web development", en: "Web development" }, icon: "🌐", mods: ["Claude Sonnet", "v0"],
      promptTip: { cs: "Specifikujte tech stack, design styl a všechny sekce.", en: "Specify tech stack, design style and all sections." },
      ps: [
        { label: { cs: "Landing page", en: "Landing page" }, p: { cs: "Landing page pro [produkt]. React + Tailwind CSS.\n1) Hero s CTA\n2) 3-4 benefity\n3) Jak to funguje\n4) Testimonials\n5) Pricing (3 plány)\n6) FAQ accordion\n7) Footer\n\nResponsive, dark/light mode, minimalistický design.", en: "Landing page for [product]. React + Tailwind CSS.\n1) Hero with CTA\n2) 3-4 benefits\n3) How it works (3 steps)\n4) Testimonials\n5) Pricing (3 tiers)\n6) FAQ accordion\n7) Footer\n\nResponsive, dark/light mode, minimal design." }},
      ]},
    { task: { cs: "Prompt engineering", en: "Prompt engineering" }, icon: "🧠", mods: ["Claude Opus"],
      promptTip: { cs: "Dobrý systémový prompt má jasnou roli, omezení a příklady.", en: "Good system prompt has clear role, constraints and examples." },
      ps: [
        { label: { cs: "Systémový prompt", en: "System prompt" }, p: { cs: "Systémový prompt pro AI asistenta:\n\nRole: [popis]\nÚčel: [co dělá]\nUživatelé: [kdo]\n\n1) Role a osobnost\n2) Znalosti a omezení\n3) Formát odpovědí\n4) 3 příklady (few-shot)\n5) Edge cases\n6) Safety guardrails\n7) Anti-injection ochrana", en: "System prompt for AI assistant:\n\nRole: [desc]\nPurpose: [what it does]\nUsers: [who]\n\n1) Role and personality\n2) Knowledge and limits\n3) Response format\n4) 3 examples (few-shot)\n5) Edge cases\n6) Safety guardrails\n7) Anti-injection protection" }},
      ]},
    { task: { cs: "Sales funnel", en: "Sales funnel" }, icon: "🎯", mods: ["ChatGPT", "Claude"],
      promptTip: { cs: "Definujte produkt, cenu, cílovku a problém, který řešíte.", en: "Define product, price, target and the problem you solve." },
      ps: [
        { label: { cs: "Kompletní funnel", en: "Full funnel" }, p: { cs: "Prodejní funnel:\nProdukt: [produkt], Cena: [cena]\n\n1) TOFU: 3 awareness články\n2) Lead magnet\n3) Email sekvence (7 emailů)\n4) Sales page copy\n5) Upsell strategie\n6) Retargeting\n7) KPIs", en: "Sales funnel:\nProduct: [product], Price: [price]\n\n1) TOFU: 3 awareness articles\n2) Lead magnet\n3) Email sequence (7 emails)\n4) Sales page copy\n5) Upsell strategy\n6) Retargeting\n7) KPIs" }},
      ]},
  ],
};

// ─── MODELS ───────────────────────────────────────────────────────────────────
const MODELS = {
  beginner: [
    { name: "ChatGPT", icon: "🟢", url: "https://chat.openai.com", d: { cs: "Nejpopulárnější AI. Univerzální.", en: "Most popular AI. Universal." }, mv: { cs: "GPT-4o = hlavní | GPT-4o mini = rychlejší | o1 = hluboký reasoning", en: "GPT-4o = main | GPT-4o mini = faster | o1 = deep reasoning (paid)" },
      tips: { cs: ["Buďte konkrétní — '200slovný článek o vaření pro začátečníky'", "Dejte AI roli: 'Jsi zkušený učitel.'", "Říkejte co změnit místo psaní nového dotazu", "'Pokračuj' nebo 'zkrať to' pro úpravu délky"], en: ["Be specific — '200-word cooking article for beginners'", "Give role: 'You are a teacher.'", "Say what to change, don't rewrite the whole prompt", "'Continue' or 'shorten' for length control"] }},
    { name: "Claude", icon: "🟠", url: "https://claude.ai", d: { cs: "Přesný, pečlivý, zvládá dlouhé texty.", en: "Precise, careful, handles long texts." }, mv: { cs: "Haiku = nejrychlejší | Sonnet = rychlý + chytrý | Opus = nejchytřejší", en: "Haiku = fastest | Sonnet = fast + smart | Opus = smartest (paid)" },
      tips: { cs: ["Zvládne celé PDF (200+ stran)", "Jasné instrukce: '3 body, max 100 slov'", "Upřímný — neví-li, řekne", "Strukturovaný výstup: 'problém, řešení, příklad'"], en: ["Handles PDFs (200+ pages)", "Clear instructions: '3 points, max 100 words'", "Honest — says when it doesn't know", "Structured output: 'problem, solution, example'"] }},
    { name: "Gemini", icon: "🔵", url: "https://gemini.google.com", d: { cs: "Google AI. Aktuální informace.", en: "Google AI. Current information." }, mv: { cs: "Flash = rychlý | Pro = hlavní | Ultra = nejsilnější", en: "Flash = fast | Pro = main | Ultra = most powerful" },
      tips: { cs: ["Hledá aktuální info na internetu", "Funguje s Gmail, Docs, Drive", "'Shrň tuto stránku' + odkaz"], en: ["Searches current info online", "Works with Gmail, Docs, Drive", "'Summarize this page' + link"] }},
    { name: "DeepSeek", icon: "🟤", url: "https://chat.deepseek.com", d: { cs: "Zdarma! R1 ukazuje myšlenkový postup.", en: "Free! R1 shows thinking process." }, mv: { cs: "V3 = rychlý | R1 = reasoning (jako o1, ale zdarma!)", en: "V3 = fast, universal | R1 = step-by-step reasoning (like o1, free!)" },
      tips: { cs: ["Úplně zdarma bez limitů", "R1 ukazuje jak přemýšlí — skvělé na učení", "Silný v matematice a logice", "Funguje dobře česky"], en: ["Completely free, no limits", "R1 shows thinking — great for learning", "Strong in math and logic", "Works in many languages"] }},
    { name: "NotebookLM", icon: "📘", url: "https://notebooklm.google.com", d: { cs: "Pro učení z dokumentů. Zdarma.", en: "For learning from documents. Free." }, mv: { cs: "Zaměřený na analýzu nahraných dokumentů", en: "Focused on analyzing uploaded documents" },
      tips: { cs: ["Až 50 zdrojů najednou", "Odpovídá s citacemi z dokumentů", "Umí vytvořit podcast!", "Ideální na studium a výzkum"], en: ["Up to 50 sources at once", "Answers with citations from docs", "Can create podcasts!", "Ideal for studying and research"] }},
  ],
  intermediate: [
    { name: "ChatGPT (GPT-4o)", icon: "🟢", url: "https://chat.openai.com", d: { cs: "Multimodální. Text, obrázky, kód, data.", en: "Multimodal. Text, images, code, data." }, mv: { cs: "GPT-4o = hlavní | o1 = hluboký reasoning | GPT-4o mini = lehký", en: "GPT-4o = main | o1 = deep reasoning | GPT-4o mini = light" },
      tips: { cs: ["Custom Instructions pro váš kontext", "CSV/Excel → Python analýza + grafy", "Vlastní GPTs pro opakující se úkoly", "DALL-E 3 pro obrázky v chatu"], en: ["Custom Instructions for your context", "CSV/Excel → Python analysis + charts", "Custom GPTs for recurring tasks", "DALL-E 3 for images in chat"] }},
    { name: "Claude (Sonnet/Opus)", icon: "🟠", url: "https://claude.ai", d: { cs: "Silný v analýze, kódu. 200K tokenů.", en: "Strong in analysis, code. 200K tokens." }, mv: { cs: "Haiku = rychlé | Sonnet = nejlepší poměr | Opus = nejchytřejší", en: "Haiku = quick | Sonnet = best ratio | Opus = smartest" },
      tips: { cs: ["Artifacts → interaktivní komponenty", "Projekty sdílejí kontext", "XML tagy: <context>, <task>", "200K tokenů = celé knihy"], en: ["Artifacts → interactive components", "Projects share context across conversations", "XML tags: <context>, <task>", "200K tokens = entire books in one call"] }},
    { name: "DeepSeek R1", icon: "🟤", url: "https://chat.deepseek.com", d: { cs: "Zdarma reasoning model.", en: "Free reasoning model." }, mv: { cs: "V3 = rychlý | R1 = reasoning (o1 konkurent, zdarma!)", en: "V3 = fast | R1 = reasoning (o1 competitor, free!)" },
      tips: { cs: ["Zdarma alternativa k o1", "Vidíte myšlenkový postup", "Silný v matematice a kódu", "Open-source — lokálně přes Ollama"], en: ["Free o1 alternative", "See full thinking process", "Strong in math and code", "Open-source — run locally via Ollama"] }},
    { name: "Perplexity", icon: "🟣", url: "https://perplexity.ai", d: { cs: "AI search s citacemi.", en: "AI search with citations." }, mv: { cs: "Default = rychlý | Pro = volba modelu", en: "Default = fast | Pro = model choice" },
      tips: { cs: ["Citace u každé odpovědi", "Focus: Academic, Writing, Math", "Ideální na research"], en: ["Citations with every answer", "Focus: Academic, Writing, Math", "Ideal for research"] }},
    { name: "Midjourney", icon: "🎨", url: "https://midjourney.com", d: { cs: "Nejlepší generátor obrázků.", en: "Best image generator." }, mv: { cs: "v6.1 = nejnovější | Niji = anime styl", en: "v6.1 = latest | Niji = anime style" },
      tips: { cs: ["--ar 16:9, --style raw, --chaos 30", "Vždy promptujte anglicky", "--no pro vyloučení prvků z výsledku"], en: ["--ar 16:9, --style raw, --chaos 30", "Always prompt in English", "--no to exclude elements from result"] }},
  ],
  advanced: [
    { name: "Claude (Opus/Sonnet)", icon: "🟠", url: "https://claude.ai", d: { cs: "Top pro analýzu, strategii, kód.", en: "Top for analysis, strategy, code." }, mv: { cs: "Opus = nejhlubší | Sonnet = denní driver | Haiku = ultra rychlý", en: "Opus = deepest | Sonnet = daily driver | Haiku = ultra fast" },
      tips: { cs: ["XML: <role>, <context>, <constraints>", "Claude Code CLI pro agentické kódování", "Extended thinking pro složité úkoly", "Batched API — 50% sleva na velkých objemech"], en: ["XML: <role>, <context>, <constraints>", "Claude Code CLI for agentic coding", "Extended thinking for complex tasks", "Batched API — 50% discount at scale"] }},
    { name: "ChatGPT (GPT-4o / o1)", icon: "🟢", url: "https://platform.openai.com", d: { cs: "Multimodální ekosystém s API.", en: "Multimodal ecosystem with API." }, mv: { cs: "GPT-4o = nejuniverzálnější | o1 = nejhlubší reasoning | o1-mini = levnější", en: "GPT-4o = most universal | o1 = deepest reasoning | o1-mini = cheaper" },
      tips: { cs: ["Function calling pro strukturované výstupy", "Custom GPTs + Actions pro workflow", "Fine-tuning pro specifické use-case", "JSON mode pro API integrace"], en: ["Function calling for structured outputs", "Custom GPTs + Actions for workflows", "Fine-tuning for specific use cases", "JSON mode for API integrations"] }},
    { name: "DeepSeek R1", icon: "🟤", url: "https://chat.deepseek.com", d: { cs: "Zdarma reasoning. Open-source.", en: "Free reasoning. Open-source." }, mv: { cs: "R1 = plný model | R1-Lite = odlehčený", en: "R1 = full model | R1-Lite = lighter version" },
      tips: { cs: ["Ollama, vLLM pro lokální nasazení", "Zdarma konkurent o1", "OpenAI-kompatibilní API"], en: ["Ollama, vLLM for local deployment", "Free o1 competitor at production scale", "OpenAI-compatible API"] }},
    { name: "Cursor", icon: "⌨️", url: "https://cursor.sh", d: { cs: "AI-first code editor.", en: "AI-first code editor." }, mv: { cs: "Volba modelu: Claude Sonnet, GPT-4o", en: "Model choice: Claude Sonnet, GPT-4o" },
      tips: { cs: ["Composer edituje napříč soubory", ".cursorrules pro trvalý kontext projektu", "@ reference pro dokumentaci a soubory"], en: ["Composer edits across multiple files", ".cursorrules for persistent project context", "@ references for docs and specific files"] }},
    { name: "Perplexity Pro", icon: "🟣", url: "https://perplexity.ai", d: { cs: "Pro-tier search s volbou modelu.", en: "Pro-tier search with model choice." }, mv: { cs: "GPT-4o, Claude, Llama, Mistral — dle výběru", en: "GPT-4o, Claude, Llama, Mistral — your choice" },
      tips: { cs: ["Pro Mode vícekrokový hluboký research", "Spaces pro týmovou spolupráci", "API pro integrace do workflow"], en: ["Pro Mode multi-step deep research", "Spaces for team collaboration", "API for workflow integrations"] }},
  ],
};

// ─── HEADER COMPONENT (stable — defined outside AIGuide) ─────────────────────
function AppHeader({ lang, setLang, t, dark, setDark, headerBg, border, muted, text }) {
  return (
    <header style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "0 32px", height: 64,
      borderBottom: `1px solid ${border}`,
      position: "sticky", top: 0, zIndex: 100,
      background: headerBg, backdropFilter: "blur(20px)",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `linear-gradient(135deg, ${T.accent}, #F97316)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 700, color: "#000",
          boxShadow: `0 0 20px rgba(245,158,11,0.4)`,
          flexShrink: 0,
        }}>✦</div>
        <span style={{ fontSize: 17, fontWeight: 700, color: text, letterSpacing: "-0.02em" }}>{t.title}</span>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {["cs", "en"].map(l => (
          <button key={l} onClick={() => setLang(l)} style={{
            padding: "5px 13px", borderRadius: 6,
            border: `1px solid ${lang === l ? T.accent : border}`,
            background: lang === l ? T.accentLo : "transparent",
            color: lang === l ? T.accent : muted,
            cursor: "pointer", fontSize: 12, fontWeight: 600,
            fontFamily: "inherit", letterSpacing: "0.04em",
            transition: "all .2s",
          }}>{l.toUpperCase()}</button>
        ))}
        <span style={{ width: 1, height: 18, background: border, margin: "0 4px" }} />
        <button onClick={() => setDark(!dark)} title={dark ? "Switch to light mode" : "Switch to dark mode"} style={{
          padding: "5px 11px", borderRadius: 6,
          border: `1px solid ${border}`,
          background: "transparent",
          color: muted,
          cursor: "pointer", fontSize: 14,
          fontFamily: "inherit", transition: "all .2s",
          lineHeight: 1,
        }}>{dark ? "☀️" : "🌙"}</button>
      </div>
    </header>
  );
}

// ─── BACKGROUND CANVAS (Pendle-style orbs + grid) ────────────────────────────
function Background({ dark }) {
  const orbGrid = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* Dot grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(circle, ${orbGrid} 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
      }} />
      {/* Orb 1 — teal left */}
      <div style={{
        position: "absolute", width: 700, height: 700,
        left: "-15%", top: "-10%",
        background: "radial-gradient(circle, rgba(45,212,191,0.13) 0%, transparent 65%)",
        borderRadius: "50%",
        animation: "orbFloat1 18s ease-in-out infinite",
      }} />
      {/* Orb 2 — amber center-right */}
      <div style={{
        position: "absolute", width: 600, height: 600,
        right: "-10%", top: "15%",
        background: "radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 65%)",
        borderRadius: "50%",
        animation: "orbFloat2 22s ease-in-out infinite",
      }} />
      {/* Orb 3 — purple bottom */}
      <div style={{
        position: "absolute", width: 500, height: 500,
        left: "30%", bottom: "-10%",
        background: "radial-gradient(circle, rgba(167,139,250,0.09) 0%, transparent 65%)",
        borderRadius: "50%",
        animation: "orbFloat3 26s ease-in-out infinite",
      }} />
      {/* Horizontal line accent */}
      <div style={{
        position: "absolute", top: "45%", left: 0, right: 0,
        height: 1,
        background: `linear-gradient(90deg, transparent, ${T.teal}22, ${T.accent}18, transparent)`,
      }} />
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AIGuide() {
  const [lang, setLang]           = useState("cs");
  const [level, setLevel]         = useState(null);
  const [tab, setTab]             = useState("tools");
  const [expCat, setExpCat]       = useState(null);
  const [pView, setPView]         = useState("byTask");
  const [pLang, setPLang]         = useState("cs");
  const [expP, setExpP]           = useState(null);
  const [expM, setExpM]           = useState(null);
  const [expG, setExpG]           = useState(null);
  const [copied, setCopied]       = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [search, setSearch]       = useState("");
  const [dark, setDark]           = useState(true);

  const t = L[lang];
  // Theme-aware tokens
  const bg      = dark ? "#06060A"                    : "#FAFAF7";
  const surface = dark ? "rgba(255,255,255,0.038)"    : "rgba(0,0,0,0.04)";
  const border  = dark ? "rgba(255,255,255,0.07)"     : "rgba(0,0,0,0.09)";
  const text    = dark ? "#F1F0EE"                    : "#111118";
  const muted   = dark ? "#8A8A9A"                    : "#6B6B7A";
  const faint   = dark ? "#4A4A5A"                    : "#B0B0BC";
  const headerBg= dark ? "rgba(6,6,10,0.85)"          : "rgba(250,250,247,0.88)";
  const orbGrid = dark ? "rgba(255,255,255,0.06)"     : "rgba(0,0,0,0.04)";

  const cp = useCallback((txt, id) => {
    navigator.clipboard.writeText(txt).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const handleSelectLevel = (id) => {
    setLevel(id);
    setExpCat(null); setExpP(null); setExpM(null); setExpG(null);
    setTab("tools"); setShowGuide(false); setSearch("");
    window.scrollTo(0, 0);
  };

  // ── Sub-components ──
  const Pill = ({ active, children, onClick }) => (
    <button onClick={onClick} style={{
      padding: "5px 14px", borderRadius: 6,
      border: `1px solid ${active ? T.accent : border}`,
      background: active ? T.accentLo : "transparent",
      color: active ? T.accent : muted,
      cursor: "pointer", fontSize: 13, fontWeight: 500,
      fontFamily: "inherit", transition: "all .2s",
    }}>{children}</button>
  );

  const Badge = ({ price }) => {
    const map = { free: [T.green, "rgba(16,185,129,0.12)"], paid: [T.red, "rgba(239,68,68,0.12)"], freemium: [T.accent, T.accentLo] };
    const [clr, bg] = map[price] || [muted, surface];
    return (
      <span style={{ padding: "3px 9px", borderRadius: 5, fontSize: 11, fontWeight: 600, background: bg, color: clr, border: `1px solid ${clr}28`, letterSpacing: "0.03em" }}>
        {t[price]}
      </span>
    );
  };

  const Acc = ({ expanded, onToggle, icon, title, sub, children }) => (
    <div style={{
      borderRadius: 12, marginBottom: 8, overflow: "hidden",
      border: `1px solid ${expanded ? T.accent + "55" : border}`,
      background: expanded ? "rgba(245,158,11,0.05)" : surface,
      transition: "all .25s",
    }}>
      <button onClick={onToggle} style={{
        width: "100%", textAlign: "left", background: "transparent",
        border: "none", padding: "16px 20px", cursor: "pointer",
        fontFamily: "inherit", color: text,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        minHeight: 60,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
          {icon && <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: text }}>{title}</div>
            {sub && <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>{sub}</div>}
          </div>
        </div>
        <span style={{
          fontSize: 10, color: expanded ? T.accent : faint,
          transition: "transform .25s", transform: expanded ? "rotate(180deg)" : "none",
          flexShrink: 0, marginLeft: 10,
        }}>▼</span>
      </button>
      {expanded && (
        <div style={{ padding: "2px 20px 18px", animation: "fadeIn .2s ease" }}>
          {children}
        </div>
      )}
    </div>
  );

  // Global CSS
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${bg}; }
    a { text-decoration: none; color: ${T.accent}; }
    a:hover { opacity: .75; }
    ::selection { background: ${T.accent}44; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes orbFloat1 { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(40px,-30px) scale(1.05); } 66% { transform: translate(-20px,20px) scale(0.97); } }
    @keyframes orbFloat2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-30px,40px) scale(1.08); } }
    @keyframes orbFloat3 { 0%,100% { transform: translate(0,0); } 40% { transform: translate(50px,-20px); } 80% { transform: translate(-10px,30px); } }
    @keyframes shimmer { 0% { opacity: 0; transform: translateY(16px); } 100% { opacity: 1; transform: translateY(0); } }
    .lvl-card { transition: all .25s !important; }
    .lvl-card:hover { border-color: ${T.accent}88 !important; background: rgba(245,158,11,0.06) !important; transform: translateY(-3px) !important; box-shadow: 0 8px 32px rgba(245,158,11,0.08) !important; }
    .back-btn:hover { color: ${T.accent} !important; border-color: ${T.accent}66 !important; }
    input:focus { outline: none; border-color: ${T.accent}88 !important; box-shadow: 0 0 0 3px ${T.accentLo} !important; }
    .tab-btn:hover { border-color: ${T.accent}44 !important; }
    .tool-link:hover { color: ${T.teal} !important; }
    ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${faint}; border-radius: 4px; }
  `;

  // ── HOME SCREEN ──────────────────────────────────────────────────────────────
  if (!level) {
    const lvls = [
      { id: "beginner",     e: "🌱", l: t.beg, d: t.begD, color: T.green, glow: "rgba(16,185,129,0.15)" },
      { id: "intermediate", e: "🌿", l: t.mid, d: t.midD, color: T.teal,  glow: "rgba(45,212,191,0.15)" },
      { id: "advanced",     e: "🌳", l: t.adv, d: t.advD, color: T.accent, glow: "rgba(245,158,11,0.15)" },
    ];
    return (
      <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "'Sora',sans-serif", position: "relative" }}>
        <style>{css}</style>
        <Background dark={dark} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <AppHeader lang={lang} setLang={setLang} t={t} dark={dark} setDark={setDark} headerBg={headerBg} border={border} muted={muted} text={text} />
          <main style={{ maxWidth: 520, margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>

            {/* Hero badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 16px", borderRadius: 20,
              border: `1px solid ${border}`,
              background: surface, marginBottom: 32,
              fontSize: 12, color: muted, letterSpacing: "0.06em",
              animation: "shimmer .6s ease both",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, display: "inline-block", boxShadow: `0 0 8px ${T.green}` }} />
              PRŮVODCE · GUIDE
            </div>

            <h1 style={{
              fontSize: "clamp(36px, 7vw, 52px)", fontWeight: 700,
              letterSpacing: "-0.035em", lineHeight: 1.1,
              marginBottom: 16,
              animation: "shimmer .7s .1s ease both",
              opacity: 0, animationFillMode: "forwards",
            }}>
              <span style={{ color: T.accent }}>AI</span>{" "}
              <span style={{ color: text }}>{lang === "cs" ? "Průvodce" : "Guide"}</span>
            </h1>

            <p style={{
              fontSize: 15, color: muted, marginBottom: 56, lineHeight: 1.7,
              maxWidth: 380, margin: "0 auto 56px",
              animation: "shimmer .7s .2s ease both", opacity: 0, animationFillMode: "forwards",
            }}>{t.sub}</p>

            <p style={{ fontSize: 12, color: faint, marginBottom: 20, letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.pick}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "shimmer .7s .3s ease both", opacity: 0, animationFillMode: "forwards" }}>
              {lvls.map((lv, i) => (
                <button key={lv.id} className="lvl-card" onClick={() => handleSelectLevel(lv.id)}
                  style={{
                    padding: "24px 28px", borderRadius: 16,
                    border: `1px solid ${border}`,
                    background: surface,
                    cursor: "pointer", textAlign: "left",
                    fontFamily: "inherit", color: text,
                    display: "flex", alignItems: "center", gap: 20,
                    animationDelay: `${0.35 + i * 0.07}s`,
                  }}>
                  {/* Icon circle */}
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                    background: `radial-gradient(circle at 30% 30%, ${lv.glow}, transparent)`,
                    border: `1px solid ${lv.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                  }}>{lv.e}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4, color: text }}>{lv.l}</div>
                    <div style={{ fontSize: 13, color: muted, lineHeight: 1.5 }}>{lv.d}</div>
                  </div>
                  <span style={{ fontSize: 16, color: faint, flexShrink: 0 }}>→</span>
                </button>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ── LEVEL DATA ───────────────────────────────────────────────────────────────
  const allTools   = TOOLS[level]   || [];
  const prompts    = PROMPTS[level] || [];
  const models     = MODELS[level]  || [];
  const guide      = GUIDE[level]?.[lang] || [];
  const hasGuide   = guide.length > 0;
  const toolCount  = allTools.reduce((s, c) => s + c.items.length, 0);
  const promptCount = prompts.reduce((s, p) => s + p.ps.length, 0);

  const q = search.toLowerCase();
  const tools = q
    ? allTools.map(cat => ({ ...cat, items: cat.items.filter(i => i.name.toLowerCase().includes(q) || i.d[lang].toLowerCase().includes(q)) })).filter(c => c.items.length)
    : allTools;

  const levelEmoji = level === "beginner" ? "🌱" : level === "intermediate" ? "🌿" : "🌳";
  const levelName  = level === "beginner" ? t.beg : level === "intermediate" ? t.mid : t.adv;
  const levelColor = level === "beginner" ? T.green : level === "intermediate" ? T.teal : T.accent;

  // ── LEVEL SCREEN ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "'Sora',sans-serif", position: "relative" }}>
      <style>{css}</style>
      <Background />
      <div style={{ position: "relative", zIndex: 1 }}>
        <AppHeader lang={lang} setLang={setLang} t={t} />
        <main style={{ maxWidth: 820, margin: "0 auto", padding: "32px 24px 100px" }}>

          {/* Back button */}
          <button className="back-btn" onClick={() => { setLevel(null); setShowGuide(false); window.scrollTo(0,0); }}
            style={{
              background: "transparent", border: `1px solid ${border}`, borderRadius: 7,
              color: muted, cursor: "pointer", fontSize: 12, fontFamily: "inherit",
              marginBottom: 28, padding: "6px 14px", transition: "all .2s",
              letterSpacing: "0.02em",
            }}>{t.back}</button>

          {/* Level heading */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 11, fontSize: 22, flexShrink: 0,
              background: surface, border: `1px solid ${levelColor}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }} onClick={() => { setLevel(null); setShowGuide(false); window.scrollTo(0,0); }} title={t.back}>{levelEmoji}</div>
            <div>
              <div style={{ fontSize: 11, color: faint, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>{t.breadcrumb}</div>
              <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: text }}>{levelName}</h1>
            </div>
          </div>

          {/* Guide toggle */}
          {hasGuide && (
            <button onClick={() => setShowGuide(!showGuide)} style={{
              width: "100%", padding: "16px 20px", borderRadius: 12,
              border: `1px solid ${showGuide ? T.accent + "55" : border}`,
              background: showGuide ? "rgba(245,158,11,0.06)" : surface,
              cursor: "pointer", fontFamily: "inherit", color: text,
              marginBottom: 20, textAlign: "left",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              transition: "all .25s",
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: showGuide ? T.accent : text }}>{t.guide}</div>
                <div style={{ fontSize: 12, color: muted, marginTop: 3 }}>{t.guideIntro}</div>
              </div>
              <span style={{ fontSize: 10, color: muted, transform: showGuide ? "rotate(180deg)" : "none", transition: "transform .25s" }}>▼</span>
            </button>
          )}

          {showGuide && (
            <div style={{ marginBottom: 24, animation: "fadeIn .25s ease" }}>
              {guide.map((s, i) => (
                <Acc key={i} expanded={expG === i} onToggle={() => setExpG(expG === i ? null : i)} icon="" title={s.title} sub="">
                  <div style={{ fontSize: 13, lineHeight: 1.85, color: muted, whiteSpace: "pre-line", paddingTop: 4 }}>{s.text}</div>
                </Acc>
              ))}
            </div>
          )}

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: `1px solid ${border}`, paddingBottom: 0 }}>
            {[["tools", t.tools, toolCount], ["prompts", t.prompts, promptCount]].map(([k, v, cnt]) => (
              <button key={k} className="tab-btn" onClick={() => { setTab(k); setExpCat(null); setExpP(null); setExpM(null); setSearch(""); }}
                style={{
                  padding: "10px 18px", borderRadius: "8px 8px 0 0",
                  background: tab === k ? surface : "transparent",
                  color: tab === k ? text : faint,
                  fontWeight: tab === k ? 600 : 400, fontSize: 13,
                  border: tab === k ? `1px solid ${border}` : "1px solid transparent",
                  borderBottom: tab === k ? `1px solid ${bg}` : "1px solid transparent",
                  cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 8,
                  marginBottom: -1, transition: "all .2s",
                  letterSpacing: "0.01em",
                }}>
                {v}
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  background: tab === k ? T.accentLo : "transparent",
                  color: tab === k ? T.accent : faint,
                  borderRadius: 5, padding: "2px 6px",
                  border: `1px solid ${tab === k ? T.accent + "33" : "transparent"}`,
                }}>{cnt}</span>
              </button>
            ))}
          </div>

          {/* ── TOOLS TAB ── */}
          {tab === "tools" && (
            <>
              <input type="text" placeholder={t.searchPlaceholder} value={search}
                onChange={e => { setSearch(e.target.value); setExpCat(null); }}
                style={{
                  width: "100%", padding: "11px 16px", borderRadius: 9,
                  border: `1px solid ${border}`, background: surface,
                  color: text, fontSize: 13, fontFamily: "inherit",
                  marginBottom: 16, transition: "all .2s",
                }} />

              {tools.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: muted }}>
                  <div style={{ fontSize: 36, marginBottom: 14 }}>🔍</div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, color: text }}>{t.noResults}</div>
                  <div style={{ fontSize: 13 }}>{t.noResultsSub}</div>
                </div>
              ) : (
                tools.map((cat, ci) => (
                  <Acc key={ci} expanded={expCat === ci} onToggle={() => setExpCat(expCat === ci ? null : ci)} icon={cat.icon} title={cat.cat[lang]} sub={cat.desc[lang]}>
                    {cat.items.map((tool, ti) => (
                      <div key={ti} style={{
                        padding: "14px 16px", borderRadius: 10,
                        background: "rgba(255,255,255,0.025)",
                        border: `1px solid ${border}`,
                        marginBottom: 8,
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontWeight: 600, fontSize: 14, color: text }}>{tool.name}</span>
                          <Badge price={tool.price} />
                        </div>
                        <div style={{ fontSize: 12, color: muted, marginBottom: 5, lineHeight: 1.5 }}>{tool.d[lang]}</div>
                        <div style={{ fontSize: 12, color: muted, marginBottom: 6 }}>
                          <span style={{ color: faint, marginRight: 4 }}>{t.how}</span>{tool.h[lang]}
                        </div>
                        {tool.tip && <div style={S.tipBox}>{t.tip} {tool.tip[lang]}</div>}
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                          <a href={tool.url} target="_blank" rel="noopener noreferrer" className="tool-link"
                            style={{ fontSize: 12, fontWeight: 600, color: T.accent, letterSpacing: "0.02em" }}>{t.open}</a>
                        </div>
                      </div>
                    ))}
                  </Acc>
                ))
              )}
            </>
          )}

          {/* ── PROMPTS TAB ── */}
          {tab === "prompts" && (
            <div>
              {/* Controls row */}
              <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: faint, marginRight: 2 }}>{t.pLang}:</span>
                <Pill active={pLang === "cs"} onClick={() => setPLang("cs")}>{t.cs2}</Pill>
                <Pill active={pLang === "en"} onClick={() => setPLang("en")}>{t.en2}</Pill>
                <span style={{ width: 1, height: 18, background: border, margin: "0 6px" }} />
                <Pill active={pView === "byTask"} onClick={() => { setPView("byTask"); setExpP(null); setExpM(null); }}>{t.byTask}</Pill>
                <Pill active={pView === "byModel"} onClick={() => { setPView("byModel"); setExpP(null); setExpM(null); }}>{t.byModel}</Pill>
              </div>

              {prompts.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 0", color: muted }}>
                  <div style={{ fontSize: 36, marginBottom: 14 }}>🚧</div>
                  <div style={{ fontWeight: 600, color: text }}>{t.comingSoon}</div>
                </div>
              )}

              {pView === "byTask" && prompts.map((item, i) => (
                <Acc key={i} expanded={expP === i} onToggle={() => setExpP(expP === i ? null : i)} icon={item.icon} title={item.task[lang]} sub={t.models + " " + item.mods.join(", ")}>
                  {item.promptTip && <div style={S.ptipBox}>{t.promptTip} {item.promptTip[lang]}</div>}
                  {item.ps.map((p, pi) => (
                    <div key={pi} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: muted, marginBottom: 6, letterSpacing: "0.03em" }}>{p.label[lang]}</div>
                      <div style={{
                        padding: "14px 16px", borderRadius: 10,
                        background: "rgba(255,255,255,0.025)",
                        border: `1px solid ${border}`,
                        position: "relative",
                      }}>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, lineHeight: 1.8, color: text, whiteSpace: "pre-wrap", wordBreak: "break-word", paddingRight: 90 }}>{p.p[pLang]}</div>
                        <button aria-label={t.copyAriaLabel}
                          onClick={() => cp(p.p[pLang], `t${i}-${pi}`)}
                          style={{
                            position: "absolute", top: 12, right: 12,
                            background: copied === `t${i}-${pi}` ? T.green : "rgba(255,255,255,0.06)",
                            border: `1px solid ${copied === `t${i}-${pi}` ? T.green + "44" : border}`,
                            borderRadius: 6, padding: "4px 12px", fontSize: 11,
                            color: copied === `t${i}-${pi}` ? "#fff" : muted,
                            cursor: "pointer", fontFamily: "inherit", fontWeight: 500,
                            transition: "all .2s", whiteSpace: "nowrap",
                          }}>
                          {copied === `t${i}-${pi}` ? t.copied : t.copy}
                        </button>
                      </div>
                    </div>
                  ))}
                </Acc>
              ))}

              {pView === "byModel" && models.map((m, i) => (
                <Acc key={i} expanded={expM === i} onToggle={() => setExpM(expM === i ? null : i)} icon={m.icon} title={m.name} sub={m.d[lang]}>
                  {m.mv && <div style={S.mvBox}><span style={{ fontWeight: 600 }}>{t.mv}:</span> {m.mv[lang]}</div>}
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>{t.tips}</div>
                  {m.tips[lang].map((tip, ti) => (
                    <div key={ti} style={{
                      padding: "10px 14px", borderRadius: 8,
                      background: "rgba(255,255,255,0.025)",
                      border: `1px solid ${border}`,
                      marginBottom: 6, fontSize: 13, lineHeight: 1.6,
                      display: "flex", gap: 10, color: text,
                    }}>
                      <span style={{ color: T.accent, flexShrink: 0 }}>→</span><span>{tip}</span>
                    </div>
                  ))}
                  <a href={m.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-block", marginTop: 12, fontSize: 12, fontWeight: 600, color: T.accent, letterSpacing: "0.02em" }}>{t.open}</a>
                </Acc>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
