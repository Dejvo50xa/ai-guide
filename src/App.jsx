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
      // ── REWRITTEN (Dimension 2: more human, start with experience not definition) ──
      { title: "🤔 Co je umělá inteligence?", text: "Vzpomeňte si na naposledy, kdy jste se na něco chtěli zeptat, ale nevěděli koho. Teď máte někoho k dispozici 24 hodin denně, kdo toho hodně ví, nikdy se nezlobí a má na vás vždy čas.

AI není robot. Je to chytrý software, kterému píšete zprávy a on odpovídá — jako SMS, ale místo člověka odpovídá počítač.

AI umí:
• Odpovídat na otázky (jako encyklopedie vlastními slovy)
• Psát texty — emaily, články, dopisy
• Překládat jazyky
• Vytvářet obrázky podle popisu
• Shrnout dlouhé dokumenty
• Pomoci s plánováním a rozhodováním

A funguje to česky — nemusíte umět anglicky." },
      { title: "💰 Kolik to stojí?", text: "Většina nástrojů má bezplatnou verzi, která pro začátek bohatě stačí.

🟢 Zdarma:
• ChatGPT — chat.openai.com
• Gemini — gemini.google.com
• Claude — claude.ai
• DeepSeek — chat.deepseek.com
• NotebookLM — notebooklm.google.com

🟡 Více za předplatné (~500 Kč/měs.):
• ChatGPT Plus, Claude Pro, Gemini Advanced

Začněte zdarma. Placená verze dává smysl až když víte, že to používáte každý den." },
      { title: "🔐 Jak se zaregistrovat?", text: "1. Otevřete prohlížeč (Chrome, Edge, Safari)
2. Napište adresu — např. chat.openai.com
3. Klikněte 'Registrovat' nebo 'Sign up'
4. Zadejte email a heslo
5. Na email přijde potvrzení — klikněte na odkaz
6. Hotovo!

💡 U Gemini stačí Google účet. U většiny nástrojů lze přihlásit přes Google jedním kliknutím.

⚠️ Nemusíte zadávat platební kartu. Pokud ji někde vyžadují hned, hledejte bezplatnou alternativu." },
      // ── REWRITTEN (Dimension 2: empathetic opener, conversational, no rules numbering) ──
      { title: "💬 Jak psát dotazy (prompty)?", text: "Váš první prompt bude špatný. To je v pořádku — tak to funguje u každého. AI není Google. Čím víc mu řeknete, tím lépe vám odpoví.

Rozdíl v praxi:
❌ Špatně: 'Napiš něco o vaření'
✅ Dobře: 'Napiš jednoduchý recept na svíčkovou pro 4 osoby. Ingredience z běžného supermarketu. Postup krok za krokem, jednoduše.'

Co pomáhá:
→ Řekněte pro koho text je: 'vysvětli jako pro laika'
→ Určete délku: 've 3 větách' nebo 'na stránku'
→ Určete tón: 'formálně' nebo 'přátelsky'
→ Opravujte výsledek: 'zkrať to', 'víc detailů', 'jiný tón'

AI si nepamatuje vaše předchozí dotazy a nesoudí vás. Klidně se ptejte znovu." },
      // ── REWRITTEN (Dimension 2: lead with reassurance, cautions second) ──
      { title: "🔒 Je to bezpečné?", text: "Pro 95 % věcí co budete dělat — psaní textů, odpovědi na otázky, plánování — je AI naprosto bezpečný nástroj. Nic se nemůže pokazit. Nejhorší co se stane je, že dostanete špatnou odpověď, kterou jednoduše ignorujete.

Tady jsou věci, které dělat nechcete:
• Nezadávejte rodná čísla, hesla nebo čísla karet
• Důležitá fakta (zdravotní, právní, finanční) si ověřte
• AI nemá přístup k vašemu počítači ani datům

💡 Berte AI jako radu od chytrého kamaráda — velmi užitečná, ale pro zásadní rozhodnutí konzultujte odborníka." },
      { title: "📱 Na čem to funguje?", text: "🖥️ Počítač — stačí otevřít prohlížeč
📱 Telefon — prohlížeč nebo zdarma aplikace (App Store / Google Play)
📱 Tablet — stejně jako telefon

Potřebujete jen internet. Žádná instalace, žádný speciální hardware.

💡 Na telefonu doporučuji stáhnout aplikaci ChatGPT nebo Gemini — jsou pohodlnější než prohlížeč." },
      { title: "🆚 Který nástroj vybrat?", text: "🟢 ChatGPT — nejuniverzálnější, nejlepší pro začátek
🟠 Claude — nejlepší na dlouhé texty a přesné odpovědi
🔵 Gemini — hledá aktuální info, propojený s Googlem
🟤 DeepSeek — úplně zdarma bez limitů
📘 NotebookLM — pro učení z dokumentů, umí udělat podcast
🔴 Kimi — na extrémně dlouhé dokumenty

💡 Začněte s ChatGPT. Funguje to hned, bez nastavení. Pokud nesedí, zkuste Claude nebo Gemini." },
      // ── NEW: Mýty a první chyby (Dimension 2) ──
      { title: "🚫 5 největších mýtů o AI", text: "Než začnete, vyvrátíme nejčastější mylné představy.\n\n❌ Mýtus 1: 'AI si věci vymýšlí — nemůžu mu věřit'\n✅ Pravda: AI může chybovat u konkrétních faktů, ale pro psaní emailů, plánování a vysvětlení je spolehlivý. Důležitá fakta jednoduše ověřte. Nemusíte ověřovat každou větu.\n\n❌ Mýtus 2: 'Musím umět anglicky'\n✅ Pravda: ChatGPT, Claude i Gemini fungují výborně česky. Pište česky, dostanete česky.\n\n❌ Mýtus 3: 'Stejně si to pak musím přepsat — nestojí to za čas'\n✅ Pravda: AI dává první návrh za 10 sekund. Upravit návrh trvá zlomek doby oproti psaní od nuly. Cíl je ušetřit 80 % práce, ne 100 %.\n\n❌ Mýtus 4: 'AI má přístup k mým datům'\n✅ Pravda: AI nevidí váš počítač, email ani soubory. Vidí jen to, co mu sami napíšete nebo nahrajete.\n\n❌ Mýtus 5: 'AI je pro mladé a technické lidi'\n✅ Pravda: Nejrychleji rostoucí skupina uživatelů v Evropě je 45–65 let. Pokud zvládáte Google, zvládáte i AI." },
      { title: "😤 Proč to nevychází napoprvé", text: "60–70 % lidí cítí po prvních třech pokusech, že AI 'nefunguje'. Skoro vždy je problém v zadání, ne v AI.\n\n5 nejčastějších chyb začátečníků:\n\n1. Ptáte se jako na Googlu\n   ❌ 'nejlepší restaurace Praha'\n   ✅ 'Doporuč restauraci v centru Prahy na romantickou večeři, max 800 Kč, bez fast foodu'\n\n2. Zadáváte bez kontextu\n   ❌ 'Napiš email'\n   ✅ 'Napiš email šéfovi, omlouvám se za zpoždění. Formální tón, max 80 slov.'\n\n3. Přijmete první výsledek nebo ho rovnou smažete\n   → Iterujte: 'Zkrať to', 'Víc formálně', 'Přidej konkrétní příklad'\n\n4. Kladete příliš složitý úkol najednou\n   → Rozdělte: nejdřív analýza, pak návrh, pak finální verze\n\n5. Vzdáte to při první špatné odpovědi\n   → Správná reakce: 'Toto není co jsem chtěl/a. Zkus to takto: [upřesnění]'\n\n💡 Váš první prompt bude špatný. To je v pořádku. AI vás nesoudí a každý nový chat začíná znovu." },
      // ── NEW SECTION 1 (Dimension 2: "Co AI neumí — a proč je to dobře") ──
      { title: "⚠️ Co AI neumí — a proč je to dobře", text: "AI je mocný nástroj, ale má limity. Znát je vám ušetří zklamání.

Co AI nedělá spolehlivě:
• Nezná aktuální zprávy a události (pokud nemá přístup k internetu)
• Může si vymyslet konkrétní fakta — jména, čísla, citace — a uvést je s jistotou
• Nerozumí vám jako člověk — analyzuje text, nepromýšlí situaci
• Má znalostní cutoff — neví co se stalo po určitém datu

Proč je to vlastně dobře:
→ Vy jste stále v kontrole. AI je nástroj, ne autorita.
→ Pro psaní emailů, plánování a vysvětlení konceptů jsou tyto limity téměř bezvýznamné.
→ Důležité informace (zdravotní, právní, finanční) si jednoduše ověřte u odborníka.

💡 Pravidlo: Čím důležitější rozhodnutí, tím víc ověřujte. Pro každodenní úkoly ověřování nepotřebujete." },
      // ── NEW SECTION 2 (Dimension 2: "Jak opravovat špatné odpovědi") ──
      { title: "🔁 Jak opravovat špatné odpovědi", text: "Když výsledek není dobrý, většina lidí to vzdá. To je škoda — iterace je ta nejdůležitější dovednost při práci s AI.

Když je odpověď špatná, nemazejte ji a nezačínejte znovu. Opravte ji:

→ Příliš dlouhé? Napište: 'Zkrať to na 3 věty.'
→ Příliš obecné? Napište: 'Přidej konkrétní příklad z praxe.'
→ Špatný tón? Napište: 'Napiš to přátelštěji, méně formálně.'
→ Chybí detaily? Napište: 'Rozveď bod číslo 2 podrobněji.'
→ Úplně vedle? Napište: 'Zapomeň na předchozí odpověď. Zkusím to jinak:' a přeformulujte.

5 kroků jak vylepšit jakýkoliv výstup:
1. Identifikujte co přesně vadí (délka / tón / obsah / struktura)
2. Napište konkrétní instrukci co změnit
3. Přečtěte nový výsledek
4. Opakujte max 2-3x
5. Pokud nefunguje, začněte nový chat s lepším výchozím zadáním

💡 Cíl není perfektní první výstup — cíl je ušetřit 80 % času na psaní, ne 100 %." },
      // ── NEW SECTION 3 (Dimension 2: "AI v každodenním životě") ──
      { title: "🇨🇿 AI v českém každodenním životě", text: "AI není jen pro techniky a mladé lidi. Nejrychleji rostoucí skupina uživatelů v Evropě je 45–65 let — lidé kteří ho používají na psaní a práci s dokumenty.

10 situací kde AI opravdu pomůže:

1. 📄 Dostali jste nesrozumitelný dopis z úřadu → AI ho vysvětlí lidsky
2. 💼 Píšete žádost o práci → AI pomůže s motivačním dopisem
3. 🏥 Nevíte co znamená lékařská zpráva → AI vysvětlí termíny
4. 🚗 Dostali pokutu a chcete se odvolat → AI napíše odvolání
5. 🏠 Plánujete rekonstrukci a potřebujete rozpočet → AI pomůže s výpočty
6. 📚 Dítě má referát do školy → AI vysvětlí téma srozumitelně
7. ⭐ Zákazník napsal negativní recenzi → AI navrhne profesionální odpověď
8. 📧 Potřebujete napsat složitý email → AI navrhne znění
9. 💊 Nevíte zda příznaky jsou urgentní → AI pomůže formulovat otázky pro lékaře
10. 💰 Zvažujete finanční rozhodnutí → AI pomůže promyslet otázky

💡 Vyzkoušejte jednu situaci ze svého života tento týden. Stačí otevřít ChatGPT a napsat co potřebujete." },
    ],
    en: [
      // ── REWRITTEN (Dimension 2: start with experience, empathetic) ──
      { title: "🤔 What is AI?", text: "Think about the last time you wanted to ask something but didn't know who to ask. Now you have someone available 24 hours a day who knows a lot, never gets annoyed, and always has time for you.

AI is not a robot. It's smart software you write messages to — like texting, but a very knowledgeable computer replies.

AI can:
• Answer questions (like an encyclopedia in your own words)
• Write texts — emails, articles, letters
• Translate languages
• Create images from descriptions
• Summarize long documents
• Help with planning and decisions

And it works in Czech, English, and most European languages." },
      { title: "💰 How much does it cost?", text: "Most tools have a free version that's more than enough to start.

🟢 Free: ChatGPT, Gemini, Claude, DeepSeek, NotebookLM

🟡 More with subscription (~$20/mo): ChatGPT Plus, Claude Pro, Gemini Advanced

Start free. A paid plan only makes sense once you know you're using it every day." },
      { title: "🔐 How to register?", text: "1. Open browser (Chrome, Edge, Safari)
2. Go to the tool — e.g. chat.openai.com
3. Click 'Sign up'
4. Enter email and password
5. Confirm via the email link
6. Done!

💡 For Gemini, your Google account is enough. Most tools let you sign in with Google in one click.

⚠️ You don't need to enter a credit card. If one is required immediately, look for a free alternative." },
      // ── REWRITTEN (empathetic, conversational) ──
      { title: "💬 How to write prompts?", text: "Your first prompt will be bad. That's fine — it's the same for everyone. AI is not Google. The more you tell it, the better it answers.

The difference in practice:
❌ Bad: 'Write something about cooking'
✅ Good: 'Write a simple beef stew recipe for 4 people. Grocery store ingredients. Step-by-step, simple language.'

What helps:
→ Say who it's for: 'explain like I know nothing about this'
→ Set the length: 'in 3 sentences' or 'one page'
→ Set the tone: 'formal' or 'friendly'
→ Correct the result: 'shorten it', 'more detail', 'different tone'

AI doesn't remember your previous questions and doesn't judge you. Ask again freely." },
      // ── REWRITTEN (reassurance first) ──
      { title: "🔒 Is it safe?", text: "For 95% of what you'll do — writing texts, answering questions, planning — AI is completely safe. Nothing can go wrong. The worst that happens is you get a bad answer, which you simply ignore.

Here's what you don't want to do:
• Don't enter ID numbers, passwords or card details
• Verify important facts (medical, legal, financial) with a specialist
• AI has no access to your computer or files

💡 Think of AI like advice from a knowledgeable friend — very useful, but for major decisions consult an expert." },
      { title: "📱 What devices?", text: "🖥️ Computer — just open a browser
📱 Phone — browser or free app (App Store / Google Play)
📱 Tablet — same as phone

All you need is internet. No installation, no special hardware.

💡 On phone, download the ChatGPT or Gemini app — more comfortable than a browser." },
      { title: "🆚 Which tool?", text: "🟢 ChatGPT — most universal, best to start
🟠 Claude — best for long texts and precise answers
🔵 Gemini — current info, connected to Google
🟤 DeepSeek — completely free with no limits
📘 NotebookLM — learning from documents, can create podcasts
🔴 Kimi — extremely long documents

💡 Start with ChatGPT. Works immediately, no setup. If it doesn't feel right, try Claude or Gemini." },
      // ── NEW: Myths and first-task failures (Dimension 2) ──
      { title: "🚫 5 biggest myths about AI", text: "Before you start, let's bust the most common misconceptions.\n\n❌ Myth 1: 'AI makes things up — I can't trust it'\n✅ Truth: AI can be wrong on specific facts, but for writing emails, planning, and explanations it's reliable. Simply verify important facts. You don't need to verify every sentence.\n\n❌ Myth 2: 'I need to know English'\n✅ Truth: ChatGPT, Claude and Gemini all work great in Czech and most European languages. Write in your language, get answers in your language.\n\n❌ Myth 3: 'I'll have to rewrite it anyway — not worth the time'\n✅ Truth: AI delivers a first draft in 10 seconds. Editing a draft takes a fraction of the time of writing from scratch. The goal is to save 80% of the work, not 100%.\n\n❌ Myth 4: 'AI has access to my data'\n✅ Truth: AI can't see your computer, email or files. It only sees what you type or upload into the chat.\n\n❌ Myth 5: 'AI is for young and technical people'\n✅ Truth: The fastest-growing user group in Europe is 45–65 year olds. If you can use Google, you can use AI." },
      { title: "😤 Why it doesn't work first time", text: "60–70% of people feel after their first three attempts that AI 'doesn't work.' Almost always the problem is the prompt, not the AI.\n\n5 most common beginner mistakes:\n\n1. Searching like Google\n   ❌ 'best restaurants Prague'\n   ✅ 'Recommend a restaurant in central Prague for a romantic dinner, max 800 CZK per person, no fast food'\n\n2. Giving no context\n   ❌ 'Write an email'\n   ✅ 'Write an email to my boss apologizing for a delay. Formal tone, max 80 words.'\n\n3. Accepting the first result or deleting it immediately\n   → Iterate: 'Shorten it', 'More formal', 'Add a specific example'\n\n4. Asking something too complex in one go\n   → Break it down: first analysis, then draft, then final version\n\n5. Giving up after the first bad answer\n   → Right response: 'This is not what I wanted. Try it like this: [clarification]'\n\n💡 Your first prompt will be bad. That's fine. AI doesn't judge you and every new chat starts fresh." },
      // ── NEW SECTION 1 ──
      { title: "⚠️ What AI can't do — and why that's fine", text: "AI is a powerful tool but it has limits. Knowing them saves you disappointment.

What AI doesn't do reliably:
• Doesn't know current news and events (unless it has internet access)
• Can invent specific facts — names, numbers, citations — and state them confidently
• Doesn't understand you like a human — it analyzes text, doesn't think through situations
• Has a knowledge cutoff — doesn't know what happened after a certain date

Why this is actually fine:
→ You stay in control. AI is a tool, not an authority.
→ For writing emails, planning, and explaining concepts, these limits barely matter.
→ For important information (medical, legal, financial), simply verify with a specialist.

💡 Rule: The more important the decision, the more you verify. For everyday tasks, you don't need to verify much." },
      // ── NEW SECTION 2 ──
      { title: "🔁 How to fix bad answers", text: "When the output isn't good, most people give up. That's a shame — iteration is the most important skill when working with AI.

When the answer is wrong, don't delete it and start over. Fix it:

→ Too long? Write: 'Shorten it to 3 sentences.'
→ Too vague? Write: 'Add a specific real-world example.'
→ Wrong tone? Write: 'Make it friendlier, less formal.'
→ Missing detail? Write: 'Expand on point number 2 in more detail.'
→ Completely off? Write: 'Forget the previous answer. Let me try again:' and rephrase.

5 steps to improve any output:
1. Identify exactly what's wrong (length / tone / content / structure)
2. Write a specific instruction for what to change
3. Read the new result
4. Repeat max 2-3 times
5. If it's still not working, start a new chat with a better initial prompt

💡 The goal isn't a perfect first output — the goal is to save 80% of your writing time, not 100%." },
      // ── NEW SECTION 3 ──
      { title: "🌍 AI in everyday life", text: "AI isn't just for tech people and young people. The fastest-growing user group in Europe is 45–65 year olds using it for writing and document tasks.

10 situations where AI genuinely helps:

1. 📄 Got an incomprehensible official letter → AI explains it in plain language
2. 💼 Writing a job application → AI helps with the cover letter
3. 🏥 Don't understand a medical report → AI explains the terms
4. 🚗 Got a fine and want to appeal → AI writes the appeal
5. 🏠 Planning a renovation and need a budget → AI helps with calculations
6. 📚 Your child has a school project → AI explains the topic clearly
7. ⭐ A customer left a negative review → AI suggests a professional response
8. 📧 Need to write a difficult email → AI drafts the wording
9. 💊 Not sure if symptoms are urgent → AI helps formulate questions for a doctor
10. 💰 Considering a financial decision → AI helps think through the questions

💡 Try one situation from your own life this week. Just open ChatGPT and write what you need." },
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

    // ── EMAIL ────────────────────────────────────────────────────────────────
    { task: { cs: "Napsat email", en: "Write email" }, icon: "📧", mods: ["ChatGPT", "Claude", "Gemini"],
      promptTip: {
        cs: "Proč to funguje: AI potřebuje vědět KDO píše, KOMU, v jakém VZTAHU a s jakým CÍLEM. Čím konkrétnější jsi, tím méně roboticky email zní. Vždy říkej co NECHCEŠ — to zabrání nejčastějším chybám.",
        en: "Why it works: AI needs to know WHO is writing, TO WHOM, in what RELATIONSHIP, and with what GOAL. The more specific you are, the less robotic the result. Always say what you DON'T want — this prevents the most common AI failures.",
      },
      ps: [
        { label: { cs: "Omluva šéfovi", en: "Apologize to boss" }, p: {
          cs: "Napiš email šéfovi [jméno], kde se omlouvám za zpoždění projektu [název].
Důvod: byl/a jsem nemocný/á [X] dní.
Tón: profesionální, ale lidský — ne přehnaně servilní.
Max 80 slov.
Nezačínej pozdravem 'Dobrý den' — použij přirozený oslovení.
Nezačínej větou 'Omlouvám se' — nejdřív krátce vysvětli situaci, pak se omluv.",
          en: "Write an email to my manager [name] apologizing for the delay on project [name].
Reason: I was sick for [X] days.
Tone: professional but human — not groveling.
Max 80 words.
Don't start with 'Dear' — use a natural opener.
Don't lead with 'I apologize' — briefly explain first, then apologize.",
        }},
        { label: { cs: "Žádost o schůzku", en: "Meeting request" }, p: {
          cs: "Napiš email kolegovi/ě [jméno], navrhuji pracovní schůzku.
Téma schůzky: [téma — buď konkrétní, např. 'revize Q3 rozpočtu'].
Nabídni 3 konkrétní termíny s časem.
Řekni předem co bude potřeba připravit.
Tón: přátelský a přímý. Max 100 slov.",
          en: "Write an email to [name] proposing a work meeting.
Meeting topic: [topic — be specific, e.g. 'Q3 budget review'].
Offer 3 specific dates and times.
Mention what they should prepare in advance.
Tone: friendly and direct. Max 100 words.",
        }},
        { label: { cs: "Reklamace produktu", en: "Product complaint" }, p: {
          cs: "Napiš reklamační email firmě [název firmy].
Produkt: [název], koupeno: [datum], cena: [částka].
Problém: [přesný popis vady nebo situace].
Co chci: [výměnu / vrácení peněz / opravu — vyber].
Tón: věcný a nekompromisní, ne agresivní.
Zmíň že jsi zákonná práva ze zákona o ochraně spotřebitele.",
          en: "Write a complaint email to [company name].
Product: [name], purchased: [date], price: [amount].
Issue: [exact description of the defect or problem].
What I want: [replacement / refund / repair — choose one].
Tone: factual and firm, not aggressive.
Mention that I have rights under consumer protection law.",
        }},
        { label: { cs: "Úřední dotaz", en: "Government office inquiry" }, p: {
          cs: "Dostal/a jsem tento dopis / rozhodnutí od [název úřadu / pojišťovny / banky]:
[vlož text dopisu nebo hlavní body]

Napiš mi odpověď, kde zdvořile žádám o:
1) Vysvětlení co toto rozhodnutí znamená
2) Co přesně se po mně požaduje a do kdy
3) Jaké mám možnosti nebo práva

Tón: zdvořilý, sebejistý — neptám se jako prosebník, ale jako občan, který zná svá práva.",
          en: "I received this letter / decision from [name of office / insurer / bank]:
[paste letter text or key points]

Write a reply politely asking for:
1) An explanation of what this decision means
2) Exactly what is required of me and by when
3) What options or rights I have

Tone: polite, confident — not pleading, but as a citizen who knows their rights.",
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
          cs: "Napiš blogový článek o [téma] z pohledu [tvoje role, např. 'freelancer s 5 lety praxe' nebo 'rodič dvou dětí'].
Cílový čtenář: [kdo to přečte a co potřebuje vědět].
Délka: 500 slov.
Struktura: konkrétní úvodní situace (ne obecná otázka) → 3 praktické tipy s reálnými příklady → závěr s jedním jasným doporučením.
Styl: osobní, mluv na čtenáře jako 'ty'. Zakaž si klišé jako 'v dnešní době', 'je důležité' nebo 'každý z nás'.",
          en: "Write a blog post about [topic] from the perspective of [your role, e.g. 'freelancer with 5 years experience' or 'parent of two kids'].
Target reader: [who will read it and what they need to know].
Length: 500 words.
Structure: concrete opening situation (not a generic question) → 3 practical tips with real examples → conclusion with one clear recommendation.
Style: personal, speak to reader as 'you'. Ban clichés like 'in today's world', 'it's important to' or 'we all know'.",
        }},
        { label: { cs: "LinkedIn příspěvek", en: "LinkedIn post" }, p: {
          cs: "Napiš LinkedIn příspěvek (max 200 slov) o [téma nebo zkušenost z práce].
Začni konkrétní situací nebo překvapivým číslem — ne obecným tvrzením.
Uprostřed: 3 konkrétní poznatky ve formátu 'Co jsem zjistil/a:'
Závěr: jedno konkrétní doporučení pro čtenáře.
Nezačínej slovy 'Jsem rád/a', 'Hrdě oznamuji' nebo 'Skvělá příležitost'.
Tón: přemýšlivý odborník, ne sebepropagace.",
          en: "Write a LinkedIn post (max 200 words) about [topic or work experience].
Start with a specific situation or surprising number — not a generic statement.
Middle: 3 concrete insights in the format 'What I discovered:'
End: one specific recommendation for the reader.
Don't start with 'I'm excited to', 'Proud to announce' or 'Great opportunity'.
Tone: thoughtful expert, not self-promotion.",
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
          cs: "Shrň tento dokument. Výstup musí mít přesně tuto strukturu:
• SITUACE (1 věta): o čem dokument je
• KLÍČOVÉ ZJIŠTĚNÍ (1 věta): nejdůležitější věc
• CO TO ZNAMENÁ PRO NÁS (2-3 věty): praktický dopad
• DOPORUČENÍ (1 věta): co dělat dál
Max 120 slov celkem.

[vlož text nebo nahraj PDF]",
          en: "Summarize this document. Output must follow this exact structure:
• SITUATION (1 sentence): what the document is about
• KEY FINDING (1 sentence): the most important thing
• WHAT THIS MEANS FOR US (2-3 sentences): practical impact
• RECOMMENDATION (1 sentence): what to do next
Max 120 words total.

[paste text or upload PDF]",
        }},
        { label: { cs: "Zápis ze schůzky → úkoly", en: "Meeting notes → action items" }, p: {
          cs: "Z těchto poznámek ze schůzky vytvoř:
1) Rozhodnutí (max 3 odrážky — co bylo odsouhlaseno)
2) Úkoly ve formátu: [Kdo] udělá [Co] do [Kdy]
3) Otevřené otázky (co ještě nebylo rozhodnuto)

Poznámky ze schůzky:
[vlož text]",
          en: "From these meeting notes create:
1) Decisions (max 3 bullets — what was agreed)
2) Action items in format: [Who] will [Do what] by [When]
3) Open questions (what still hasn't been decided)

Meeting notes:
[paste text]",
        }},
        { label: { cs: "Porozumět úřednímu dopisu", en: "Understand official letter" }, p: {
          cs: "Přečti tento text z úřadu / pojišťovny / banky a vysvětli mi ho jednoduše:
[vlož text dokumentu]

Potřebuji vědět:
1) Co po mně chtějí?
2) Musím něco udělat? Co a do kdy?
3) Co se stane pokud nic neudělám?
4) Na co si dát pozor?

Vysvětli to jako kamarád, ne jako právník. Bez zbytečného opakování 'je důležité'.",
          en: "Read this text from a government office / insurer / bank and explain it to me simply:
[paste document text]

I need to know:
1) What do they want from me?
2) Do I need to do anything? What and by when?
3) What happens if I do nothing?
4) What should I watch out for?

Explain it like a knowledgeable friend, not a lawyer.",
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
          cs: "Vytvoř Instagram příspěvek pro [typ účtu, např. 'kavárna v Praze' nebo 'fitness trenér'].
Téma: [téma].
Cíl: [co má příspěvek způsobit — sdílení / komentáře / proklik na web]
Popisek: max 150 slov, začni silnou první větou (ta se zobrazuje bez rozbalení).
Hashtagy: 10 relevantních (mix velké + niche).
Návrh vizuálu: popiš co by měl obrázek nebo video zobrazovat.",
          en: "Create an Instagram post for [account type, e.g. 'Prague café' or 'fitness coach'].
Topic: [topic].
Goal: [what the post should cause — shares / comments / website clicks]
Caption: max 150 words, start with a strong first sentence (visible without expanding).
Hashtags: 10 relevant ones (mix popular + niche).
Visual suggestion: describe what the image or video should show.",
        }},
        { label: { cs: "LinkedIn — odborný post", en: "LinkedIn — thought leadership" }, p: {
          cs: "Napiš LinkedIn příspěvek o [téma] pro profesionální publikum v oboru [obor].
Začni konkrétním příkladem nebo překvapivým číslem.
Tři krátké odstavce: problém → moje zkušenost/poznatek → co z toho plyne pro ostatní.
Zakončení: otázka která vyzývá ke komentáři.
Max 200 slov. Žádné emoji v prvních 2 větách.",
          en: "Write a LinkedIn post about [topic] for a professional audience in [industry].
Start with a concrete example or surprising stat.
Three short paragraphs: problem → my experience/insight → what this means for others.
End with a question inviting comments.
Max 200 words. No emoji in the first 2 sentences.",
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
          cs: "Naplánuj [X]-denní výlet do [město/region].
Budget: [částka] Kč na osobu (včetně dopravy z [odkud]).
Cestujeme: [sami / pár / rodina s dětmi věk X]
Zájmy: [co nás baví, např. 'příroda a pěší turistika, ne muzea']
Vyhýbáme se: [co nechceme, např. 'turistické pasti a fronty']

Chci: itinerář po dnech s konkrétními časy, odhadem cen, tipem na oběd a večeři každý den.",
          en: "Plan a [X]-day trip to [city/region].
Budget: [amount] per person (including transport from [where]).
Traveling: [solo / couple / family with kids age X]
Interests: [what we enjoy, e.g. 'nature and hiking, not museums']
Avoiding: [what we don't want, e.g. 'tourist traps and queues']

I want: day-by-day itinerary with specific times, estimated costs, and a lunch + dinner tip each day.",
        }},
        { label: { cs: "Týdenní jídelníček", en: "Weekly meal plan" }, p: {
          cs: "Vytvoř jídelníček na 5 pracovních dní pro [počet osob].
Omezení stravy: [bez lepku / vegetariánský / bez laktózy / žádné — vyber]
Budget: max [částka] Kč týdně za suroviny.
Čas na vaření: max 30 minut na jídlo.
Preference: [co máme rádi a co nesnášíme]

Výstup:
• Jídla na každý den (snídaně volná)
• Nákupní seznam seřazený podle oddělení (zelenina, mléčné, maso...)
• Které ingredience se opakují a šetří peníze",
          en: "Create a meal plan for 5 working days for [number of people].
Dietary restrictions: [gluten-free / vegetarian / dairy-free / none — choose]
Budget: max [amount] per week for ingredients.
Cooking time: max 30 minutes per meal.
Preferences: [what we like and what we hate]

Output:
• Meals for each day (breakfast flexible)
• Shopping list organized by store section (veg, dairy, meat...)
• Which ingredients repeat across meals to save money",
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
          cs: "Vysvětli mi [téma] jednoduše.
Moje aktuální znalost: [nic nevím / základy / trochu rozumím — vyber].
Příklady: použij příklady z [moje profese/situace, např. 'řízení malé firmy' nebo 'každodenního života'].
Formát: nejdřív 1 věta co to je, pak 3 klíčové body, pak 1 konkrétní příklad, pak shrnutí.
Pokud jsou tam termíny které neznám, vysvětli je automaticky.",
          en: "Explain [topic] to me simply.
My current knowledge: [nothing / basics / some understanding — choose].
Examples: use examples from [my profession/situation, e.g. 'running a small business' or 'everyday life'].
Format: first 1 sentence what it is, then 3 key points, then 1 concrete example, then summary.
If there are terms I might not know, explain them automatically.",
        }},
        { label: { cs: "Interaktivní výuka", en: "Interactive learning" }, p: {
          cs: "Chci se naučit [téma]. Buď můj učitel.
Postupuj po malých krocích — jeden koncept najednou.
Po každém kroku mi polož jednu konkrétní otázku, abych si ověřil/a porozumění.
Pokud odpovím špatně, nevysvětluj znovu stejně — zkus jiný příklad nebo analogii.
Začni tím, proč je toto téma užitečné v praxi.",
          en: "I want to learn [topic]. Be my teacher.
Proceed in small steps — one concept at a time.
After each step, ask me one specific question to verify my understanding.
If I answer wrong, don't re-explain the same way — try a different example or analogy.
Start with why this topic is practically useful.",
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
          cs: "Napiš mi motivační dopis na tuto pracovní pozici.
Pozice: [název pozice]
Firma: [název firmy — pokud víš, doplň co o nich víš]
Moje zkušenosti: [2-3 věty — co umíš a co jsi dělal/a]
Požadavky z inzerátu: [vlož text nebo hlavní body]

Pravidla:
• Max 200 slov
• Začni konkrétní větou proč tě tato firma nebo role zajímá — ne 'Dovolte mi představit se'
• Žádná klišé: komunikativní, týmový hráč, orientace na výsledky
• Ukaž co přineseš jim, ne jen co hledáš ty",
          en: "Write a cover letter for this job position.
Position: [job title]
Company: [company name — if you know it, add what you know about them]
My experience: [2-3 sentences — what you can do and what you've done]
Job requirements: [paste listing text or key points]

Rules:
• Max 200 words
• Start with a specific sentence on why this company or role interests you — not 'I would like to apply'
• No clichés: communicative, team player, results-oriented
• Show what you'll bring them, not just what you're looking for",
        }},
        { label: { cs: "Stížnost / odvolání", en: "Complaint / appeal" }, p: {
          cs: "Pomoz mi napsat formální stížnost nebo odvolání.
Komu píšu: [firma / úřad / pojišťovna]
Co se stalo: [přesný popis situace s daty a čísly pokud máš]
Co jsem už zkusil/a: [předchozí kroky]
Co chci dosáhnout: [konkrétní výsledek — vrácení peněz, oprava, omluva]

Tón: věcný, bez emocí, s odkazem na zákon pokud relevantní.
Formát: datum, věc, tělo dopisu, žádost s termínem odpovědi.",
          en: "Help me write a formal complaint or appeal.
Who I'm writing to: [company / office / insurer]
What happened: [exact description with dates and numbers if available]
What I've already tried: [previous steps]
What I want to achieve: [specific outcome — refund, repair, apology]

Tone: factual, unemotional, with reference to law if relevant.
Format: date, subject, body, request with response deadline.",
        }},
        { label: { cs: "Finanční rozhodnutí", en: "Financial decision" }, p: {
          cs: "Pomoz mi promyslet toto finanční rozhodnutí — nechci konkrétní doporučení (to je na finančním poradci), ale chci lépe pochopit situaci.
Rozhodnutí: [popis — např. 'refinancování hypotéky' nebo 'auto na leasing vs hotově']
Moje čísla: [relevantní částky, příjmy, výdaje — sdílej jen co ti je příjemné]

Chci vědět:
1) Jaké klíčové otázky bych si měl/a položit?
2) Co lidé v této situaci nejčastěji přehlíží?
3) Jak udělat rychlý výpočet pro orientaci?",
          en: "Help me think through this financial decision — I don't want specific advice (that's for a financial advisor), but I want to understand the situation better.
Decision: [description — e.g. 'mortgage refinancing' or 'car on lease vs cash']
My numbers: [relevant amounts, income, expenses — share only what you're comfortable with]

I want to know:
1) What key questions should I ask myself?
2) What do people in this situation most often overlook?
3) How to do a quick back-of-envelope calculation?",
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
          cs: "Napiš prodejní text pro [produkt/služba] metodou AIDA.

Cílová skupina: [popis — věk, profese, hlavní problém který řeší]
USP (proč právě vy): [hlavní výhoda, buď konkrétní]
Hlavní námitka zákazníka: [proč by nekoupil — cena, nedůvěra, alternativa]

Struktura:
• ATTENTION: Nadpis který zasáhne hlavní bolest cílovky — ne 'Představujeme...'
• INTEREST: Rozveď proč je tento problém závažnější než si myslí
• DESIRE: Konkrétní výsledek zákazníka (ne vlastnosti). Příklad: 'Za 3 týdny...' ne 'Náš produkt umí...'
• ACTION: Jedno CTA s důvodem jednat teď (omezená nabídka / deadline / konkrétní přínos)

Max 300 slov. Nezačínej slovem 'Jsou' nebo 'Každý'.",
          en: "Write sales copy for [product/service] using the AIDA method.

Target audience: [description — age, profession, main problem they solve]
USP (why you): [main advantage, be specific]
Main customer objection: [why they wouldn't buy — price, distrust, alternative]

Structure:
• ATTENTION: Headline that hits the target's main pain — not 'Introducing...'
• INTEREST: Expand on why this problem is more serious than they think
• DESIRE: Specific customer result (not features). Example: 'In 3 weeks...' not 'Our product can...'
• ACTION: One CTA with a reason to act now (limited offer / deadline / specific benefit)

Max 300 words. Don't start with 'Are you' or 'Everyone'.",
        }},
        { label: { cs: "Cold email outreach", en: "Cold email outreach" }, p: {
          cs: "Napiš cold email potenciálnímu klientovi.
Typ firmy/osoby: [komu píšu]
Co nabízím: [stručně]
Proč jim píšu teď (trigger): [konkrétní důvod — novinka o jejich firmě, sezóna, problém který řeším]
Cíl emailu: 20minutový hovor — ne prodat hned.

Pravidla:
• Max 5 vět v těle emailu
• První věta mluví o nich, ne o mně
• Zmíň jeden konkrétní problém, který pravděpodobně mají
• Nezačínej 'Dobrý den, jmenuji se...'
• Předmět: max 6 slov, žádné otazníky

Napiš 2 varianty:
A) Přímá a stručná
B) S konkrétním příkladem nebo číslem",
          en: "Write a cold email to a potential client.
Type of company/person: [who I'm writing to]
What I offer: [briefly]
Why I'm writing now (trigger): [specific reason — news about their company, season, problem I solve]
Goal of email: 20-minute call — not to sell immediately.

Rules:
• Max 5 sentences in the email body
• First sentence is about them, not me
• Mention one specific problem they likely have
• Don't start with 'My name is...'
• Subject: max 6 words, no question marks

Write 2 variants:
A) Direct and concise
B) With a specific example or number",
        }},
        { label: { cs: "PAS prodejní email", en: "PAS sales email" }, p: {
          cs: "Napiš prodejní email metodou PAS (Problem, Agitate, Solution).
Produkt/služba: [co prodávám]
Cílová skupina: [kdo jsou moji zákazníci]
Hlavní problém: [co je trápí — buď velmi konkrétní]

Struktura:
• PROBLEM: Pojmenuj problém jazykem zákazníka — ne jak ho vidíš ty
• AGITATE: Ukáž co se stane pokud ho neřeší (ztracené peníze, čas, příležitosti)
• SOLUTION: Představ produkt jako přirozené řešení — ne jako reklamu

Předmět: 3 varianty (jedna s číslem, jedna s otázkou, jedna s 'jak')
Délka emailu: max 200 slov.",
          en: "Write a sales email using the PAS method (Problem, Agitate, Solution).
Product/service: [what I'm selling]
Target audience: [who my customers are]
Main problem: [what troubles them — be very specific]

Structure:
• PROBLEM: Name the problem in the customer's language — not how you see it
• AGITATE: Show what happens if they don't solve it (lost money, time, opportunities)
• SOLUTION: Introduce the product as the natural solution — not as an ad

Subject: 3 variants (one with a number, one with a question, one with 'how to')
Email length: max 200 words.",
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
          cs: "Analyzuj přiložený dataset. Výstup musí mít přesně tuto strukturu:

1) PŘEHLED DAT: Kolik řádků/sloupců, jaký typ dat, chybějící hodnoty?
2) TOP 3 ZJIŠTĚNÍ: Co je nejdůležitější co data říkají? Každé = 1 věta + konkrétní číslo.
3) ANOMÁLIE: Co vypadá divně nebo neočekávaně? Proč to může být důležité?
4) VIZUALIZACE: Navrhni 2 konkrétní grafy — popiš typ, osy a co přesně zobrazit.
5) DOPORUČENÉ KROKY: Co analyticky zkoumat dál?

Každá sekce max 3-5 vět. Chci report, ne akademickou práci.

[nahraj soubor nebo vlož data]",
          en: "Analyze the attached dataset. Output must follow this exact structure:

1) DATA OVERVIEW: How many rows/columns, what type of data, missing values?
2) TOP 3 FINDINGS: What is the most important thing the data says? Each = 1 sentence + specific number.
3) ANOMALIES: What looks strange or unexpected? Why might this be important?
4) VISUALIZATIONS: Suggest 2 specific charts — describe type, axes, and exactly what to show.
5) RECOMMENDED NEXT STEPS: What to analyze further?

Max 3-5 sentences per section. I want a report, not an academic paper.

[upload file or paste data]",
        }},
        { label: { cs: "Analýza zpětné vazby zákazníků", en: "Customer feedback analysis" }, p: {
          cs: "Mám [X] hodnocení/recenzí/zpětné vazby od zákazníků. Analyzuj je.

[vlož text recenzí nebo nahraj soubor]

Výstup:
1) Top 3 věci které zákazníci CHVÁLÍ (s citací 1 příkladu každého)
2) Top 3 věci které zákazníci KRITIZUJÍ (s citací 1 příkladu každého)
3) SKRYTÉ POTŘEBY: Co zákazníci chtějí ale přímo neříkají?
4) PRIORITA: Jedno doporučení — co udělat jako první a proč

Ignoruj obecné fráze jako 'dobrá kvalita' nebo 'doporučuji'. Hledej konkrétní vzory.",
          en: "I have [X] reviews / ratings / feedback from customers. Analyze them.

[paste review text or upload file]

Output:
1) Top 3 things customers PRAISE (with 1 example quote each)
2) Top 3 things customers CRITICIZE (with 1 example quote each)
3) HIDDEN NEEDS: What do customers want but don't say directly?
4) PRIORITY: One recommendation — what to do first and why

Ignore generic phrases like 'good quality' or 'would recommend'. Look for specific patterns.",
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
          cs: "Napiš [jazyk + verze, např. 'Python 3.11'] funkci pro: [přesný popis co má dělat].

Požadavky:
• Ošetření chyb pro edge cases: [vyjmenuj možné problémy]
• Typové anotace
• Docstring s popisem parametrů
• 3 unit testy (normální případ, edge case, chybový stav)

Příklad vstupu: [konkrétní data]
Očekávaný výstup: [konkrétní výsledek]

Existující kód pro kontext:
```
[vlož relevantní části kódu pokud máš]
```",
          en: "Write a [language + version, e.g. 'Python 3.11'] function for: [exact description of what it should do].

Requirements:
• Error handling for edge cases: [list possible issues]
• Type annotations
• Docstring with parameter descriptions
• 3 unit tests (normal case, edge case, error state)

Example input: [specific data]
Expected output: [specific result]

Existing code for context:
```
[paste relevant parts of your code if available]
```",
        }},
        { label: { cs: "Debug a oprava", en: "Debug and fix" }, p: {
          cs: "Tento kód nefunguje správně:

```[jazyk]
[vlož kód]
```

Chyba / nesprávné chování: [přesný popis co se děje]
Očekávané chování: [co by se mělo dít]
Prostředí: [OS, verze jazyka, relevantní knihovny]

Potřebuji:
1) Identifikaci bugu s vysvětlením PROČ k tomu dochází
2) Opravu s komentářem co se změnilo
3) Jedno doporučení jak kódu do budoucna předejít podobnému problému",
          en: "This code isn't working correctly:

```[language]
[paste code]
```

Error / wrong behavior: [exact description of what's happening]
Expected behavior: [what should happen]
Environment: [OS, language version, relevant libraries]

I need:
1) Identification of the bug with explanation of WHY it happens
2) Fix with a comment on what changed
3) One recommendation for how to prevent similar issues in the future",
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
          cs: "Fáze 1 — generování:
Vygeneruj 20 nápadů na [téma/problém]. Zahrň i neobvyklé nebo zdánlivě absurdní nápady — nekritizuj je.

Fáze 2 — výběr a plán:
Vyber 5 nejlepších. Pro každý:
• Proč je silný (konkrétní argument)
• Jak ho realizovat (první 3 kroky)
• Hlavní překážka a jak ji překonat
• Odhad nákladů nebo potřebného času

Kontext: [doplň relevantní info — obor, cílová skupina, dostupné zdroje]",
          en: "Phase 1 — generation:
Generate 20 ideas for [topic/problem]. Include unusual or seemingly absurd ideas — don't criticize them.

Phase 2 — selection and plan:
Select the 5 best. For each:
• Why it's strong (specific argument)
• How to implement it (first 3 steps)
• Main obstacle and how to overcome it
• Estimated cost or time required

Context: [add relevant info — industry, target audience, available resources]",
        }},
        { label: { cs: "Analýza z více perspektiv", en: "Multi-perspective analysis" }, p: {
          cs: "Analyzuj [problém/rozhodnutí/nápad] z těchto 5 perspektiv:
1) Zákazník / uživatel: co si myslí a co potřebuje?
2) Konkurence: jak by na to reagovala?
3) Technologie: co je technicky možné nebo omezující?
4) Finance: jaký je finanční dopad a riziko?
5) Lidský faktor: jak to ovlivní tým nebo vztahy?

Pro každou perspektivu: 2-3 konkrétní postřehy + 1 doporučení.
Na závěr: jedno souhrnné doporučení s odůvodněním.",
          en: "Analyze [problem/decision/idea] from these 5 perspectives:
1) Customer / user: what do they think and need?
2) Competition: how would they react?
3) Technology: what's technically possible or limiting?
4) Finance: what's the financial impact and risk?
5) Human factor: how does it affect the team or relationships?

For each perspective: 2-3 specific insights + 1 recommendation.
At the end: one overall recommendation with reasoning.",
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
          cs: "Proveď rešerši na téma: [téma]
Účel: [co s tím budu dělat — např. 'rozhodnutí zda vstoupit na trh' nebo 'příprava prezentace pro klienta']

Struktura výstupu:
1) SOUČASNÝ STAV: Kde se obor/téma nachází dnes? (3-5 klíčových faktů)
2) HLAVNÍ HRÁČI: Kdo jsou dominantní aktéři a jaké jsou jejich pozice?
3) TRENDY: Co se mění v posledních 2 letech? (ne obecnosti — konkrétní posuny)
4) VÝZVY A RIZIKA: Co brání růstu nebo způsobuje problémy?
5) PŘÍLEŽITOSTI: Kde jsou mezery nebo neobsloužené potřeby?
6) PREDIKCE: Co lze očekávat za 2-3 roky?

U každého tvrzení uveď zdroj nebo alespoň odkaz.",
          en: "Conduct research on: [topic]
Purpose: [what I'll do with it — e.g. 'decision whether to enter the market' or 'preparing a client presentation']

Output structure:
1) CURRENT STATE: Where is the industry/topic today? (3-5 key facts)
2) KEY PLAYERS: Who are the dominant actors and what are their positions?
3) TRENDS: What has changed in the last 2 years? (not generalities — specific shifts)
4) CHALLENGES & RISKS: What's preventing growth or causing problems?
5) OPPORTUNITIES: Where are the gaps or underserved needs?
6) PREDICTIONS: What can be expected in 2-3 years?

Cite a source or at least a reference for each claim.",
        }},
        { label: { cs: "Srovnání produktů / řešení", en: "Product / solution comparison" }, p: {
          cs: "Porovnej [A] vs [B] vs [C] pro použití: [konkrétní use case — pro koho a k čemu].

Kritéria pro porovnání:
• Cena a cenový model (freemium, předplatné, jednorázová platba)
• Klíčové funkce relevantní pro [use case]
• Nevýhody a omezení
• Pro koho je každá možnost nejlepší
• Integrace s dalšími nástroji

Výstup: srovnávací tabulka + 1 odstavec doporučení pro [moji situaci: popis].
Buď konkrétní — vyhni se formulaci 'záleží na situaci' bez vysvětlení.",
          en: "Compare [A] vs [B] vs [C] for use case: [specific use case — for whom and what for].

Comparison criteria:
• Price and pricing model (freemium, subscription, one-time)
• Key features relevant to [use case]
• Disadvantages and limitations
• Who each option is best for
• Integration with other tools

Output: comparison table + 1 paragraph recommendation for [my situation: description].
Be specific — avoid 'it depends' without explanation.",
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
          cs: "Napiš SEO článek na klíčové slovo: '[keyword]'

Search intent: [informační / transakční / navigační / porovnávací — vyber]
Cílový čtenář: [kdo to bude číst a co potřebuje vyřešit]

Struktura:
• H1: Obsahuje keyword, max 60 znaků, slibuje konkrétní hodnotu
• Úvod (150 slov): problém čtenáře → proč je tento článek odpovědí → co se dozví
• H2 sekce: [seznam sekcí]
• FAQ sekce: 5 otázek z 'Lidé se také ptají' pro tento keyword
• Závěr: shrnutí + jasný next step

EEAT signály (zabuduj přirozeně):
• Konkrétní čísla nebo statistiky s uvedením zdroje
• Příklad z reálné praxe nebo case study
• Jasné vymezení kdo a proč je kvalifikovaný psát o tomto tématu

Meta title: keyword + benefit, max 60 znaků
Meta description: problém → řešení → CTA, max 155 znaků
Délka: 1800-2200 slov",
          en: "Write an SEO article for keyword: '[keyword]'

Search intent: [informational / transactional / navigational / comparison — choose]
Target reader: [who will read it and what they need to solve]

Structure:
• H1: Contains keyword, max 60 chars, promises specific value
• Intro (150 words): reader's problem → why this article answers it → what they'll learn
• H2 sections: [list of sections]
• FAQ section: 5 questions from 'People Also Ask' for this keyword
• Conclusion: summary + clear next step

EEAT signals (embed naturally):
• Specific numbers or statistics with source
• Real-world example or case study
• Clear statement of who is qualified to write about this topic and why

Meta title: keyword + benefit, max 60 chars
Meta description: problem → solution → CTA, max 155 chars
Length: 1800-2200 words",
        }},
        { label: { cs: "SEO brief pro copywritera", en: "SEO brief for copywriter" }, p: {
          cs: "Vytvoř kompletní SEO brief pro copywritera. Keyword: '[keyword]'

1) SEARCH INTENT: Co přesně uživatel hledá? (nechce obecný článek — chce...)
2) STRUKTURA H1-H3: Navrhni konkrétní nadpisy (ne zástupné texty)
3) DÉLKA A ČITELNOST: Doporučená délka, úroveň čtení (Flesch score cíl)
4) LSI A SÉMANTICKÁ KLÍČOVÁ SLOVA: 15 výrazů které musí článek přirozeně obsahovat
5) INTERNAL LINKING: 3 existující stránky na webu na které může odkazovat
6) FEATURED SNIPPET: Jak strukturovat odpověď pro snippet (tabulka / seznam / odstavec)
7) SCHEMA MARKUP: Doporučený typ (Article / FAQ / HowTo)
8) COMPETITOR GAP: Co top 3 výsledky mají a co jim chybí?

Web: [URL webu pokud máš]",
          en: "Create a complete SEO brief for a copywriter. Keyword: '[keyword]'

1) SEARCH INTENT: What exactly is the user looking for? (they don't want a generic article — they want...)
2) H1-H3 STRUCTURE: Suggest specific headings (not placeholder text)
3) LENGTH & READABILITY: Recommended length, reading level (Flesch score target)
4) LSI & SEMANTIC KEYWORDS: 15 expressions the article must naturally contain
5) INTERNAL LINKING: 3 existing pages on the site it can link to
6) FEATURED SNIPPET: How to structure the answer for a snippet (table / list / paragraph)
7) SCHEMA MARKUP: Recommended type (Article / FAQ / HowTo)
8) COMPETITOR GAP: What do top 3 results have and what are they missing?

Website: [URL if available]",
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
          cs: "<business>
[Popis firmy/produktu/služby — co děláte, jak, pro koho]
</business>
<market>
[Popis trhu — geografický rozsah, velikost, zralost]
</market>
<goals>
[Cíle — konkrétní čísla a časový horizont]
</goals>
<constraints>
[Omezení — budget, tým, čas, regulace]
</constraints>

Vytvoř byznys plán:
1) Executive summary (max 200 slov — pro investora)
2) Analýza trhu (TAM/SAM/SOM s čísly)
3) Konkurenční analýza (min 3 přímí konkurenti — silné stránky, slabé stránky, jak se odlišujeme)
4) Business Model Canvas (všech 9 polí)
5) GTM strategie (první 3 měsíce — konkrétní kroky)
6) Finanční projekce na 3 roky (optimistická / realistická / pesimistická varianta)
7) Klíčová rizika + mitigace
8) KPIs pro měření úspěchu

Buď kritický — pokud náš plán má slabiny, pojmenuj je.",
          en: "<business>
[Company/product/service description — what you do, how, for whom]
</business>
<market>
[Market description — geographic scope, size, maturity]
</market>
<goals>
[Goals — specific numbers and time horizon]
</goals>
<constraints>
[Constraints — budget, team, time, regulations]
</constraints>

Create a business plan:
1) Executive summary (max 200 words — for an investor)
2) Market analysis (TAM/SAM/SOM with numbers)
3) Competitive analysis (min 3 direct competitors — strengths, weaknesses, how we differ)
4) Business Model Canvas (all 9 fields)
5) GTM strategy (first 3 months — specific steps)
6) 3-year financial projections (optimistic / realistic / pessimistic scenarios)
7) Key risks + mitigation
8) KPIs for measuring success

Be critical — if our plan has weaknesses, name them.",
        }},
        { label: { cs: "Analýza konkurence", en: "Competitor analysis" }, p: {
          cs: "<context>
Naše firma: [popis, cílová skupina, cenová úroveň, hlavní USP]
Náš problém: [proč zákazníci odcházejí ke konkurenci nebo k nám nepřicházejí]
</context>

<task>
Analyzuj konkurenci pro naši firmu vs [konkurent 1], [konkurent 2], [konkurent 3].

1) Positioning matrix: umísti všechny hráče na 2 osy — [osa 1, např. cena] vs [osa 2, např. jednoduchost]
2) Kde jsou konkurenti slabí a kde bychom mohli vyhrát?
3) Které segmenty zákazníků obsluhují oni a ne my (a naopak)?
4) Navrhni 1 positioning statement který nás jasně odliší
5) 3 konkrétní kroky které můžeme udělat v příštích 30 dnech
</task>

Buď kritický. Pokud naše USP není přesvědčivé, řekni to přímo.",
          en: "<context>
Our company: [description, target audience, price level, main USP]
Our problem: [why customers go to competitors or don't come to us]
</context>

<task>
Analyze the competitive landscape for our company vs [competitor 1], [competitor 2], [competitor 3].

1) Positioning matrix: place all players on 2 axes — [axis 1, e.g. price] vs [axis 2, e.g. simplicity]
2) Where are competitors weak and where could we win?
3) Which customer segments do they serve that we don't (and vice versa)?
4) Propose 1 positioning statement that clearly differentiates us
5) 3 concrete steps we can take in the next 30 days
</task>

Be critical. If our USP isn't compelling, say so directly.",
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
          cs: "Vytvoř landing page pro [produkt/služba]. Tech stack: React + Tailwind CSS.

Design reference: [odkaz nebo popis stylu — např. 'minimalistický, tmavé pozadí, amber akcenty']
Cílová skupina: [kdo jsou návštěvníci]
Hlavní CTA: [co má visitor udělat]

Sekce (v tomto pořadí):
1) Hero: headline + subheadline + CTA tlačítko + hero vizuál nebo mockup
2) Social proof: loga klientů nebo [X] spokojených zákazníků
3) Benefity: 3-4 karty s ikonou, nadpisem a 2 větami
4) Jak to funguje: 3 kroky s čísly
5) Testimonials: 2-3 citace se jménem a rolí
6) Pricing: 3 plány (Basic / Pro / Enterprise) s highlighted středním plánem
7) FAQ: 5 otázek v accordion
8) Footer: logo, navigace, kontakt, social

Technické požadavky: responsive, dark/light mode toggle, smooth scroll, lazy loading obrázků.",
          en: "Create a landing page for [product/service]. Tech stack: React + Tailwind CSS.

Design reference: [link or style description — e.g. 'minimalist, dark background, amber accents']
Target audience: [who the visitors are]
Main CTA: [what the visitor should do]

Sections (in this order):
1) Hero: headline + subheadline + CTA button + hero visual or mockup
2) Social proof: client logos or [X] happy customers
3) Benefits: 3-4 cards with icon, title, and 2 sentences
4) How it works: 3 steps with numbers
5) Testimonials: 2-3 quotes with name and role
6) Pricing: 3 plans (Basic / Pro / Enterprise) with highlighted middle plan
7) FAQ: 5 questions in accordion
8) Footer: logo, navigation, contact, social

Technical requirements: responsive, dark/light mode toggle, smooth scroll, lazy image loading.",
        }},
        { label: { cs: "API integrace", en: "API integration" }, p: {
          cs: "Napiš kód pro integraci [název API / služby] do existující [jazyk/framework] aplikace.

Co integrace má dělat: [přesný popis funkcionality]
Autentizace: [API key / OAuth / JWT — co používá tato API]
Endpoint(s): [konkrétní endpoints nebo odkaz na docs]

Existující kód (relevantní části):
```
[vlož]
```

Požadavky:
• Error handling pro: rate limiting, timeout, invalid response
• Logování pro debugging
• Typové definice (TypeScript pokud projekt používá)
• Příklad použití v komentáři",
          en: "Write code for integrating [API name / service] into an existing [language/framework] application.

What the integration should do: [exact description of functionality]
Authentication: [API key / OAuth / JWT — what this API uses]
Endpoint(s): [specific endpoints or link to docs]

Existing code (relevant parts):
```
[paste]
```

Requirements:
• Error handling for: rate limiting, timeout, invalid response
• Logging for debugging
• Type definitions (TypeScript if project uses it)
• Usage example in a comment",
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
          cs: "Vytvoř systémový prompt pro AI asistenta s těmito parametry:

Role: [přesný popis role — např. 'zákaznický servis pro SaaS firmu']
Účel: [co asistent dělá a co ne]
Uživatelé: [kdo bude asistenta používat]
Tón a osobnost: [formální / přátelský / přímý — s příkladem]

Struktura systémového promptu:
1) Role a kontext (2-3 věty)
2) Co asistent VÍ (znalostní báze — odkaz na dokumenty nebo popis)
3) Co asistent NESMÍ dělat (guardrails — buď konkrétní)
4) Formát odpovědí (délka, struktura, jazyk)
5) 3 few-shot příklady (otázka → ideální odpověď)
6) Edge cases (co říct při mimo-téma otázkách, necitlivých dotazech)
7) Anti-injection ochrana

Po napsání promptu: navrhni 5 testovacích vstupů včetně 2 adversariálních.",
          en: "Create a system prompt for an AI assistant with these parameters:

Role: [exact role description — e.g. 'customer service for a SaaS company']
Purpose: [what the assistant does and doesn't do]
Users: [who will use the assistant]
Tone and personality: [formal / friendly / direct — with an example]

System prompt structure:
1) Role and context (2-3 sentences)
2) What the assistant KNOWS (knowledge base — link to docs or description)
3) What the assistant MUST NOT do (guardrails — be specific)
4) Response format (length, structure, language)
5) 3 few-shot examples (question → ideal response)
6) Edge cases (what to say for off-topic questions, sensitive queries)
7) Anti-injection protection

After writing the prompt: suggest 5 test inputs including 2 adversarial ones.",
        }},
        { label: { cs: "XML prompt pro komplexní úkol", en: "XML prompt for complex task" }, p: {
          cs: "Přepis tento jednoduchý prompt do strukturovaného XML formátu pro lepší výsledky:

Původní prompt: [vlož]

XML struktura:
<role>[kdo je AI v tomto kontextu]</role>
<context>[relevantní zázemí a informace]</context>
<task>[přesný úkol — jeden konkrétní]</task>
<constraints>[co AI nesmí nebo musí zachovat]</constraints>
<format>[přesný formát výstupu]</format>
<examples>
<good>[příklad dobrého výstupu]</good>
<bad>[příklad čemu se vyhnout]</bad>
</examples>

Po přepsání: vysvětli co každý tag přidává a proč je výsledek lepší než původní prompt.",
          en: "Rewrite this simple prompt into a structured XML format for better results:

Original prompt: [paste]

XML structure:
<role>[who AI is in this context]</role>
<context>[relevant background and information]</context>
<task>[exact task — one specific thing]</task>
<constraints>[what AI must not do or must preserve]</constraints>
<format>[exact output format]</format>
<examples>
<good>[example of good output]</good>
<bad>[example of what to avoid]</bad>
</examples>

After rewriting: explain what each tag adds and why the result is better than the original prompt.",
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
          cs: "Navrhni kompletní sales funnel pro:
Produkt: [název a stručný popis]
Cena: [cenový model — např. '990 Kč/měs nebo 9900 Kč/rok']
Cílová skupina: [přesný popis — kdo jsou, co řeší, kde tráví čas]
Hlavní námitka: [proč nekoupí — cena / nedůvěra / načasování]

Fáze funnelu:
1) TOFU — Awareness: 3 nápady na obsah který osloví lidi kteří náš produkt ještě neznají
2) Lead magnet: 1 konkrétní bezplatný obsah (checklist, template, mini-kurz) s názvem a popisem
3) Email sekvence (7 emailů): předmět + 2věty obsah pro každý email; den 1, 3, 5, 7, 10, 14, 21
4) Sales page: struktura (ne copy) — co musí stránka obsahovat v jakém pořadí
5) Upsell: co nabídnout po koupi a jak načasovat
6) Retargeting: 2 nápady na retargeting pro ty, kteří nekoupili
7) KPIs: co měřit v každé fázi (conversion rate, open rate...)",
          en: "Design a complete sales funnel for:
Product: [name and brief description]
Price: [pricing model — e.g. '$49/month or $490/year']
Target audience: [precise description — who they are, what they solve, where they spend time]
Main objection: [why they won't buy — price / distrust / timing]

Funnel stages:
1) TOFU — Awareness: 3 content ideas that reach people who don't know our product yet
2) Lead magnet: 1 specific free resource (checklist, template, mini-course) with name and description
3) Email sequence (7 emails): subject + 2-sentence content for each email; day 1, 3, 5, 7, 10, 14, 21
4) Sales page: structure (not copy) — what the page must contain and in what order
5) Upsell: what to offer after purchase and when to time it
6) Retargeting: 2 retargeting ideas for those who didn't buy
7) KPIs: what to measure at each stage (conversion rate, open rate...)",
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

  const levelEmoji = level === "beginner" ? "🌱" : level === "intermediate" ? "🌿" : "🌳";
  const levelName  = level === "beginner" ? t.beg : level === "intermediate" ? t.mid : t.adv;
  const levelColor = level === "beginner" ? T.green : level === "intermediate" ? T.teal : T.accent;

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
