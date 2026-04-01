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
    claude: "Claude Průvodce", claudeD: "Interaktivní průvodce reálnými use cases s Claudem krok za krokem.",
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
    claude: "Claude Guide", claudeD: "Interactive step-by-step guide through real Claude use cases.",
  },
};

// ─── GUIDE DATA ───────────────────────────────────────────────────────────────
const GUIDE = {
  beginner: {
    cs: [
      // ── REWRITTEN (Dimension 2: more human, start with experience not definition) ──
      { title: "🤔 Co je umělá inteligence?", text: "Vzpomeňte si na naposledy, kdy jste se na něco chtěli zeptat, ale nevěděli koho. Teď máte někoho k dispozici 24 hodin denně, kdo toho hodně ví, nikdy se nezlobí a má na vás vždy čas.\n\nAI není robot. Je to chytrý software, kterému píšete zprávy a on odpovídá — jako SMS, ale místo člověka odpovídá počítač.\n\nAI umí:\n• Odpovídat na otázky (jako encyklopedie vlastními slovy)\n• Psát texty — emaily, články, dopisy\n• Překládat jazyky\n• Vytvářet obrázky podle popisu\n• Shrnout dlouhé dokumenty\n• Pomoci s plánováním a rozhodováním\n\nA funguje to česky — nemusíte umět anglicky." },
      { title: "💰 Kolik to stojí?", text: "Většina nástrojů má bezplatnou verzi, která pro začátek bohatě stačí.\n\n🟢 Zdarma:\n• ChatGPT — chat.openai.com\n• Gemini — gemini.google.com\n• Claude — claude.ai\n• DeepSeek — chat.deepseek.com\n• NotebookLM — notebooklm.google.com\n\n🟡 Více za předplatné (~500 Kč/měs.):\n• ChatGPT Plus, Claude Pro, Gemini Advanced\n\nZačněte zdarma. Placená verze dává smysl až když víte, že to používáte každý den." },
      { title: "🔐 Jak se zaregistrovat?", text: "1. Otevřete prohlížeč (Chrome, Edge, Safari)\n2. Napište adresu — např. chat.openai.com\n3. Klikněte 'Registrovat' nebo 'Sign up'\n4. Zadejte email a heslo\n5. Na email přijde potvrzení — klikněte na odkaz\n6. Hotovo!\n\n💡 U Gemini stačí Google účet. U většiny nástrojů lze přihlásit přes Google jedním kliknutím.\n\n⚠️ Nemusíte zadávat platební kartu. Pokud ji někde vyžadují hned, hledejte bezplatnou alternativu." },
      // ── REWRITTEN (Dimension 2: empathetic opener, conversational, no rules numbering) ──
      { title: "💬 Jak psát dotazy (prompty)?", text: "Váš první prompt bude špatný. To je v pořádku — tak to funguje u každého. AI není Google. Čím víc mu řeknete, tím lépe vám odpoví.\n\nRozdíl v praxi:\n❌ Špatně: 'Napiš něco o vaření'\n✅ Dobře: 'Napiš jednoduchý recept na svíčkovou pro 4 osoby. Ingredience z běžného supermarketu. Postup krok za krokem, jednoduše.'\n\nCo pomáhá:\n→ Řekněte pro koho text je: 'vysvětli jako pro laika'\n→ Určete délku: 've 3 větách' nebo 'na stránku'\n→ Určete tón: 'formálně' nebo 'přátelsky'\n→ Opravujte výsledek: 'zkrať to', 'víc detailů', 'jiný tón'\n\nAI si nepamatuje vaše předchozí dotazy a nesoudí vás. Klidně se ptejte znovu." },
      // ── REWRITTEN (Dimension 2: lead with reassurance, cautions second) ──
      { title: "🔒 Je to bezpečné?", text: "Pro 95 % věcí co budete dělat — psaní textů, odpovědi na otázky, plánování — je AI naprosto bezpečný nástroj. Nic se nemůže pokazit. Nejhorší co se stane je, že dostanete špatnou odpověď, kterou jednoduše ignorujete.\n\nTady jsou věci, které dělat nechcete:\n• Nezadávejte rodná čísla, hesla nebo čísla karet\n• Důležitá fakta (zdravotní, právní, finanční) si ověřte\n• AI nemá přístup k vašemu počítači ani datům\n\n💡 Berte AI jako radu od chytrého kamaráda — velmi užitečná, ale pro zásadní rozhodnutí konzultujte odborníka." },
      { title: "📱 Na čem to funguje?", text: "🖥️ Počítač — stačí otevřít prohlížeč\n📱 Telefon — prohlížeč nebo zdarma aplikace (App Store / Google Play)\n📱 Tablet — stejně jako telefon\n\nPotřebujete jen internet. Žádná instalace, žádný speciální hardware.\n\n💡 Na telefonu doporučuji stáhnout aplikaci ChatGPT nebo Gemini — jsou pohodlnější než prohlížeč." },
      { title: "🆚 Který nástroj vybrat?", text: "🟢 ChatGPT — nejuniverzálnější, nejlepší pro začátek\n🟠 Claude — nejlepší na dlouhé texty a přesné odpovědi\n🔵 Gemini — hledá aktuální info, propojený s Googlem\n🟤 DeepSeek — úplně zdarma bez limitů\n📘 NotebookLM — pro učení z dokumentů, umí udělat podcast\n🔴 Kimi — na extrémně dlouhé dokumenty\n\n💡 Začněte s ChatGPT. Funguje to hned, bez nastavení. Pokud nesedí, zkuste Claude nebo Gemini." },
      // ── NEW: Mýty a první chyby (Dimension 2) ──
      { title: "🚫 5 největších mýtů o AI", text: "Než začnete, vyvrátíme nejčastější mylné představy.\n\n❌ Mýtus 1: 'AI si věci vymýšlí — nemůžu mu věřit'\n✅ Pravda: AI může chybovat u konkrétních faktů, ale pro psaní emailů, plánování a vysvětlení je spolehlivý. Důležitá fakta jednoduše ověřte. Nemusíte ověřovat každou větu.\n\n❌ Mýtus 2: 'Musím umět anglicky'\n✅ Pravda: ChatGPT, Claude i Gemini fungují výborně česky. Pište česky, dostanete česky.\n\n❌ Mýtus 3: 'Stejně si to pak musím přepsat — nestojí to za čas'\n✅ Pravda: AI dává první návrh za 10 sekund. Upravit návrh trvá zlomek doby oproti psaní od nuly. Cíl je ušetřit 80 % práce, ne 100 %.\n\n❌ Mýtus 4: 'AI má přístup k mým datům'\n✅ Pravda: AI nevidí váš počítač, email ani soubory. Vidí jen to, co mu sami napíšete nebo nahrajete.\n\n❌ Mýtus 5: 'AI je pro mladé a technické lidi'\n✅ Pravda: Nejrychleji rostoucí skupina uživatelů v Evropě je 45–65 let. Pokud zvládáte Google, zvládáte i AI." },
      { title: "😤 Proč to nevychází napoprvé", text: "60–70 % lidí cítí po prvních třech pokusech, že AI 'nefunguje'. Skoro vždy je problém v zadání, ne v AI.\n\n5 nejčastějších chyb začátečníků:\n\n1. Ptáte se jako na Googlu\n   ❌ 'nejlepší restaurace Praha'\n   ✅ 'Doporuč restauraci v centru Prahy na romantickou večeři, max 800 Kč, bez fast foodu'\n\n2. Zadáváte bez kontextu\n   ❌ 'Napiš email'\n   ✅ 'Napiš email šéfovi, omlouvám se za zpoždění. Formální tón, max 80 slov.'\n\n3. Přijmete první výsledek nebo ho rovnou smažete\n   → Iterujte: 'Zkrať to', 'Víc formálně', 'Přidej konkrétní příklad'\n\n4. Kladete příliš složitý úkol najednou\n   → Rozdělte: nejdřív analýza, pak návrh, pak finální verze\n\n5. Vzdáte to při první špatné odpovědi\n   → Správná reakce: 'Toto není co jsem chtěl/a. Zkus to takto: [upřesnění]'\n\n💡 Váš první prompt bude špatný. To je v pořádku. AI vás nesoudí a každý nový chat začíná znovu." },
      // ── NEW SECTION 1 (Dimension 2: "Co AI neumí — a proč je to dobře") ──
      { title: "⚠️ Co AI neumí — a proč je to dobře", text: "AI je mocný nástroj, ale má limity. Znát je vám ušetří zklamání.\n\nCo AI nedělá spolehlivě:\n• Nezná aktuální zprávy a události (pokud nemá přístup k internetu)\n• Může si vymyslet konkrétní fakta — jména, čísla, citace — a uvést je s jistotou\n• Nerozumí vám jako člověk — analyzuje text, nepromýšlí situaci\n• Má znalostní cutoff — neví co se stalo po určitém datu\n\nProč je to vlastně dobře:\n→ Vy jste stále v kontrole. AI je nástroj, ne autorita.\n→ Pro psaní emailů, plánování a vysvětlení konceptů jsou tyto limity téměř bezvýznamné.\n→ Důležité informace (zdravotní, právní, finanční) si jednoduše ověřte u odborníka.\n\n💡 Pravidlo: Čím důležitější rozhodnutí, tím víc ověřujte. Pro každodenní úkoly ověřování nepotřebujete." },
      // ── NEW SECTION 2 (Dimension 2: "Jak opravovat špatné odpovědi") ──
      { title: "🔁 Jak opravovat špatné odpovědi", text: "Když výsledek není dobrý, většina lidí to vzdá. To je škoda — iterace je ta nejdůležitější dovednost při práci s AI.\n\nKdyž je odpověď špatná, nemazejte ji a nezačínejte znovu. Opravte ji:\n\n→ Příliš dlouhé? Napište: 'Zkrať to na 3 věty.'\n→ Příliš obecné? Napište: 'Přidej konkrétní příklad z praxe.'\n→ Špatný tón? Napište: 'Napiš to přátelštěji, méně formálně.'\n→ Chybí detaily? Napište: 'Rozveď bod číslo 2 podrobněji.'\n→ Úplně vedle? Napište: 'Zapomeň na předchozí odpověď. Zkusím to jinak:' a přeformulujte.\n\n5 kroků jak vylepšit jakýkoliv výstup:\n1. Identifikujte co přesně vadí (délka / tón / obsah / struktura)\n2. Napište konkrétní instrukci co změnit\n3. Přečtěte nový výsledek\n4. Opakujte max 2-3x\n5. Pokud nefunguje, začněte nový chat s lepším výchozím zadáním\n\n💡 Cíl není perfektní první výstup — cíl je ušetřit 80 % času na psaní, ne 100 %." },
      // ── NEW SECTION 3 (Dimension 2: "AI v každodenním životě") ──
      { title: "🇨🇿 AI v českém každodenním životě", text: "AI není jen pro techniky a mladé lidi. Nejrychleji rostoucí skupina uživatelů v Evropě je 45–65 let — lidé kteří ho používají na psaní a práci s dokumenty.\n\n10 situací kde AI opravdu pomůže:\n\n1. 📄 Dostali jste nesrozumitelný dopis z úřadu → AI ho vysvětlí lidsky\n2. 💼 Píšete žádost o práci → AI pomůže s motivačním dopisem\n3. 🏥 Nevíte co znamená lékařská zpráva → AI vysvětlí termíny\n4. 🚗 Dostali pokutu a chcete se odvolat → AI napíše odvolání\n5. 🏠 Plánujete rekonstrukci a potřebujete rozpočet → AI pomůže s výpočty\n6. 📚 Dítě má referát do školy → AI vysvětlí téma srozumitelně\n7. ⭐ Zákazník napsal negativní recenzi → AI navrhne profesionální odpověď\n8. 📧 Potřebujete napsat složitý email → AI navrhne znění\n9. 💊 Nevíte zda příznaky jsou urgentní → AI pomůže formulovat otázky pro lékaře\n10. 💰 Zvažujete finanční rozhodnutí → AI pomůže promyslet otázky\n\n💡 Vyzkoušejte jednu situaci ze svého života tento týden. Stačí otevřít ChatGPT a napsat co potřebujete." },
    ],
    en: [
      // ── REWRITTEN (Dimension 2: start with experience, empathetic) ──
      { title: "🤔 What is AI?", text: "Think about the last time you wanted to ask something but didn't know who to ask. Now you have someone available 24 hours a day who knows a lot, never gets annoyed, and always has time for you.\n\nAI is not a robot. It's smart software you write messages to — like texting, but a very knowledgeable computer replies.\n\nAI can:\n• Answer questions (like an encyclopedia in your own words)\n• Write texts — emails, articles, letters\n• Translate languages\n• Create images from descriptions\n• Summarize long documents\n• Help with planning and decisions\n\nAnd it works in Czech, English, and most European languages." },
      { title: "💰 How much does it cost?", text: "Most tools have a free version that's more than enough to start.\n\n🟢 Free: ChatGPT, Gemini, Claude, DeepSeek, NotebookLM\n\n🟡 More with subscription (~$20/mo): ChatGPT Plus, Claude Pro, Gemini Advanced\n\nStart free. A paid plan only makes sense once you know you're using it every day." },
      { title: "🔐 How to register?", text: "1. Open browser (Chrome, Edge, Safari)\n2. Go to the tool — e.g. chat.openai.com\n3. Click 'Sign up'\n4. Enter email and password\n5. Confirm via the email link\n6. Done!\n\n💡 For Gemini, your Google account is enough. Most tools let you sign in with Google in one click.\n\n⚠️ You don't need to enter a credit card. If one is required immediately, look for a free alternative." },
      // ── REWRITTEN (empathetic, conversational) ──
      { title: "💬 How to write prompts?", text: "Your first prompt will be bad. That's fine — it's the same for everyone. AI is not Google. The more you tell it, the better it answers.\n\nThe difference in practice:\n❌ Bad: 'Write something about cooking'\n✅ Good: 'Write a simple beef stew recipe for 4 people. Grocery store ingredients. Step-by-step, simple language.'\n\nWhat helps:\n→ Say who it's for: 'explain like I know nothing about this'\n→ Set the length: 'in 3 sentences' or 'one page'\n→ Set the tone: 'formal' or 'friendly'\n→ Correct the result: 'shorten it', 'more detail', 'different tone'\n\nAI doesn't remember your previous questions and doesn't judge you. Ask again freely." },
      // ── REWRITTEN (reassurance first) ──
      { title: "🔒 Is it safe?", text: "For 95% of what you'll do — writing texts, answering questions, planning — AI is completely safe. Nothing can go wrong. The worst that happens is you get a bad answer, which you simply ignore.\n\nHere's what you don't want to do:\n• Don't enter ID numbers, passwords or card details\n• Verify important facts (medical, legal, financial) with a specialist\n• AI has no access to your computer or files\n\n💡 Think of AI like advice from a knowledgeable friend — very useful, but for major decisions consult an expert." },
      { title: "📱 What devices?", text: "🖥️ Computer — just open a browser\n📱 Phone — browser or free app (App Store / Google Play)\n📱 Tablet — same as phone\n\nAll you need is internet. No installation, no special hardware.\n\n💡 On phone, download the ChatGPT or Gemini app — more comfortable than a browser." },
      { title: "🆚 Which tool?", text: "🟢 ChatGPT — most universal, best to start\n🟠 Claude — best for long texts and precise answers\n🔵 Gemini — current info, connected to Google\n🟤 DeepSeek — completely free with no limits\n📘 NotebookLM — learning from documents, can create podcasts\n🔴 Kimi — extremely long documents\n\n💡 Start with ChatGPT. Works immediately, no setup. If it doesn't feel right, try Claude or Gemini." },
      // ── NEW: Myths and first-task failures (Dimension 2) ──
      { title: "🚫 5 biggest myths about AI", text: "Before you start, let's bust the most common misconceptions.\n\n❌ Myth 1: 'AI makes things up — I can't trust it'\n✅ Truth: AI can be wrong on specific facts, but for writing emails, planning, and explanations it's reliable. Simply verify important facts. You don't need to verify every sentence.\n\n❌ Myth 2: 'I need to know English'\n✅ Truth: ChatGPT, Claude and Gemini all work great in Czech and most European languages. Write in your language, get answers in your language.\n\n❌ Myth 3: 'I'll have to rewrite it anyway — not worth the time'\n✅ Truth: AI delivers a first draft in 10 seconds. Editing a draft takes a fraction of the time of writing from scratch. The goal is to save 80% of the work, not 100%.\n\n❌ Myth 4: 'AI has access to my data'\n✅ Truth: AI can't see your computer, email or files. It only sees what you type or upload into the chat.\n\n❌ Myth 5: 'AI is for young and technical people'\n✅ Truth: The fastest-growing user group in Europe is 45–65 year olds. If you can use Google, you can use AI." },
      { title: "😤 Why it doesn't work first time", text: "60–70% of people feel after their first three attempts that AI 'doesn't work.' Almost always the problem is the prompt, not the AI.\n\n5 most common beginner mistakes:\n\n1. Searching like Google\n   ❌ 'best restaurants Prague'\n   ✅ 'Recommend a restaurant in central Prague for a romantic dinner, max 800 CZK per person, no fast food'\n\n2. Giving no context\n   ❌ 'Write an email'\n   ✅ 'Write an email to my boss apologizing for a delay. Formal tone, max 80 words.'\n\n3. Accepting the first result or deleting it immediately\n   → Iterate: 'Shorten it', 'More formal', 'Add a specific example'\n\n4. Asking something too complex in one go\n   → Break it down: first analysis, then draft, then final version\n\n5. Giving up after the first bad answer\n   → Right response: 'This is not what I wanted. Try it like this: [clarification]'\n\n💡 Your first prompt will be bad. That's fine. AI doesn't judge you and every new chat starts fresh." },
      // ── NEW SECTION 1 ──
      { title: "⚠️ What AI can't do — and why that's fine", text: "AI is a powerful tool but it has limits. Knowing them saves you disappointment.\n\nWhat AI doesn't do reliably:\n• Doesn't know current news and events (unless it has internet access)\n• Can invent specific facts — names, numbers, citations — and state them confidently\n• Doesn't understand you like a human — it analyzes text, doesn't think through situations\n• Has a knowledge cutoff — doesn't know what happened after a certain date\n\nWhy this is actually fine:\n→ You stay in control. AI is a tool, not an authority.\n→ For writing emails, planning, and explaining concepts, these limits barely matter.\n→ For important information (medical, legal, financial), simply verify with a specialist.\n\n💡 Rule: The more important the decision, the more you verify. For everyday tasks, you don't need to verify much." },
      // ── NEW SECTION 2 ──
      { title: "🔁 How to fix bad answers", text: "When the output isn't good, most people give up. That's a shame — iteration is the most important skill when working with AI.\n\nWhen the answer is wrong, don't delete it and start over. Fix it:\n\n→ Too long? Write: 'Shorten it to 3 sentences.'\n→ Too vague? Write: 'Add a specific real-world example.'\n→ Wrong tone? Write: 'Make it friendlier, less formal.'\n→ Missing detail? Write: 'Expand on point number 2 in more detail.'\n→ Completely off? Write: 'Forget the previous answer. Let me try again:' and rephrase.\n\n5 steps to improve any output:\n1. Identify exactly what's wrong (length / tone / content / structure)\n2. Write a specific instruction for what to change\n3. Read the new result\n4. Repeat max 2-3 times\n5. If it's still not working, start a new chat with a better initial prompt\n\n💡 The goal isn't a perfect first output — the goal is to save 80% of your writing time, not 100%." },
      // ── NEW SECTION 3 ──
      { title: "🌍 AI in everyday life", text: "AI isn't just for tech people and young people. The fastest-growing user group in Europe is 45–65 year olds using it for writing and document tasks.\n\n10 situations where AI genuinely helps:\n\n1. 📄 Got an incomprehensible official letter → AI explains it in plain language\n2. 💼 Writing a job application → AI helps with the cover letter\n3. 🏥 Don't understand a medical report → AI explains the terms\n4. 🚗 Got a fine and want to appeal → AI writes the appeal\n5. 🏠 Planning a renovation and need a budget → AI helps with calculations\n6. 📚 Your child has a school project → AI explains the topic clearly\n7. ⭐ A customer left a negative review → AI suggests a professional response\n8. 📧 Need to write a difficult email → AI drafts the wording\n9. 💊 Not sure if symptoms are urgent → AI helps formulate questions for a doctor\n10. 💰 Considering a financial decision → AI helps think through the questions\n\n💡 Try one situation from your own life this week. Just open ChatGPT and write what you need." },
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
      { title: "🏷️ XML promptování", text: "Pokročilí uživatelé používají XML tagy:\n\n\u003crole\u003eJsi zkušený finanční analytik\u003c/role\u003e\n\u003ccontext\u003eAnalyzuji startup v SaaS segmentu\u003c/context\u003e\n\u003ctask\u003eVytvoř finanční projekci na 3 roky\u003c/task\u003e\n\u003cconstraints\u003eKonzervativní odhady, sensitivity analysis\u003c/constraints\u003e\n\u003cformat\u003eTabulka + komentář v bodech\u003c/format\u003e\n\nProč XML funguje:\n• Jasně odděluje roli, kontext, úkol a omezení\n• Snižuje ambiguitu\n• Claude byl trénován s XML strukturou\n\n💡 Pro složité prompty vždy \u003ccontext\u003e + \u003ctask\u003e." },
      { title: "⚙️ Návrh systémových promptů", text: "Systémový prompt je základ každého AI produktu:\n\n1. Definuje roli a osobnost\n2. Vymezuje znalostní bázi\n3. Definuje formát výstupů\n4. Obsahuje few-shot příklady (2–3)\n5. Řeší edge cases\n6. Obsahuje safety guardrails\n\n💡 Testujte s 10 různými vstupy včetně adversariálních před nasazením." },
      { title: "🔌 API a automatizace", text: "Přímé API volání otevírá nové možnosti:\n\nClaude API:\n• claude-opus-4 pro hluboký reasoning\n• Batched API — 50% sleva\n• 200K tokenů context window\n\nOpenAI API:\n• GPT-4o, JSON mode, Function calling\n\nAutomatizace:\n• Make — vizuální workflow + HTTP modul\n• n8n — open-source, self-host\n\n💡 Make + HTTP → Claude API. Za odpoledne automatizace na emails." },
      { title: "🤖 Agentické nástroje", text: "AI agenti vykonávají akce autonomně:\n\nClaude Code (CLI):\n• npm install -g @anthropic-ai/claude-code\n• Edituje soubory, spouští testy\n• Vy schvalujete, AI vykonává\n\nCursor IDE:\n• Composer — editace napříč soubory\n• .cursorrules — kontext projektu\n\nCrewAI:\n• Týmy agentů: Researcher → Writer → Editor\n• Každý má nástroje a předává výsledky\n\n💡 Začněte Claude Code pro kódovací projekty." },
    ],
    en: [
      { title: "🏆 Model Selection for Advanced Tasks", text: "Model choice directly affects output quality:\n\nDeep analysis and strategy:\n→ Claude Opus — strongest reasoning\n→ o1 — chain-of-thought, math and logic\n\nFast iteration and coding:\n→ Claude Sonnet — best speed/performance ratio\n→ GPT-4o — multimodal, diverse tasks\n\nResearch and current data:\n→ Perplexity Pro — cites sources\n→ Gemini Pro — real-time internet\n\n💡 Rule: Right model saves time. Don't use Opus for simple summaries." },
      { title: "🏷️ XML Prompting", text: "Advanced users use XML tags to structure prompts:\n\n\u003crole\u003eYou are an experienced financial analyst\u003c/role\u003e\n\u003ccontext\u003eI'm analyzing a SaaS startup\u003c/context\u003e\n\u003ctask\u003eCreate a 3-year financial projection\u003c/task\u003e\n\u003cconstraints\u003eConservative estimates, sensitivity analysis\u003c/constraints\u003e\n\u003cformat\u003eTable + bullet-point commentary\u003c/format\u003e\n\nWhy XML works:\n• Clearly separates role, context, task, constraints\n• Reduces ambiguity\n• Claude was trained with XML structure\n\n💡 For complex prompts always use \u003ccontext\u003e + \u003ctask\u003e." },
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
      { name: "Claude (Opus)", url: "https://claude.ai", price: "freemium", d: { cs: "Nejchytřejší pro hlubokou analýzu.", en: "Smartest for deep analysis." }, h: { cs: "SWOT, finanční modely, byznys plány.", en: "SWOT, financial models, business plans." }, tip: { cs: "XML: \u003ccontext\u003eváš byznys\u003c/context\u003e\u003ctask\u003eúkol\u003c/task\u003e", en: "XML: \u003ccontext\u003eyour business\u003c/context\u003e\u003ctask\u003etask\u003c/task\u003e" } },
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

    // ── EMAIL ────────────────────────────────────────────────────────────────
    { task: { cs: "Napsat email", en: "Write email" }, icon: "📧", mods: ["ChatGPT", "Claude", "Gemini"],
      promptTip: {
        cs: "Proč to funguje: AI potřebuje vědět KDO píše, KOMU, v jakém VZTAHU a s jakým CÍLEM. Čím konkrétnější jsi, tím méně roboticky email zní. Vždy říkej co NECHCEŠ — to zabrání nejčastějším chybám.",
        en: "Why it works: AI needs to know WHO is writing, TO WHOM, in what RELATIONSHIP, and with what GOAL. The more specific you are, the less robotic the result. Always say what you DON'T want — this prevents the most common AI failures.",
      },
      ps: [
        { label: { cs: "Omluva šéfovi", en: "Apologize to boss" }, p: {
          cs: "Napiš email šéfovi [jméno], kde se omlouvám za zpoždění projektu [název].\nDůvod: byl/a jsem nemocný/á [X] dní.\nTón: profesionální, ale lidský — ne přehnaně servilní.\nMax 80 slov.\nNezačínej pozdravem 'Dobrý den' — použij přirozený oslovení.\nNezačínej větou 'Omlouvám se' — nejdřív krátce vysvětli situaci, pak se omluv.",
          en: "Write an email to my manager [name] apologizing for the delay on project [name].\nReason: I was sick for [X] days.\nTone: professional but human — not groveling.\nMax 80 words.\nDon't start with 'Dear' — use a natural opener.\nDon't lead with 'I apologize' — briefly explain first, then apologize.",
        }},
        { label: { cs: "Žádost o schůzku", en: "Meeting request" }, p: {
          cs: "Napiš email kolegovi/ě [jméno], navrhuji pracovní schůzku.\nTéma schůzky: [téma — buď konkrétní, např. 'revize Q3 rozpočtu'].\nNabídni 3 konkrétní termíny s časem.\nŘekni předem co bude potřeba připravit.\nTón: přátelský a přímý. Max 100 slov.",
          en: "Write an email to [name] proposing a work meeting.\nMeeting topic: [topic — be specific, e.g. 'Q3 budget review'].\nOffer 3 specific dates and times.\nMention what they should prepare in advance.\nTone: friendly and direct. Max 100 words.",
        }},
        { label: { cs: "Reklamace produktu", en: "Product complaint" }, p: {
          cs: "Napiš reklamační email firmě [název firmy].\nProdukt: [název], koupeno: [datum], cena: [částka].\nProblém: [přesný popis vady nebo situace].\nCo chci: [výměnu / vrácení peněz / opravu — vyber].\nTón: věcný a nekompromisní, ne agresivní.\nZmíň že jsi zákonná práva ze zákona o ochraně spotřebitele.",
          en: "Write a complaint email to [company name].\nProduct: [name], purchased: [date], price: [amount].\nIssue: [exact description of the defect or problem].\nWhat I want: [replacement / refund / repair — choose one].\nTone: factual and firm, not aggressive.\nMention that I have rights under consumer protection law.",
        }},
        { label: { cs: "Úřední dotaz", en: "Government office inquiry" }, p: {
          cs: "Dostal/a jsem tento dopis / rozhodnutí od [název úřadu / pojišťovny / banky]:\n[vlož text dopisu nebo hlavní body]\n\nNapiš mi odpověď, kde zdvořile žádám o:\n1) Vysvětlení co toto rozhodnutí znamená\n2) Co přesně se po mně požaduje a do kdy\n3) Jaké mám možnosti nebo práva\n\nTón: zdvořilý, sebejistý — neptám se jako prosebník, ale jako občan, který zná svá práva.",
          en: "I received this letter / decision from [name of office / insurer / bank]:\n[paste letter text or key points]\n\nWrite a reply politely asking for:\n1) An explanation of what this decision means\n2) Exactly what is required of me and by when\n3) What options or rights I have\n\nTone: polite, confident — not pleading, but as a citizen who knows their rights.",
        }},
      ]},

    // ── ARTICLE ──────────────────────────────────────────────────────────────
    { task: { cs: "Napsat článek", en: "Write article" }, icon: "📝", mods: ["ChatGPT", "Claude"],
      promptTip: {
        cs: "Proč to funguje: AI píše genericky, pokud nedostane kontext. Klíč je definovat PERSONU autora, ČTENÁŘE a zakázat klišé. Výsledek zní jako skutečný člověk, ne jako šablona.",
        en: "Why it works: AI writes generically without context. The key is defining the AUTHOR persona, the READER, and banning clichés. The result sounds like a real person, not a template.",
      },
      ps: [
        { label: { cs: "Blog post (osobní styl)", en: "Blog post (personal style)" }, p: {
          cs: "Napiš blogový článek o [téma] z pohledu [tvoje role, např. 'freelancer s 5 lety praxe' nebo 'rodič dvou dětí'].\nCílový čtenář: [kdo to přečte a co potřebuje vědět].\nDélka: 500 slov.\nStruktura: konkrétní úvodní situace (ne obecná otázka) → 3 praktické tipy s reálnými příklady → závěr s jedním jasným doporučením.\nStyl: osobní, mluv na čtenáře jako 'ty'. Zakaž si klišé jako 'v dnešní době', 'je důležité' nebo 'každý z nás'.",
          en: "Write a blog post about [topic] from the perspective of [your role, e.g. 'freelancer with 5 years experience' or 'parent of two kids'].\nTarget reader: [who will read it and what they need to know].\nLength: 500 words.\nStructure: concrete opening situation (not a generic question) → 3 practical tips with real examples → conclusion with one clear recommendation.\nStyle: personal, speak to reader as 'you'. Ban clichés like 'in today's world', 'it's important to' or 'we all know'.",
        }},
        { label: { cs: "LinkedIn příspěvek", en: "LinkedIn post" }, p: {
          cs: "Napiš LinkedIn příspěvek (max 200 slov) o [téma nebo zkušenost z práce].\nZačni konkrétní situací nebo překvapivým číslem — ne obecným tvrzením.\nUprostřed: 3 konkrétní poznatky ve formátu 'Co jsem zjistil/a:'\nZávěr: jedno konkrétní doporučení pro čtenáře.\nNezačínej slovy 'Jsem rád/a', 'Hrdě oznamuji' nebo 'Skvělá příležitost'.\nTón: přemýšlivý odborník, ne sebepropagace.",
          en: "Write a LinkedIn post (max 200 words) about [topic or work experience].\nStart with a specific situation or surprising number — not a generic statement.\nMiddle: 3 concrete insights in the format 'What I discovered:'\nEnd: one specific recommendation for the reader.\nDon't start with 'I'm excited to', 'Proud to announce' or 'Great opportunity'.\nTone: thoughtful expert, not self-promotion.",
        }},
      ]},

    // ── SUMMARIZE ────────────────────────────────────────────────────────────
    { task: { cs: "Shrnout dokument", en: "Summarize document" }, icon: "📋", mods: ["Claude", "NotebookLM"],
      promptTip: {
        cs: "Proč to funguje: bez struktury AI vyprodukuje zeď textu. Přesný formát výstupu je důležitější než délka — říkej AI přesně co chceš vidět, ne jen 'shrň'.",
        en: "Why it works: without structure AI produces a wall of text. Specifying the exact output format matters more than length — tell AI exactly what you want to see, not just 'summarize'.",
      },
      ps: [
        { label: { cs: "Strukturované shrnutí", en: "Structured summary" }, p: {
          cs: "Shrň tento dokument. Výstup musí mít přesně tuto strukturu:\n• SITUACE (1 věta): o čem dokument je\n• KLÍČOVÉ ZJIŠTĚNÍ (1 věta): nejdůležitější věc\n• CO TO ZNAMENÁ PRO NÁS (2-3 věty): praktický dopad\n• DOPORUČENÍ (1 věta): co dělat dál\nMax 120 slov celkem.\n\n[vlož text nebo nahraj PDF]",
          en: "Summarize this document. Output must follow this exact structure:\n• SITUATION (1 sentence): what the document is about\n• KEY FINDING (1 sentence): the most important thing\n• WHAT THIS MEANS FOR US (2-3 sentences): practical impact\n• RECOMMENDATION (1 sentence): what to do next\nMax 120 words total.\n\n[paste text or upload PDF]",
        }},
        { label: { cs: "Zápis ze schůzky → úkoly", en: "Meeting notes → action items" }, p: {
          cs: "Z těchto poznámek ze schůzky vytvoř:\n1) Rozhodnutí (max 3 odrážky — co bylo odsouhlaseno)\n2) Úkoly ve formátu: [Kdo] udělá [Co] do [Kdy]\n3) Otevřené otázky (co ještě nebylo rozhodnuto)\n\nPoznámky ze schůzky:\n[vlož text]",
          en: "From these meeting notes create:\n1) Decisions (max 3 bullets — what was agreed)\n2) Action items in format: [Who] will [Do what] by [When]\n3) Open questions (what still hasn't been decided)\n\nMeeting notes:\n[paste text]",
        }},
        { label: { cs: "Porozumět úřednímu dopisu", en: "Understand official letter" }, p: {
          cs: "Přečti tento text z úřadu / pojišťovny / banky a vysvětli mi ho jednoduše:\n[vlož text dokumentu]\n\nPotřebuji vědět:\n1) Co po mně chtějí?\n2) Musím něco udělat? Co a do kdy?\n3) Co se stane pokud nic neudělám?\n4) Na co si dát pozor?\n\nVysvětli to jako kamarád, ne jako právník. Bez zbytečného opakování 'je důležité'.",
          en: "Read this text from a government office / insurer / bank and explain it to me simply:\n[paste document text]\n\nI need to know:\n1) What do they want from me?\n2) Do I need to do anything? What and by when?\n3) What happens if I do nothing?\n4) What should I watch out for?\n\nExplain it like a knowledgeable friend, not a lawyer.",
        }},
      ]},

    // ── SOCIAL MEDIA ─────────────────────────────────────────────────────────
    { task: { cs: "Sociální sítě", en: "Social media" }, icon: "📱", mods: ["ChatGPT", "Gemini"],
      promptTip: {
        cs: "Proč to funguje: každá platforma má jiný rytmus a délku. Říkej platformu, tón a co má příspěvek ZPŮSOBIT (sdílení, komentář, klik) — ne jen o čem má být.",
        en: "Why it works: every platform has different rhythm and length. Specify the platform, tone, and what the post should CAUSE (share, comment, click) — not just what it should be about.",
      },
      ps: [
        { label: { cs: "Instagram příspěvek", en: "Instagram post" }, p: {
          cs: "Vytvoř Instagram příspěvek pro [typ účtu, např. 'kavárna v Praze' nebo 'fitness trenér'].\nTéma: [téma].\nCíl: [co má příspěvek způsobit — sdílení / komentáře / proklik na web]\nPopisek: max 150 slov, začni silnou první větou (ta se zobrazuje bez rozbalení).\nHashtagy: 10 relevantních (mix velké + niche).\nNávrh vizuálu: popiš co by měl obrázek nebo video zobrazovat.",
          en: "Create an Instagram post for [account type, e.g. 'Prague café' or 'fitness coach'].\nTopic: [topic].\nGoal: [what the post should cause — shares / comments / website clicks]\nCaption: max 150 words, start with a strong first sentence (visible without expanding).\nHashtags: 10 relevant ones (mix popular + niche).\nVisual suggestion: describe what the image or video should show.",
        }},
        { label: { cs: "LinkedIn — odborný post", en: "LinkedIn — thought leadership" }, p: {
          cs: "Napiš LinkedIn příspěvek o [téma] pro profesionální publikum v oboru [obor].\nZačni konkrétním příkladem nebo překvapivým číslem.\nTři krátké odstavce: problém → moje zkušenost/poznatek → co z toho plyne pro ostatní.\nZakončení: otázka která vyzývá ke komentáři.\nMax 200 slov. Žádné emoji v prvních 2 větách.",
          en: "Write a LinkedIn post about [topic] for a professional audience in [industry].\nStart with a concrete example or surprising stat.\nThree short paragraphs: problem → my experience/insight → what this means for others.\nEnd with a question inviting comments.\nMax 200 words. No emoji in the first 2 sentences.",
        }},
      ]},

    // ── PLANNING ─────────────────────────────────────────────────────────────
    { task: { cs: "Plánování", en: "Planning" }, icon: "🗓️", mods: ["ChatGPT", "Gemini"],
      promptTip: {
        cs: "Proč to funguje: plánování bez omezení je k ničemu. Vždy zadej budget, časové omezení a konkrétní preference — AI pak filtruje za tebe místo aby ti dal seznam všeho možného.",
        en: "Why it works: planning without constraints is useless. Always specify budget, time limits, and specific preferences — AI then filters for you instead of listing everything possible.",
      },
      ps: [
        { label: { cs: "Výlet po ČR / Evropě", en: "Trip in CZ / Europe" }, p: {
          cs: "Naplánuj [X]-denní výlet do [město/region].\nBudget: [částka] Kč na osobu (včetně dopravy z [odkud]).\nCestujeme: [sami / pár / rodina s dětmi věk X]\nZájmy: [co nás baví, např. 'příroda a pěší turistika, ne muzea']\nVyhýbáme se: [co nechceme, např. 'turistické pasti a fronty']\n\nChci: itinerář po dnech s konkrétními časy, odhadem cen, tipem na oběd a večeři každý den.",
          en: "Plan a [X]-day trip to [city/region].\nBudget: [amount] per person (including transport from [where]).\nTraveling: [solo / couple / family with kids age X]\nInterests: [what we enjoy, e.g. 'nature and hiking, not museums']\nAvoiding: [what we don't want, e.g. 'tourist traps and queues']\n\nI want: day-by-day itinerary with specific times, estimated costs, and a lunch + dinner tip each day.",
        }},
        { label: { cs: "Týdenní jídelníček", en: "Weekly meal plan" }, p: {
          cs: "Vytvoř jídelníček na 5 pracovních dní pro [počet osob].\nOmezení stravy: [bez lepku / vegetariánský / bez laktózy / žádné — vyber]\nBudget: max [částka] Kč týdně za suroviny.\nČas na vaření: max 30 minut na jídlo.\nPreference: [co máme rádi a co nesnášíme]\n\nVýstup:\n• Jídla na každý den (snídaně volná)\n• Nákupní seznam seřazený podle oddělení (zelenina, mléčné, maso...)\n• Které ingredience se opakují a šetří peníze",
          en: "Create a meal plan for 5 working days for [number of people].\nDietary restrictions: [gluten-free / vegetarian / dairy-free / none — choose]\nBudget: max [amount] per week for ingredients.\nCooking time: max 30 minutes per meal.\nPreferences: [what we like and what we hate]\n\nOutput:\n• Meals for each day (breakfast flexible)\n• Shopping list organized by store section (veg, dairy, meat...)\n• Which ingredients repeat across meals to save money",
        }},
      ]},

    // ── LEARNING ─────────────────────────────────────────────────────────────
    { task: { cs: "Učení a vysvětlení", en: "Learning & explanation" }, icon: "🎓", mods: ["ChatGPT", "Claude"],
      promptTip: {
        cs: "Proč to funguje: říkej AI jakou úroveň znalostí máš a požaduj příklady z tvého světa — ne z učebnic. Aktivní učení (otázky po každém kroku) je efektivnější než pasivní čtení výkladu.",
        en: "Why it works: tell AI your knowledge level and ask for examples from your world — not textbooks. Active learning (questions after each step) is more effective than passively reading explanations.",
      },
      ps: [
        { label: { cs: "Vysvětli jednoduše", en: "Explain simply" }, p: {
          cs: "Vysvětli mi [téma] jednoduše.\nMoje aktuální znalost: [nic nevím / základy / trochu rozumím — vyber].\nPříklady: použij příklady z [moje profese/situace, např. 'řízení malé firmy' nebo 'každodenního života'].\nFormát: nejdřív 1 věta co to je, pak 3 klíčové body, pak 1 konkrétní příklad, pak shrnutí.\nPokud jsou tam termíny které neznám, vysvětli je automaticky.",
          en: "Explain [topic] to me simply.\nMy current knowledge: [nothing / basics / some understanding — choose].\nExamples: use examples from [my profession/situation, e.g. 'running a small business' or 'everyday life'].\nFormat: first 1 sentence what it is, then 3 key points, then 1 concrete example, then summary.\nIf there are terms I might not know, explain them automatically.",
        }},
        { label: { cs: "Interaktivní výuka", en: "Interactive learning" }, p: {
          cs: "Chci se naučit [téma]. Buď můj učitel.\nPostupuj po malých krocích — jeden koncept najednou.\nPo každém kroku mi polož jednu konkrétní otázku, abych si ověřil/a porozumění.\nPokud odpovím špatně, nevysvětluj znovu stejně — zkus jiný příklad nebo analogii.\nZačni tím, proč je toto téma užitečné v praxi.",
          en: "I want to learn [topic]. Be my teacher.\nProceed in small steps — one concept at a time.\nAfter each step, ask me one specific question to verify my understanding.\nIf I answer wrong, don't re-explain the same way — try a different example or analogy.\nStart with why this topic is practically useful.",
        }},
      ]},

    // ── CZECH LIFE SITUATIONS (NEW) ──────────────────────────────────────────
    { task: { cs: "České životní situace", en: "Real-life situations" }, icon: "🇨🇿", mods: ["ChatGPT", "Claude"],
      promptTip: {
        cs: "Tyto prompty řeší situace které Češi řeší každý den — úřady, práce, finance. AI je v tomto velmi užitečný a většina lidí neví, že se na to dá použít.",
        en: "These prompts address situations Czechs face every day — bureaucracy, work, finances. AI is very useful here and most people don't know it can be used for this.",
      },
      ps: [
        { label: { cs: "Motivační dopis na práci", en: "Job application cover letter" }, p: {
          cs: "Napiš mi motivační dopis na tuto pracovní pozici.\nPozice: [název pozice]\nFirma: [název firmy — pokud víš, doplň co o nich víš]\nMoje zkušenosti: [2-3 věty — co umíš a co jsi dělal/a]\nPožadavky z inzerátu: [vlož text nebo hlavní body]\n\nPravidla:\n• Max 200 slov\n• Začni konkrétní větou proč tě tato firma nebo role zajímá — ne 'Dovolte mi představit se'\n• Žádná klišé: komunikativní, týmový hráč, orientace na výsledky\n• Ukaž co přineseš jim, ne jen co hledáš ty",
          en: "Write a cover letter for this job position.\nPosition: [job title]\nCompany: [company name — if you know it, add what you know about them]\nMy experience: [2-3 sentences — what you can do and what you've done]\nJob requirements: [paste listing text or key points]\n\nRules:\n• Max 200 words\n• Start with a specific sentence on why this company or role interests you — not 'I would like to apply'\n• No clichés: communicative, team player, results-oriented\n• Show what you'll bring them, not just what you're looking for",
        }},
        { label: { cs: "Stížnost / odvolání", en: "Complaint / appeal" }, p: {
          cs: "Pomoz mi napsat formální stížnost nebo odvolání.\nKomu píšu: [firma / úřad / pojišťovna]\nCo se stalo: [přesný popis situace s daty a čísly pokud máš]\nCo jsem už zkusil/a: [předchozí kroky]\nCo chci dosáhnout: [konkrétní výsledek — vrácení peněz, oprava, omluva]\n\nTón: věcný, bez emocí, s odkazem na zákon pokud relevantní.\nFormát: datum, věc, tělo dopisu, žádost s termínem odpovědi.",
          en: "Help me write a formal complaint or appeal.\nWho I'm writing to: [company / office / insurer]\nWhat happened: [exact description with dates and numbers if available]\nWhat I've already tried: [previous steps]\nWhat I want to achieve: [specific outcome — refund, repair, apology]\n\nTone: factual, unemotional, with reference to law if relevant.\nFormat: date, subject, body, request with response deadline.",
        }},
        { label: { cs: "Finanční rozhodnutí", en: "Financial decision" }, p: {
          cs: "Pomoz mi promyslet toto finanční rozhodnutí — nechci konkrétní doporučení (to je na finančním poradci), ale chci lépe pochopit situaci.\nRozhodnutí: [popis — např. 'refinancování hypotéky' nebo 'auto na leasing vs hotově']\nMoje čísla: [relevantní částky, příjmy, výdaje — sdílej jen co ti je příjemné]\n\nChci vědět:\n1) Jaké klíčové otázky bych si měl/a položit?\n2) Co lidé v této situaci nejčastěji přehlíží?\n3) Jak udělat rychlý výpočet pro orientaci?",
          en: "Help me think through this financial decision — I don't want specific advice (that's for a financial advisor), but I want to understand the situation better.\nDecision: [description — e.g. 'mortgage refinancing' or 'car on lease vs cash']\nMy numbers: [relevant amounts, income, expenses — share only what you're comfortable with]\n\nI want to know:\n1) What key questions should I ask myself?\n2) What do people in this situation most often overlook?\n3) How to do a quick back-of-envelope calculation?",
        }},
      ]},
  ],

  intermediate: [

    // ── COPYWRITING ──────────────────────────────────────────────────────────
    { task: { cs: "Copywriting", en: "Copywriting" }, icon: "✏️", mods: ["ChatGPT", "Claude"],
      promptTip: {
        cs: "Proč to funguje: dobrý copy musí adresovat hlavní NÁMITKU zákazníka, ne jen chválit produkt. Přidání 'hlavní námitky' do promptu je rozdíl mezi textem který prodává a textem který informuje.",
        en: "Why it works: good copy must address the customer's main OBJECTION, not just praise the product. Adding the 'main objection' to the prompt is the difference between copy that sells and copy that informs.",
      },
      ps: [
        { label: { cs: "AIDA prodejní text", en: "AIDA sales copy" }, p: {
          cs: "Napiš prodejní text pro [produkt/služba] metodou AIDA.\n\nCílová skupina: [popis — věk, profese, hlavní problém který řeší]\nUSP (proč právě vy): [hlavní výhoda, buď konkrétní]\nHlavní námitka zákazníka: [proč by nekoupil — cena, nedůvěra, alternativa]\n\nStruktura:\n• ATTENTION: Nadpis který zasáhne hlavní bolest cílovky — ne 'Představujeme...'\n• INTEREST: Rozveď proč je tento problém závažnější než si myslí\n• DESIRE: Konkrétní výsledek zákazníka (ne vlastnosti). Příklad: 'Za 3 týdny...' ne 'Náš produkt umí...'\n• ACTION: Jedno CTA s důvodem jednat teď (omezená nabídka / deadline / konkrétní přínos)\n\nMax 300 slov. Nezačínej slovem 'Jsou' nebo 'Každý'.",
          en: "Write sales copy for [product/service] using the AIDA method.\n\nTarget audience: [description — age, profession, main problem they solve]\nUSP (why you): [main advantage, be specific]\nMain customer objection: [why they wouldn't buy — price, distrust, alternative]\n\nStructure:\n• ATTENTION: Headline that hits the target's main pain — not 'Introducing...'\n• INTEREST: Expand on why this problem is more serious than they think\n• DESIRE: Specific customer result (not features). Example: 'In 3 weeks...' not 'Our product can...'\n• ACTION: One CTA with a reason to act now (limited offer / deadline / specific benefit)\n\nMax 300 words. Don't start with 'Are you' or 'Everyone'.",
        }},
        { label: { cs: "Cold email outreach", en: "Cold email outreach" }, p: {
          cs: "Napiš cold email potenciálnímu klientovi.\nTyp firmy/osoby: [komu píšu]\nCo nabízím: [stručně]\nProč jim píšu teď (trigger): [konkrétní důvod — novinka o jejich firmě, sezóna, problém který řeším]\nCíl emailu: 20minutový hovor — ne prodat hned.\n\nPravidla:\n• Max 5 vět v těle emailu\n• První věta mluví o nich, ne o mně\n• Zmíň jeden konkrétní problém, který pravděpodobně mají\n• Nezačínej 'Dobrý den, jmenuji se...'\n• Předmět: max 6 slov, žádné otazníky\n\nNapiš 2 varianty:\nA) Přímá a stručná\nB) S konkrétním příkladem nebo číslem",
          en: "Write a cold email to a potential client.\nType of company/person: [who I'm writing to]\nWhat I offer: [briefly]\nWhy I'm writing now (trigger): [specific reason — news about their company, season, problem I solve]\nGoal of email: 20-minute call — not to sell immediately.\n\nRules:\n• Max 5 sentences in the email body\n• First sentence is about them, not me\n• Mention one specific problem they likely have\n• Don't start with 'My name is...'\n• Subject: max 6 words, no question marks\n\nWrite 2 variants:\nA) Direct and concise\nB) With a specific example or number",
        }},
        { label: { cs: "PAS prodejní email", en: "PAS sales email" }, p: {
          cs: "Napiš prodejní email metodou PAS (Problem, Agitate, Solution).\nProdukt/služba: [co prodávám]\nCílová skupina: [kdo jsou moji zákazníci]\nHlavní problém: [co je trápí — buď velmi konkrétní]\n\nStruktura:\n• PROBLEM: Pojmenuj problém jazykem zákazníka — ne jak ho vidíš ty\n• AGITATE: Ukáž co se stane pokud ho neřeší (ztracené peníze, čas, příležitosti)\n• SOLUTION: Představ produkt jako přirozené řešení — ne jako reklamu\n\nPředmět: 3 varianty (jedna s číslem, jedna s otázkou, jedna s 'jak')\nDélka emailu: max 200 slov.",
          en: "Write a sales email using the PAS method (Problem, Agitate, Solution).\nProduct/service: [what I'm selling]\nTarget audience: [who my customers are]\nMain problem: [what troubles them — be very specific]\n\nStructure:\n• PROBLEM: Name the problem in the customer's language — not how you see it\n• AGITATE: Show what happens if they don't solve it (lost money, time, opportunities)\n• SOLUTION: Introduce the product as the natural solution — not as an ad\n\nSubject: 3 variants (one with a number, one with a question, one with 'how to')\nEmail length: max 200 words.",
        }},
      ]},

    // ── DATA ANALYSIS ─────────────────────────────────────────────────────────
    { task: { cs: "Analýza dat", en: "Data analysis" }, icon: "📊", mods: ["ChatGPT", "Claude"],
      promptTip: {
        cs: "Proč to funguje: bez předepsaného formátu AI vyprodukuje akademickou zeď textu. Klíč je říct přesně JAKÝ VÝSTUP chceš a co s ním budeš dělat — pak dostaneš akceschopný report, ne přednášku.",
        en: "Why it works: without a prescribed format AI produces an academic wall of text. The key is saying exactly WHAT OUTPUT you want and what you'll do with it — then you get an actionable report, not a lecture.",
      },
      ps: [
        { label: { cs: "Kompletní analýza datasetu", en: "Full dataset analysis" }, p: {
          cs: "Analyzuj přiložený dataset. Výstup musí mít přesně tuto strukturu:\n\n1) PŘEHLED DAT: Kolik řádků/sloupců, jaký typ dat, chybějící hodnoty?\n2) TOP 3 ZJIŠTĚNÍ: Co je nejdůležitější co data říkají? Každé = 1 věta + konkrétní číslo.\n3) ANOMÁLIE: Co vypadá divně nebo neočekávaně? Proč to může být důležité?\n4) VIZUALIZACE: Navrhni 2 konkrétní grafy — popiš typ, osy a co přesně zobrazit.\n5) DOPORUČENÉ KROKY: Co analyticky zkoumat dál?\n\nKaždá sekce max 3-5 vět. Chci report, ne akademickou práci.\n\n[nahraj soubor nebo vlož data]",
          en: "Analyze the attached dataset. Output must follow this exact structure:\n\n1) DATA OVERVIEW: How many rows/columns, what type of data, missing values?\n2) TOP 3 FINDINGS: What is the most important thing the data says? Each = 1 sentence + specific number.\n3) ANOMALIES: What looks strange or unexpected? Why might this be important?\n4) VISUALIZATIONS: Suggest 2 specific charts — describe type, axes, and exactly what to show.\n5) RECOMMENDED NEXT STEPS: What to analyze further?\n\nMax 3-5 sentences per section. I want a report, not an academic paper.\n\n[upload file or paste data]",
        }},
        { label: { cs: "Analýza zpětné vazby zákazníků", en: "Customer feedback analysis" }, p: {
          cs: "Mám [X] hodnocení/recenzí/zpětné vazby od zákazníků. Analyzuj je.\n\n[vlož text recenzí nebo nahraj soubor]\n\nVýstup:\n1) Top 3 věci které zákazníci CHVÁLÍ (s citací 1 příkladu každého)\n2) Top 3 věci které zákazníci KRITIZUJÍ (s citací 1 příkladu každého)\n3) SKRYTÉ POTŘEBY: Co zákazníci chtějí ale přímo neříkají?\n4) PRIORITA: Jedno doporučení — co udělat jako první a proč\n\nIgnoruj obecné fráze jako 'dobrá kvalita' nebo 'doporučuji'. Hledej konkrétní vzory.",
          en: "I have [X] reviews / ratings / feedback from customers. Analyze them.\n\n[paste review text or upload file]\n\nOutput:\n1) Top 3 things customers PRAISE (with 1 example quote each)\n2) Top 3 things customers CRITICIZE (with 1 example quote each)\n3) HIDDEN NEEDS: What do customers want but don't say directly?\n4) PRIORITY: One recommendation — what to do first and why\n\nIgnore generic phrases like 'good quality' or 'would recommend'. Look for specific patterns.",
        }},
      ]},

    // ── CODING ────────────────────────────────────────────────────────────────
    { task: { cs: "Psaní kódu", en: "Coding" }, icon: "💻", mods: ["Claude Sonnet", "ChatGPT", "DeepSeek R1"],
      promptTip: {
        cs: "Proč to funguje: AI píše lepší kód když ví kontext (jazyk, verze, existující kód). Příklad vstupu/výstupu je kritický — bez něj dostaneš obecné řešení místo toho co potřebuješ.",
        en: "Why it works: AI writes better code when it knows context (language, version, existing code). Example input/output is critical — without it you get a generic solution instead of what you need.",
      },
      ps: [
        { label: { cs: "Nová funkce", en: "New function" }, p: {
          cs: "Napiš [jazyk + verze, např. 'Python 3.11'] funkci pro: [přesný popis co má dělat].\n\nPožadavky:\n• Ošetření chyb pro edge cases: [vyjmenuj možné problémy]\n• Typové anotace\n• Docstring s popisem parametrů\n• 3 unit testy (normální případ, edge case, chybový stav)\n\nPříklad vstupu: [konkrétní data]\nOčekávaný výstup: [konkrétní výsledek]\n\nExistující kód pro kontext:\n```\n[vlož relevantní části kódu pokud máš]\n```",
          en: "Write a [language + version, e.g. 'Python 3.11'] function for: [exact description of what it should do].\n\nRequirements:\n• Error handling for edge cases: [list possible issues]\n• Type annotations\n• Docstring with parameter descriptions\n• 3 unit tests (normal case, edge case, error state)\n\nExample input: [specific data]\nExpected output: [specific result]\n\nExisting code for context:\n```\n[paste relevant parts of your code if available]\n```",
        }},
        { label: { cs: "Debug a oprava", en: "Debug and fix" }, p: {
          cs: "Tento kód nefunguje správně:\n\n```[jazyk]\n[vlož kód]\n```\n\nChyba / nesprávné chování: [přesný popis co se děje]\nOčekávané chování: [co by se mělo dít]\nProstředí: [OS, verze jazyka, relevantní knihovny]\n\nPotřebuji:\n1) Identifikaci bugu s vysvětlením PROČ k tomu dochází\n2) Opravu s komentářem co se změnilo\n3) Jedno doporučení jak kódu do budoucna předejít podobnému problému",
          en: "This code isn't working correctly:\n\n```[language]\n[paste code]\n```\n\nError / wrong behavior: [exact description of what's happening]\nExpected behavior: [what should happen]\nEnvironment: [OS, language version, relevant libraries]\n\nI need:\n1) Identification of the bug with explanation of WHY it happens\n2) Fix with a comment on what changed\n3) One recommendation for how to prevent similar issues in the future",
        }},
      ]},

    // ── BRAINSTORMING ────────────────────────────────────────────────────────
    { task: { cs: "Brainstorming", en: "Brainstorming" }, icon: "💡", mods: ["ChatGPT", "Claude"],
      promptTip: {
        cs: "Proč to funguje: AI brainstorming funguje nejlépe ve dvou fázích — nejdřív co nejvíc nápadů (bez hodnocení), pak kritický výběr. Spojení obou do jednoho promptu zabrání tomu, aby AI rovnou filtroval a ztratil neobvyklé nápady.",
        en: "Why it works: AI brainstorming works best in two phases — first as many ideas as possible (without evaluation), then critical selection. Combining both in one prompt prevents AI from filtering too early and losing unusual ideas.",
      },
      ps: [
        { label: { cs: "20 nápadů → top 5 s plánem", en: "20 ideas → top 5 with plan" }, p: {
          cs: "Fáze 1 — generování:\nVygeneruj 20 nápadů na [téma/problém]. Zahrň i neobvyklé nebo zdánlivě absurdní nápady — nekritizuj je.\n\nFáze 2 — výběr a plán:\nVyber 5 nejlepších. Pro každý:\n• Proč je silný (konkrétní argument)\n• Jak ho realizovat (první 3 kroky)\n• Hlavní překážka a jak ji překonat\n• Odhad nákladů nebo potřebného času\n\nKontext: [doplň relevantní info — obor, cílová skupina, dostupné zdroje]",
          en: "Phase 1 — generation:\nGenerate 20 ideas for [topic/problem]. Include unusual or seemingly absurd ideas — don't criticize them.\n\nPhase 2 — selection and plan:\nSelect the 5 best. For each:\n• Why it's strong (specific argument)\n• How to implement it (first 3 steps)\n• Main obstacle and how to overcome it\n• Estimated cost or time required\n\nContext: [add relevant info — industry, target audience, available resources]",
        }},
        { label: { cs: "Analýza z více perspektiv", en: "Multi-perspective analysis" }, p: {
          cs: "Analyzuj [problém/rozhodnutí/nápad] z těchto 5 perspektiv:\n1) Zákazník / uživatel: co si myslí a co potřebuje?\n2) Konkurence: jak by na to reagovala?\n3) Technologie: co je technicky možné nebo omezující?\n4) Finance: jaký je finanční dopad a riziko?\n5) Lidský faktor: jak to ovlivní tým nebo vztahy?\n\nPro každou perspektivu: 2-3 konkrétní postřehy + 1 doporučení.\nNa závěr: jedno souhrnné doporučení s odůvodněním.",
          en: "Analyze [problem/decision/idea] from these 5 perspectives:\n1) Customer / user: what do they think and need?\n2) Competition: how would they react?\n3) Technology: what's technically possible or limiting?\n4) Finance: what's the financial impact and risk?\n5) Human factor: how does it affect the team or relationships?\n\nFor each perspective: 2-3 specific insights + 1 recommendation.\nAt the end: one overall recommendation with reasoning.",
        }},
      ]},

    // ── RESEARCH ─────────────────────────────────────────────────────────────
    { task: { cs: "Research", en: "Research" }, icon: "🔎", mods: ["Perplexity", "Claude", "Gemini"],
      promptTip: {
        cs: "Proč to funguje: research bez struktury = halda informací. Definuj předem CO budete dělat s výsledky — to změní jak AI vybírá a prezentuje informace. Na faktuální research použij Perplexity (cituje zdroje), na analýzu Claude.",
        en: "Why it works: research without structure = pile of information. Define upfront WHAT you'll do with the results — that changes how AI selects and presents information. Use Perplexity for factual research (cites sources), Claude for analysis.",
      },
      ps: [
        { label: { cs: "Oborová rešerše", en: "Industry research" }, p: {
          cs: "Proveď rešerši na téma: [téma]\nÚčel: [co s tím budu dělat — např. 'rozhodnutí zda vstoupit na trh' nebo 'příprava prezentace pro klienta']\n\nStruktura výstupu:\n1) SOUČASNÝ STAV: Kde se obor/téma nachází dnes? (3-5 klíčových faktů)\n2) HLAVNÍ HRÁČI: Kdo jsou dominantní aktéři a jaké jsou jejich pozice?\n3) TRENDY: Co se mění v posledních 2 letech? (ne obecnosti — konkrétní posuny)\n4) VÝZVY A RIZIKA: Co brání růstu nebo způsobuje problémy?\n5) PŘÍLEŽITOSTI: Kde jsou mezery nebo neobsloužené potřeby?\n6) PREDIKCE: Co lze očekávat za 2-3 roky?\n\nU každého tvrzení uveď zdroj nebo alespoň odkaz.",
          en: "Conduct research on: [topic]\nPurpose: [what I'll do with it — e.g. 'decision whether to enter the market' or 'preparing a client presentation']\n\nOutput structure:\n1) CURRENT STATE: Where is the industry/topic today? (3-5 key facts)\n2) KEY PLAYERS: Who are the dominant actors and what are their positions?\n3) TRENDS: What has changed in the last 2 years? (not generalities — specific shifts)\n4) CHALLENGES & RISKS: What's preventing growth or causing problems?\n5) OPPORTUNITIES: Where are the gaps or underserved needs?\n6) PREDICTIONS: What can be expected in 2-3 years?\n\nCite a source or at least a reference for each claim.",
        }},
        { label: { cs: "Srovnání produktů / řešení", en: "Product / solution comparison" }, p: {
          cs: "Porovnej [A] vs [B] vs [C] pro použití: [konkrétní use case — pro koho a k čemu].\n\nKritéria pro porovnání:\n• Cena a cenový model (freemium, předplatné, jednorázová platba)\n• Klíčové funkce relevantní pro [use case]\n• Nevýhody a omezení\n• Pro koho je každá možnost nejlepší\n• Integrace s dalšími nástroji\n\nVýstup: srovnávací tabulka + 1 odstavec doporučení pro [moji situaci: popis].\nBuď konkrétní — vyhni se formulaci 'záleží na situaci' bez vysvětlení.",
          en: "Compare [A] vs [B] vs [C] for use case: [specific use case — for whom and what for].\n\nComparison criteria:\n• Price and pricing model (freemium, subscription, one-time)\n• Key features relevant to [use case]\n• Disadvantages and limitations\n• Who each option is best for\n• Integration with other tools\n\nOutput: comparison table + 1 paragraph recommendation for [my situation: description].\nBe specific — avoid 'it depends' without explanation.",
        }},
      ]},
  ],

  advanced: [

    // ── SEO ───────────────────────────────────────────────────────────────────
    { task: { cs: "SEO obsah", en: "SEO content" }, icon: "🔍", mods: ["Claude Opus", "ChatGPT"],
      promptTip: {
        cs: "Proč to funguje: moderní SEO není jen o keywordech — Google hodnotí EEAT (Experience, Expertise, Authoritativeness, Trust). Přidání konkrétních čísel, reálných příkladů a jasné autority do článku je důležitější než hustota klíčových slov.",
        en: "Why it works: modern SEO isn't just about keywords — Google evaluates EEAT (Experience, Expertise, Authoritativeness, Trust). Adding specific numbers, real examples, and clear authority to the article matters more than keyword density.",
      },
      ps: [
        { label: { cs: "SEO článek s EEAT", en: "SEO article with EEAT" }, p: {
          cs: "Napiš SEO článek na klíčové slovo: '[keyword]'\n\nSearch intent: [informační / transakční / navigační / porovnávací — vyber]\nCílový čtenář: [kdo to bude číst a co potřebuje vyřešit]\n\nStruktura:\n• H1: Obsahuje keyword, max 60 znaků, slibuje konkrétní hodnotu\n• Úvod (150 slov): problém čtenáře → proč je tento článek odpovědí → co se dozví\n• H2 sekce: [seznam sekcí]\n• FAQ sekce: 5 otázek z 'Lidé se také ptají' pro tento keyword\n• Závěr: shrnutí + jasný next step\n\nEEAT signály (zabuduj přirozeně):\n• Konkrétní čísla nebo statistiky s uvedením zdroje\n• Příklad z reálné praxe nebo case study\n• Jasné vymezení kdo a proč je kvalifikovaný psát o tomto tématu\n\nMeta title: keyword + benefit, max 60 znaků\nMeta description: problém → řešení → CTA, max 155 znaků\nDélka: 1800-2200 slov",
          en: "Write an SEO article for keyword: '[keyword]'\n\nSearch intent: [informational / transactional / navigational / comparison — choose]\nTarget reader: [who will read it and what they need to solve]\n\nStructure:\n• H1: Contains keyword, max 60 chars, promises specific value\n• Intro (150 words): reader's problem → why this article answers it → what they'll learn\n• H2 sections: [list of sections]\n• FAQ section: 5 questions from 'People Also Ask' for this keyword\n• Conclusion: summary + clear next step\n\nEEAT signals (embed naturally):\n• Specific numbers or statistics with source\n• Real-world example or case study\n• Clear statement of who is qualified to write about this topic and why\n\nMeta title: keyword + benefit, max 60 chars\nMeta description: problem → solution → CTA, max 155 chars\nLength: 1800-2200 words",
        }},
        { label: { cs: "SEO brief pro copywritera", en: "SEO brief for copywriter" }, p: {
          cs: "Vytvoř kompletní SEO brief pro copywritera. Keyword: '[keyword]'\n\n1) SEARCH INTENT: Co přesně uživatel hledá? (nechce obecný článek — chce...)\n2) STRUKTURA H1-H3: Navrhni konkrétní nadpisy (ne zástupné texty)\n3) DÉLKA A ČITELNOST: Doporučená délka, úroveň čtení (Flesch score cíl)\n4) LSI A SÉMANTICKÁ KLÍČOVÁ SLOVA: 15 výrazů které musí článek přirozeně obsahovat\n5) INTERNAL LINKING: 3 existující stránky na webu na které může odkazovat\n6) FEATURED SNIPPET: Jak strukturovat odpověď pro snippet (tabulka / seznam / odstavec)\n7) SCHEMA MARKUP: Doporučený typ (Article / FAQ / HowTo)\n8) COMPETITOR GAP: Co top 3 výsledky mají a co jim chybí?\n\nWeb: [URL webu pokud máš]",
          en: "Create a complete SEO brief for a copywriter. Keyword: '[keyword]'\n\n1) SEARCH INTENT: What exactly is the user looking for? (they don't want a generic article — they want...)\n2) H1-H3 STRUCTURE: Suggest specific headings (not placeholder text)\n3) LENGTH & READABILITY: Recommended length, reading level (Flesch score target)\n4) LSI & SEMANTIC KEYWORDS: 15 expressions the article must naturally contain\n5) INTERNAL LINKING: 3 existing pages on the site it can link to\n6) FEATURED SNIPPET: How to structure the answer for a snippet (table / list / paragraph)\n7) SCHEMA MARKUP: Recommended type (Article / FAQ / HowTo)\n8) COMPETITOR GAP: What do top 3 results have and what are they missing?\n\nWebsite: [URL if available]",
        }},
      ]},

    // ── BUSINESS PLAN ────────────────────────────────────────────────────────
    { task: { cs: "Byznys plán", en: "Business plan" }, icon: "💼", mods: ["Claude Opus"],
      promptTip: {
        cs: "Proč Claude Opus: byznys plán je komplexní vícekroková analýza která vyžaduje hluboký reasoning. Na Sonnet nebo GPT-4o výstup bude povrchní. XML struktura promptu výrazně zlepšuje kvalitu — Claude byl trénován s ní.",
        en: "Why Claude Opus: a business plan is a complex multi-step analysis requiring deep reasoning. On Sonnet or GPT-4o the output will be superficial. XML structure in the prompt significantly improves quality — Claude was trained with it.",
      },
      ps: [
        { label: { cs: "Kompletní byznys plán", en: "Full business plan" }, p: {
          cs: "\u003cbusiness\u003e\n[Popis firmy/produktu/služby — co děláte, jak, pro koho]\n\u003c/business\u003e\n\u003cmarket\u003e\n[Popis trhu — geografický rozsah, velikost, zralost]\n\u003c/market\u003e\n\u003cgoals\u003e\n[Cíle — konkrétní čísla a časový horizont]\n\u003c/goals\u003e\n\u003cconstraints\u003e\n[Omezení — budget, tým, čas, regulace]\n\u003c/constraints\u003e\n\nVytvoř byznys plán:\n1) Executive summary (max 200 slov — pro investora)\n2) Analýza trhu (TAM/SAM/SOM s čísly)\n3) Konkurenční analýza (min 3 přímí konkurenti — silné stránky, slabé stránky, jak se odlišujeme)\n4) Business Model Canvas (všech 9 polí)\n5) GTM strategie (první 3 měsíce — konkrétní kroky)\n6) Finanční projekce na 3 roky (optimistická / realistická / pesimistická varianta)\n7) Klíčová rizika + mitigace\n8) KPIs pro měření úspěchu\n\nBuď kritický — pokud náš plán má slabiny, pojmenuj je.",
          en: "\u003cbusiness\u003e\n[Company/product/service description — what you do, how, for whom]\n\u003c/business\u003e\n\u003cmarket\u003e\n[Market description — geographic scope, size, maturity]\n\u003c/market\u003e\n\u003cgoals\u003e\n[Goals — specific numbers and time horizon]\n\u003c/goals\u003e\n\u003cconstraints\u003e\n[Constraints — budget, team, time, regulations]\n\u003c/constraints\u003e\n\nCreate a business plan:\n1) Executive summary (max 200 words — for an investor)\n2) Market analysis (TAM/SAM/SOM with numbers)\n3) Competitive analysis (min 3 direct competitors — strengths, weaknesses, how we differ)\n4) Business Model Canvas (all 9 fields)\n5) GTM strategy (first 3 months — specific steps)\n6) 3-year financial projections (optimistic / realistic / pessimistic scenarios)\n7) Key risks + mitigation\n8) KPIs for measuring success\n\nBe critical — if our plan has weaknesses, name them.",
        }},
        { label: { cs: "Analýza konkurence", en: "Competitor analysis" }, p: {
          cs: "\u003ccontext\u003e\nNaše firma: [popis, cílová skupina, cenová úroveň, hlavní USP]\nNáš problém: [proč zákazníci odcházejí ke konkurenci nebo k nám nepřicházejí]\n\u003c/context\u003e\n\n\u003ctask\u003e\nAnalyzuj konkurenci pro naši firmu vs [konkurent 1], [konkurent 2], [konkurent 3].\n\n1) Positioning matrix: umísti všechny hráče na 2 osy — [osa 1, např. cena] vs [osa 2, např. jednoduchost]\n2) Kde jsou konkurenti slabí a kde bychom mohli vyhrát?\n3) Které segmenty zákazníků obsluhují oni a ne my (a naopak)?\n4) Navrhni 1 positioning statement který nás jasně odliší\n5) 3 konkrétní kroky které můžeme udělat v příštích 30 dnech\n\u003c/task\u003e\n\nBuď kritický. Pokud naše USP není přesvědčivé, řekni to přímo.",
          en: "\u003ccontext\u003e\nOur company: [description, target audience, price level, main USP]\nOur problem: [why customers go to competitors or don't come to us]\n\u003c/context\u003e\n\n\u003ctask\u003e\nAnalyze the competitive landscape for our company vs [competitor 1], [competitor 2], [competitor 3].\n\n1) Positioning matrix: place all players on 2 axes — [axis 1, e.g. price] vs [axis 2, e.g. simplicity]\n2) Where are competitors weak and where could we win?\n3) Which customer segments do they serve that we don't (and vice versa)?\n4) Propose 1 positioning statement that clearly differentiates us\n5) 3 concrete steps we can take in the next 30 days\n\u003c/task\u003e\n\nBe critical. If our USP isn't compelling, say so directly.",
        }},
      ]},

    // ── WEB DEVELOPMENT ──────────────────────────────────────────────────────
    { task: { cs: "Web development", en: "Web development" }, icon: "🌐", mods: ["Claude Sonnet", "v0", "Bolt"],
      promptTip: {
        cs: "Proč to funguje: AI generuje lepší kód když dostane tech stack, design reference a seznam VŠECH sekcí předem. Vague brief = generický výsledek. Pro prototyp použij v0 nebo Bolt, pro produkci Claude Sonnet v Cursoru.",
        en: "Why it works: AI generates better code when given the tech stack, design references, and list of ALL sections upfront. Vague brief = generic result. For prototyping use v0 or Bolt, for production use Claude Sonnet in Cursor.",
      },
      ps: [
        { label: { cs: "Landing page", en: "Landing page" }, p: {
          cs: "Vytvoř landing page pro [produkt/služba]. Tech stack: React + Tailwind CSS.\n\nDesign reference: [odkaz nebo popis stylu — např. 'minimalistický, tmavé pozadí, amber akcenty']\nCílová skupina: [kdo jsou návštěvníci]\nHlavní CTA: [co má visitor udělat]\n\nSekce (v tomto pořadí):\n1) Hero: headline + subheadline + CTA tlačítko + hero vizuál nebo mockup\n2) Social proof: loga klientů nebo [X] spokojených zákazníků\n3) Benefity: 3-4 karty s ikonou, nadpisem a 2 větami\n4) Jak to funguje: 3 kroky s čísly\n5) Testimonials: 2-3 citace se jménem a rolí\n6) Pricing: 3 plány (Basic / Pro / Enterprise) s highlighted středním plánem\n7) FAQ: 5 otázek v accordion\n8) Footer: logo, navigace, kontakt, social\n\nTechnické požadavky: responsive, dark/light mode toggle, smooth scroll, lazy loading obrázků.",
          en: "Create a landing page for [product/service]. Tech stack: React + Tailwind CSS.\n\nDesign reference: [link or style description — e.g. 'minimalist, dark background, amber accents']\nTarget audience: [who the visitors are]\nMain CTA: [what the visitor should do]\n\nSections (in this order):\n1) Hero: headline + subheadline + CTA button + hero visual or mockup\n2) Social proof: client logos or [X] happy customers\n3) Benefits: 3-4 cards with icon, title, and 2 sentences\n4) How it works: 3 steps with numbers\n5) Testimonials: 2-3 quotes with name and role\n6) Pricing: 3 plans (Basic / Pro / Enterprise) with highlighted middle plan\n7) FAQ: 5 questions in accordion\n8) Footer: logo, navigation, contact, social\n\nTechnical requirements: responsive, dark/light mode toggle, smooth scroll, lazy image loading.",
        }},
        { label: { cs: "API integrace", en: "API integration" }, p: {
          cs: "Napiš kód pro integraci [název API / služby] do existující [jazyk/framework] aplikace.\n\nCo integrace má dělat: [přesný popis funkcionality]\nAutentizace: [API key / OAuth / JWT — co používá tato API]\nEndpoint(s): [konkrétní endpoints nebo odkaz na docs]\n\nExistující kód (relevantní části):\n```\n[vlož]\n```\n\nPožadavky:\n• Error handling pro: rate limiting, timeout, invalid response\n• Logování pro debugging\n• Typové definice (TypeScript pokud projekt používá)\n• Příklad použití v komentáři",
          en: "Write code for integrating [API name / service] into an existing [language/framework] application.\n\nWhat the integration should do: [exact description of functionality]\nAuthentication: [API key / OAuth / JWT — what this API uses]\nEndpoint(s): [specific endpoints or link to docs]\n\nExisting code (relevant parts):\n```\n[paste]\n```\n\nRequirements:\n• Error handling for: rate limiting, timeout, invalid response\n• Logging for debugging\n• Type definitions (TypeScript if project uses it)\n• Usage example in a comment",
        }},
      ]},

    // ── PROMPT ENGINEERING ───────────────────────────────────────────────────
    { task: { cs: "Prompt engineering", en: "Prompt engineering" }, icon: "🧠", mods: ["Claude Opus"],
      promptTip: {
        cs: "Proč to funguje: systémový prompt je základ každého AI produktu. Testuj vždy s adversariálními vstupy (pokusy o obcházení pravidel) — to odhalí slabiny které normální testování nenajde.",
        en: "Why it works: the system prompt is the foundation of every AI product. Always test with adversarial inputs (attempts to bypass rules) — this reveals weaknesses that normal testing won't find.",
      },
      ps: [
        { label: { cs: "Systémový prompt pro AI asistenta", en: "System prompt for AI assistant" }, p: {
          cs: "Vytvoř systémový prompt pro AI asistenta s těmito parametry:\n\nRole: [přesný popis role — např. 'zákaznický servis pro SaaS firmu']\nÚčel: [co asistent dělá a co ne]\nUživatelé: [kdo bude asistenta používat]\nTón a osobnost: [formální / přátelský / přímý — s příkladem]\n\nStruktura systémového promptu:\n1) Role a kontext (2-3 věty)\n2) Co asistent VÍ (znalostní báze — odkaz na dokumenty nebo popis)\n3) Co asistent NESMÍ dělat (guardrails — buď konkrétní)\n4) Formát odpovědí (délka, struktura, jazyk)\n5) 3 few-shot příklady (otázka → ideální odpověď)\n6) Edge cases (co říct při mimo-téma otázkách, necitlivých dotazech)\n7) Anti-injection ochrana\n\nPo napsání promptu: navrhni 5 testovacích vstupů včetně 2 adversariálních.",
          en: "Create a system prompt for an AI assistant with these parameters:\n\nRole: [exact role description — e.g. 'customer service for a SaaS company']\nPurpose: [what the assistant does and doesn't do]\nUsers: [who will use the assistant]\nTone and personality: [formal / friendly / direct — with an example]\n\nSystem prompt structure:\n1) Role and context (2-3 sentences)\n2) What the assistant KNOWS (knowledge base — link to docs or description)\n3) What the assistant MUST NOT do (guardrails — be specific)\n4) Response format (length, structure, language)\n5) 3 few-shot examples (question → ideal response)\n6) Edge cases (what to say for off-topic questions, sensitive queries)\n7) Anti-injection protection\n\nAfter writing the prompt: suggest 5 test inputs including 2 adversarial ones.",
        }},
        { label: { cs: "XML prompt pro komplexní úkol", en: "XML prompt for complex task" }, p: {
          cs: "Přepis tento jednoduchý prompt do strukturovaného XML formátu pro lepší výsledky:\n\nPůvodní prompt: [vlož]\n\nXML struktura:\n\u003crole\u003e[kdo je AI v tomto kontextu]\u003c/role\u003e\n\u003ccontext\u003e[relevantní zázemí a informace]\u003c/context\u003e\n\u003ctask\u003e[přesný úkol — jeden konkrétní]\u003c/task\u003e\n\u003cconstraints\u003e[co AI nesmí nebo musí zachovat]\u003c/constraints\u003e\n\u003cformat\u003e[přesný formát výstupu]\u003c/format\u003e\n\u003cexamples\u003e\n\u003cgood\u003e[příklad dobrého výstupu]\u003c/good\u003e\n\u003cbad\u003e[příklad čemu se vyhnout]\u003c/bad\u003e\n\u003c/examples\u003e\n\nPo přepsání: vysvětli co každý tag přidává a proč je výsledek lepší než původní prompt.",
          en: "Rewrite this simple prompt into a structured XML format for better results:\n\nOriginal prompt: [paste]\n\nXML structure:\n\u003crole\u003e[who AI is in this context]\u003c/role\u003e\n\u003ccontext\u003e[relevant background and information]\u003c/context\u003e\n\u003ctask\u003e[exact task — one specific thing]\u003c/task\u003e\n\u003cconstraints\u003e[what AI must not do or must preserve]\u003c/constraints\u003e\n\u003cformat\u003e[exact output format]\u003c/format\u003e\n\u003cexamples\u003e\n\u003cgood\u003e[example of good output]\u003c/good\u003e\n\u003cbad\u003e[example of what to avoid]\u003c/bad\u003e\n\u003c/examples\u003e\n\nAfter rewriting: explain what each tag adds and why the result is better than the original prompt.",
        }},
      ]},

    // ── SALES FUNNEL ─────────────────────────────────────────────────────────
    { task: { cs: "Sales funnel", en: "Sales funnel" }, icon: "🎯", mods: ["ChatGPT", "Claude"],
      promptTip: {
        cs: "Proč to funguje: sales funnel je systém, ne jeden text. Nejlepší výsledek dostaneš když AI zná celý kontext — produkt, cenu, zákazníka, jeho hlavní námitku. Každá fáze funnelu má jiný cíl a jiný tón.",
        en: "Why it works: a sales funnel is a system, not one text. You get the best results when AI knows the full context — product, price, customer, their main objection. Each funnel stage has a different goal and different tone.",
      },
      ps: [
        { label: { cs: "Kompletní sales funnel", en: "Full sales funnel" }, p: {
          cs: "Navrhni kompletní sales funnel pro:\nProdukt: [název a stručný popis]\nCena: [cenový model — např. '990 Kč/měs nebo 9900 Kč/rok']\nCílová skupina: [přesný popis — kdo jsou, co řeší, kde tráví čas]\nHlavní námitka: [proč nekoupí — cena / nedůvěra / načasování]\n\nFáze funnelu:\n1) TOFU — Awareness: 3 nápady na obsah který osloví lidi kteří náš produkt ještě neznají\n2) Lead magnet: 1 konkrétní bezplatný obsah (checklist, template, mini-kurz) s názvem a popisem\n3) Email sekvence (7 emailů): předmět + 2věty obsah pro každý email; den 1, 3, 5, 7, 10, 14, 21\n4) Sales page: struktura (ne copy) — co musí stránka obsahovat v jakém pořadí\n5) Upsell: co nabídnout po koupi a jak načasovat\n6) Retargeting: 2 nápady na retargeting pro ty, kteří nekoupili\n7) KPIs: co měřit v každé fázi (conversion rate, open rate...)",
          en: "Design a complete sales funnel for:\nProduct: [name and brief description]\nPrice: [pricing model — e.g. '$49/month or $490/year']\nTarget audience: [precise description — who they are, what they solve, where they spend time]\nMain objection: [why they won't buy — price / distrust / timing]\n\nFunnel stages:\n1) TOFU — Awareness: 3 content ideas that reach people who don't know our product yet\n2) Lead magnet: 1 specific free resource (checklist, template, mini-course) with name and description\n3) Email sequence (7 emails): subject + 2-sentence content for each email; day 1, 3, 5, 7, 10, 14, 21\n4) Sales page: structure (not copy) — what the page must contain and in what order\n5) Upsell: what to offer after purchase and when to time it\n6) Retargeting: 2 retargeting ideas for those who didn't buy\n7) KPIs: what to measure at each stage (conversion rate, open rate...)",
        }},
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
      tips: { cs: ["Artifacts → interaktivní komponenty", "Projekty sdílejí kontext", "XML tagy: \u003ccontext\u003e, \u003ctask\u003e", "200K tokenů = celé knihy"], en: ["Artifacts → interactive components", "Projects share context across conversations", "XML tags: \u003ccontext\u003e, \u003ctask\u003e", "200K tokens = entire books in one call"] }},
    { name: "DeepSeek R1", icon: "🟤", url: "https://chat.deepseek.com", d: { cs: "Zdarma reasoning model.", en: "Free reasoning model." }, mv: { cs: "V3 = rychlý | R1 = reasoning (o1 konkurent, zdarma!)", en: "V3 = fast | R1 = reasoning (o1 competitor, free!)" },
      tips: { cs: ["Zdarma alternativa k o1", "Vidíte myšlenkový postup", "Silný v matematice a kódu", "Open-source — lokálně přes Ollama"], en: ["Free o1 alternative", "See full thinking process", "Strong in math and code", "Open-source — run locally via Ollama"] }},
    { name: "Perplexity", icon: "🟣", url: "https://perplexity.ai", d: { cs: "AI search s citacemi.", en: "AI search with citations." }, mv: { cs: "Default = rychlý | Pro = volba modelu", en: "Default = fast | Pro = model choice" },
      tips: { cs: ["Citace u každé odpovědi", "Focus: Academic, Writing, Math", "Ideální na research"], en: ["Citations with every answer", "Focus: Academic, Writing, Math", "Ideal for research"] }},
    { name: "Midjourney", icon: "🎨", url: "https://midjourney.com", d: { cs: "Nejlepší generátor obrázků.", en: "Best image generator." }, mv: { cs: "v6.1 = nejnovější | Niji = anime styl", en: "v6.1 = latest | Niji = anime style" },
      tips: { cs: ["--ar 16:9, --style raw, --chaos 30", "Vždy promptujte anglicky", "--no pro vyloučení prvků z výsledku"], en: ["--ar 16:9, --style raw, --chaos 30", "Always prompt in English", "--no to exclude elements from result"] }},
  ],
  advanced: [
    { name: "Claude (Opus/Sonnet)", icon: "🟠", url: "https://claude.ai", d: { cs: "Top pro analýzu, strategii, kód.", en: "Top for analysis, strategy, code." }, mv: { cs: "Opus = nejhlubší | Sonnet = denní driver | Haiku = ultra rychlý", en: "Opus = deepest | Sonnet = daily driver | Haiku = ultra fast" },
      tips: { cs: ["XML: \u003crole\u003e, \u003ccontext\u003e, \u003cconstraints\u003e", "Claude Code CLI pro agentické kódování", "Extended thinking pro složité úkoly", "Batched API — 50% sleva na velkých objemech"], en: ["XML: \u003crole\u003e, \u003ccontext\u003e, \u003cconstraints\u003e", "Claude Code CLI for agentic coding", "Extended thinking for complex tasks", "Batched API — 50% discount at scale"] }},
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


// ─── CLAUDE INTERACTIVE GUIDE DATA ───────────────────────────────────────────
const CLAUDE_GUIDE = [
  {
    id: "website",
    icon: "🌐",
    title: { cs: "Vytvořit web", en: "Create a website" },
    time: { cs: "2–4 hodiny", en: "2–4 hours" },
    difficulty: { cs: "Středně pokročilý", en: "Intermediate" },
    desc: { cs: "Od nápadu k živému webu na Vercelu. Přesně jak vznikl tento průvodce.", en: "From idea to live website on Vercel. Exactly how this guide was built." },
    steps: [
      { title: { cs: "Popiš projekt Claudovi", en: "Describe your project to Claude" },
        desc: { cs: "Začni co nejkonkrétnějším popisem. Čím víc detailů dáš, tím lepší první verze dostaneš. Řekni co web dělá, kdo ho bude používat a jak má vypadat.", en: "Start with the most specific description you can. The more details you give, the better the first version will be. Say what the site does, who uses it, and how it should look." },
        prompt: { cs: "Vytvoř mi React single-page aplikaci. Jde o [popis projektu].\nCíloví uživatelé: [kdo to bude používat]\nDesign: tmavé pozadí (#06060A), amber akcenty (#F59E0B), font Sora\nFunkce: [seznam funkcí]\nVýstup: kompletní App.jsx připravený k nasazení přes Vite.", en: "Create a React single-page app for me. It is [project description].\nTarget users: [who will use it]\nDesign: dark background (#06060A), amber accents (#F59E0B), Sora font\nFeatures: [list of features]\nOutput: complete App.jsx ready to deploy via Vite." },
        tip: { cs: "Přidej odkaz na podobný web jako designovou referenci. 'Chci styl jako pendle.finance' je silnější instrukce než 20 vět o designu.", en: "Add a link to a similar website as a design reference. 'I want a style like pendle.finance' is a stronger instruction than 20 sentences about design." }
      },
      { title: { cs: "Nastav Vite projekt", en: "Set up the Vite project" },
        desc: { cs: "Vytvoř čistý React/Vite projekt lokálně. Tento krok je potřeba udělat jen jednou na začátku — poté už jen kopíruješ App.jsx od Claudea.", en: "Create a clean React/Vite project locally. This step only needs to be done once at the start — after that you just copy App.jsx from Claude." },
        prompt: { cs: "cd ~/Desktop\nnpm create vite@latest nazev-projektu -- --template react\ncd nazev-projektu\nnpm install", en: "cd ~/Desktop\nnpm create vite@latest project-name -- --template react\ncd project-name\nnpm install" },
        tip: { cs: "Spusť npm create vite PŘED tím než jdeš do složky — příkaz složku teprve vytvoří. Pak zkopíruj App.jsx od Claudea do src/App.jsx.", en: "Run npm create vite BEFORE going into the folder — the command creates the folder. Then copy App.jsx from Claude into src/App.jsx." }
      },
      { title: { cs: "Oprav build chyby", en: "Fix build errors" },
        desc: { cs: "Než pushneš na GitHub, požádej Claudea o automatickou opravu dvou nejčastějších problémů: víceřádkové stringy a XML tagy uvnitř JSX. Vite je odmítne buildovat.", en: "Before pushing to GitHub, ask Claude to automatically fix the two most common problems: multiline strings and XML tags inside JSX. Vite will refuse to build these." },
        prompt: { cs: "Zkontroluj tento App.jsx a oprav:\n1) Víceřádkové stringy uvnitř dvojitých uvozovek — nahraď je \n\n2) Raw XML tagy jako <context>, <role>, <task> uvnitř stringů — escapuj je na \u003c...\u003e\nVypiš kolik oprav jsi udělal a vrať opravený soubor.", en: "Check this App.jsx and fix:\n1) Multiline strings inside double quotes — replace with \n\n2) Raw XML tags like <context>, <role>, <task> inside strings — escape to \u003c...\u003e\nReport how many fixes you made and return the fixed file." },
        tip: { cs: "Rychlý test: build selže za ~7 sekund s 42-53 log řádky? Jde o multiline strings nebo XML tagy. Claude to opraví automaticky pokud ho požádáš.", en: "Quick test: build fails in ~7 seconds with 42-53 log lines? It's multiline strings or XML tags. Claude will fix it automatically if you ask." }
      },
      { title: { cs: "Pushni na GitHub", en: "Push to GitHub" },
        desc: { cs: "Vytvoř prázdný repozitář na github.com a nahrej kód. Důležité: nech repozitář prázdný — žádné README — jinak vznikne konflikt hned při prvním pushu.", en: "Create an empty repository on github.com and upload the code. Important: keep the repository empty — no README — otherwise a conflict will arise on the first push." },
        prompt: { cs: "git init\ngit add .\ngit commit -m "init"\ngit branch -M main\ngit remote add origin https://TVUJ_TOKEN@github.com/UZIVATEL/REPO.git\ngit push -u origin main", en: "git init\ngit add .\ngit commit -m "init"\ngit branch -M main\ngit remote add origin https://YOUR_TOKEN@github.com/USER/REPO.git\ngit push -u origin main" },
        tip: { cs: "Token najdeš na GitHub → avatar → Settings → Developer settings → Personal access tokens → Tokens (classic). Začíná na ghp_...", en: "Find your token at GitHub → avatar → Settings → Developer settings → Personal access tokens → Tokens (classic). Starts with ghp_..." }
      },
      { title: { cs: "Nasaď na Vercel", en: "Deploy on Vercel" },
        desc: { cs: "Vercel automaticky detekuje Vite projekt a nasadí ho zdarma. Po propojení s GitHubem se každý push automaticky promítne na web — žádná manuální práce.", en: "Vercel automatically detects a Vite project and deploys it for free. Once connected to GitHub, every push automatically updates the website — no manual work." },
        prompt: { cs: "1. Jdi na vercel.com → Add New → Project\n2. Vyber svůj GitHub repozitář\n3. Klikni Deploy (Vite je auto-detekováno)\n4. Za 60 sekund je web živý na *.vercel.app", en: "1. Go to vercel.com → Add New → Project\n2. Select your GitHub repository\n3. Click Deploy (Vite is auto-detected)\n4. In 60 seconds the site is live at *.vercel.app" },
        tip: { cs: "Každý další update: git add . && git commit -m 'update' && git push — Vercel nasadí automaticky.", en: "Every future update: git add . && git commit -m 'update' && git push — Vercel deploys automatically." }
      },
      { title: { cs: "Připoj vlastní doménu", en: "Connect your domain" },
        desc: { cs: "Pokud máš vlastní doménu, propoj ji s Vercelem přes DNS záznamy. Wedos a jiní čeští registrátoři používají standardní A a CNAME záznamy.", en: "If you have your own domain, connect it to Vercel via DNS records. Wedos and other Czech registrars use standard A and CNAME records." },
        prompt: { cs: "Vercel → projekt → Settings → Domains → přidej doménu.\nPotom na Wedosu (client.wedos.com → DNS):\n• Typ A, Název @, Hodnota 76.76.21.21\n• Typ CNAME, Název www, Hodnota cname.vercel-dns.com\nDNS se propaguje za 15 minut až 2 hodiny.", en: "Vercel → project → Settings → Domains → add domain.\nThen at your registrar:\n• Type A, Name @, Value 76.76.21.21\n• Type CNAME, Name www, Value cname.vercel-dns.com\nDNS propagates in 15 minutes to 2 hours." },
        tip: { cs: "Vercel vydá HTTPS certifikát automaticky hned po propagaci DNS. Nic dalšího nastavovat nemusíš.", en: "Vercel issues the HTTPS certificate automatically right after DNS propagates. No additional setup needed." }
      },
    ]
  },
  {
    id: "skill",
    icon: "🛠️",
    title: { cs: "Vytvořit Claude skill", en: "Create a Claude skill" },
    time: { cs: "1–2 hodiny", en: "1–2 hours" },
    difficulty: { cs: "Pokročilý", en: "Advanced" },
    desc: { cs: "Nauč Claudea workflow, který bude automaticky používat. Skill se uloží a Claude ho použije vždy když je relevantní.", en: "Teach Claude a workflow it will automatically use. The skill is saved and Claude uses it whenever relevant." },
    steps: [
      { title: { cs: "Popiš workflow který chceš zachytit", en: "Describe the workflow you want to capture" },
        desc: { cs: "Skill je nejlepší pro opakující se komplexní úkoly — deployment, tvorba dokumentů, analýza dat. Popiš co děláš, v jakém pořadí a co se nejčastěji pokazí.", en: "Skills work best for repetitive complex tasks — deployment, document creation, data analysis. Describe what you do, in what order, and what most commonly goes wrong." },
        prompt: { cs: "Chci vytvořit Claude skill pro tento workflow:\n[popis workflow]\n\nWorkflow se spouští když: [trigger situace]\nVstup: [co dostane Claude na začátku]\nVýstup: [co má Claude dodat]\nNejčastější chyby: [co se kazí]\n\nPolož mi otázky abychom skill navrhli správně.", en: "I want to create a Claude skill for this workflow:\n[workflow description]\n\nThe workflow triggers when: [trigger situation]\nInput: [what Claude receives at the start]\nOutput: [what Claude should deliver]\nMost common failures: [what goes wrong]\n\nAsk me questions so we design the skill correctly." },
        tip: { cs: "Dobré skilly mají konkrétní trigger — Claude je použije jen když jsou opravdu relevantní. Vague trigger = skill se nikdy nespustí.", en: "Good skills have a specific trigger — Claude uses them only when truly relevant. Vague trigger = skill never fires." }
      },
      { title: { cs: "Claude napíše SKILL.md", en: "Claude writes SKILL.md" },
        desc: { cs: "SKILL.md je srdce každého skillu. Obsahuje trigger description, krok po kroku instrukce, edge cases a reference soubory. Claude ho napíše na základě vaší diskuse.", en: "SKILL.md is the heart of every skill. It contains the trigger description, step-by-step instructions, edge cases, and reference files. Claude writes it based on your discussion." },
        prompt: { cs: "Na základě naší diskuse napiš kompletní SKILL.md pro tento skill.\nStruktura:\n---\nname: nazev-skillu\ndescription: [trigger popis — co spustí skill]\n---\n\n# Název skillu\n[instrukce krok po kroku]\n[edge cases]\n[reference soubory pokud jsou potřeba]", en: "Based on our discussion, write a complete SKILL.md for this skill.\nStructure:\n---\nname: skill-name\ndescription: [trigger description — what triggers the skill]\n---\n\n# Skill Name\n[step-by-step instructions]\n[edge cases]\n[reference files if needed]" },
        tip: { cs: "Description field je nejdůležitější — Claude se rozhoduje jestli skill použít právě podle něj. Měl by být 'pushy' a konkrétní, ne vágní.", en: "The description field is most important — Claude decides whether to use the skill based on it. It should be 'pushy' and specific, not vague." }
      },
      { title: { cs: "Otestuj skill", en: "Test the skill" },
        desc: { cs: "Před instalací si projdi skill mentálně s reálným příkladem. Projdi každý krok a ověř že instrukce produkují správný výsledek. Oprav co nefunguje.", en: "Before installing, mentally walk through the skill with a real example. Go through each step and verify the instructions produce the correct output. Fix what doesn't work." },
        prompt: { cs: "Proveď tento skill na tomto konkrétním příkladu:\n[příklad vstupu]\n\nKrok po kroku popiš co bys udělal/a. Pokud narážíš na nejednoznačnost nebo chybějící instrukce, pojmenuj je.", en: "Run through this skill on this specific example:\n[example input]\n\nStep by step, describe what you would do. If you encounter ambiguity or missing instructions, name them." },
        tip: { cs: "Nejlepší test je adversariální — zkus skill na vstupu který by ho měl spustit ale je hraniční. Odhalí slabé triggery.", en: "The best test is adversarial — try the skill on an input that should trigger it but is borderline. It reveals weak triggers." }
      },
      { title: { cs: "Zabalení a instalace", en: "Package and install" },
        desc: { cs: "Skill se zabalí do .skill souboru a nainstaluje přes Claude Settings. Od té chvíle Claude skill automaticky použije kdykoli je relevantní kontext.", en: "The skill is packaged into a .skill file and installed via Claude Settings. From that point, Claude automatically uses the skill whenever the context is relevant." },
        prompt: { cs: "Zabal skill do .skill souboru pomocí:\npython -m scripts.package_skill /cesta/ke/skill-slozce/\n\nPak jdi na claude.ai → Settings → Skills → Install from file → nahraj .skill soubor.", en: "Package the skill into a .skill file using:\npython -m scripts.package_skill /path/to/skill-folder/\n\nThen go to claude.ai → Settings → Skills → Install from file → upload the .skill file." },
        tip: { cs: "Skill můžeš updatovat kdykoliv — stačí upravit SKILL.md a znovu zabalit a nainstalovat. Starý skill se přepíše.", en: "You can update the skill anytime — just edit SKILL.md and repackage and reinstall. The old skill gets overwritten." }
      },
    ]
  },
  {
    id: "financial",
    icon: "📊",
    title: { cs: "Finanční model z dokumentu", en: "Financial model from document" },
    time: { cs: "30–90 minut", en: "30–90 minutes" },
    difficulty: { cs: "Středně pokročilý", en: "Intermediate" },
    desc: { cs: "Nahraj dodavatelský dokument nebo fee schedule a Claude z toho udělá interaktivní Excel simulaci.", en: "Upload a supplier document or fee schedule and Claude turns it into an interactive Excel simulation." },
    steps: [
      { title: { cs: "Nahraj dokument a popiš co chceš modelovat", en: "Upload the document and describe what to model" },
        desc: { cs: "Nahraj PDF, Word nebo CSV soubor. Řekni Claudovi co je cílem modelu — co se bude simulovat a které hodnoty jsou vstupní parametry.", en: "Upload a PDF, Word, or CSV file. Tell Claude what the model's goal is — what will be simulated and which values are input parameters." },
        prompt: { cs: "Nahraný soubor je [popis dokumentu — fee schedule / výroční zpráva / partnerská smlouva].\n\nChci z toho udělat Excel model kde budu moci simulovat:\n• Různé objemy transakcí (měsíčně v CZK)\n• Různé tempo růstu\n• Různé kurzy EUR/CZK\n\nBlue buňky = moje vstupy, které měním. Black buňky = vzorce vypočítané z vstupů.\nVýstup: xlsx s listem Assumptions, listem pro každého partnera a Summary listem.", en: "The uploaded file is [document description — fee schedule / annual report / partner agreement].\n\nI want to create an Excel model where I can simulate:\n• Different transaction volumes (monthly in CZK)\n• Different growth rates\n• Different EUR/CZK exchange rates\n\nBlue cells = my inputs that I change. Black cells = formulas calculated from inputs.\nOutput: xlsx with an Assumptions sheet, a sheet per partner, and a Summary sheet." },
        tip: { cs: "Čím konkrétnější jsi ohledně struktury outputu, tím lépe. 'Chci Assumptions sheet s modrými buňkami a Summary s celkovými revenues' je lepší než 'udělej Excel'.", en: "The more specific you are about the output structure, the better. 'I want an Assumptions sheet with blue cells and a Summary with total revenues' is better than 'make an Excel'." }
      },
      { title: { cs: "Claude detekuje strukturu dokumentu", en: "Claude detects document structure" },
        desc: { cs: "Claude přečte dokument, identifikuje tabulky, fee typy, objemové tiry a vzorce. Výsledek ti popíše než začne psát kód — tak můžeš opravit nedorozumění.", en: "Claude reads the document, identifies tables, fee types, volume tiers, and relationships. It describes the result to you before writing code — so you can correct misunderstandings." },
        prompt: { cs: "Před tím než začneš psát kód, popiš mi co jsi v dokumentu našel:\n1) Jaké fee typy existují a jak jsou strukturované\n2) Jsou tam objemové tiry? Jaké thresholdy?\n3) Které hodnoty jsou fixní, které závisí na objemu\n4) Co bude v Assumptions sheetu (modré buňky)\n5) Co bude vzorec vs. hardcoded hodnota", en: "Before writing any code, describe to me what you found in the document:\n1) What fee types exist and how are they structured\n2) Are there volume tiers? What thresholds?\n3) Which values are fixed, which depend on volume\n4) What will be in the Assumptions sheet (blue cells)\n5) What will be a formula vs. a hardcoded value" },
        tip: { cs: "Tento krok ušetří hodiny. Nechej Claudea popsat strukturu a oprav ho pokud něco špatně pochopil — pak teprve pusť na kódování.", en: "This step saves hours. Let Claude describe the structure and correct it if something was misunderstood — only then let it start coding." }
      },
      { title: { cs: "Validace a doručení", en: "Validation and delivery" },
        desc: { cs: "Claude spustí recalc script který ověří nulový počet formula chyb. Pak dostaneš xlsx soubor s popsanou strukturou a návodem jak měnit vstupy.", en: "Claude runs the recalc script which verifies zero formula errors. You then receive the xlsx file with a described structure and instructions on how to change inputs." },
        prompt: { cs: "Po vygenerování souboru:\n1) Spusť scripts/recalc.py a ověř že status je 'success'\n2) Zkontroluj že žádná buňka neobsahuje #REF!, #DIV/0! nebo #VALUE!\n3) Popiš mi strukturu sheetu — jaké jsou modré buňky a co se přepočítá když je změním\n4) Doruč soubor", en: "After generating the file:\n1) Run scripts/recalc.py and verify status is 'success'\n2) Check no cell contains #REF!, #DIV/0! or #VALUE!\n3) Describe the sheet structure to me — what are the blue cells and what recalculates when I change them\n4) Deliver the file" },
        tip: { cs: "Pokud model potřebuješ aktualizovat (nové fee sazby, nový partner), stačí nahrát nový dokument a říct 'aktualizuj existující model' — Claude zachová strukturu.", en: "If you need to update the model (new fee rates, new partner), just upload a new document and say 'update the existing model' — Claude will preserve the structure." }
      },
    ]
  },
  {
    id: "mcp",
    icon: "🔌",
    title: { cs: "Propojit aplikace s Claudem", en: "Connect apps with Claude" },
    time: { cs: "15–30 minut", en: "15–30 minutes" },
    difficulty: { cs: "Začátečník", en: "Beginner" },
    desc: { cs: "Přes MCP konektory Claude vidí tvůj Google Kalendář, Gmail, Figmu a další aplikace. Můžeš ho pak požádat aby za tebe věci rovnou udělal.", en: "Via MCP connectors, Claude can see your Google Calendar, Gmail, Figma, and other apps. You can then ask it to do things for you directly." },
    steps: [
      { title: { cs: "Aktivuj konektory v nastavení", en: "Enable connectors in settings" },
        desc: { cs: "Claude.ai má v nastavení sekci Connectors kde aktivuješ integraci s různými aplikacemi. Každý konektor vyžaduje jednorázové přihlášení přes OAuth.", en: "Claude.ai has a Connectors section in settings where you activate integration with various apps. Each connector requires a one-time OAuth login." },
        prompt: { cs: "Jdi na claude.ai → Settings → Connectors\nDostupné konektory:\n• Google Calendar — čtení a tvorba událostí\n• Gmail — čtení a posílání emailů\n• Figma — čtení a editace designů\n• Google Drive — přístup k dokumentům\n• Slack — čtení a posílání zpráv\n\nKlikni na konektor → Authorize → přihlaš se do příslušné služby.", en: "Go to claude.ai → Settings → Connectors\nAvailable connectors:\n• Google Calendar — reading and creating events\n• Gmail — reading and sending emails\n• Figma — reading and editing designs\n• Google Drive — document access\n• Slack — reading and sending messages\n\nClick connector → Authorize → log in to the respective service." },
        tip: { cs: "Konektory fungují jen v konverzaci kde jsou aktivovány. Aktivuj je kliknutím na ikonu nástrojů v chat okně.", en: "Connectors only work in conversations where they are activated. Enable them by clicking the tools icon in the chat window." }
      },
      { title: { cs: "Otestuj konektor reálným úkolem", en: "Test the connector with a real task" },
        desc: { cs: "Nejlepší test je okamžitě použít konektor na reálný úkol. Přidej konektor do konverzace a zadej konkrétní požadavek.", en: "The best test is to immediately use the connector on a real task. Add the connector to the conversation and give a specific request." },
        prompt: { cs: "Zkus jeden z těchto promptů podle aktivního konektoru:\n\nGoogle Calendar: 'Co mám v kalendáři příští týden? Jsou tam nějaké konflikty?'\n\nGmail: 'Najdi emaily od [odesílatel] z posledního týdne a shrň co chtějí.'\n\nFigma: 'Otevři tento Figma soubor [URL] a popiš mi komponentu na hlavní stránce.'", en: "Try one of these prompts based on the active connector:\n\nGoogle Calendar: 'What do I have in my calendar next week? Are there any conflicts?'\n\nGmail: 'Find emails from [sender] from the last week and summarize what they want.'\n\nFigma: 'Open this Figma file [URL] and describe the component on the main page.'" },
        tip: { cs: "Kombinace konektorů je silná — 'Podívej se do Gmailu jestli mám emaily o meetingu v pátek, a pokud ne, vytvoř mi v Kalendáři event' funguje v jednom promptu.", en: "Combining connectors is powerful — 'Check Gmail for emails about Friday's meeting, and if there aren't any, create a Calendar event for me' works in one prompt." }
      },
    ]
  },
  {
    id: "email",
    icon: "📧",
    title: { cs: "Psát profesionální emaily", en: "Write professional emails" },
    time: { cs: "5–10 minut", en: "5–10 minutes" },
    difficulty: { cs: "Začátečník", en: "Beginner" },
    desc: { cs: "Claude napíše email za zlomek času a obvykle lépe než bys napsal sám. Klíč je dát mu správný kontext a omezení.", en: "Claude writes an email in a fraction of the time and usually better than you would yourself. The key is giving it the right context and constraints." },
    steps: [
      { title: { cs: "Popiš situaci a co nechceš", en: "Describe the situation and what you don't want" },
        desc: { cs: "Řekni kdo píše komu, v jakém vztahu a co je cílem emailu. Stejně důležité je říct co v emailu NECHCEŠ — AI defaultně píše příliš formálně a začíná Dobrý den.", en: "Say who is writing to whom, in what relationship, and what the email's goal is. Equally important is saying what you DON'T want — AI defaults to too formal and starts with Dear Sir." },
        prompt: { cs: "Napiš email [komu — jméno/role].\nSituace: [co se stalo, kontext]\nCíl emailu: [co chci dosáhnout]\nTón: [profesionální ale přátelský / formální / přímý]\nMax délka: [X slov nebo vět]\n\nNezačínej 'Dobrý den, jmenuji se'.\nNezačínej větou s omluvou pokud to není omluva.\nŽádná klišé jako 'těším se na spolupráci'.", en: "Write an email to [who — name/role].\nSituation: [what happened, context]\nEmail goal: [what I want to achieve]\nTone: [professional but friendly / formal / direct]\nMax length: [X words or sentences]\n\nDon't start with 'Dear Sir/Madam, my name is'.\nDon't start with an apology if it's not an apology.\nNo clichés like 'I look forward to hearing from you'." },
        tip: { cs: "Nejsilnější instrukce je říct co NECHCEŠ. 'Nezačínej slovem Omlouvám se — nejdřív vysvětli situaci, pak se omluv' změní výsledek dramaticky.", en: "The most powerful instruction is saying what you DON'T want. 'Don't start with I apologize — first explain the situation, then apologize' changes the result dramatically." }
      },
      { title: { cs: "Iteruj dokud to nesedí", en: "Iterate until it fits" },
        desc: { cs: "První verze bude dobrá ale ne perfektní. Použij krátké instrukce pro iteraci — nepřepisuj celý prompt znovu.", en: "The first version will be good but not perfect. Use short instructions for iteration — don't rewrite the entire prompt again." },
        prompt: { cs: "Rychlé iterační instrukce:\n'Zkrať to o třetinu'\n'Tón víc přátelský, méně formální'\n'Přidej konkrétní příklad z [situace]'\n'Začni silnější první větou'\n'Odstraň poslední odstavec'\n'Přepiš to jako bych psal/a já, ne jako šablona'", en: "Quick iteration instructions:\n'Shorten it by a third'\n'Tone more friendly, less formal'\n'Add a specific example from [situation]'\n'Start with a stronger first sentence'\n'Remove the last paragraph'\n'Rewrite it as if I wrote it, not as a template'" },
        tip: { cs: "Výsledek nepotřebuješ použít 1:1 — stačí když ti dá dobrý základ který upravíš za 2 minuty místo psaní od nuly za 20.", en: "You don't need to use the result 1:1 — it's enough if it gives you a good base you can adjust in 2 minutes instead of writing from scratch in 20." }
      },
    ]
  },
  {
    id: "project",
    icon: "🗂️",
    title: { cs: "Vytvořit Project v Claudovi", en: "Build a Project in Claude" },
    time: { cs: "20–40 minut", en: "20–40 minutes" },
    difficulty: { cs: "Středně pokročilý", en: "Intermediate" },
    desc: { cs: "Projects jsou jako soukromé pracovní prostory kde Claude zná kontext tvé práce. Každá konverzace v projektu sdílí stejné instrukce a znalosti.", en: "Projects are like private workspaces where Claude knows the context of your work. Every conversation in the project shares the same instructions and knowledge." },
    steps: [
      { title: { cs: "Vytvoř nový projekt", en: "Create a new project" },
        desc: { cs: "Project vytvoříš v levém panelu na claude.ai. Každý projekt má systémový prompt — instrukce které Claude dostane na začátku každé konverzace v projektu.", en: "Create a project in the left panel on claude.ai. Each project has a system prompt — instructions Claude receives at the start of every conversation in the project." },
        prompt: { cs: "claude.ai → levý panel → New Project → zadej název\n\nSystémový prompt pro projekt (příklad pro treasury workflow):\n'Jsem Head of Treasury ve fintech firmě. Pracuji s cashflow modely, FX riziky a regulatorním reportingem (MiCA). Odpovídej stručně a konkrétně. Čísla vždy v CZK pokud neřeknu jinak. Pokud potřebuješ víc informací, zeptej se — nehádej.'", en: "claude.ai → left panel → New Project → enter name\n\nSystem prompt for the project (treasury workflow example):\n'I am Head of Treasury at a fintech company. I work with cashflow models, FX risks, and regulatory reporting (MiCA). Answer concisely and specifically. Numbers always in CZK unless I say otherwise. If you need more information, ask — don't guess.'" },
        tip: { cs: "Systémový prompt by měl říkat KDO jsi, CO děláš a JAK chceš aby Claude odpovídal. Krátký a konkrétní je lepší než dlouhý a obecný.", en: "The system prompt should say WHO you are, WHAT you do, and HOW you want Claude to respond. Short and specific is better than long and general." }
      },
      { title: { cs: "Přidej znalostní soubory", en: "Add knowledge files" },
        desc: { cs: "Do projektu můžeš nahrát dokumenty které Claude bude mít vždy k dispozici — interní předpisy, šablony, fee scheduly, technická dokumentace. Claude je přečte a bude na ně odkazovat.", en: "You can upload documents to the project that Claude always has available — internal regulations, templates, fee schedules, technical documentation. Claude reads them and references them." },
        prompt: { cs: "Project → Add content → nahraj soubory\n\nCo funguje dobře jako project knowledge:\n• Interní procesy a schvalovací workflow\n• Šablony dokumentů\n• Fee scheduly a cenové tabulky\n• Kontakty a organizační struktura\n• Technická dokumentace API\n• Regulatorní pravidla relevantní pro tvoji práci", en: "Project → Add content → upload files\n\nWhat works well as project knowledge:\n• Internal processes and approval workflows\n• Document templates\n• Fee schedules and pricing tables\n• Contacts and organizational structure\n• API technical documentation\n• Regulatory rules relevant to your work" },
        tip: { cs: "Project knowledge má limit. Nahrávej jen dokumenty na které se budeš aktivně odkazovat — ne celý firemní intranet.", en: "Project knowledge has a limit. Upload only documents you will actively reference — not the entire company intranet." }
      },
      { title: { cs: "Spusť první konverzaci", en: "Start your first conversation" },
        desc: { cs: "V projektu každá konverzace začíná se systémovým promptem a přístupem ke všem nahraným dokumentům. Nemusíš každý přidávat znovu.", en: "In the project, every conversation starts with the system prompt and access to all uploaded documents. You don't need to add them again each time." },
        prompt: { cs: "Příklady prvních promptů v projektu:\n\n'Shrň klíčové body z [nahraného dokumentu] relevantní pro [konkrétní situaci].'\n\n'Napiš email partnerovi podle naší standardní šablony. Situace: [popis]'\n\n'Zkontroluj jestli tento postup odpovídá interním pravidlům: [popis postupu]'", en: "Examples of first prompts in a project:\n\n'Summarize the key points from [uploaded document] relevant to [specific situation].'\n\n'Write an email to a partner using our standard template. Situation: [description]'\n\n'Check if this procedure follows our internal rules: [procedure description]'" },
        tip: { cs: "Projekty jsou nejsilnější pro opakující se typy práce — treasury reporty, partnerská komunikace, regulatorní analýzy. Vytvoř projekt pro každou oblast.", en: "Projects are most powerful for recurring types of work — treasury reports, partner communication, regulatory analysis. Create a project for each domain." }
      },
    ]
  },
  {
    id: "prompts",
    icon: "💡",
    title: { cs: "Vytvořit knihovnu promptů", en: "Create a prompt library" },
    time: { cs: "1–2 hodiny", en: "1–2 hours" },
    difficulty: { cs: "Středně pokročilý", en: "Intermediate" },
    desc: { cs: "Místo psaní promptu od nuly pokaždé si vytvoř sadu šablon pro nejčastější úkoly. Ušetří 80% času na opakující se práci.", en: "Instead of writing prompts from scratch each time, create a set of templates for your most common tasks. Saves 80% of time on recurring work." },
    steps: [
      { title: { cs: "Identifikuj opakující se úkoly", en: "Identify recurring tasks" },
        desc: { cs: "Projdi posledních 30 dní práce a napiš seznam věcí které děláš opakovaně. Každý z nich je kandidát na prompt šablonu. Zaměř se na věci které trvají 15+ minut.", en: "Review the last 30 days of work and list things you do repeatedly. Each is a candidate for a prompt template. Focus on things that take 15+ minutes." },
        prompt: { cs: "Pomoz mi identifikovat moje nejčastější pracovní úkoly vhodné pro AI asistenci.\n\nMoje role: [popis role]\nTypické projekty: [seznam]\n\nPro každý úkol řekni:\n1) Jak by vypadal ideální prompt šablona\n2) Jaké proměnné by šablona měla mít (věci v [závorkách])\n3) Jaký výstup by Claude měl dodat", en: "Help me identify my most common work tasks suitable for AI assistance.\n\nMy role: [role description]\nTypical projects: [list]\n\nFor each task say:\n1) What would the ideal prompt template look like\n2) What variables should the template have ([in brackets])\n3) What output should Claude deliver" },
        tip: { cs: "Nejlepší prompt šablony řeší opakující se situace kde výstup je vždy podobného typu — zprávy, emaily, analýzy, shrnutí.", en: "The best prompt templates solve recurring situations where the output is always of a similar type — reports, emails, analyses, summaries." }
      },
      { title: { cs: "Ulož šablony do projektu", en: "Save templates to a project" },
        desc: { cs: "Vytvoř Claude projekt pro svou prompt knihovnu. Nahraj šablony jako soubor nebo je vlož do systémového promptu. Pak stačí říct 'použij šablonu X' a doplnit proměnné.", en: "Create a Claude project for your prompt library. Upload templates as a file or include them in the system prompt. Then just say 'use template X' and fill in the variables." },
        prompt: { cs: "Systémový prompt pro prompt knihovnu:\n'Máš přístup k mé knihovně prompt šablon. Když řeknu "použij šablonu [název]", načti příslušnou šablonu, požádej mě o hodnoty proměnných v závorkách, a pak ji vyplň.\n\nMoje šablony:\n[seznam názvů šablon]\n\nKompletní šablony jsou v přiloženém souboru prompts.md'", en: "System prompt for prompt library:\n'You have access to my prompt template library. When I say "use template [name]", load the appropriate template, ask me for values of variables in brackets, then fill it in.\n\nMy templates:\n[list of template names]\n\nComplete templates are in the attached prompts.md file'" },
        tip: { cs: "Nemusíš mít šablonu pro všechno — 5 kvalitních šablon pro nejčastější úkoly je lepší než 50 mediokrních.", en: "You don't need a template for everything — 5 quality templates for your most common tasks is better than 50 mediocre ones." }
      },
    ]
  },
  {
    id: "research",
    icon: "🔍",
    title: { cs: "Research s Perplexity + Claude", en: "Research with Perplexity + Claude" },
    time: { cs: "30–60 minut", en: "30–60 minutes" },
    difficulty: { cs: "Středně pokročilý", en: "Intermediate" },
    desc: { cs: "Perplexity hledá aktuální fakta s citacemi, Claude je hluboce analyzuje. Kombinace je silnější než každý nástroj zvlášť.", en: "Perplexity finds current facts with citations, Claude deeply analyzes them. The combination is stronger than either tool alone." },
    steps: [
      { title: { cs: "Použij Perplexity pro sběr faktů", en: "Use Perplexity for fact gathering" },
        desc: { cs: "Perplexity je specializovaný na vyhledávání s aktuálními daty a citacemi zdrojů. Použij ho pro faktické otázky kde záleží na aktuálnosti a ověřitelnosti.", en: "Perplexity specializes in search with current data and source citations. Use it for factual questions where currency and verifiability matter." },
        prompt: { cs: "Perplexity prompt (na perplexity.ai):\n'Zjisti aktuální informace o [téma].\nPotřebuji:\n• Konkrétní čísla a statistiky z posledních 12 měsíců\n• Hlavní hráče nebo události\n• Trendy a predikce\n\nUveď zdroje pro každé tvrzení.'", en: "Perplexity prompt (at perplexity.ai):\n'Find current information about [topic].\nI need:\n• Specific numbers and statistics from the last 12 months\n• Key players or events\n• Trends and predictions\n\nCite sources for each claim.'" },
        tip: { cs: "Perplexity Deep Research dává podstatně hlubší výstupy než základní verze. Výsledky jsou delší ale mají více zdrojů a kontextu.", en: "Perplexity Deep Research gives substantially deeper outputs than the basic version. Results are longer but have more sources and context." }
      },
      { title: { cs: "Pošli výsledky Claudovi k analýze", en: "Send results to Claude for analysis" },
        desc: { cs: "Zkopíruj výsledky z Perplexity a vlož je do Claudea s instrukcí co s nimi udělat. Claude je strukturuje, vyvodí závěry a identifikuje mezery.", en: "Copy results from Perplexity and paste them into Claude with instructions on what to do with them. Claude structures them, draws conclusions, and identifies gaps." },
        prompt: { cs: "Toto jsou výsledky z Perplexity o [téma]:\n[vlož výsledky]\n\nAnalyzuj je a:\n1) Identifikuj 3-5 klíčových zjištění\n2) Jaké jsou implikace pro [moje situace / firma / rozhodnutí]?\n3) Co v datech chybí nebo je nejasné?\n4) Jaký je tvůj závěr?\n\nBuď konkrétní — ne obecné shrnutí ale akční poznatky.", en: "These are Perplexity results about [topic]:\n[paste results]\n\nAnalyze them and:\n1) Identify 3-5 key findings\n2) What are the implications for [my situation / company / decision]?\n3) What is missing or unclear in the data?\n4) What is your conclusion?\n\nBe specific — not a general summary but actionable insights." },
        tip: { cs: "Tento workflow funguje skvěle pro due diligence, competitive intelligence a regulatorní analýzy — oblasti kde potřebuješ aktuální fakta i hluboké myšlení.", en: "This workflow works great for due diligence, competitive intelligence, and regulatory analysis — areas where you need current facts AND deep thinking." }
      },
    ]
  },
  {
    id: "artifact",
    icon: "🤖",
    title: { cs: "Vytvořit AI-powered artifact", en: "Build an AI-powered artifact" },
    time: { cs: "30–60 minut", en: "30–60 minutes" },
    difficulty: { cs: "Pokročilý", en: "Advanced" },
    desc: { cs: "Artifact je interaktivní aplikace běžící přímo v Claudovi. Může volat Anthropic API a vytvářet tak AI-powered nástroje bez nutnosti nasazení.", en: "An artifact is an interactive application running directly inside Claude. It can call the Anthropic API, creating AI-powered tools without deployment." },
    steps: [
      { title: { cs: "Popiš aplikaci", en: "Describe the application" },
        desc: { cs: "Artifacts jsou React nebo HTML aplikace renderované přímo v chatu. Mohou volat Anthropic API což znamená že mohou samy generovat AI obsah.", en: "Artifacts are React or HTML applications rendered directly in chat. They can call the Anthropic API which means they can themselves generate AI content." },
        prompt: { cs: "Vytvoř React artifact — interaktivní aplikaci která:\n[popis co aplikace dělá]\n\nAplikace má:\n• [UI prvky — input pole, tlačítka, výstupní oblast]\n• [Volání Anthropic API s modelem claude-sonnet-4-20250514]\n• [Jak zpracuje výsledek a zobrazí ho uživateli]\n\nPoužij Tailwind pro styling. Zachovej tmavé téma (#06060A pozadí, #F59E0B akcenty).", en: "Create a React artifact — an interactive application that:\n[description of what the app does]\n\nThe application has:\n• [UI elements — input fields, buttons, output area]\n• [Anthropic API call with model claude-sonnet-4-20250514]\n• [How it processes the result and displays it to the user]\n\nUse Tailwind for styling. Maintain dark theme (#06060A background, #F59E0B accents)." },
        tip: { cs: "Artifacts s API voláním jsou nejsilnější pro nástroje které generují různý obsah pokaždé — prompt vylepšovač, email asistent, analýza textu.", en: "Artifacts with API calls are most powerful for tools that generate different content each time — prompt improver, email assistant, text analysis." }
      },
      { title: { cs: "Exportuj jako standalone HTML", en: "Export as standalone HTML" },
        desc: { cs: "Artifact běžící v Claudovi lze exportovat jako samostatný HTML soubor. Ten pak lze nahrát na jakýkoliv webhosting nebo sdílet přímo.", en: "An artifact running in Claude can be exported as a standalone HTML file. This can then be uploaded to any web host or shared directly." },
        prompt: { cs: "Vezmi tento React artifact a převeď ho na standalone HTML soubor:\n• React a Babel ze CDN (cdnjs.cloudflare.com)\n• Veškerý kód v jednom souboru\n• API klíč budu vkládat přes input pole v UI (ne hardcoded)\n• Soubor musí fungovat když ho otevřu lokálně v prohlížeči", en: "Take this React artifact and convert it to a standalone HTML file:\n• React and Babel from CDN (cdnjs.cloudflare.com)\n• All code in one file\n• API key entered via input field in the UI (not hardcoded)\n• File must work when I open it locally in a browser" },
        tip: { cs: "API klíč nikdy hardcode do souboru — vždy ho nech uživatele zadat přes UI. Standalone HTML soubory sdílíš a nechceš v nich viditelné API klíče.", en: "Never hardcode the API key into the file — always let the user enter it via the UI. Standalone HTML files get shared and you don't want visible API keys in them." }
      },
    ]
  },
  {
    id: "automation",
    icon: "📱",
    title: { cs: "Automatizovat opakující se úkoly", en: "Automate repetitive tasks" },
    time: { cs: "1–3 hodiny", en: "1–3 hours" },
    difficulty: { cs: "Pokročilý", en: "Advanced" },
    desc: { cs: "Claude pomůže identifikovat co automatizovat a jak. Nemusíš umět programovat — Claude napíše kód, ty jen popíšeš co chceš.", en: "Claude helps identify what to automate and how. You don't need to know how to program — Claude writes the code, you just describe what you want." },
    steps: [
      { title: { cs: "Identifikuj co automatizovat", en: "Identify what to automate" },
        desc: { cs: "Ne všechno má smysl automatizovat. Nejlepší kandidáti jsou úkoly které jsou časté, mají jasný vstup a výstup a nevyžadují lidský úsudek v každém kroku.", en: "Not everything is worth automating. The best candidates are tasks that are frequent, have a clear input and output, and don't require human judgment at every step." },
        prompt: { cs: "Chci automatizovat tento úkol:\n[popis úkolu]\n\nAktuálně to dělám takto: [popis kroků]\nFrekvence: [jak často]\nČas: [kolik to zabere]\n\nNavrhni:\n1) Zda to má smysl automatizovat\n2) Jaký nástroj by byl nejlepší (Python script / Make / n8n / Claude API)\n3) Co bude vstup a výstup automatizace\n4) Jaká jsou rizika nebo edge cases", en: "I want to automate this task:\n[task description]\n\nCurrently I do it like this: [step description]\nFrequency: [how often]\nTime: [how long it takes]\n\nSuggest:\n1) Whether it makes sense to automate\n2) What tool would be best (Python script / Make / n8n / Claude API)\n3) What the input and output of the automation will be\n4) What the risks or edge cases are" },
        tip: { cs: "Pravidlo: pokud úkol děláš více než 3x týdně a trvá víc než 15 minut, automatizace se pravděpodobně vyplatí.", en: "Rule: if you do a task more than 3 times a week and it takes more than 15 minutes, automation likely pays off." }
      },
      { title: { cs: "Claude napíše automatizaci", en: "Claude writes the automation" },
        desc: { cs: "Poté co víš co automatizovat a čím, nech Claudea napsat konkrétní implementaci. Pro Python skripty ti napíše hotový kód, pro Make nebo n8n popíše workflow.", en: "Once you know what to automate and with what, let Claude write the specific implementation. For Python scripts it writes ready code, for Make or n8n it describes the workflow." },
        prompt: { cs: "Napiš Python skript pro tuto automatizaci:\nVstup: [popis vstupu — soubor, API volání, email]\nZpracování: [co se má stát]\nVýstup: [kde se výsledek uloží nebo pošle]\n\nPožadavky:\n• Ošetření chyb a edge cases\n• Logování co skript dělá\n• Spustitelný přes command line s parametry\n• Komentáře u složitějších částí", en: "Write a Python script for this automation:\nInput: [input description — file, API call, email]\nProcessing: [what should happen]\nOutput: [where the result is saved or sent]\n\nRequirements:\n• Error handling and edge cases\n• Logging what the script does\n• Runnable from command line with parameters\n• Comments on more complex parts" },
        tip: { cs: "Začni malou automatizací která řeší jeden konkrétní problém. Je lepší mít jednoduchou automatizaci která spolehlivě funguje než složitou která občas selže.", en: "Start with a small automation that solves one specific problem. A simple automation that reliably works is better than a complex one that occasionally fails." }
      },
      { title: { cs: "Otestuj a nasaď", en: "Test and deploy" },
        desc: { cs: "Před nasazením otestuj automatizaci na malém vzorku dat. Pak ji nasaď — buď lokálně jako cron job, nebo v cloudu přes GitHub Actions nebo Make.", en: "Before deploying, test the automation on a small data sample. Then deploy it — either locally as a cron job, or in the cloud via GitHub Actions or Make." },
        prompt: { cs: "Jak nastavit spouštění tohoto skriptu automaticky:\n\nLokálně (Mac/Linux):\ncrontab -e\n# Každý den v 9:00:\n0 9 * * * /usr/bin/python3 /cesta/ke/skriptu.py\n\nGitHub Actions (cloud, zdarma):\n[Claude napíše .github/workflows/automation.yml]\n\nMake.com (bez kódu):\n[Claude popíše workflow v Make pro stejný výsledek]", en: "How to set up automatic execution of this script:\n\nLocally (Mac/Linux):\ncrontab -e\n# Every day at 9:00:\n0 9 * * * /usr/bin/python3 /path/to/script.py\n\nGitHub Actions (cloud, free):\n[Claude writes .github/workflows/automation.yml]\n\nMake.com (no-code):\n[Claude describes the Make workflow for the same result]" },
        tip: { cs: "GitHub Actions je skvělá volba pro automatizace které potřebují běžet v cloudu zdarma. Limit je 2000 minut za měsíc na free tier — na většinu automatizací stačí.", en: "GitHub Actions is a great choice for automations that need to run in the cloud for free. The limit is 2000 minutes per month on the free tier — sufficient for most automations." }
      },
    ]
  },
];

// ─── HEADER COMPONENT (stable — defined outside AIGuide) ─────────────────────
function AppHeader({ lang, setLang, t, dark, setDark, headerBg, border, muted, text, setLevel, setShowGuide }) {
  const goHome = () => { if (setLevel) { setLevel(null); setShowGuide(false); window.scrollTo(0, 0); } };
  return (
    <header style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "0 32px", height: 64,
      borderBottom: `1px solid ${border}`,
      position: "sticky", top: 0, zIndex: 100,
      background: headerBg, backdropFilter: "blur(20px)",
    }}>
      {/* Logo */}
      <div onClick={goHome} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
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


// ─── CLAUDE INTERACTIVE GUIDE COMPONENT ──────────────────────────────────────
function ClaudeGuide({ lang, t, dark, bg, surface, border, text, muted, faint, headerBg, setDark, setLevel, setShowGuide }) {
  const [activeCase, setActiveCase] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const PURPLE = "#7C3AED";
  const PURPLELO = "rgba(124,58,237,0.12)";

  const cp = useCallback((txt, id) => {
    navigator.clipboard.writeText(txt).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const guide = CLAUDE_GUIDE[activeCase];
  const step = guide.steps[activeStep];
  const totalSteps = guide.steps.length;
  const isFirst = activeStep === 0;
  const isLast = activeStep === totalSteps - 1;

  const goNext = () => {
    setCompleted(prev => ({ ...prev, [`${activeCase}-${activeStep}`]: true }));
    if (!isLast) { setActiveStep(s => s + 1); window.scrollTo(0, 0); }
  };

  const goBack = () => {
    if (!isFirst) { setActiveStep(s => s - 1); window.scrollTo(0, 0); }
  };

  const selectCase = (idx) => {
    setActiveCase(idx);
    setActiveStep(0);
    window.scrollTo(0, 0);
  };

  const diffColor = (d) => {
    if (!d) return muted;
    const cs = (d.cs || d).toLowerCase();
    if (cs.includes("začáteč") || cs.toLowerCase().includes("beginner")) return "#10B981";
    if (cs.includes("pokroč") || cs.toLowerCase().includes("advanced")) return T.accent;
    return T.teal;
  };

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "'Sora',sans-serif", position: "relative" }}>
      <Background dark={dark} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <AppHeader lang={lang} setLang={() => {}} t={t} dark={dark} setDark={setDark} headerBg={headerBg} border={border} muted={muted} text={text} setLevel={setLevel} setShowGuide={setShowGuide} />
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 100px" }}>

          {/* Back button */}
          <button className="back-btn" onClick={() => { setLevel(null); setShowGuide(false); window.scrollTo(0, 0); }}
            style={{ background: "transparent", border: `1px solid ${border}`, borderRadius: 7, padding: "7px 16px", fontSize: 13, color: muted, cursor: "pointer", fontFamily: "inherit", marginBottom: 24, transition: "all .2s" }}>
            {lang === "cs" ? "← Zpět" : "← Back"}
          </button>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${PURPLE}, #A78BFA)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
              <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", color: text }}>
                {lang === "cs" ? "Claude Průvodce" : "Claude Guide"}
              </h1>
            </div>
            <p style={{ color: muted, fontSize: 14, maxWidth: 560, lineHeight: 1.6 }}>
              {lang === "cs" ? "Interaktivní průvodce reálnými use cases. Klikej se krok po kroku a kopíruj prompty přímo do Claudea." : "Interactive guide through real use cases. Click through step by step and copy prompts directly into Claude."}
            </p>
          </div>

          <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>

            {/* Left panel — use case selector */}
            <div style={{ width: 240, flexShrink: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: faint, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
                {lang === "cs" ? "Témata" : "Topics"}
              </div>
              {CLAUDE_GUIDE.map((g, i) => {
                const isActive = i === activeCase;
                const doneCount = g.steps.filter((_, si) => completed[`${i}-${si}`]).length;
                return (
                  <button key={g.id} onClick={() => selectCase(i)} style={{
                    width: "100%", textAlign: "left", background: isActive ? PURPLELO : "transparent",
                    border: `1px solid ${isActive ? PURPLE + "66" : border}`,
                    borderRadius: 10, padding: "10px 14px", cursor: "pointer",
                    fontFamily: "inherit", color: isActive ? "#C4B5FD" : muted,
                    marginBottom: 6, transition: "all .2s", display: "flex", alignItems: "center", gap: 10,
                  }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{g.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? "#C4B5FD" : text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.title[lang]}</div>
                      <div style={{ fontSize: 11, color: faint, marginTop: 2 }}>{g.time[lang]} · {g.steps.length} {lang === "cs" ? "kroků" : "steps"}</div>
                    </div>
                    {doneCount > 0 && (
                      <span style={{ fontSize: 10, color: "#10B981", fontWeight: 700, flexShrink: 0 }}>{doneCount}/{g.steps.length}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right panel — step walkthrough */}
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* Use case header */}
              <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: "24px 28px", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 36 }}>{guide.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                      <h2 style={{ fontSize: 20, fontWeight: 700, color: text, letterSpacing: "-0.015em" }}>{guide.title[lang]}</h2>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 5, background: diffColor(guide.difficulty) + "22", color: diffColor(guide.difficulty), border: `1px solid ${diffColor(guide.difficulty)}44` }}>
                        {guide.difficulty[lang]}
                      </span>
                      <span style={{ fontSize: 11, color: faint }}>⏱ {guide.time[lang]}</span>
                    </div>
                    <p style={{ fontSize: 13, color: muted, lineHeight: 1.6 }}>{guide.desc[lang]}</p>
                  </div>
                </div>

                {/* Step progress dots */}
                <div style={{ display: "flex", gap: 6, marginTop: 20, flexWrap: "wrap" }}>
                  {guide.steps.map((s, si) => {
                    const isDone = completed[`${activeCase}-${si}`];
                    const isCurrent = si === activeStep;
                    return (
                      <button key={si} onClick={() => setActiveStep(si)} style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "5px 12px", borderRadius: 6, border: `1px solid ${isCurrent ? PURPLE : isDone ? "#10B98144" : border}`,
                        background: isCurrent ? PURPLELO : isDone ? "rgba(16,185,129,0.08)" : "transparent",
                        color: isCurrent ? "#C4B5FD" : isDone ? "#10B981" : faint,
                        cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: isCurrent ? 600 : 400,
                        transition: "all .2s",
                      }}>
                        {isDone ? "✓" : si + 1}
                        <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title[lang]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Current step */}
              <div style={{ background: surface, border: `1px solid ${PURPLE}44`, borderRadius: 16, padding: "28px 32px", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: PURPLE, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {lang === "cs" ? `Krok ${activeStep + 1} z ${totalSteps}` : `Step ${activeStep + 1} of ${totalSteps}`}
                  </div>
                  <div style={{ display: "flex", gap: 3 }}>
                    {guide.steps.map((_, si) => (
                      <div key={si} style={{ width: 24, height: 3, borderRadius: 2, background: si <= activeStep ? PURPLE : border, transition: "background .2s" }} />
                    ))}
                  </div>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 700, color: text, marginBottom: 12, letterSpacing: "-0.01em" }}>{step.title[lang]}</h3>
                <p style={{ fontSize: 14, color: muted, lineHeight: 1.7, marginBottom: 24 }}>{step.desc[lang]}</p>

                {/* Prompt block */}
                <div style={{ position: "relative", marginBottom: step.tip ? 20 : 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: faint, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                    {lang === "cs" ? "Prompt k použití" : "Prompt to use"}
                  </div>
                  <div style={{ background: dark ? "#0D1117" : "#1E293B", border: `1px solid ${PURPLE}33`, borderRadius: 12, padding: "16px 18px", position: "relative" }}>
                    <pre style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, lineHeight: 1.85, color: "#E2E8F0", whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0, paddingRight: 80 }}>{step.prompt[lang]}</pre>
                    <button onClick={() => cp(step.prompt[lang], `step-${activeCase}-${activeStep}`)}
                      aria-label={t.copyAriaLabel}
                      style={{
                        position: "absolute", top: 12, right: 12,
                        background: copiedId === `step-${activeCase}-${activeStep}` ? "#10B981" : "rgba(255,255,255,0.08)",
                        border: `1px solid ${copiedId === `step-${activeCase}-${activeStep}` ? "#10B98144" : "rgba(255,255,255,0.1)"}`,
                        borderRadius: 6, padding: "4px 12px", fontSize: 11,
                        color: copiedId === `step-${activeCase}-${activeStep}` ? "#fff" : "#94A3B8",
                        cursor: "pointer", fontFamily: "inherit", fontWeight: 500, transition: "all .2s",
                      }}>
                      {copiedId === `step-${activeCase}-${activeStep}` ? (lang === "cs" ? "✓ Zkopírováno" : "✓ Copied") : (lang === "cs" ? "Kopírovat" : "Copy")}
                    </button>
                  </div>
                </div>

                {/* Tip */}
                {step.tip && (
                  <div style={{ padding: "10px 14px", background: T.accentLo, border: `1px solid rgba(245,158,11,0.2)`, borderRadius: 10, fontSize: 13, color: T.accent, lineHeight: 1.6 }}>
                    <strong>💡 {lang === "cs" ? "Tip:" : "Tip:"}</strong> {step.tip[lang]}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button onClick={goBack} disabled={isFirst} style={{
                  padding: "10px 22px", borderRadius: 8, border: `1px solid ${isFirst ? border : PURPLE + "66"}`,
                  background: "transparent", color: isFirst ? faint : "#C4B5FD",
                  cursor: isFirst ? "default" : "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 500,
                  transition: "all .2s", opacity: isFirst ? 0.4 : 1,
                }}>
                  ← {lang === "cs" ? "Zpět" : "Back"}
                </button>

                <button onClick={goNext} style={{
                  padding: "10px 28px", borderRadius: 8,
                  background: isLast ? "linear-gradient(135deg, #10B981, #059669)" : `linear-gradient(135deg, ${PURPLE}, #A78BFA)`,
                  border: "none", color: "#fff",
                  cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600,
                  boxShadow: `0 4px 16px ${isLast ? "rgba(16,185,129,0.3)" : "rgba(124,58,237,0.3)"}`,
                  transition: "all .2s",
                }}>
                  {isLast ? (lang === "cs" ? "✓ Hotovo!" : "✓ Done!") : (lang === "cs" ? "Další krok →" : "Next step →")}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
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
      background: expanded ? `rgba(245,158,11,${dark ? "0.05" : "0.07"})` : surface,
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
    body { background: ${bg}; transition: background .3s; }
  `;

  // ── HOME SCREEN ──────────────────────────────────────────────────────────────
  if (!level) {
    const lvls = [
      { id: "beginner",     e: "🌱", l: t.beg, d: t.begD, color: T.green, glow: "rgba(16,185,129,0.15)" },
      { id: "intermediate", e: "🌿", l: t.mid, d: t.midD, color: T.teal,  glow: "rgba(45,212,191,0.15)" },
      { id: "advanced",     e: "🌳", l: t.adv, d: t.advD, color: T.accent, glow: "rgba(245,158,11,0.15)" },
      { id: "claude",       e: "🤖", l: t.claude, d: t.claudeD, color: "#7C3AED", glow: "rgba(124,58,237,0.15)" },
    ];
    return (
      <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "'Sora',sans-serif", position: "relative" }}>
        <style>{css}</style>
        <Background dark={dark} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <AppHeader lang={lang} setLang={setLang} t={t} dark={dark} setDark={setDark} headerBg={headerBg} border={border} muted={muted} text={text} setLevel={setLevel} setShowGuide={setShowGuide} />
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

  const levelEmoji = level === "beginner" ? "🌱" : level === "intermediate" ? "🌿" : level === "advanced" ? "🌳" : "🤖";
  const levelName  = level === "beginner" ? t.beg : level === "intermediate" ? t.mid : level === "advanced" ? t.adv : t.claude;
  const levelColor = level === "beginner" ? T.green : level === "intermediate" ? T.teal : level === "advanced" ? T.accent : "#7C3AED";

  // ── CLAUDE GUIDE SCREEN ─────────────────────────────────────────────────────
  if (level === "claude") {
    return <ClaudeGuide lang={lang} t={t} dark={dark} bg={bg} surface={surface} border={border} text={text} muted={muted} faint={faint} headerBg={headerBg} setDark={setDark} setLevel={setLevel} setShowGuide={setShowGuide} />;
  }

  // ── LEVEL SCREEN ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "'Sora',sans-serif", position: "relative" }}>
      <style>{css}</style>
      <Background dark={dark} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <AppHeader lang={lang} setLang={setLang} t={t} dark={dark} setDark={setDark} headerBg={headerBg} border={border} muted={muted} text={text} setLevel={setLevel} setShowGuide={setShowGuide} />
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
                        background: surface,
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
              {/* Controls row — view toggle only; language is set globally in header */}
              <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
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
                        background: surface,
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

              {pView === "byModel" && models.map((m, i) => {
                // Find prompts that reference this model by name
                const modelPrompts = prompts.filter(item =>
                  item.mods.some(mod => mod.toLowerCase().includes(m.name.split(" ")[0].toLowerCase()))
                );
                return (
                  <Acc key={i} expanded={expM === i} onToggle={() => setExpM(expM === i ? null : i)} icon={m.icon} title={m.name} sub={m.d[lang]}>
                    {m.mv && <div style={S.mvBox}><span style={{ fontWeight: 600 }}>{t.mv}:</span> {m.mv[lang]}</div>}

                    {/* Tips */}
                    <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>{t.tips}</div>
                    {m.tips[lang].map((tip, ti) => (
                      <div key={ti} style={{
                        padding: "10px 14px", borderRadius: 8,
                        background: surface,
                        border: `1px solid ${border}`,
                        marginBottom: 6, fontSize: 13, lineHeight: 1.6,
                        display: "flex", gap: 10, color: text,
                      }}>
                        <span style={{ color: T.accent, flexShrink: 0 }}>→</span><span>{tip}</span>
                      </div>
                    ))}

                    {/* Prompts for this model */}
                    {modelPrompts.length > 0 && (
                      <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: T.accent, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Prompty</div>
                        {modelPrompts.map((item, pi) =>
                          item.ps.map((p, pj) => (
                            <div key={`${pi}-${pj}`} style={{ marginBottom: 10 }}>
                              <div style={{ fontSize: 11, color: muted, marginBottom: 5, fontWeight: 500 }}>
                                {item.icon} {item.task[lang]} — {p.label[lang]}
                              </div>
                              <div style={{
                                padding: "12px 14px", borderRadius: 10,
                                background: surface, border: `1px solid ${border}`,
                                position: "relative",
                              }}>
                                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, lineHeight: 1.8, color: text, whiteSpace: "pre-wrap", wordBreak: "break-word", paddingRight: 86 }}>{p.p[lang]}</div>
                                <button
                                  aria-label={t.copyAriaLabel}
                                  onClick={() => cp(p.p[lang], `m${i}-${pi}-${pj}`)}
                                  style={{
                                    position: "absolute", top: 10, right: 10,
                                    background: copied === `m${i}-${pi}-${pj}` ? T.green : surface,
                                    border: `1px solid ${copied === `m${i}-${pi}-${pj}` ? T.green + "44" : border}`,
                                    borderRadius: 6, padding: "3px 10px", fontSize: 11,
                                    color: copied === `m${i}-${pi}-${pj}` ? "#fff" : muted,
                                    cursor: "pointer", fontFamily: "inherit", fontWeight: 500,
                                    transition: "all .2s", whiteSpace: "nowrap",
                                  }}>
                                  {copied === `m${i}-${pi}-${pj}` ? t.copied : t.copy}
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    <a href={m.url} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-block", marginTop: 14, fontSize: 12, fontWeight: 600, color: T.accent, letterSpacing: "0.02em" }}>{t.open}</a>
                  </Acc>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
