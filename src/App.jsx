import { useState, useCallback } from "react";

const T = {
  accent:"#F59E0B", accentLo:"rgba(245,158,11,0.10)", accentBorder:"rgba(245,158,11,0.28)",
  teal:"#2DD4BF", tealLo:"rgba(45,212,191,0.07)", tealBorder:"rgba(45,212,191,0.25)",
  purple:"#A78BFA", purpleLo:"rgba(167,139,250,0.08)", purpleBorder:"rgba(167,139,250,0.28)",
  blue:"#60A5FA", blueLo:"rgba(96,165,250,0.08)", blueBorder:"rgba(96,165,250,0.25)",
  orange:"#F97316", bg:"#06060A", surface:"rgba(255,255,255,0.036)",
  border:"rgba(255,255,255,0.07)", text:"#F1F0EE", muted:"#8A8A9A",
  faint:"#3A3A4A", green:"#10B981", red:"#EF4444",
};

const L = {
  cs:{
    title:"PromptujAI", sub:"Průvodce světem umělé inteligence — od začátečníka po experta",
    pick:"Zvolte svou úroveň",
    beg:"Začátečník", begD:"První kroky s AI. Průvodce bez žargonu.",
    mid:"Mírně pokročilý", midD:"Zvládáte základy. Čas na konkrétní nástroje a techniky.",
    adv:"Pokročilý", advD:"Marketing, byznys, SEO, vývoj aplikací, AI agenti.",
    tools:"Nástroje", prompts:"Prompty", models:"Modely",
    byTask:"Podle úkolu", byModel:"Podle modelu",
    pLang:"Jazyk promptů", cs2:"Čeština", en2:"English",
    back:"Zpět", open:"Otevřít",
    mv:"Verze:", tips:"Tipy:",
    free:"Zdarma", paid:"Placený", freemium:"Freemium",
    copy:"Kopírovat", copied:"Zkopírováno",
    guide:"Průvodce pro tuto úroveň", guideIntro:"Doporučujeme přečíst před začátkem.",
    promptTip:"Tip k promptu:",
    noResults:"Žádné výsledky", noResultsSub:"Zkuste jiný výraz.",
    searchPH:"Hledat…", copyAria:"Kopírovat prompt",
    anatomyTitle:"Anatomie dokonalého promptu",
    toolsDesc:"Vyberte co chcete dělat — dostanete doporučené nástroje, kroky a tip.",
    modelsDesc:"Přehled všech AI modelů — na co jsou ideální, jak z nich vytěžit maximum a konkrétní prompty.",
    recommended:"Doporučené nástroje:", howTo:"Jak na to:",
    idealPrompts:"Ideální prompty", bestFor:"Ideální pro", notFor:"Méně vhodný",
  },
  en:{
    title:"PromptujAI", sub:"Your guide to artificial intelligence — from beginner to expert",
    pick:"Choose your level",
    beg:"Beginner", begD:"First steps with AI. Guide without jargon.",
    mid:"Intermediate", midD:"You know the basics. Time for specific tools and techniques.",
    adv:"Advanced", advD:"Marketing, business, SEO, app development, AI agents.",
    tools:"Tools", prompts:"Prompts", models:"Models",
    byTask:"By task", byModel:"By model",
    pLang:"Prompt language", cs2:"Čeština", en2:"English",
    back:"Back", open:"Open",
    mv:"Versions:", tips:"Tips:",
    free:"Free", paid:"Paid", freemium:"Freemium",
    copy:"Copy", copied:"Copied",
    guide:"Guide for this level", guideIntro:"Recommended reading before you start.",
    promptTip:"Prompt tip:",
    noResults:"No results", noResultsSub:"Try a different term.",
    searchPH:"Search…", copyAria:"Copy prompt",
    anatomyTitle:"Anatomy of a perfect prompt",
    toolsDesc:"Pick what you want to do — get recommended tools, steps and a tip.",
    modelsDesc:"Overview of all AI models — ideal use cases, how to get the most out of them and concrete prompts.",
    recommended:"Recommended tools:", howTo:"How to:",
    idealPrompts:"Ideal prompts", bestFor:"Ideal for", notFor:"Less suitable",
  },
};

// ─── GUIDE ────────────────────────────────────────────────────────────────────
const GUIDE = {
  beginner:{
    cs:[
      {title:"Jak pracovat s AI: váš první průvodce",text:"Nejdůležitější věc: AI je nástroj, ne věštec. Funguje jako chytrý asistent, kterému píšete zprávy. Čím přesněji se ptáte, tím lepší odpověď dostanete.\n\nZačněte takto:\n1. Otevřete claude.ai nebo chat.openai.com\n2. Přihlaste se (Google účet stačí)\n3. Napište první dotaz česky\n4. Čtěte odpověď — pak upřesněte\n\nZlatá rada: Pište AI jako kolegovi — v celých větách s kontextem. Ne jako Googlu.\n\nRozdíl:\n[Google] restaurace Praha centrum\n[AI] Hledám restauraci v centru Prahy na pracovní oběd pro 2, česká kuchyně, ~400 Kč/os. Co doporučíš?\n\nVyzkoušejte AI tento týden na jeden reálný problém."},
      {title:"Kolik to stojí a kde začít",text:"Naprostá většina toho, co jako začátečník potřebujete, je zdarma.\n\nZdarma (bez kreditní karty):\n→ Claude — claude.ai (nejlepší na texty a analýzu)\n→ ChatGPT — chat.openai.com (nejuniverzálnější)\n→ Gemini — gemini.google.com (aktuální informace z webu)\n→ DeepSeek — chat.deepseek.com (zcela zdarma, bez limitů)\n→ NotebookLM — notebooklm.google.com (učení z vašich dokumentů)\n→ Perplexity — perplexity.ai (AI vyhledávač s citacemi)\n\nPlacené verze (~500 Kč/měs) odemknou výkonnější modely, méně omezení a pokročilé funkce.\n\nDoporučení: Začněte s Claude nebo ChatGPT. Oba fungují výborně česky."},
      {title:"Jak psát prompty — anatomie dobrého dotazu",text:"Prompt = zpráva, kterou posíláte AI. Kvalita promptu rozhoduje o 80 % kvality odpovědi.\n\nStruktura profesionálního promptu:\n[ROLE] Jsi zkušený copywriter pro B2B firmy.\n[ÚKOL] Napiš email potenciálnímu klientovi.\n[KONTEXT] Firma prodává CRM software. Klient je ředitel obchodní firmy. Prezentaci viděl před 3 dny.\n[STYL] Profesionální, přátelský. Ne agresivně prodejní.\n[FORMÁT] Max 120 slov. Předmět emailu jako první řádek.\n\nNejčastější chyby:\n→ Příliš vague: 'Napiš něco o marketingu'\n→ Bez kontextu: 'Napiš email' (komu? o čem? jaký tón?)\n→ Přijmout první výsledek bez iterace\n\nTip: Napište AI přímo: 'Napiš mi ideální prompt pro tento úkol: [popis]' — AI vám prompt navrhne sama."},
      {title:"Bezpečnost a soukromí",text:"Pro 95 % každodenního použití je AI zcela bezpečný nástroj.\n\nCo do AI NESMÍTE zadávat:\n→ Rodná čísla, čísla pasů nebo průkazů\n→ Hesla nebo přístupové klíče\n→ Čísla platebních karet\n→ Citlivé obchodní informace (patenty, neveřejné smlouvy)\n\nCo je zcela v pořádku:\n→ Vaše jméno a email pro drafty\n→ Obecné info o vaší práci\n→ Dokumenty bez osobních dat třetích stran\n\nAI může chybovat u konkrétních čísel a faktů — u důležitých rozhodnutí vždy ověřte.\nAI vás nesoudí a každý nový chat začíná čistě."},
    ],
    en:[
      {title:"How to work with AI: your first guide",text:"Most important: AI is a tool, not an oracle. Write messages to it like a smart assistant. The more precisely you ask, the better the answer.\n\nStart here:\n1. Open claude.ai or chat.openai.com\n2. Sign in (Google account works)\n3. Type your first question\n4. Read the answer — then refine\n\nGolden rule: Write to AI like a colleague — full sentences with context. Not like a search engine.\n\nTry AI this week on one real problem."},
      {title:"How much and where to start",text:"The vast majority of what you need as a beginner is completely free.\n\nFree (no card): Claude, ChatGPT, Gemini, DeepSeek, NotebookLM, Perplexity\n\nPaid (~$20/mo) unlocks more powerful models and fewer limits.\n\nRecommendation: Start with Claude or ChatGPT. Both work great in most languages."},
    ],
  },
  intermediate:{
    cs:[
      {title:"Systémový přístup k promptům",text:"Na této úrovni potřebujete předvídatelné, kvalitní výstupy. Klíč je struktura.\n\nTechnika Role + Task + Context + Format:\nROLE: 'Jsi zkušený finanční analytik pro malé firmy...'\nTASK: '...analyzuj přiložený cash flow report...'\nCONTEXT: '...pro majitele e-shopu zvažujícího expanzi. Bez finančního vzdělání.'\nFORMAT: '1) 3 klíčová zjištění, 2) 2 rizika, 3) doporučení v 1 větě. Žádný akademický jazyk.'\n\nPro iteraci výstupu:\n→ Příliš dlouhé: 'Zkrať na 3 věty, zachovej hlavní argument'\n→ Příliš obecné: 'Přidej 2 konkrétní příklady z praxe'\n→ Špatný tón: 'Přepis přímějším, asertivním tónem'\n→ Odborný žargon: 'Vysvětli tak, aby pochopil neodborník'"},
      {title:"Nastavení AI na váš styl",text:"Chcete aby AI vždy psala vaším hlasem? Používejte trvalé instrukce.\n\nV Claude — Project Instructions:\n1. Vytvořte nový projekt (levý panel)\n2. Klikněte 'Project Instructions'\n3. Vložte instrukce které platí pro celý projekt\n\nPříklad: 'Jsem majitel marketingové agentury. Piš přátelsky ale profesionálně, česky bez anglicismů, přímočaře. Krátké odstavce, max 3-4 věty každý.'\n\nV ChatGPT — Settings > Customize ChatGPT.\n\nTip: Nahrajte AI vzorové texty a napište 'Analyzuj styl a napiš popis jak mám rád/a aby AI psala.' Výsledný popis vložte do Instructions."},
    ],
    en:[
      {title:"Systematic approach to prompts",text:"At this level you need predictable, quality outputs. The key is structure.\n\nRole + Task + Context + Format technique:\nROLE: 'You are an experienced financial analyst for small businesses...'\nTASK: '...analyze the attached cash flow report...'\nCONTEXT: '...for an e-shop owner considering expansion. No financial background.'\nFORMAT: '1) 3 key findings, 2) 2 risks, 3) recommendation in 1 sentence. No academic language.'"},
    ],
  },
  advanced:{
    cs:[
      {title:"Pokročilé promptování — XML a Extended Thinking",text:"Profesionální prompty mají strukturu. Claude byl trénován s XML tagy — výrazně zlepšují výstupy.\n\n<role>Jsi senior growth stratég s 10 lety zkušeností v SaaS.</role>\n<task>Vytvoř 90denní GTM plán pro nový AI produktivní nástroj.</task>\n<context>Produkt: AI task manager pro foundrery. Tým: 2 lidé. Budget: lean. 15–20 beta uživatelů. Rizika: Adoption, Retention, Positioning.</context>\n<stop_conditions>Zastav až bude roadmapa s 3–4 akcemi/týden a Launch Decision Gate.</stop_conditions>\n<o>Týdenní sprint plán: Action, Owner, Risk, Rationale.</o>\n\nExtended Thinking (Opus/Sonnet):\n→ Zapněte pro strategické analýzy, komplexní kód a právní analýzy\n→ Prompt: 'Před odpovědí projdi všechny perspektivy. Popiš reasoning. Pak dej finální odpověď.'\n→ Nevyplatí se: překlady, formátování, jednoduché texty"},
    ],
    en:[
      {title:"Advanced prompting — XML and Extended Thinking",text:"Professional prompts have structure. Claude was trained with XML tags — they significantly improve outputs.\n\n<role>Senior growth strategist, 10 years SaaS experience.</role>\n<task>Create 90-day GTM plan for new AI productivity tool.</task>\n<context>Product: AI task manager. Team: 2 people. Budget: lean. 15-20 beta users.</context>\n<o>Weekly sprint plan: Action, Owner, Risk, Rationale.</o>"},
    ],
  },
};

// ─── TOOLS — organized by USE CASE ────────────────────────────────────────────
const TOOLS = {
  beginner:[
    {
      task:{cs:"Psaní emailů a zpráv",en:"Writing emails & messages"},icon:"—",
      url:"https://claude.ai",
      urlLabel:{cs:"Otevřít Claude",en:"Open Claude"},
      desc:{cs:"Popíšete situaci a AI napíše celý email za vás — formálně i neformálně. Funguje pro emaily šéfovi, klientovi, úřadu i kamarádovi.",en:"Describe the situation and AI writes the whole email for you — formal or informal."},
      recommended:["Claude","ChatGPT"],
      steps:{
        cs:[
          "Jděte na claude.ai (zdarma, stačí Google účet) nebo chat.openai.com",
          "Do chatovacího pole dole napište svůj požadavek — například: 'Napiš formální email šéfovi. Omlouvám se za zpoždění projektu o 2 dny. Tón klidný, max 80 slov.'",
          "AI napíše návrh emailu. Přečtěte ho — pokud se vám něco nelíbí, napište přímo do chatu třeba 'Zkrať to' nebo 'Piš méně formálně'",
          "Výsledný text zkopírujte (Ctrl+C) a vložte do svého emailového klienta",
        ],
        en:[
          "Go to claude.ai (free, Google account works) or chat.openai.com",
          "Type your request into the chat box — for example: 'Write a formal email to my boss. Apologizing for a 2-day project delay. Calm tone, max 80 words.'",
          "AI writes a draft email. Read it — if something's off, type directly: 'Make it shorter' or 'Less formal'",
          "Copy the result (Ctrl+C) and paste into your email client",
        ],
      },
      tip:{cs:"Nemusíte znát anglicky — Claude i ChatGPT rozumí česky perfektně. Pište přirozeně, jako byste vysvětlovali kamarádovi co potřebujete.",en:"No need to know English — Claude and ChatGPT understand perfectly. Write naturally, as if explaining to a friend what you need."},
    },
    {
      task:{cs:"Vysvětlení složitého textu",en:"Explaining complex text"},icon:"—",
      url:"https://claude.ai",
      urlLabel:{cs:"Otevřít Claude",en:"Open Claude"},
      desc:{cs:"Máte smlouvu, lékařskou zprávu nebo úřední dopis plný žargonu? Vložte ho do AI a dostanete srozumitelné vysvětlení v lidské řeči.",en:"Have a contract, medical report or official letter full of jargon? Paste it into AI and get a plain-language explanation."},
      recommended:["Claude","ChatGPT"],
      steps:{
        cs:[
          "Jděte na claude.ai — Claude je na analýzu textů a dokumentů nejlepší",
          "Zkopírujte text který chcete vysvětlit (nebo nahrajte PDF — ikona sponky vedle pole pro psaní)",
          "Vložte text do chatu a přidejte pokyn, například: 'Vysvětli mi tento text jednoduše. Co z toho pro mě vyplývá?'",
          "Pokud vám něco stále není jasné, ptejte se dál: 'Co přesně znamená odstavec 3?' nebo 'Musím něco udělat do určitého termínu?'",
        ],
        en:[
          "Go to claude.ai — Claude is the best for analyzing texts and documents",
          "Copy the text you want explained (or upload PDF — the paperclip icon next to the text field)",
          "Paste text into chat and add an instruction, e.g.: 'Explain this text simply. What does it mean for me?'",
          "If something's still unclear, keep asking: 'What exactly does paragraph 3 mean?' or 'Do I need to do anything by a deadline?'",
        ],
      },
      tip:{cs:"Claude zvládne nahrané PDF i Word dokumenty. Klikněte na ikonku sponky vedle textového pole a soubor nahrajte přímo — nemusíte text opisovat.",en:"Claude handles uploaded PDFs and Word documents. Click the paperclip icon next to the text field and upload the file directly — no need to retype."},
    },
    {
      task:{cs:"Překlad textu",en:"Text translation"},icon:"—",
      url:"https://www.deepl.com",
      urlLabel:{cs:"Otevřít DeepL",en:"Open DeepL"},
      desc:{cs:"Přeložte texty rychle a kvalitně. Pro jednoduché dokumenty je DeepL nejrychlejší, pro delší texty s kontextem je lepší ChatGPT nebo Claude.",en:"Translate texts quickly and accurately. For simple documents DeepL is fastest, for longer texts with context ChatGPT or Claude is better."},
      recommended:["DeepL (zdarma)","ChatGPT","Claude"],
      steps:{
        cs:[
          "Pro rychlý překlad: jděte na deepl.com — je zdarma do 5 000 znaků najednou, bez registrace",
          "Vložte text vlevo, vyberte cílový jazyk vpravo — překlad se ukáže okamžitě",
          "Pro delší nebo odborné texty (smlouvy, manuály): použijte Claude nebo ChatGPT a napište: 'Přelož tento text do češtiny. Jde o právní dokument — terminologii zachovej přesně.'",
          "Přeložený text zkopírujte tlačítkem vpravo nahoře",
        ],
        en:[
          "For quick translation: go to deepl.com — free up to 5,000 characters at once, no registration",
          "Paste text on the left, select target language on the right — translation appears immediately",
          "For longer or technical texts (contracts, manuals): use Claude or ChatGPT and type: 'Translate this text to English. It's a legal document — keep terminology precise.'",
          "Copy the translated text using the button in the top right",
        ],
      },
      tip:{cs:"DeepL je zdarma do 5 000 znaků. Potřebujete přeložit celý dokument (Word, PDF)? Nahrajte ho přímo na deepl.com — zdarma 3 dokumenty měsíčně.",en:"DeepL is free up to 5,000 characters. Need to translate a whole document (Word, PDF)? Upload it directly on deepl.com — 3 documents free per month."},
    },
    {
      task:{cs:"Učení nového tématu",en:"Learning a new topic"},icon:"—",
      url:"https://notebooklm.google.com",
      urlLabel:{cs:"Otevřít NotebookLM",en:"Open NotebookLM"},
      desc:{cs:"Nahrajte vlastní materiály (skripta, knihy, články) a AI vám z nich udělá shrnutí, testové otázky nebo dokonce podcast. Zdarma od Googlu.",en:"Upload your own materials (notes, books, articles) and AI creates summaries, test questions or even a podcast from them. Free from Google."},
      recommended:["NotebookLM","Claude","ChatGPT"],
      steps:{
        cs:[
          "Jděte na notebooklm.google.com — přihlaste se Google účtem (je zdarma)",
          "Klikněte na '+ Nový notebook' a pak '+ Přidat zdroj'",
          "Nahrajte PDF nebo Word soubor, vložte odkaz na YouTube video, nebo zkopírujte text — NotebookLM ho načte",
          "V chatovém okně vpravo se ptejte: 'Shrň klíčové body', 'Vysvětli mi pojem X', nebo 'Vytvoř 10 otázek na test'",
          "Bonus: klikněte na 'Audio Overview' — AI vygeneruje 10–15minutový podcast kde dva hlasy diskutují váš materiál",
        ],
        en:[
          "Go to notebooklm.google.com — sign in with Google account (free)",
          "Click '+ New notebook' then '+ Add source'",
          "Upload PDF or Word file, paste a YouTube link, or copy text — NotebookLM loads it",
          "In the chat window on the right ask: 'Summarize key points', 'Explain concept X', or 'Create 10 test questions'",
          "Bonus: click 'Audio Overview' — AI generates a 10–15 minute podcast where two voices discuss your material",
        ],
      },
      tip:{cs:"NotebookLM 'vidí' jen váš nahraný obsah — nikdy nevymyslí informaci z internetu. Každá odpověď odkazuje na konkrétní místo ve vašem dokumentu. Ideální pro studium.",en:"NotebookLM 'sees' only your uploaded content — never makes up information from the internet. Each answer references the specific place in your document. Ideal for studying."},
    },
    {
      task:{cs:"Hledání aktuálních informací",en:"Finding current information"},icon:"—",
      url:"https://www.perplexity.ai",
      urlLabel:{cs:"Otevřít Perplexity",en:"Open Perplexity"},
      desc:{cs:"Potřebujete aktuální fakta, novinky nebo ověřit informaci? Perplexity a Gemini prohledávají internet a vždy ukáží odkaz na zdroj.",en:"Need current facts, news or to verify information? Perplexity and Gemini search the internet and always show a source link."},
      recommended:["Perplexity (zdarma)","Gemini"],
      steps:{
        cs:[
          "Jděte na perplexity.ai — základní verze je zdarma bez registrace",
          "Napište svůj dotaz přirozenou češtinou, například: 'Jaké jsou aktuální úrokové sazby hypoték v ČR?' nebo 'Co se stalo s firmou XY?'",
          "Perplexity zobrazí odpověď a vedle každé informace číslo — kliknutím zjistíte zdroj",
          "Alternativa: gemini.google.com — také prohledává web, navíc se propojí s vaším Google účtem",
        ],
        en:[
          "Go to perplexity.ai — basic version is free without registration",
          "Type your query in natural language, e.g.: 'What are current mortgage interest rates?' or 'What happened to company XY?'",
          "Perplexity shows the answer and a number next to each fact — click it to see the source",
          "Alternative: gemini.google.com — also searches the web, plus connects to your Google account",
        ],
      },
      tip:{cs:"Claude a ChatGPT bez internetu mohou mít zastaralá data (jejich znalosti mají datum cutoff). Pro aktuální zprávy, ceny, kurzy a novinky vždy použijte Perplexity nebo Gemini.",en:"Claude and ChatGPT without internet may have outdated data (their knowledge has a cutoff date). For current news, prices, rates and recent events always use Perplexity or Gemini."},
    },
    {
      task:{cs:"Generování obrázků",en:"Image generation"},icon:"—",
      url:"https://nanobananapro.com",
      urlLabel:{cs:"Otevřít Nano Banana",en:"Open Nano Banana"},
      desc:{cs:"Popište obrázek česky a AI ho vygeneruje za pár sekund. Nano Banana Pro je nejjednodušší a nejrychlejší volba — bez registrace.",en:"Describe an image in your language and AI generates it in seconds. Nano Banana Pro is the simplest and fastest option — no registration needed."},
      recommended:["Nano Banana Pro","ChatGPT (placený)"],
      steps:{
        cs:[
          "Jděte na nanobananapro.com — není potřeba registrace ani platební karta",
          "Do textového pole napište popis obrázku česky, například: 'Fotografie kávy v bílém šálku na dřevěném stole, ranní světlo z okna, útulná kavárna'",
          "Klikněte na tlačítko generovat — obrázek je hotový za 10–20 sekund",
          "Líbí se? Stáhněte ho kliknutím pravým tlačítkem → 'Uložit obrázek jako...'",
          "Nechce se to? Upravte popis a generujte znovu — každé zadání dá jiný výsledek",
        ],
        en:[
          "Go to nanobananapro.com — no registration or payment card needed",
          "Type an image description, e.g.: 'Photo of coffee in a white cup on a wooden table, morning light from the window, cozy café'",
          "Click the generate button — image is ready in 10–20 seconds",
          "Like it? Download by right-clicking → 'Save image as...'",
          "Not happy? Tweak the description and generate again — every prompt gives a different result",
        ],
      },
      tip:{cs:"Čím konkrétnější popis, tím lepší výsledek. Zkuste přidat: styl ('jako olejomalba', 'fotorealistické'), náladu ('teplé světlo', 'dramatické stíny') nebo místo ('v pražské kavárně').",en:"The more specific the description, the better the result. Try adding: style ('like an oil painting', 'photorealistic'), mood ('warm light', 'dramatic shadows') or location ('in a Prague café')."},
    },
  ],
  intermediate:[
    {task:{cs:"Profesionální generování obrázků",en:"Professional image generation"},icon:"—",
     url:"https://midjourney.com",
     urlLabel:{cs:"Otevřít Midjourney",en:"Open Midjourney"},
     desc:{cs:"Midjourney generuje fotografie a ilustrace v profesionální kvalitě. Výsledky jsou výrazně lepší než u bezplatných nástrojů — používají ho grafici, marketéři i filmaři. Není zdarma.",en:"Midjourney generates photos and illustrations in professional quality. Results are significantly better than free tools — used by designers, marketers and filmmakers. Not free."},
     recommended:["Midjourney (placený)","Nano Banana Pro (zdarma)"],
     steps:{
       cs:[
         "Jděte na midjourney.com a zaregistrujte se — Midjourney není zdarma, vyžaduje placený účet",
         "Midjourney funguje dvěma způsoby: přímo na webu midjourney.com (jednodušší) nebo přes Discord. Discord je chatovací aplikace — pokud ji neznáte, použijte web",
         "Na webu klikněte na 'Create' a do pole napište popis obrázku anglicky. Prompt má strukturu: CO chcete vidět → styl → nálada → formát",
         "Příklad hotového promptu: 'portrait of a woman drinking coffee in a Prague café, warm morning light, film photography style, shallow depth of field --ar 3:2 --v 7' — --ar je poměr stran (3:2 = fotografie), --v 7 je verze Midjourney",
         "Tip: nevíte jak prompt napsat? Otevřete Claude a napište: 'Napiš mi Midjourney prompt pro: [popište česky co chcete]' — Claude vám celý prompt vygeneruje",
       ],
       en:[
         "Go to midjourney.com and sign up — Midjourney is not free, requires a paid account",
         "Midjourney works two ways: directly on midjourney.com (simpler) or through Discord. Discord is a chat app — if you don't know it, use the website",
         "On the website click 'Create' and type your image description in English. Prompt structure: WHAT you want to see → style → mood → format",
         "Example finished prompt: 'portrait of a woman drinking coffee in a Prague café, warm morning light, film photography style, shallow depth of field --ar 3:2 --v 7' — --ar is aspect ratio (3:2 = photo), --v 7 is Midjourney version",
         "Tip: not sure how to write a prompt? Open Claude and type: 'Write me a Midjourney prompt for: [describe in plain language what you want]' — Claude generates the whole prompt",
       ],
     },
     tip:{cs:"Nejčastější chyba: popis v češtině. Midjourney rozumí anglicky mnohem lépe. Napište popis česky Claudovi a on vám ho přeloží do správného formátu pro Midjourney.",en:"Most common mistake: description in your language. Midjourney understands English much better. Write description in your language to Claude and it translates it into the right Midjourney format."},
    },
    {task:{cs:"Tvorba videí s AI",en:"AI video creation"},icon:"—",
     url:"https://runwayml.com",
     urlLabel:{cs:"Otevřít Runway",en:"Open Runway"},
     desc:{cs:"AI dokáže vygenerovat krátké video z fotografie nebo textového popisu. Hodí se na obsah pro Instagram, TikTok nebo YouTube — například animovaný záběr produktu, pozadí za mluvícím člověkem nebo krátká scéna bez kamery.",en:"AI can generate short videos from a photo or text description. Great for Instagram, TikTok or YouTube content — animated product shot, background behind a speaker, or a short scene without a camera."},
     recommended:["Runway","Kling","Higgsfield","Sora"],
     steps:{
       cs:[
         "Nejjednodušší způsob: jděte na runwayml.com a zaregistrujte se — základní verze je zdarma s omezeným počtem generací",
         "Klikněte na 'Image to Video' — tato funkce vezme vaši fotku a zanimuje ji (např. vlasy se pohybují ve větru, káva se kouří, auto projíždí ulicí)",
         "Nahrajte fotku a do textového pole popište pohyb: 'vlasy se pomalu pohybují ve větru, jemný pohyb kamery doleva' — čím konkrétnější, tím lepší výsledek",
         "Klikněte Generate — video trvá 30–60 sekund na zpracování",
         "Výsledek se vám nelíbí? Nevadí — klikněte Generate znovu se stejným nebo upraveným popisem. Každé generování dá jiný výsledek. Většina lidí generuje 3–5× než najde ten správný",
         "Alternativy: Kling (kling.ai) — velmi realistické pohyby, oblíbený pro portréty. Higgsfield (higgsfield.ai) — umí otestovat více nástrojů najednou a porovnat výsledky",
       ],
       en:[
         "Easiest way: go to runwayml.com and sign up — basic version is free with limited generations",
         "Click 'Image to Video' — this takes your photo and animates it (e.g. hair moves in wind, coffee steams, car drives down street)",
         "Upload a photo and describe the motion in the text box: 'hair slowly moves in the wind, gentle camera pan left' — more specific = better result",
         "Click Generate — video takes 30–60 seconds to process",
         "Don't like the result? No problem — click Generate again with the same or adjusted description. Each generation gives a different result. Most people generate 3–5 times before finding the right one",
         "Alternatives: Kling (kling.ai) — very realistic motion, popular for portraits. Higgsfield (higgsfield.ai) — can test multiple tools at once and compare results",
       ],
     },
     tip:{cs:"Nejčastější chyba: příliš vágní popis pohybu. Místo 'pohybující se video' napište konkrétně: 'kamera se pomalu přibližuje k obličeji, vlasy se lehce pohybují, pozadí je rozostřené'. AI potřebuje přesné instrukce.",en:"Most common mistake: too vague motion description. Instead of 'moving video' write specifically: 'camera slowly zooms toward face, hair moves slightly, background is blurred'. AI needs precise instructions."},
    },
    {task:{cs:"Generování hlasu — ElevenLabs",en:"Voice generation — ElevenLabs"},icon:"—",
     url:"https://elevenlabs.io",
     urlLabel:{cs:"Otevřít ElevenLabs",en:"Open ElevenLabs"},
     desc:{cs:"ElevenLabs přemění psaný text na mluvené slovo — realistickým hlasem, ne roboticky. Hodí se na: komentář k videu, audioknihu, hlasový průvodce v aplikaci, nebo dabování obsahu do jiného jazyka. Základní verze je zdarma (10 000 znaků měsíčně).",en:"ElevenLabs turns written text into spoken audio — with a realistic voice, not robotic. Great for: video voiceover, audiobook, voice guide in an app, or dubbing content into another language. Basic version is free (10,000 characters per month)."},
     recommended:["ElevenLabs"],
     steps:{
       cs:[
         "Jděte na elevenlabs.io a zaregistrujte se — základní plán je zdarma",
         "Klikněte na 'Text to Speech' v levém menu",
         "Vyberte hlas z knihovny (stovky hlasů) — nebo klikněte na 'Voice Design' a popište hlas přirozeně: 'klidný ženský hlas, profesionální, mírně pomalejší tempo'",
         "Vložte text do pole a klikněte na šipku (generovat) — audio je hotové za pár sekund",
         "Stáhněte výsledek tlačítkem 'Download' nebo rovnou zkopírujte odkaz",
         "Chcete naklonovat vlastní hlas? Klikněte na 'Voices' → 'Add Voice' → 'Instant Voice Cloning'. Nahrajte nahrávku svého hlasu (alespoň 1 minuta čistého záznamu bez hudby nebo šumu na pozadí) a pojmenujte ji",
       ],
       en:[
         "Go to elevenlabs.io and sign up — basic plan is free",
         "Click 'Text to Speech' in the left menu",
         "Choose a voice from the library (hundreds of voices) — or click 'Voice Design' and describe naturally: 'calm female voice, professional, slightly slower pace'",
         "Paste text into the field and click the arrow (generate) — audio is ready in a few seconds",
         "Download the result with the 'Download' button or copy the link directly",
         "Want to clone your own voice? Click 'Voices' → 'Add Voice' → 'Instant Voice Cloning'. Upload a recording of your voice (at least 1 minute of clean audio without music or background noise) and name it",
       ],
     },
     tip:{cs:"Zdarma dostanete 10 000 znaků měsíčně — to je přibližně 7 minut mluveného slova. Na otestování nebo kratší videa to bohatě stačí. Placený plán od $5/měs odemkne více znaků a klonování hlasu.",en:"Free gives you 10,000 characters per month — roughly 7 minutes of spoken audio. Plenty for testing or short videos. Paid plan from $5/mo unlocks more characters and voice cloning."},
    },
    {task:{cs:"Generování hudby — Suno",en:"Music generation — Suno"},icon:"—",
     url:"https://suno.ai",
     urlLabel:{cs:"Otevřít Suno",en:"Open Suno"},
     desc:{cs:"Suno vygeneruje celou skladbu s vokálem z textového popisu — za 30 sekund. Hodí se na: hudební podkres do videa, reklamní jingle, nebo jen pro zábavu. Základní verze zdarma.",en:"Suno generates a complete song with vocals from a text description — in 30 seconds. Great for: background music for video, ad jingle, or just for fun. Basic version is free."},
     recommended:["Suno"],
     steps:{
       cs:[
         "Jděte na suno.ai — přihlaste se přes Google nebo Discord účet, základní plán je zdarma",
         "Na hlavní stránce najdete textové pole — napište popis skladby. Příklad: 'veselá česká lidová píseň o jaru, akustická kytara, ženský hlas'",
         "Klikněte na 'Create' — Suno vygeneruje 2 varianty skladby najednou, každá trvá asi 30 sekund zpracování",
         "Poslechněte si obě varianty — líbí se vám jedna? Klikněte na tři tečky a 'Download' pro stažení jako MP3",
         "Chcete mít nad skladbou větší kontrolu? Klikněte na 'Custom mode' — tam můžete napsat vlastní text písně a přesněji určit styl",
       ],
       en:[
         "Go to suno.ai — sign in with Google or Discord, basic plan is free",
         "On the main page find the text field — write a song description. Example: 'happy folk song about spring, acoustic guitar, female vocals'",
         "Click 'Create' — Suno generates 2 song variants at once, each takes about 30 seconds to process",
         "Listen to both variants — like one? Click the three dots and 'Download' to save as MP3",
         "Want more control? Click 'Custom mode' — there you can write your own song lyrics and specify the style more precisely",
       ],
     },
     tip:{cs:"Suno zdarma dává 50 generací denně — každá generace = 2 skladby. Na zkoušení je to víc než dost. Výsledky jsou autorsky chráněné Sunem pokud máte zdarma plán — pro komerční použití potřebujete placený plán.",en:"Suno free gives 50 generations per day — each generation = 2 songs. More than enough for experimenting. Results are copyright-protected by Suno on the free plan — for commercial use you need a paid plan."},
    },
    {task:{cs:"Tvorba webu nebo aplikace (bez kódu)",en:"Website or app creation (no code)"},icon:"—",
     url:"https://bolt.new",
     urlLabel:{cs:"Otevřít Bolt",en:"Open Bolt"},
     desc:{cs:"Popíšete co chcete vytvořit a AI za vás napíše celý web nebo jednoduchou aplikaci — bez nutnosti znát programování. Výsledek si rovnou prohlédnete v prohlížeči a sdílíte jako odkaz. Bolt a v0 jsou zdarma pro základní použití.",en:"Describe what you want to create and AI writes the whole website or simple app for you — no coding knowledge needed. You see the result immediately in the browser and can share it as a link. Bolt and v0 are free for basic use."},
     recommended:["Bolt.new","v0 (Vercel)","Lovable"],
     steps:{
       cs:[
         "Jděte na bolt.new — základní verze je zdarma, není potřeba nic instalovat, vše běží v prohlížeči",
         "Do textového pole napište co chcete vytvořit — pište jako byste to zadávali grafickému designérovi. Příklad: 'Vytvoř jednoduchou landing page pro moje fotografické studio. Tmavý design, elegantní. Nahoře velká fotka, pod ní seznam služeb se cenami, kontaktní formulář dole.'",
         "Bolt zobrazí výsledek živě vpravo — vidíte stránku v reálném čase jak ji AI píše",
         "Chcete něco změnit? Napište do chatu: 'Změň barvu tlačítek na zlatou' nebo 'Přidej sekci s referencemi od klientů' — AI zapracuje úpravy okamžitě",
         "Výsledek sdílíte jako odkaz (tlačítko Share) nebo si stáhnete kód (tlačítko Download) pokud chcete stránku nahrát na vlastní hosting",
         "Alternativa pro samotné komponenty (jen část stránky): v0.dev — tam popisujete konkrétní prvek, např. 'Vytvoř přihlašovací formulář s polem na email a heslo'",
       ],
       en:[
         "Go to bolt.new — basic version is free, nothing to install, everything runs in the browser",
         "Type what you want to create — write as if briefing a graphic designer. Example: 'Create a simple landing page for my photography studio. Dark design, elegant. Large photo at top, service list with prices below, contact form at the bottom.'",
         "Bolt shows the result live on the right — you see the page in real time as AI writes it",
         "Want to change something? Type in the chat: 'Change button color to gold' or 'Add a client testimonials section' — AI applies changes immediately",
         "Share the result as a link (Share button) or download the code (Download button) if you want to upload the page to your own hosting",
         "Alternative for individual components (just one part of a page): v0.dev — describe a specific element, e.g. 'Create a login form with email and password fields'",
       ],
     },
     tip:{cs:"Čím konkrétnější popis, tím lepší výsledek. Nezapomeňte zmínit: jaký typ stránky (portfolio, e-shop, landing page), jaký styl (tmavý/světlý, minimalistický/barevný) a co na ní má být. AI není věštec — řekněte mu přesně co chcete.",en:"The more specific the description, the better the result. Don't forget to mention: what type of page (portfolio, shop, landing page), what style (dark/light, minimal/colorful) and what should be on it. AI isn't a mind reader — tell it exactly what you want."},
    },
    {task:{cs:"Automatizace — Make (propojení aplikací)",en:"Automation — Make (connecting apps)"},icon:"—",
     url:"https://make.com",
     urlLabel:{cs:"Otevřít Make",en:"Open Make"},
     desc:{cs:"Automatizace znamená: nastavíte jednou, pak to funguje samo. Příklad: každý nový email od klienta se automaticky uloží do tabulky. Nebo: každé pondělí se vám vygeneruje týdenní přehled. Make je vizuální nástroj kde propojujete aplikace klikáním — žádné programování. Základní plán je zdarma.",en:"Automation means: set it up once, then it runs by itself. Example: every new email from a client automatically saves to a spreadsheet. Or: every Monday a weekly summary generates itself. Make is a visual tool where you connect apps by clicking — no programming. Basic plan is free."},
     recommended:["Make (Integromat)","Manus","n8n"],
     steps:{
       cs:[
         "Nejdřív pochopte rozdíl: běžná AI (Claude, ChatGPT) odpovídá na vaše otázky. AI agent pracuje samostatně — sám čte emaily, sám rozhoduje co s nimi udělat, sám vyplňuje tabulku. Vy jen zkontrolujete výsledek.",
         "Jděte na make.com a zaregistrujte se — základní plán zdarma zahrnuje 1 000 automatizovaných akcí měsíčně",
         "Klikněte na 'Create a new scenario' — uvidíte prázdné plátno kde budujete svůj automatický proces",
         "Nejjednodušší první automatizace pro začátečníka: Gmail → Google Sheets. Klikněte na '+', vyberte Gmail, zvolte 'Watch emails' (hlídej nové emaily). Přidejte druhý blok: Google Sheets, zvolte 'Add a row' (přidej řádek). Propojte je. Teď se každý nový email uloží do vaší tabulky.",
         "Chcete přidat AI? Mezi Gmail a Sheets přidejte blok 'Claude' nebo 'ChatGPT'. Nastavte instrukci: 'Přečti tento email a napiš mi jednovětové shrnutí.' Výsledek se uloží do tabulky vedle emailu.",
         "Hotové šablony: klikněte na 'Templates' — najdete stovky hotových automatizací. Hledejte např. 'Gmail to Google Sheets' nebo 'Save email attachments to Drive'",
         "Další nástroje: Manus (manus.im) — AI agent který běží sám přímo na vašem zařízení, Zapier (zapier.com) — podobný Make, více integrací, n8n (n8n.io) — open-source varianta pro technicky zdatnější",
       ],
       en:[
         "First understand the difference: regular AI (Claude, ChatGPT) answers your questions. An AI agent works independently — reads emails on its own, decides what to do with them, fills in the spreadsheet itself. You just check the result.",
         "Go to make.com and sign up — basic free plan includes 1,000 automated actions per month",
         "Click 'Create a new scenario' — you'll see an empty canvas where you build your automated process",
         "Simplest first automation for beginners: Gmail → Google Sheets. Click '+', select Gmail, choose 'Watch emails'. Add second block: Google Sheets, choose 'Add a row'. Connect them. Now every new email saves to your spreadsheet.",
         "Want to add AI? Between Gmail and Sheets add a 'Claude' or 'ChatGPT' block. Set the instruction: 'Read this email and write me a one-sentence summary.' The result saves to the spreadsheet next to the email.",
         "Ready-made templates: click 'Templates' — hundreds of ready automations. Search e.g. 'Gmail to Google Sheets' or 'Save email attachments to Drive'",
         "Other tools: Manus (manus.im) — AI agent that runs independently directly on your device, Zapier (zapier.com) — similar to Make, more integrations, n8n (n8n.io) — open-source option for more technical users",
       ],
     },
     tip:{cs:"Rozdíl mezi AI a AI agentem jednoduše: AI = ptáte se, dostanete odpověď. AI agent = řeknete co chcete dosáhnout, agent to sám udělá (přečte emaily, vyplní tabulku, pošle odpověď). Make vám umožní postavit takového agenta bez programování — propojujete bloky jako LEGO.",en:"Difference between AI and AI agent simply: AI = you ask, you get an answer. AI agent = you say what you want to achieve, agent does it itself (reads emails, fills spreadsheet, sends reply). Make lets you build such an agent without coding — you connect blocks like LEGO."},
    },
    {task:{cs:"Tvorba tabulek a prezentací",en:"Creating spreadsheets and presentations"},icon:"—",
     url:"https://claude.ai",
     urlLabel:{cs:"Otevřít Claude",en:"Open Claude"},
     desc:{cs:"AI pomůže vytvořit tabulku v Excelu nebo Google Sheets, navrhnout strukturu prezentace nebo napsat texty na slidy. Ušetříte hodiny formátování a přemýšlení co kam dát.",en:"AI helps create a spreadsheet in Excel or Google Sheets, design a presentation structure or write slide texts. Save hours of formatting and thinking about what goes where."},
     recommended:["Claude","ChatGPT","Google Slides AI"],
     steps:{
       cs:[
         "── TABULKY (Excel / Google Sheets) ──",
         "Pro jednoduchou tabulku: jděte na claude.ai a napište: 'Vytvoř tabulku v Excelu pro [co chcete sledovat]. Sloupce: [vyjmenujte co chcete mít]. Přidej vzorce pro [součty / průměry / podmínky].'\nClaude napíše tabulku jako text nebo přímo jako CSV soubor ke stažení.",
         "Pro složitější tabulku s daty: nahrajte existující Excel nebo CSV přímo do Claude (ikona sponky) a napište: 'Přidej sloupec který vypočítá [co]. Zvýrazni řádky kde [podmínka]. Udělej kontingenční tabulku podle [sloupec].'",
         "Google Sheets má vlastní AI — klikněte na buňku a napište = a pak popis v češtině. Nebo použijte Extensions → Apps Script pro automatizaci.",
         "── TVORBA Z VAŠICH MATERIÁLŮ ──",
         "Máte smlouvu, report, zápisky ze schůzky nebo PDF a chcete z toho tabulku nebo prezentaci? Nahrajte soubor přímo do Claude (ikona sponky vedle textového pole) a napište:\n\nZ dokumentu do tabulky: 'Z tohoto dokumentu vytvoř tabulku. Sloupce: [co chcete sledovat]. Přidej řádek pro každou [položku / osobu / termín].'\n\nZ dokumentu do prezentace: 'Z tohoto dokumentu vytvoř strukturu prezentace. 8 slidů. Každý slide: nadpis + 3 odrážky. Přidej poznámky pro přednášejícího.'\n\nZ zápisků do přehledu: 'Z těchto zápisků ze schůzky vytvoř přehlednou tabulku: Úkol | Kdo zodpovídá | Termín | Stav'\n\nZ dat do grafu: 'Z těchto čísel navrhni jak udělat graf v Excelu. Jaký typ grafu by byl nejlepší a proč?'\n\nClaude zvládne: PDF, Word, Excel, zápisky v textu, emaily, výroční zprávy, faktury — cokoliv nahrajete.",
         "Struktura a texty: jděte na claude.ai a napište: 'Navrhni strukturu prezentace na téma [téma] pro [koho]. Počet slidů: [číslo]. Na každý slide napiš: nadpis, 3–4 odrážky a poznámku pro přednášejícího.'",
         "Vizuální design: texty od Clauda zkopírujte do Canvy (canva.com → Prezentace) — má stovky šablon a AI navrhne rozložení automaticky. Nebo do Google Slides kde klikněte na Nástroje → Pomoc od AI.",
         "Gamma (gamma.app): nejjednodušší cesta — napište téma a Gamma sama vytvoří celou vizuální prezentaci včetně designu. Zdarma s limitem.",
       ],
       en:[
         "── SPREADSHEETS (Excel / Google Sheets) ──",
         "For a simple spreadsheet: go to claude.ai and type: 'Create a spreadsheet in Excel for [what you want to track]. Columns: [list what you want]. Add formulas for [totals / averages / conditions].'\nClaude writes the spreadsheet as text or directly as a CSV file to download.",
         "For a more complex spreadsheet with data: upload existing Excel or CSV directly to Claude (paperclip icon) and type: 'Add a column that calculates [what]. Highlight rows where [condition]. Make a pivot table by [column].'",
         "Google Sheets has its own AI — click a cell and type = then a description in plain language. Or use Extensions → Apps Script for automation.",
         "── PRESENTATIONS (PowerPoint / Google Slides) ──",
         "Structure and texts: go to claude.ai and type: 'Design a presentation structure on topic [topic] for [who]. Number of slides: [number]. For each slide write: heading, 3–4 bullet points and a speaker note.'",
         "Visual design: copy texts from Claude into Canva (canva.com → Presentations) — has hundreds of templates and AI suggests layout automatically. Or into Google Slides where you click Tools → Help me organize.",
         "Gamma (gamma.app): simplest path — write the topic and Gamma creates the entire visual presentation including design. Free with limit.",
       ],
     },
     tip:{cs:"Největší časová úspora: nechte Claude navrhnout strukturu a napsat texty, pak teprve otevřete PowerPoint nebo Canvu a přidejte vizuální stránku. Nepište texty a nedesignujte zároveň — mozek to dělá špatně.",en:"Biggest time saver: let Claude suggest structure and write texts, then open PowerPoint or Canva and add the visual side. Don't write texts and design at the same time — the brain is bad at both simultaneously."},
    },
    {task:{cs:"Obsah na sociální sítě",en:"Social media content"},icon:"—",
     url:"https://claude.ai",
     urlLabel:{cs:"Otevřít Claude",en:"Open Claude"},
     desc:{cs:"AI vám pomůže napsat příspěvky na LinkedIn, Instagram nebo TikTok — navrhne strukturu, text i vizuální koncepty. Nemusíte vymýšlet co napsat od nuly.",en:"AI helps you write posts for LinkedIn, Instagram or TikTok — suggests structure, text and visual concepts. No need to come up with content from scratch."},
     recommended:["Claude","ChatGPT","Canva (canva.com)"],
     steps:{
       cs:[
         "LINKEDIN POST — jděte na claude.ai a napište: 'Napiš LinkedIn příspěvek o [téma]. Začni jednou větou která zaujme (to je tzv. hook — první věta která přiměje lidi číst dál). Pak vysvětli proč je to důležité. Na konci přidej otázku pro čtenáře.' LinkedIn příspěvky bez háčku na začátku nikdo nečte.",
         "CTA = výzva k akci (Call To Action) — je to věta na konci příspěvku která říká čtenáři co má udělat. Příklady: 'Napište do komentářů jak to řešíte vy', 'Sdílejte s někým komu by to pomohlo', 'Sledujte mě pro více tipů'",
         "INSTAGRAM CAROUSEL (série obrázků kde se swipuje) — Claude Artifacts je funkce v Claude.ai kde AI může vytvořit vizuální obsah přímo v chatu. Jděte na claude.ai, napište: 'Vytvoř Instagram carousel o [téma] — 7 slidů. První slid: šokující tvrzení nebo číslo. Prostřední slidy: tipy. Poslední slid: co mají udělat.' Claude vygeneruje celý vizuální carousel přímo v chatu — udělejte screenshot každého slidu.",
         "TIKTOK / REELS SKRIPT — napište Claudovi: 'Napiš skript pro 60sekundové video o [téma]. Styl: vzdělávací a přímý. Každá věta na nový řádek — budu číst z papíru.'",
         "CANVA AI — jděte na canva.com a přihlaste se (zdarma). Klikněte na 'Vytvořit návrh' a vyberte formát (Instagram post, LinkedIn banner...). V pravém panelu najdete tlačítko 'Magic Write' nebo 'AI' — vložte téma a Canva navrhne text i vizuální design automaticky.",
       ],
       en:[
         "LINKEDIN POST — go to claude.ai and type: 'Write a LinkedIn post about [topic]. Start with one sentence that grabs attention (that's called a hook — the first sentence that makes people keep reading). Then explain why it matters. End with a question for readers.'",
         "CTA = Call To Action — a sentence at the end of the post telling readers what to do. Examples: 'Write in the comments how you handle it', 'Share with someone who'd find this helpful', 'Follow me for more tips'",
         "INSTAGRAM CAROUSEL (series of images you swipe through) — Claude Artifacts is a feature in Claude.ai where AI can create visual content directly in the chat. Go to claude.ai, type: 'Create an Instagram carousel about [topic] — 7 slides. First slide: shocking claim or number. Middle slides: tips. Last slide: what they should do.' Claude generates the whole visual carousel in chat — screenshot each slide.",
         "TIKTOK / REELS SCRIPT — type to Claude: 'Write a script for a 60-second video about [topic]. Style: educational and direct. Each sentence on a new line — I'll read from paper.'",
         "CANVA AI — go to canva.com and sign in (free). Click 'Create a design' and choose format (Instagram post, LinkedIn banner...). In the right panel find 'Magic Write' or 'AI' button — enter your topic and Canva suggests text and visual design automatically.",
       ],
     },
     tip:{cs:"Nejlepší postup: nejdřív si v Claudovi napište text příspěvku. Pak jděte do Canvy a přidejte vizuální stránku. AI za vás zvládne obojí — ale každý nástroj je lepší na něco jiného: Claude na text, Canva na vzhled.",en:"Best approach: first write the post text in Claude. Then go to Canva and add the visual side. AI handles both for you — but each tool is better at something different: Claude for text, Canva for looks."},
    },
  ],
  advanced:[
    {task:{cs:"Vývoj aplikací — Vibe Coding",en:"App development — Vibe Coding"},icon:"—",
     url:"https://bolt.new",
     urlLabel:{cs:"Začít v Bolt.new",en:"Start in Bolt.new"},
     desc:{cs:"Vibe Coding = popisujete co chcete vytvořit přirozenou řečí a AI napíše celý kód za vás. Nemusíte rozumět programování. Výsledkem je funkční web nebo aplikace — ne jen mockup.",en:"Vibe Coding = describe what you want to create in plain language and AI writes all the code for you. No programming knowledge needed. The result is a working website or app — not just a mockup."},
     recommended:["Bolt.new","Cursor","Claude Code"],
     steps:{
       cs:[
         "── CESTA 1: Nevývojář (nechcete se učit kódovat) ──",
         "Jděte na bolt.new — popište svoji aplikaci nebo web česky: 'Chci vytvořit web pro mé fotografické studio s galérií fotek, ceníkem a kontaktním formulářem. Tmavý elegantní design.'",
         "Bolt postaví celou aplikaci v prohlížeči — vidíte živý výsledek vpravo. Chcete změnu? Napište do chatu: 'Přidej sekci s referencemi' nebo 'Změň barvu tlačítek na zlatou'",
         "Hotovou stránku sdílíte jako odkaz nebo stáhnete — žádná instalace není potřeba. Chcete stránku opravdu spustit online? Klikněte na 'Deploy' v Bolt.new — nasadí ji automaticky na Netlify nebo Vercel (hosting = server kde váš web žije). Dostanete vlastní odkaz který funguje pro kohokoliv. Pro vlastní doménu (např. mojefirma.cz) si ji kupte na Wedos.cz nebo Namecheap.com za ~300 Kč/rok a v nastavení ji propojte s Netlify.",
         "── CESTA 2: Vývojář (kódujete ale chcete AI jako parťáka) ──",
         "Claude Code je AI přímo v terminálu (příkazová řádka = okno kde píšete příkazy počítači). Nainstalujete ho příkazem: npm install -g @anthropic/claude-code",
         "V projektu napište /init — Claude prozkoumá vaše soubory a vytvoří dva pomocné dokumenty: ARCHITECTURE.md (přehled jak je projekt postavený) a CLAUDE.md (vaše coding standardy a pravidla). Tyto soubory Claude čte před každou změnou, aby věděl kontext",
         "Claude Skills: v složce ~/.claude/skills/ si vytvoříte .md soubory s instrukcemi pro opakované úkoly — např. 'brand-voice.md' říká Claudovi jak psát texty ve vašem stylu, nebo 'seo-checklist.md' co kontrolovat u každého článku",
         "Cursor je VS Code editor (program pro psaní kódu) s vestavěnou AI. Cmd+K = opravit nebo přepsat konkrétní část kódu přirozenou řečí. Cmd+L = chat který vidí celý váš projekt",
         "/clear použijte když Claude začne dávat horší odpovědi v delším sezení — smaže historii konverzace a znovu se soustředí",
         "Antigravity + Claude Code: Antigravity je bezplatná Chrome rozšíření od Googlu která nainstaluje Claude Code přímo do prohlížeče jako coding asistenta. Dobrý start pokud chcete vyzkoušet Claude Code bez plného nastavení terminálu.",
       ],
       en:[
         "── PATH 1: Non-developer (don't want to learn coding) ──",
         "Go to bolt.new — describe your app or website: 'I want to create a website for my photography studio with a photo gallery, price list and contact form. Dark elegant design.'",
         "Bolt builds the entire app in the browser — you see the live result on the right. Want a change? Type in chat: 'Add a testimonials section' or 'Change button color to gold'",
         "Share the finished page as a link or download it — no installation needed",
         "── PATH 2: Developer (you code but want AI as a partner) ──",
         "Claude Code is AI directly in the terminal. Install it with: npm install -g @anthropic/claude-code",
         "In your project type /init — Claude explores your files and creates two helper documents: ARCHITECTURE.md (overview of how the project is built) and CLAUDE.md (your coding standards and rules). Claude reads these before every change so it knows the context",
         "Claude Skills: in the ~/.claude/skills/ folder create .md files with instructions for repeated tasks — e.g. 'brand-voice.md' tells Claude how to write texts in your style",
         "Cursor is a VS Code editor with built-in AI. Cmd+K = fix or rewrite specific code in plain language. Cmd+L = chat that sees your entire project",
         "Use /clear when Claude starts giving worse answers in a longer session — clears conversation history and refocuses",
         "Antigravity (Google Antigravity) + Claude Code: Antigravity is a free extension that installs Claude Code directly into Chrome as a coding assistant. Good starting point if you want to try Claude Code without the full terminal setup.",
       ],
     },
     tip:{cs:"Nevývojář: Bolt.new je nejrychlejší start — výsledek za minuty. Vývojář: Claude Code + Cursor je nejsilnější kombinace pro vývoj s AI. Startovací stack pro aplikaci v 2026 vychází na ~$20/měs: Claude Pro + Supabase (databáze, zdarma) + Vercel (hosting, zdarma).",en:"Non-developer: Bolt.new is the fastest start — results in minutes. Developer: Claude Code + Cursor is the most powerful combination for AI-assisted development. Starting stack for an app in 2026 costs ~$20/mo: Claude Pro + Supabase (database, free) + Vercel (hosting, free)."},
    },
    {task:{cs:"Vibe Coding — web nebo aplikace: kompletní průvodce",en:"Vibe Coding — website or app: complete guide"},icon:"—",
     url:"https://bolt.new",
     urlLabel:{cs:"Otevřít Bolt.new",en:"Open Bolt.new"},
     desc:{cs:"Rychlý přehled co použít, jak začít a jak dostat výsledek online — podle toho jestli chcete web nebo funkční aplikaci.",en:"Quick guide on what to use, how to start and how to get live — depending on whether you want a website or a working app."},
     recommended:["Bolt.new","v0.dev","Lovable"],
     steps:{
       cs:[
         "── CHCI WEB (prezentace, portfolio, landing page) ──",
         "Bolt.new: nejrychlejší. Napište vše do jedné zprávy — sekce, obsah, styl, barvy. Příklad: 'Vytvoř landing page pro mé účetnictví. Sekce: Hlavní banner s CTA tlačítkem, Služby (3 karty), O mně s fotkou, Ceník, Kontakt. Styl: čistý, bílý, profesionální, modrý akcent.' Bolt stránku sestaví živě — vidíte výsledek vpravo.",
         "v0.dev: ideální když chcete jen jednu část — kontaktní formulář, cenovou tabulku nebo galerii. Popište komponentu → dostanete kód který vložíte do existující stránky.",
         "Spuštění online: klikněte 'Deploy' v Bolt.new → automaticky nahraje na Vercel nebo Netlify (hosting = server kde web žije) zdarma. Dostanete odkaz jako mujweb.vercel.app. Pro vlastní doménu (mojefirma.cz) ~300 Kč/rok na Wedos.cz — v nastavení Vercelu pak doménu propojíte.",
         "── CHCI APLIKACI (registrace, přihlášení, ukládání dat, platby) ──",
         "Lovable (lovable.dev): nejjednodušší cesta k funkční aplikaci. Popište co aplikace dělá → Lovable sestaví přihlašování, databázi i platby automaticky. Příklad: 'Chci aplikaci kde se uživatelé registrují, přidávají úkoly a označují je jako hotové. Platba přes Stripe za prémiové funkce.'",
         "Bolt.new zvládne i aplikace — přidejte do popisu: 's přihlašováním přes Google a ukládáním do databáze'. Bolt propojí Supabase (databáze, zdarma do 50 000 uživatelů) automaticky.",
         "Platby: Stripe (stripe.com) — nejjednodušší platební brána. Lovable i Bolt ho nastaví na váš pokyn: 'Přidej Stripe platby za 199 Kč/měs'.",
         "Spuštění: Lovable → tlačítko 'Publish' → online okamžitě zdarma. Pro vlastní doménu stejný postup jako u webu — Wedos + propojení v nastavení.",
       ],
       en:[
         "── I WANT A WEBSITE (presentation, portfolio, landing page) ──",
         "Bolt.new: fastest. Write everything in one message — sections, content, style, colors. Example: 'Create a landing page for my accounting firm. Sections: Main banner with CTA button, Services (3 cards), About me with photo, Pricing, Contact. Style: clean, white, professional, blue accent.' Bolt builds the page live — you see the result on the right.",
         "v0.dev: ideal when you want just one part — contact form, pricing table or photo gallery. Describe the component → get code you paste into an existing page.",
         "Going live: click 'Deploy' in Bolt.new → automatically uploads to Vercel or Netlify (hosting = server where your site lives) for free. You get a link like mysite.vercel.app. For a custom domain (~$12/year on Namecheap.com) — connect it in Vercel settings.",
         "── I WANT AN APP (registration, login, data storage, payments) ──",
         "Lovable (lovable.dev): easiest path to a working app. Describe what the app does → Lovable builds login, database and payments automatically. Example: 'I want an app where users register, add tasks and mark them as done. Payment via Stripe for premium features.'",
         "Bolt.new handles apps too — add to your description: 'with Google login and database storage'. Bolt connects Supabase (database, free up to 50,000 users) automatically.",
         "Payments: Stripe (stripe.com) — simplest payment gateway. Lovable and Bolt set it up on request: 'Add Stripe payments for $9/month'.",
         "Going live: Lovable → 'Publish' button → online instantly for free. For a custom domain same process as for websites — Namecheap + connect in settings.",
       ],
     },
     tip:{cs:"Zlaté pravidlo: napište VŠE do prvního promptu — všechny sekce, funkce, barvy, texty. AI potřebuje celý obrázek najednou. Pokud přidáváte funkce postupně, výsledek bývá nekonzistentní a hůř se opravuje.",en:"Golden rule: write EVERYTHING into the first prompt — all sections, features, colors, texts. AI needs the complete picture at once. Adding features gradually tends to produce inconsistent results that are harder to fix."},
    },
    {task:{cs:"SEO — jak být výše ve výsledcích Googlu",en:"SEO — how to rank higher in Google"},icon:"—",
     url:"https://claude.ai",
     urlLabel:{cs:"Otevřít Claude",en:"Open Claude"},
     desc:{cs:"SEO (Search Engine Optimization) = úpravy webu a obsahu tak, aby vás Google zobrazoval výš ve výsledcích vyhledávání. Čím výš jste, tím víc lidí vás najde. AI dokáže SEO výrazně zrychlit — analýzu, psaní článků i technické kontroly.",en:"SEO (Search Engine Optimization) = adjusting your website and content so Google shows you higher in search results. The higher you are, the more people find you. AI can significantly speed up SEO — analysis, writing articles and technical checks."},
     recommended:["Claude","Perplexity"],
     steps:{
       cs:[
         "ZÁKLADNÍ POJMY — přečtěte před začátkem:\n• Keyword (klíčové slovo) = slovo nebo fráze kterou lidé zadávají do Googlu, např. 'nejlepší kavárna Praha'\n• Search intent (záměr hledání) = proč to lidé hledají — chtějí informaci, porovnat produkty, nebo rovnou koupit?\n• EEAT = čtyři věci které Google hodnotí: Experience (máte přímou zkušenost s tématem?), Expertise (jste odborník?), Authoritativeness (odkazují na vás jiné weby?), Trustworthiness (je váš web důvěryhodný?). Čím víc EEAT, tím výš v Googlu.\n• Meta popis = krátký text pod nadpisem ve výsledcích Googlu — píšete ho vy, láká lidi ke kliknutí\n• H1, H2, H3 = nadpisy na stránce — H1 je hlavní nadpis (jeden na stránku), H2 jsou podnadpisy, H3 pod-podnadpisy",
         "KROK 1 — Najděte správná klíčová slova. Jděte na claude.ai a napište: 'Jaká klíčová slova by lidé hledali když chtějí [váš produkt nebo služba] v [místo nebo obor]? Navrhni 10 konkrétních frází včetně delších dotazů (3–5 slov) a otázek začínajících na jak, proč, co.'\n\nPříklad: 'Jaká klíčová slova by lidé hledali když chtějí fotografa na svatbu v Praze? Navrhni 10 konkrétních frází včetně delších dotazů a otázek.'",
         "KROK 2 — Napište nebo vylepšete článek. Vložte do Claude: 'Napiš SEO článek pro klíčové slovo [váš keyword]. Cílový čtenář: [kdo to bude číst]. Délka: 1000–1500 slov. Přidej konkrétní příklady a čísla — Google odměňuje články které ukazují reálné zkušenosti.'\n\nPříklad: 'Napiš SEO článek pro klíčové slovo svatební fotograf Praha cena. Cílový čtenář: páry plánující svatbu. Délka: 1200 slov. Přidej příklady cenových rozmezí a tipy jak vybrat fotografa.'",
         "KROK 3 — Zkontrolujte technické věci na webu. Zkopírujte celý text vaší stránky (Ctrl+A, Ctrl+C) nebo URL a vložte do Claude.ai s touto zprávou: 'Zkontroluj tuto stránku z pohledu SEO. Má správný H1 nadpis? Je meta popis do 155 znaků a láká ke kliknutí? Jsou klíčová slova přirozeně v textu? Co bys zlepšil jako první?' Claude vám konkrétně řekne co změnit.",
         "KROK 4 — Maximalizujte SEO celého webu najednou. Zkopírujte URL vašeho webu a napište Claudovi nebo Perplexity: 'Prozkoumej web [URL]. Jaká klíčová slova mu chybí? Co dělá konkurence lépe? Navrhni 5 konkrétních kroků jak zlepšit pozici v Googlu do 30 dní.'",
         "KROK 5 — Podívejte se co dělá konkurence. Napište Perplexity: 'Vyhledej co píší top 3 weby v Googlu pro klíčové slovo [keyword]. Co mají co já nemám? Jaká témata nebo otázky přeskočili?'",
         "Pozn: Claude Code /seo je pokročilá funkce pro vývojáře s nainstalovaným Claude Code — pokud Claude Code nemáte, kroky 1–5 výše vám plně postačí",
       ],
       en:[
         "KEY TERMS — read before starting:\n• Keyword = word or phrase people type into Google, e.g. 'best coffee shop Prague'\n• Search intent = why people search it — do they want information, to compare products, or to buy?\n• EEAT = four things Google evaluates: Experience (do you have direct experience with the topic?), Expertise (are you an expert?), Authoritativeness (do other sites link to you?), Trustworthiness (is your site credible?). More EEAT = higher in Google.\n• Meta description = short text under the headline in Google results — you write it, it entices people to click\n• H1, H2, H3 = headings on the page — H1 is the main heading (one per page), H2 are subheadings, H3 sub-subheadings",
         "STEP 1 — Find the right keywords. Go to claude.ai and type: 'What keywords would people search when looking for [your product or service] in [location or field]? Suggest 10 specific phrases including longer queries (3–5 words) and questions starting with how, why, what.'\n\nExample: 'What keywords would people search when looking for a wedding photographer in Prague? Suggest 10 specific phrases including longer queries and questions.'",
         "STEP 2 — Write or improve an article. Paste into Claude: 'Write an SEO article for keyword [your keyword]. Target reader: [who will read it]. Length: 1000–1500 words. Add specific examples and numbers — Google rewards articles that show real experience.'\n\nExample: 'Write an SEO article for keyword wedding photographer Prague price. Target reader: couples planning a wedding. Length: 1200 words. Add pricing range examples and tips on choosing a photographer.'",
         "STEP 3 — Check the technical things on your site. Copy all text from your page (Ctrl+A, Ctrl+C) or the URL and paste into Claude.ai with this message: 'Check this page from an SEO perspective. Does it have the correct H1 heading? Is the meta description under 155 characters and enticing to click? Are keywords naturally in the text? What would you improve first?' Claude will tell you specifically what to change.",
         "STEP 4 — Maximize SEO of your whole website at once. Copy your website URL and tell Claude or Perplexity: 'Analyze website [URL]. What keywords is it missing? What does the competition do better? Suggest 5 specific steps to improve Google ranking in 30 days.'",
         "STEP 5 — See what competitors do. Tell Perplexity: 'Search what the top 3 Google sites write for keyword [keyword]. What do they have that I don't? What topics or questions did they miss?'",
       ],
     },
     tip:{cs:"Moderní SEO nevyhraje ten kdo má nejvíc klíčových slov — vyhraje ten kdo má nejlepší a nejdůvěryhodnější obsah. Přidejte do článků vždy: konkrétní čísla, vaše vlastní zkušenosti a odpovědi na otázky které zákazníci skutečně kladou.",en:"Modern SEO isn't won by who has the most keywords — it's won by who has the best and most trustworthy content. Always add to articles: specific numbers, your own experiences and answers to questions customers actually ask."},
    },
    {task:{cs:"Marketing — strategie, obsah a kampaně",en:"Marketing — strategy, content and campaigns"},icon:"—",
     url:"https://claude.ai",
     urlLabel:{cs:"Otevřít Claude",en:"Open Claude"},
     desc:{cs:"AI dokáže pokrýt celý marketingový proces: od strategie přes tvorbu obsahu až po automatizaci kampaní. Hodí se pro freelancery, majitele firem i marketéry — bez nutnosti mít velký tým.",en:"AI can cover the entire marketing process: from strategy through content creation to campaign automation. Great for freelancers, business owners and marketers — no big team needed."},
     recommended:["Claude","ChatGPT","Canva","ElevenLabs","Runway"],
     steps:{
       cs:[
         "── CO VŠECHNO AI V MARKETINGU ZVLÁDNE ──",
         "Psaní obsahu: LinkedIn posty, Instagram popisky, emaily, reklamní texty, blog články\nTvorba strategie: 90denní plán co publikovat, kdy a kde\nVisuály a video: carousel pro Instagram (viz mírně pokročilý), skripty pro Reels/TikTok, hlasový komentář přes ElevenLabs, animace přes Runway\nAutomatizace: AI agent který třídí příchozí zprávy, odpovídá na komentáře nebo posílá follow-up emaily (viz sekce Automatizace)",
         "── KROK 1: Sestavte 90denní obsahovou strategii ──",
         "Nejdřív pár pojmů:\n• ICP (Ideal Customer Profile) = přesný popis vašeho ideálního zákazníka — věk, profese, největší problémy, kde tráví čas online\n• Content pillars (obsahové pilíře) = 3–4 hlavní témata o kterých budete pravidelně komunikovat\n• Editorial kalendář = plán co zveřejníte kdy a na jaké platformě\n\nNapište do Claude: 'Sestav mi 90denní obsahovou strategii pro [popis vaší firmy/produktu]. Můj ideální zákazník: [věk, profese, největší problém]. Platformy: [Instagram / LinkedIn / email]. Cíl: [více sledujících / víc poptávek / prodeje].\n\nChci:\n1) Popis mého ideálního zákazníka — kdo je, co ho trápí, kde ho najdu online\n2) 3 hlavní témata o kterých budu komunikovat a proč\n3) Týdenní plán: co zveřejnit každý den a v jakém formátu\n4) 3 věci které udělám tento týden jako první'",
         "── KROK 2: Plňte strategii obsahem ──",
         "LinkedIn post: 'Napiš LinkedIn příspěvek o [téma z vaší strategie]. Hook (první věta která zaujme): [váš nápad nebo nechte AI]. Tón: [osobní / odborný]. Max 250 slov.'\nInstagram popisek: 'Napiš Instagram popisek pro fotku kde [popis fotky]. Téma: [pilíř]. CTA (výzva k akci = co má follower udělat): ulož si, sdílej, napiš do komentářů.'\nEmail kampaň: 'Napiš 3 emaily pro lidi kteří se přihlásili k odběru ale ještě nekoupili. Email 1 (ihned): uvítání + jedna rychlá hodnota. Email 2 (den 3): příběh zákazníka. Email 3 (den 7): nabídka s důvodem jednat teď.'\nReklamní text (AIDA / PAS): PAS = Problem (popiš problém) → Agitate (zdůrazni jak moc to bolí) → Solution (nabídni řešení). Příklad: 'Každý večer nevíte co zveřejnit? Scrollujete prázdnou obrazovku a čas utíká? Tady je 90denní plán obsahu sestavený za 5 minut.'",
         "── KROK 3: Instagram carousel bez Canvy ──",
         "Claude Artifacts = funkce v Claude.ai kde AI může generovat vizuální obsah (HTML stránku) přímo v chatu. Carousel = série obrázků/slidů které se na Instagramu swipují.\n\nJděte na claude.ai a napište: 'Vytvoř Instagram carousel jako HTML artefakt. Téma: [vaše téma]. 7 slidů. Slide 1: šokující číslo nebo tvrzení. Slidy 2–6: jeden tip na každém. Slide 7: výzva k akci. Design: tmavý, velká bílá písma, [vaše barva] jako akcent.'\n\nClaude vygeneruje celý vizuální carousel přímo v chatu. Na mobilu udělejte screenshot každého slidu → přidejte na Instagram. Více o carouselu → viz nástroj 'Obsah na sociální sítě' v mírně pokročilém.",
         "── KROK 4: Skripty pro videa a Reels ──",
         "Napište do Claude: 'Napiš scénář pro 60sekundové Reels video o [téma]. Styl: [vzdělávací / zábavný / osobní]. Každá věta na nový řádek — budu číst z papíru. Na konci otázka pro komentáře.'\nHlas k videu: text ze scénáře vložte do ElevenLabs (elevenlabs.io) → vygeneruje profesionální hlas jako komentář\nAnimace záběrů: výchozí snímek z Midjourney nebo Nano Banana → nahrajte do Runway (runwayml.com) → AI ho zanimuje",
         "── KROK 5: Automatizace marketingu ──",
         "AI agenti vám ušetří hodiny týdně:\n• Třídění DM zpráv a komentářů: Make.com + Claude — nová zpráva → Claude vyhodnotí → připraví návrh odpovědi\n• Follow-up emaily: Make.com + Gmail — někdo vyplnil formulář → Claude napíše personalizovaný email → vy schválíte → odešle se\n• Reporty: každý týden Make.com stáhne data z Instagram / LinkedIn → Claude napíše shrnutí → přijde vám na email\nViz nástroj 'Automatizace' v mírně pokročilém pro postup krok za krokem.",
       ],
       en:[
         "── WHAT AI CAN HANDLE IN MARKETING ──",
         "Content writing: LinkedIn posts, Instagram captions, emails, ad copy, blog articles\nStrategy: 90-day plan of what to publish, when and where\nVisuals and video: carousel for Instagram (see intermediate), scripts for Reels/TikTok, voiceover via ElevenLabs, animation via Runway\nAutomation: AI agent that sorts incoming messages, replies to comments or sends follow-up emails (see Automation section)",
         "── STEP 1: Build a 90-day content strategy ──",
         "A few terms first:\n• ICP (Ideal Customer Profile) = exact description of your ideal customer — age, profession, biggest problems, where they spend time online\n• Content pillars = 3–4 main topics you'll communicate about regularly\n• Editorial calendar = plan of what you'll publish when and on which platform\n\nType into Claude: 'Build me a 90-day content strategy for [description of your business/product]. My ideal customer: [age, profession, biggest problem]. Platforms: [Instagram / LinkedIn / email]. Goal: [more followers / more inquiries / sales].\n\nI want:\n1) Description of my ideal customer — who they are, what troubles them, where I find them online\n2) 3 main topics I'll communicate about and why\n3) Weekly plan: what to publish each day and in what format\n4) 3 things to do this week first'",
         "── STEP 2: Fill the strategy with content ──",
         "LinkedIn post: 'Write a LinkedIn post about [topic from your strategy]. Hook (first sentence that grabs attention): [your idea or let AI]. Tone: [personal / professional]. Max 250 words.'\nInstagram caption: 'Write an Instagram caption for a photo where [describe photo]. Topic: [pillar]. CTA (call to action = what should the follower do): save this, share, write in comments.'\nEmail campaign: 'Write 3 emails for people who subscribed but haven't bought yet. Email 1 (immediately): welcome + one quick value. Email 2 (day 3): customer story. Email 3 (day 7): offer with reason to act now.'\nAd copy (AIDA / PAS): PAS = Problem (describe problem) → Agitate (emphasize how much it hurts) → Solution (offer solution).",
         "── STEP 3: Instagram carousel without Canva ──",
         "Claude Artifacts = feature in Claude.ai where AI can generate visual content (HTML page) directly in chat. Carousel = series of images/slides that users swipe through on Instagram.\n\nGo to claude.ai and type: 'Create an Instagram carousel as HTML artifact. Topic: [your topic]. 7 slides. Slide 1: shocking number or claim. Slides 2–6: one tip each. Slide 7: call to action. Design: dark, large white text, [your color] as accent.'\n\nClaude generates the entire visual carousel in chat. On mobile screenshot each slide → add to Instagram. More about carousels → see 'Social media content' tool in intermediate.",
         "── STEP 4: Scripts for videos and Reels ──",
         "Type into Claude: 'Write a script for a 60-second Reels video about [topic]. Style: [educational / entertaining / personal]. Each sentence on a new line — I'll read from paper. End with a question for comments.'\nVoiceover: paste the script text into ElevenLabs (elevenlabs.io) → generates professional voice as commentary\nAnimation: starting frame from Midjourney or Nano Banana → upload to Runway (runwayml.com) → AI animates it",
         "── STEP 5: Marketing automation ──",
         "AI agents save you hours per week:\n• Sorting DMs and comments: Make.com + Claude — new message → Claude evaluates → prepares draft reply\n• Follow-up emails: Make.com + Gmail — someone filled out form → Claude writes personalized email → you approve → it sends\n• Reports: every week Make.com pulls data from Instagram/LinkedIn → Claude writes summary → arrives in your email\nSee 'Automation' tool in intermediate for step-by-step instructions.",
       ],
     },
     tip:{cs:"Zlaté pravidlo: strategie nejdřív, pak obsah. Bez jasných pilířů a ICP budete produkovat obsah do prázdna. Dejte Claudovi 10 minut na strategii — ušetříte hodiny týdně.",en:"Golden rule: strategy first, then content. Without clear pillars and ICP you'll produce content into a void. Give Claude 10 minutes for strategy — save hours per week."},
    },
    {task:{cs:"Byznys — strategie a plánování",en:"Business — strategy and planning"},icon:"—",
     url:"https://claude.ai",
     urlLabel:{cs:"Otevřít Claude",en:"Open Claude"},
     desc:{cs:"AI vám pomůže sestavit byznys plán, analyzovat konkurenci, nacenit vaše služby nebo naplánovat jak oslovit první zákazníky. Vše bez konzultanta — za hodinu místo týdnů.",en:"AI helps you build a business plan, analyze competition, price your services or plan how to reach first customers. All without a consultant — in an hour instead of weeks."},
     recommended:["Claude","Perplexity"],
     steps:{
       cs:[
         "KROK 1 — Byznys plán\n\nByznys plán = dokument který popisuje co děláte, pro koho, jak na tom vyděláte a co vás čeká. Hodí se před spuštěním firmy, při žádosti o půjčku nebo jen abyste měli jasno sami sobě.\n\nNejlepší výsledek dostanete když Claudovi dáte strukturovaný vstup. XML = speciální formát ohraničený značkami — Claude ho čte lépe než volný text.\n\nNapište do Claude.ai:\n<business>\nCo děláme: [popis produktu nebo služby]\nJak to vydělává peníze: [poplatky / předplatné / provize]\n</business>\n<market>\nKdo jsou zákazníci: [věk, profese, problém který řeší]\nGeografie: [ČR / Evropa / online]\n</market>\n<goals>\nCíl za 6 měsíců: [konkrétní číslo]\nCíl za 1 rok: [konkrétní číslo]\n</goals>\n<constraints>\nTým: [kolik lidí]\nRozpočet: [malý / střední / velký]\nHlavní rizika: [co by mohlo nevyjít]\n</constraints>\n\nNa základě toho mi vytvoř byznys plán s: shrnutím pro investora (max 150 slov), analýzou trhu, popisem konkurence, finančními projekcemi na 3 roky a 5 konkrétními kroky pro první měsíc.\n\n→ PŘÍKLAD: viz sekce Prompty → Byznys",
         "KROK 2 — Analýza konkurence\n\nNejdřív zjistěte kdo jsou konkurenti — pak Claude navrhne jak se odlišit.\n\nFáze 1: Jděte na perplexity.ai a napište:\n'Kdo jsou hlavní konkurenti pro [váš produkt/službu] v [ČR / online]? Co nabízejí, jaké mají ceny a co zákazníci chválí nebo kritizují?'\n\nFáze 2: Výsledky zkopírujte a vložte do Claude.ai:\n'Toto je konkurence v mém oboru: [vložte výsledky z Perplexity]. Kde jsou slabí? Jak se odlišit? Navrhni 3 konkrétní způsoby jak získat část jejich zákazníků.'\n\n→ PŘÍKLAD vyplněného promptu: viz sekce Prompty → Byznys",
         "KROK 3 — Nacenění vaší služby\n\nHigh-ticket offer = dražší nabídka (obvykle 15 000 Kč+) zaměřená na konkrétní výsledek pro zákazníka. Hodí se pro kouče, konzultanty, freelancery nebo specialisty.\n\nNapište do Claude.ai:\n'Chci sestavit dražší nabídku svých služeb. Zeptej se mě postupně na: moje zkušenosti, konkrétní výsledky které klientům přináším a co mě odlišuje od jiných. Pak navrhni jak nabídku nazvat, co do ní zahrnout, jak ji nacenit (na základě hodnoty pro klienta, ne mého času) a jak ji prezentovat za 60 sekund.'\n\nClaude vás bude vyzvívat otázkami — jen odpovídejte. Na konci dostanete hotovou nabídku.",
         "KROK 4 — Plán jak oslovit první zákazníky\n\nGTM (Go-to-Market) strategie = plán jak dostat produkt k prvním platícím zákazníkům. KPIs = měřitelné cíle jako počet zákazníků, tržby nebo počet registrací.\n\nNapište do Claude.ai:\n'Pomoz mi sestavit plán jak získat prvních [10 / 50 / 100] zákazníků za [1 / 3 / 6] měsíců.\nProdukt/služba: [popis]\nIdeální zákazník: [kdo je]\nRozpočet na marketing: [nulový / malý / střední]\nCo už mám: [web / sociální sítě / kontakty / nic]\nChci týdenní plán: co přesně dělat každý týden, jak měřit výsledky a kdy přehodnotit přístup.'\n\n→ PŘÍKLAD: viz sekce Prompty → Byznys",
       ],
       en:[
         "STEP 1 — Business plan\n\nBusiness plan = document describing what you do, for whom, how you make money and what to expect. Useful before launching, applying for a loan or just getting clarity.\n\nBest results come from structured input. XML = special format with tags — Claude reads it better than plain text.\n\nType into Claude.ai:\n<business>\nWhat we do: [product or service]\nHow it makes money: [fees / subscription / commission]\n</business>\n<market>\nWho are customers: [age, profession, problem]\nGeography: [local / Europe / online]\n</market>\n<goals>\nGoal in 6 months: [specific number]\nGoal in 1 year: [specific number]\n</goals>\n<constraints>\nTeam: [how many people]\nBudget: [small / medium / large]\nMain risks: [what could go wrong]\n</constraints>\n\nBased on this create a business plan with: investor summary (max 150 words), market analysis, competition, 3-year projections and 5 concrete first-month steps.",
         "STEP 2 — Competitor analysis\n\nFirst find competitors — then Claude suggests how to differentiate.\n\nPhase 1: Go to perplexity.ai and type:\n'Who are main competitors for [your product/service] in [country / online]? What do they offer, what are prices and what do customers praise or criticize?'\n\nPhase 2: Copy results and paste into Claude.ai:\n'This is the competition in my field: [paste Perplexity results]. Where are they weak? How can I differentiate? Suggest 3 concrete ways to win some of their customers.'",
         "STEP 3 — Pricing your service\n\nHigh-ticket offer = higher-priced offer ($1,000+) focused on a specific result. Great for coaches, consultants, freelancers or specialists.\n\nType into Claude.ai:\n'I want to build a premium offer. Ask me step by step about: my experience, specific results I deliver to clients and what differentiates me. Then suggest: what to call the offer, what to include, how to price it (based on client value, not my time) and how to present it in 60 seconds.'\n\nClaude asks you questions — just answer. At the end you get a finished offer.",
         "STEP 4 — Plan to reach first customers\n\nGTM (Go-to-Market) strategy = plan to get product to first paying customers. KPIs = measurable goals like number of customers, revenue or sign-ups.\n\nType into Claude.ai:\n'Help me plan how to get the first [10 / 50 / 100] customers in [1 / 3 / 6] months.\nProduct/service: [description]\nIdeal customer: [who they are]\nMarketing budget: [zero / small / medium]\nWhat I already have: [website / social / contacts / nothing]\nI want a weekly plan: exactly what to do, how to measure results and when to reconsider.'",
       ],
     },
     tip:{cs:"Extended Thinking = funkce v Claude.ai kde AI přemýšlí déle a hlouběji — hodí se pro složité byznys analýzy. Zapnete ho kliknutím na ikonu 'rozšířené přemýšlení' v chatu, nebo napište: 'Přemýšlej důkladně ze všech úhlů než odpovíš.'",en:"Extended Thinking = feature in Claude.ai where AI thinks longer and deeper — great for complex business analyses. Turn it on by clicking the 'extended thinking' icon in chat, or type: 'Think thoroughly from all angles before answering.'"},
    },
    {task:{cs:"AI Agenti — automatizace která pracuje za vás",en:"AI Agents — automation that works for you"},icon:"—",
     url:"https://retell.ai",
     urlLabel:{cs:"Otevřít Retell AI",en:"Open Retell AI"},
     desc:{cs:"AI agent = program který nepotřebuje vaše instrukce při každém kroku — sám čte vstupy, rozhoduje a provádí akce. Rozdíl od normální AI: Claude odpovídá na otázky. AI agent přijme hovor, zarezervuje termín a pošle potvrzení — bez vás.",en:"AI agent = program that doesn't need your instructions at every step — reads inputs, makes decisions and takes actions on its own. Difference from regular AI: Claude answers questions. An AI agent picks up a call, books an appointment and sends confirmation — without you."},
     recommended:["Retell AI","n8n","Claude Code","Perplexity Computer","agentskill.sh"],
     steps:{
       cs:[
         "── CO JE AI AGENT A KDY HO CHCETE ──\n\nNormální AI (Claude, ChatGPT): napíšete dotaz → dostanete odpověď → vy rozhodnete co dál.\nAI agent: nastavíte jednou → agent sám sleduje emaily, přijímá hovory, rezervuje termíny, třídí zprávy — a vy jen kontrolujete výsledky.\n\nPříklady kdy se hodí:\n• Zvedáte telefon sami? → hlasový agent zvedá za vás 24/7\n• Trávíte hodinu denně tříděním emailů? → emailový agent třídí a připravuje odpovědi\n• Opakujete stále stejné odpovědi zákazníkům? → chatbot agent odpovídá automaticky",
         "── KROK 1: Hlasový recepční agent ──\n\nCo to je: AI která přijímá telefonní hovory za vás, odpovídá na otázky, rezervuje termíny v kalendáři a přepojuje složitější hovory na vás.\n\nPotřebné nástroje (všechny se propojí dohromady):\n• Retell AI (retell.ai) — mozek agenta, nastavíte co má říkat a jak reagovat\n• Cal.com (cal.com) — váš online kalendář, agent do něj rezervuje termíny\n• ElevenLabs (elevenlabs.io) — hlas agenta, zní jako člověk\n• Telefonní číslo — koupíte přímo v Retell AI za ~$2/měs\n\nPostup:\n1. Zaregistrujte se na retell.ai\n2. Vytvořte nového agenta, vyberte hlas z ElevenLabs\n3. Napište systémový prompt (viz sekce Prompty → AI Agenti)\n4. Propojte s Cal.com přes API klíč (Retell AI vás provede)\n5. Kupte telefonní číslo v Retell AI → agent začne přijímat hovory",
         "── KROK 2: Emailový AI agent (n8n) ──\n\nN8n se liší od Make (z mírně pokročilého): Make je jednodušší a vhodný pro začátečníky. N8n je výkonnější, open-source (= zdarma ke stažení) a více přizpůsobitelný — hodí se pro složitější workflow.\n\nNejjednodušší emailový agent:\n1. Nainstalujte n8n: jděte na n8n.io → 'Get started' → cloud verze je placená, nebo stáhněte zdarma a spusťte lokálně\n2. Vytvořte nový workflow: Trigger = Gmail (nový email přijde)\n3. Přidejte Claude node: prompt = 'Zařaď tento email: urgent / lead / support / jiné. Odpověz jen názvem kategorie.'\n4. Podle kategorie: urgent → Slack notifikace, lead → CRM, support → helpdesk\n5. Přidejte draft odpovědi: Claude napíše návrh → jde do Gmailu jako koncept → vy schválíte a odešlete\n\nDůležité: nikdy nenastavujte automatické odesílání bez vašeho schválení.",
         "── KROK 3: MCP protokol — Claude propojený s vašimi nástroji ──\n\nMCP (Model Context Protocol) = způsob jak propojit Claude s externími nástroji — vaší databází, GitHubem, Google Drive nebo firemním systémem. Místo kopírování dat do chatu Claude sám sahá na živá data.\n\nPříklad: Claude vidí váš GitHub a může číst kód, vidí váš CRM a může hledat zákazníky, vidí vaší databázi a může analyzovat data.\n\nNastavení (pro vývojáře): v Claude.ai jděte do Settings → Integrations → přidejte MCP server. Nebo v Claude Code nastavte v souboru ~/.claude/settings.json.\n\nPro nevývojáře: MCP je zatím spíš pro technické uživatele. Prozatím vám plně postačí Make nebo n8n.",
         "── KROK 5: Hotové agenty — kde je najít a rovnou použít ──\n\nNechcete stavět agenta od nuly? Existují hotové řešení:\n\n• Perplexity Computer (perplexity.ai → záložka Computer): nejjednodušší start. Agent který sám prochází web, vyhledává informace, vyplňuje formuláře a sbírá data — bez nastavování. Popište úkol česky a Perplexity ho splní sám. Hodí se pro výzkum, sbírání dat, monitorování konkurence.\n\n• Relevance AI (relevanceai.com): marketplace hotových AI agentů — sales agent, support agent, research agent. Vyberte šablonu, propojte se svými nástroji a spusťte. Zdarma do limitu.\n\n• Claude.ai Projects: ne agent v pravém slova smyslu, ale Project Instructions = trvalá paměť pro Claude. Nastavíte jednou: 'Jsi můj marketingový asistent, vždy piš v tomto stylu...' → Claude si to pamatuje v celém projektu.\n\n• Manus (manus.im): agent který pracuje přímo ve vašem prohlížeči — prochází weby, vyplňuje formuláře, sbírá informace. Popíšete úkol česky → Manus ho splní sám.\n\n• Zapier Agents (zapier.com/agents): hotové AI agenty propojené s 6 000+ aplikacemi. Jednodušší než n8n, placené.",
         "── KROK 6: Jak napsat dobrého agenta — prompt šablona ──\n\nKde si agenta vytvořit (fungující platformy):\n• claude.ai → Projects → Project Instructions (nejjednodušší, zdarma)\n• relevanceai.com → Create Agent (více funkcí, zdarma do limitu)\n• retell.ai → pro hlasového agenta\n• make.com → pro agenta propojeného s aplikacemi\n\nJak napsat dobrý systémový prompt pro agenta — musí mít 5 částí:\n\nJméno a role: 'Jsi Jana, asistentka zákaznické podpory firmy XY.'\n\nCo dělá: 'Tvůj úkol je odpovídat na dotazy zákazníků o doručení, vrácení zboží a reklamacích.'\n\nJak se chová: 'Vždy odpovídej přátelsky a stručně. Max 3 věty. Nikdy neslibuj co nevíš.'\n\nCo NESMÍ dělat: 'Neposkytuj informace o cenách — přesměruj na obchodní oddělení. Neodpovídej na témata mimo zákaznickou podporu.'\n\nKdy přepojit na člověka: 'Pokud zákazník vyjadřuje frustraci nebo problém přesahuje tvoje znalosti, řekni: Předám vás kolegovi který vám pomůže lépe.'\n\n→ Celý systémový prompt ke zkopírování: viz sekce Prompty → AI Agenti",
       ],
       en:[
         "── WHAT IS AN AI AGENT AND WHEN DO YOU WANT ONE ──\n\nRegular AI (Claude, ChatGPT): you write a query → get answer → you decide what next.\nAI agent: set up once → agent monitors emails, answers calls, books appointments, sorts messages — you only review results.\n\nExamples of when it helps:\n• Answer calls yourself? → voice agent answers 24/7\n• Spend an hour daily sorting emails? → email agent sorts and prepares replies\n• Repeat the same answers to customers? → chatbot agent responds automatically",
         "── STEP 1: Voice receptionist agent ──\n\nWhat it is: AI that takes phone calls for you, answers questions, books appointments in your calendar and transfers complex calls to you.\n\nTools needed (all connect together):\n• Retell AI (retell.ai) — agent's brain, you set what it says and how it reacts\n• Cal.com (cal.com) — your online calendar, agent books appointments into it\n• ElevenLabs (elevenlabs.io) — agent's voice, sounds like a human\n• Phone number — buy directly in Retell AI for ~$2/month\n\nProcess:\n1. Sign up at retell.ai\n2. Create new agent, choose voice from ElevenLabs\n3. Write system prompt (see Prompts section → AI Agents)\n4. Connect Cal.com via API key (Retell AI guides you)\n5. Buy phone number in Retell AI → agent starts taking calls",
         "── STEP 2: Email AI agent (n8n) ──\n\nn8n differs from Make (from intermediate): Make is simpler and better for beginners. n8n is more powerful, open-source (= free to download) and more customizable — great for complex workflows.\n\nSimplest email agent:\n1. Install n8n: go to n8n.io → 'Get started' → cloud version is paid, or download free and run locally\n2. Create new workflow: Trigger = Gmail (new email arrives)\n3. Add Claude node: prompt = 'Classify this email: urgent / lead / support / other. Reply with category name only.'\n4. By category: urgent → Slack notification, lead → CRM, support → helpdesk\n5. Add draft reply: Claude writes draft → goes to Gmail as concept → you approve and send\n\nImportant: never set automatic sending without your approval.",
         "── STEP 3: MCP protocol — Claude connected to your tools ──\n\nMCP (Model Context Protocol) = way to connect Claude with external tools — your database, GitHub, Google Drive or company system. Instead of copying data into chat, Claude accesses live data directly.\n\nExample: Claude sees your GitHub and can read code, sees your CRM and can look up customers, sees your database and can analyze data.\n\nSetup (for developers): in Claude.ai go to Settings → Integrations → add MCP server. Or in Claude Code configure in ~/.claude/settings.json file.\n\nFor non-developers: MCP is currently more for technical users. Make or n8n will fully cover your needs for now.",
         "── STEP 4: Claude Skills — teach Claude your style ──\n\nClaude Skills = files with instructions that Claude Code reads before each task. Works like permanent memory — Claude always knows how to write in your voice, what coding style to use or what to check in every email.\n\nWhere to find them: in ~/.claude/skills/ folder (folder on your computer, written to via terminal)\n\nWhat to put in Skills:\n• brand-voice.md: 'Write friendly but professional. Short sentences. No jargon. Always address by name.'\n• email-style.md: 'Subject max 6 words. Body max 5 sentences. Always CTA at end.'\n• meeting-notes.md: 'From notes create: Decisions / Tasks with deadlines / Open questions'\n\nActivation: type into Claude Code 'Read skill brand-voice and write email for...'",
         "── STEP 5: Ready-made agents — where to find and use them ──\n\nDon't want to build an agent from scratch? Ready solutions exist:\n\n• Relevance AI (relevanceai.com): marketplace of ready AI agents — sales agent, support agent, research agent. Pick a template, connect your tools, launch. Free up to a limit.\n\n• AgentGPT (agentgpt.reworkd.ai): enter a goal ('Research competitors and write a report') → agent browses the web, collects data and assembles output. Free.\n\n• Claude.ai Projects: not a full agent but Project Instructions = permanent memory for Claude. Set once: 'You are my marketing assistant, always write in this style...' → Claude remembers it across the whole project.\n\n• Manus (manus.im): agent that works directly in your browser — browses sites, fills forms, collects information. Describe task → Manus does it independently.\n\n• Zapier Agents (zapier.com/agents): ready AI agents connected to 6,000+ apps. Simpler than n8n, paid.",
         "── STEP 6: How to write a good agent — prompt template ──\n\nWhere to create an agent (working platforms):\n• claude.ai → Projects → Project Instructions (simplest, free)\n• relevanceai.com → Create Agent (more features, free up to limit)\n• retell.ai → for voice agent\n• make.com → for agent connected to apps\n\nHow to write a good system prompt for an agent — needs 5 parts:\n\nName and role: 'You are Jana, customer support assistant for company XY.'\n\nWhat it does: 'Your job is to answer customer questions about delivery, returns and complaints.'\n\nHow it behaves: 'Always reply in a friendly and concise way. Max 3 sentences. Never promise what you don't know.'\n\nWhat it MUST NOT do: 'Don't provide pricing information — redirect to sales team. Don't respond to topics outside customer support.'\n\nWhen to hand off to a human: 'If the customer expresses frustration or the problem exceeds your knowledge, say: I'll transfer you to a colleague who can help better.'\n\n→ Full system prompt to copy: see Prompts section → AI Agents",
       ],
     },
     tip:{cs:"Největší ROI v 2026: hlasový agent. Retell AI + Cal.com + ElevenLabs = funkční recepční za jedno odpoledne. Zvedá telefony 24/7, rezervuje termíny, přepojuje složité hovory — od ~$50/měs za celý stack.",en:"Highest ROI in 2026: voice agent. Retell AI + Cal.com + ElevenLabs = working receptionist in one afternoon. Answers calls 24/7, books appointments, transfers complex calls — from ~$50/mo for the whole stack."},
    },
  ],
};

// ─── ALL MODELS ────────────────────────────────────────────────────────────────
const ALL_MODELS = [
  {name:"Claude Haiku 4.5",maker:"Anthropic",url:"https://claude.ai",price:"free",
   oneLiner:{cs:"Nejrychlejší Claude — jednoduché dotazy, překlady, subtasky v AI workflow.",en:"Fastest Claude — simple queries, translations, subtasks in AI workflows."},
   bestFor:{cs:["Rychlé překlady a shrnutí","FAQ a customer support chatboty","Subtasky v multi-agent systémech (Haiku vykonává, Sonnet řídí)","Prototypy a UI scaffolding — 2× rychlejší než Sonnet"],en:["Quick translations and summaries","FAQ and customer support chatbots","Subtasks in multi-agent systems (Haiku executes, Sonnet orchestrates)","Prototypes and UI scaffolding — 2× faster than Sonnet"]},
   notFor:{cs:["Komplexní strategické analýzy","Hluboký reasoning — použijte Opus"],en:["Complex strategic analyses","Deep reasoning — use Opus"]},
   idealPrompts:{
     cs:["Přelož tento text do angličtiny. Zachovej formální tón.\n\n[vložte text]","Shrň tento email do 3 odrážek s tím, co musím udělat.\n\n[vložte email]","Zařaď tento email do kategorie: urgent / lead / support / jiné.\nOdpověz jen názvem kategorie.\n\n[vložte email]"],
     en:["Translate this text to Czech. Keep formal tone.\n\n[paste text]","Summarize this email into 3 bullet points with what I need to do.\n\n[paste email]","Classify this email as: urgent / lead / support / other.\nReply only with category name.\n\n[paste email]"],
   },
   versions:{cs:"Haiku 4.5 — zdarma, nejrychlejší odpovědi. Extended thinking: nová funkce 2026.",en:"Haiku 4.5 — free, fastest responses. Extended thinking: new 2026 feature."},
   tags:["rychlý","zdarma","agenti","subtasky"],
  },
  {name:"Claude Sonnet 4.6",maker:"Anthropic",url:"https://claude.ai",price:"freemium",
   oneLiner:{cs:"Nejlepší model pro každodenní práci — texty, analýza, kódování. Ideální rovnováha.",en:"Best model for everyday work — texts, analysis, coding. Ideal balance."},
   bestFor:{cs:["Psaní, copywriting a analýza dokumentů (200K tokenů — celé knihy)","Frontend a UI kódování — pixel-perfect React/Tailwind, SWE-bench 77.2 %","Orchestrátor v multi-agent workflow","Nejlepší coding AI na trhu dle benchmarků"],en:["Writing, copywriting and document analysis (200K tokens — entire books)","Frontend and UI coding — pixel-perfect React/Tailwind, SWE-bench 77.2%","Orchestrator in multi-agent workflow","Best coding AI on market per benchmarks"]},
   notFor:{cs:["Aktuální informace z internetu","Jednoduché rychlé dotazy — Haiku je rychlejší"],en:["Current information from internet","Simple quick queries — Haiku is faster"]},
   idealPrompts:{
     cs:["Napiš článek na téma '[téma]' — 1800 slov. Cílový čtenář: [kdo]. Přidej konkrétní čísla nebo příklady z praxe. Na konci shrnutí a co dál.",
         "Analyzuj přiložený dokument. Řekni mi:\n1) 3 nejdůležitější věci\n2) 2 rizika nebo problémy\n3) Co bych měl udělat jako první?\n\n[nahrajte soubor]",
         "Udělej stránku v React + Tailwind pro [produkt]. Tmavý design, plynulé scrollování, responzivní. Sekce: Hlavní banner, Výhody, Jak to funguje, Ceny, Otázky, Patička."],
     en:["Write article on '[topic]' — 1800 words. Target reader: [who]. Add specific numbers or real examples. End with summary and next step.","Analyze attached document. Tell me:\n1) 3 most important things\n2) 2 risks or problems\n3) What should I do first?\n\n[upload file]","Build a page in React + Tailwind for [product]. Dark design, smooth scroll, responsive. Sections: Hero, Benefits, How it works, Pricing, FAQ, Footer."],
   },
   versions:{cs:"Sonnet 4.6 — výchozí model, dostupný zdarma i v Claude Pro. Extended Thinking pro komplexní problémy.",en:"Sonnet 4.6 — default model, available free and in Claude Pro. Extended Thinking for complex problems."},
   tags:["texty","kód","analýza","denní práce"],
  },
  {name:"Claude Opus 4.6",maker:"Anthropic",url:"https://claude.ai",price:"paid",
   oneLiner:{cs:"Nejpokročilejší Claude — strategické analýzy, složitý kód, hluboký vícevrstvý reasoning.",en:"Most advanced Claude — strategic analyses, complex code, deep multilayered reasoning."},
   bestFor:{cs:["Byznys strategie, byznys plány a investor pitche","Code review před mergem — chytí async bugy, memory leaky, edge cases","Právní a finanční analýzy s nuancemi","Extended Thinking (max effort) — nejhlubší reasoning dostupný v 2026"],en:["Business strategy, business plans and investor pitches","Code review before merge — catches async bugs, memory leaks, edge cases","Legal and financial analyses with nuances","Extended Thinking (max effort) — deepest reasoning available in 2026"]},
   notFor:{cs:["Každodenní jednoduché úkoly — zbytečně pomalý a drahý","Rychlé překlady nebo shrnutí"],en:["Everyday simple tasks — unnecessarily slow and expensive","Quick translations or summaries"]},
   idealPrompts:{
     cs:["Pomoz mi sestavit plán na prvních 90 dní po spuštění naší firmy/produktu.\n\nFirma: [co děláme]\nZákazníci: [kdo jsou]\nTým: [kolik lidí]\nNejvětší rizika: [co se může pokazit]\nRozpočet: [malý/střední/velký]\n\nChci týdenní přehled co dělat, kdo za co zodpovídá a jak měřit úspěch.",
         "Zkontroluj tento kód před tím, než ho nasadím na produkci.\nHledej: chyby které se projeví až pod zátěží, úniky paměti, bezpečnostní díry, neošetřené situace.\n\n[vložte kód]",
         "Porovnej nás s konkurencí: [naše firma] vs [konkurent 1], [konkurent 2].\n\nŘekni mi:\n1) Kde jsou slabší než my?\n2) Kde jsou lepší?\n3) Co bychom měli udělat v příštích 30 dnech?\n\nBuď upřímný — i když to nebude příjemné."],
     en:["Help me build a plan for the first 90 days after launching our company/product.\n\nCompany: [what we do]\nCustomers: [who they are]\nTeam: [how many people]\nBiggest risks: [what could go wrong]\nBudget: [small/medium/large]\n\nI want a weekly overview of what to do, who is responsible and how to measure success.","Check this code before I deploy it to production.\nLook for: bugs that appear under load, memory leaks, security holes, unhandled situations.\n\n[paste code]","Compare us with competition: [our company] vs [competitor 1], [competitor 2].\n\nTell me:\n1) Where are they weaker than us?\n2) Where are they better?\n3) What should we do in the next 30 days?\n\nBe honest — even if it's uncomfortable."],
   },
   versions:{cs:"Opus 4.6 — jen Claude Pro ($20/měs). Effort parameter: high/medium/low. 1M token kontext v preview.",en:"Opus 4.6 — Claude Pro only ($20/mo). Effort parameter: high/medium/low. 1M token context in preview."},
   tags:["strategie","deep reasoning","Pro only","code review"],
  },
  {name:"ChatGPT / GPT-4o",maker:"OpenAI",url:"https://chat.openai.com",price:"freemium",
   oneLiner:{cs:"Nejrozšířenější AI — multimodální, DALL-E obrázky, Voice mode a bohatý GPT Store.",en:"Most widely used AI — multimodal, DALL-E images, Voice mode and rich GPT Store."},
   bestFor:{cs:["Generování obrázků (DALL-E 3 přímo v chatu)","Voice mode — mluvená konverzace s AI v reálném čase","GPT Store — tisíce specializovaných AI asistentů","Kreativní psaní, brainstorming, příběhy"],en:["Image generation (DALL-E 3 directly in chat)","Voice mode — spoken real-time conversation with AI","GPT Store — thousands of specialized AI assistants","Creative writing, brainstorming, stories"]},
   notFor:{cs:["Extrémně dlouhé dokumenty (nižší context limit než Claude)","Kódování — Claude Sonnet je lepší"],en:["Extremely long documents (lower context limit than Claude)","Coding — Claude Sonnet is better"]},
   idealPrompts:{
     cs:["Vygeneruj obrázek:\nCo na něm má být: [popište scénu]\nStyl: [fotografie / ilustrace / umění]\nFormát: [na šířku / čtvereček / na výšku]",
         "Jsi [role — např. marketér, učitel, trenér]. Vymysli 20 nápadů na [téma].\nZahrň i neobvyklé — neboj se být kreativní.",
         "Napiš krátký příběh o [téma] ve stylu [žánr nebo autor]. Maximálně 500 slov."],
     en:["Generate image:\nWhat should be in it: [describe the scene]\nStyle: [photography / illustration / art]\nFormat: [landscape / square / portrait]","You are [role — e.g. marketer, teacher, coach]. Come up with 20 ideas for [topic].\nInclude unusual ones — don't be afraid to be creative.","Write a short story about [topic] in the style of [genre or author]. Maximum 500 words."],
   },
   versions:{cs:"GPT-4o Mini (zdarma) · GPT-4o (zdarma s limity) · o3-mini (Plus $20) · o3 (Pro $200).",en:"GPT-4o Mini (free) · GPT-4o (free with limits) · o3-mini (Plus $20) · o3 (Pro $200)."},
   tags:["kreativita","obrázky","voice","multimodální"],
  },
  {name:"o3 / o3-mini",maker:"OpenAI",url:"https://chat.openai.com",price:"paid",
   oneLiner:{cs:"OpenAI reasoning model — nejlepší na matematiku, vědu, logiku a složité kódovací architektury.",en:"OpenAI reasoning model — best at math, science, logic and complex coding architectures."},
   bestFor:{cs:["Matematika a vědecké výpočty","Logické hádanky a formální důkazy","Komplexní kódovací problémy vyžadující architekturu","Analýza dat s numerickými výpočty"],en:["Math and scientific calculations","Logic puzzles and formal proofs","Complex coding problems requiring architecture","Data analysis with numerical computations"]},
   notFor:{cs:["Kreativní psaní — analytický model, ne kreativní","Jednoduché konverzační úkoly"],en:["Creative writing — analytical model, not creative","Simple conversational tasks"]},
   idealPrompts:{
     cs:["Dokaž nebo vyvrať toto tvrzení: [tvrzení].\nUkaž mi každý krok — chci pochopit postup, nejen výsledek.",
         "Analyzuj tato data a řekni mi co je zajímavé:\n[vložte data]\n\nChci: tabulku + co to znamená + co bych měl udělat dál.",
         "Navrhni jak postavit [systém/aplikaci/nástroj].\nDůležité je: aby to zvládlo hodně uživatelů, bylo bezpečné a snadno opravitelné.\nVysvětli proč jsi zvolil toto řešení."],
     en:["Prove or disprove this claim: [claim].\nShow me every step — I want to understand the process, not just the result.","Analyze this data and tell me what's interesting:\n[paste data]\n\nI want: a table + what it means + what I should do next.","Design how to build [system/app/tool].\nImportant: it should handle many users, be secure and easy to fix.\nExplain why you chose this approach."],
   },
   versions:{cs:"o3-mini (ChatGPT Plus $20/měs) · o3 (ChatGPT Pro $200/měs). API přístup pro vývojáře.",en:"o3-mini (ChatGPT Plus $20/mo) · o3 (ChatGPT Pro $200/mo). API access for developers."},
   tags:["reasoning","matematika","věda","architektura"],
  },
  {name:"Gemini 2.5 Pro",maker:"Google",url:"https://gemini.google.com",price:"freemium",
   oneLiner:{cs:"Google AI s přístupem k internetu, Deep Research a integrací s celým Google Workspace.",en:"Google AI with internet access, Deep Research and integration with entire Google Workspace."},
   bestFor:{cs:["Aktuální research s citacemi zdrojů","Deep Research: 30min hloubková analýza (50+ zdrojů)","Google Workspace integrace (Gmail, Docs, Sheets, Drive)","1M token kontext — celá kódová base nebo celá kniha najednou"],en:["Current research with source citations","Deep Research: 30min in-depth analysis (50+ sources)","Google Workspace integration (Gmail, Docs, Sheets, Drive)","1M token context — entire codebase or entire book at once"]},
   notFor:{cs:["Kreativní psaní — Claude/ChatGPT jsou lepší","Kódování — Claude Sonnet je lepší"],en:["Creative writing — Claude/ChatGPT are better","Coding — Claude Sonnet is better"]},
   idealPrompts:{
     cs:["Chci vědět vše o tomto tématu: [téma]\nNajdi aktuální informace z internetu a dej mi přehled s odkazem na zdroje.\nZaměř se na: [co vás zajímá konkrétně]",
         "Najdi co se za poslední 3 měsíce dělo kolem [firmy/tématu].\nCo jsou nejdůležitější změny a co to znamená pro [váš obor]?",
         "Prohledej mé Google Dokumenty a najdi vše o [tématu].\nSeřaď výsledky od nejrelevantnějšího."],
     en:["I want to know everything about this topic: [topic]\nFind current information from the internet and give me an overview with source links.\nFocus on: [what specifically interests you]","Find what happened in the last 3 months around [company/topic].\nWhat are the most important changes and what does it mean for [your field]?","Search my Google Documents and find everything about [topic].\nSort results from most relevant."],
   },
   versions:{cs:"2.0 Flash (zdarma, rychlý) · 2.5 Pro (Google One Premium nebo Gemini Advanced).",en:"2.0 Flash (free, fast) · 2.5 Pro (Google One Premium or Gemini Advanced)."},
   tags:["internet","research","Google integrace","1M kontext"],
  },
  {name:"NotebookLM",maker:"Google",url:"https://notebooklm.google.com",price:"free",
   oneLiner:{cs:"Osobní AI asistent pro vaše vlastní dokumenty — shrnutí, FAQ, studijní kartičky a audio podcast.",en:"Personal AI assistant for your own documents — summaries, FAQ, study cards and audio podcast."},
   bestFor:{cs:["Studium z vlastních materiálů — PDF, Word, YouTube odkaz","Audio Overview: 10–15min podcast ze vašich dokumentů","Analýza výročních zpráv, smluv a technické dokumentace","Propojení informací z více dokumentů najednou"],en:["Studying from your own materials — PDF, Word, YouTube link","Audio Overview: 10–15min podcast from your documents","Analysis of annual reports, contracts and technical documentation","Connecting information across multiple documents at once"]},
   notFor:{cs:["Informace z internetu — vidí jen vaše nahrané dokumenty","Generování nového obsahu od nuly"],en:["Internet information — sees only your uploaded documents","Generating new content from scratch"]},
   idealPrompts:{
     cs:["Shrň tento dokument do 5 nejdůležitějších bodů.\nPiš tak, aby to pochopil někdo bez odborného vzdělání.",
         "Vytvoř z těchto materiálů 10 testových otázek.\nKaždá otázka musí mít správnou odpověď a odkaz na místo v dokumentu.",
         "Porovnej dokument A a dokument B.\nKde souhlasí? Kde si odporují? Co je v jednom a ne ve druhém?"],
     en:["Summarize this document into 5 most important points.\nWrite so someone without expert knowledge understands it.","Create 10 test questions from these materials.\nEach question must have the correct answer and a reference to where it appears in the document.","Compare document A and document B.\nWhere do they agree? Where do they contradict? What's in one but not the other?"],
   },
   versions:{cs:"NotebookLM zdarma · NotebookLM Plus (Google One) — více notebooků, prioritní přístup.",en:"NotebookLM free · NotebookLM Plus (Google One) — more notebooks, priority access."},
   tags:["dokumenty","studium","podcast","zdarma"],
  },
  {name:"DeepSeek R1",maker:"DeepSeek",url:"https://chat.deepseek.com",price:"free",
   oneLiner:{cs:"Open-source reasoning model zcela zdarma — srovnatelný s o1, viditelný chain-of-thought.",en:"Open-source reasoning model completely free — comparable to o1, visible chain-of-thought."},
   bestFor:{cs:["Matematika, logika a technické problémy","Kódování a debugging — chain-of-thought reasoning viditelný","Lokální nasazení přes Ollama pro soukromá data","Bezplatná alternativa k o1 bez žádných limitů"],en:["Math, logic and technical problems","Coding and debugging — chain-of-thought reasoning visible","Local deployment via Ollama for private data","Free alternative to o1 with no limits at all"]},
   notFor:{cs:["Kreativní psaní","Pozor: data zpracovávána na čínských serverech"],en:["Creative writing","Note: data processed on Chinese servers"]},
   idealPrompts:{
     cs:["Vyřeš tento příklad krok za krokem:\n[problém]\n\nNepiš jen výsledek — ukaž mi jak jsi k němu dospěl.",
         "Tenhle kód nefunguje. Najdi chybu a vysvětli mi proč tam je:\n\n[kód]\n\nChyba: [co se děje]\nMělo by se dít: [popis]",
         "Přečti tento argument a řekni mi kde je logická chyba:\n[argument]\n\nBuď konkrétní — ukáž přesně kde a proč to nefunguje."],
     en:["Solve this example step by step:\n[problem]\n\nDon't just write the result — show me how you got there.","This code doesn't work. Find the bug and explain why it's there:\n\n[code]\n\nError: [what's happening]\nShould do: [description]","Read this argument and tell me where the logical error is:\n[argument]\n\nBe specific — show exactly where and why it doesn't work."],
   },
   versions:{cs:"V3 (rychlý, zdarma) · R1 (reasoning, zdarma) · Lokálně přes Ollama (open-source).",en:"V3 (fast, free) · R1 (reasoning, free) · Locally via Ollama (open-source)."},
   tags:["zdarma","reasoning","matematika","open-source"],
  },
  {name:"Perplexity",maker:"Perplexity AI",url:"https://perplexity.ai",price:"freemium",
   oneLiner:{cs:"AI vyhledávač s citacemi zdrojů — pro research, ověřování faktů a aktuální data.",en:"AI search engine with source citations — for research, fact-checking and current data."},
   bestFor:{cs:["Aktuální fakta a novinky — vždy cituje zdroje","Deep Research (Pro): 20–30min hloubkový výzkum s 50+ zdroji","Srovnání produktů s aktuálními recenzemi a cenami","Spaces: sdílené výzkumné prostory pro týmy"],en:["Current facts and news — always cites sources","Deep Research (Pro): 20–30min in-depth research with 50+ sources","Product comparisons with current reviews and prices","Spaces: shared research spaces for teams"]},
   notFor:{cs:["Generování textového obsahu — Claude/ChatGPT jsou lepší","Kódování"],en:["Generating text content — Claude/ChatGPT are better","Coding"]},
   idealPrompts:{
     cs:["Co se aktuálně děje kolem [tématu]? Hledej z posledního měsíce.\nUveď odkud informace pocházejí.",
         "Porovnej [nástroj A] a [nástroj B]:\n• Cena\n• Co umí\n• Hodnocení uživatelů\n• Pro koho se hodí lépe",
         "Potřebuji podrobný přehled o [trh/firma/technologie].\nBude sloužit k: [rozhodnutí nebo projekt]\nChci citace zdrojů u každého tvrzení."],
     en:["What's currently happening around [topic]? Search from the last month.\nState where the information comes from.","Compare [tool A] and [tool B]:\n• Price\n• Features\n• User ratings\n• Who is each better for","I need a detailed overview of [market/company/technology].\nWill be used for: [decision or project]\nI want source citations for each claim."],
   },
   versions:{cs:"Zdarma (základní dotazy) · Pro ($20/měs) — Deep Research, Claude/GPT-4o backend, více dotazů.",en:"Free (basic queries) · Pro ($20/mo) — Deep Research, Claude/GPT-4o backend, more queries."},
   tags:["vyhledávání","citace","research","aktuální info"],
  },
  {name:"Midjourney v7",maker:"Midjourney",url:"https://midjourney.com",price:"paid",
   oneLiner:{cs:"Nejlepší AI generátor obrázků — fotografická kvalita a umělecká estetika bez konkurence.",en:"Best AI image generator — photographic quality and artistic aesthetics without competition."},
   bestFor:{cs:["Profesionální komerční vizuály a produktová fotografie","Umělecké ilustrace a konceptuální vizuály","Konzistentní vizuální identita (--cref pro konzistentní postavu)","Brand moodboardy a marketingové kampaně"],en:["Professional commercial visuals and product photography","Artistic illustrations and conceptual visuals","Consistent visual identity (--cref for character consistency)","Brand moodboards and marketing campaigns"]},
   notFor:{cs:["Text v obrázcích — Ideogram.ai je lepší","Bezplatné testování — placeno od $10/měs"],en:["Text in images — Ideogram.ai is better","Free testing — paid from $10/month"]},
   idealPrompts:{
     cs:["[co chcete vidět], filmová fotografie, 85mm objektiv, zlaté světlo, melancholická atmosféra, zrno filmu --ar 16:9 --v 7",
         "Produktová fotografie: [produkt], studijní osvětlení, bílé pozadí, komerční kvalita --ar 1:1 --v 7",
         "Nevíte jak napsat prompt? Napište to Claude:\n'Napiš Midjourney v7 prompt — chci vytvořit:\n[popište česky co chcete]'"],
     en:["[what you want to see], cinematic photography, 85mm lens, golden light, melancholic atmosphere, film grain --ar 16:9 --v 7","Product photography: [product], studio lighting, white background, commercial quality --ar 1:1 --v 7","Don't know how to write a prompt? Tell Claude:\n'Write a Midjourney v7 prompt — I want to create:\n[describe in plain language]'"],
   },
   versions:{cs:"v7 (výchozí, nejnovější) · --niji 7 (anime styl). Plány: Basic $10, Standard $30, Pro $60/měs.",en:"v7 (default, latest) · --niji 7 (anime style). Plans: Basic $10, Standard $30, Pro $60/mo."},
   tags:["obrázky","fotografie","komerční","kreativní"],
  },
  {name:"Nano Banana Pro",maker:"Nano Banana",url:"https://nanobananapro.com",price:"freemium",
   oneLiner:{cs:"Nejjednodušší AI generátor obrázků — napíšete popis česky a obrázek je hotový za 10 sekund.",en:"Simplest AI image generator — write description and image is ready in 10 seconds."},
   bestFor:{cs:["Úplní začátečníci — bez registrace a nastavení","Rychlé prototypy a vizuály pro prezentace","Generování obrázků bez znalosti anglické terminologie","Sociální sítě, příspěvky, miniatury videí"],en:["Complete beginners — no registration or setup","Quick prototypes and visuals for presentations","Generating images without knowledge of English terminology","Social media, posts, video thumbnails"]},
   notFor:{cs:["Profesionální komerční fotografie — Midjourney je lepší","Konzistentní vizuální identity přes více obrázků"],en:["Professional commercial photography — Midjourney is better","Consistent visual identity across multiple images"]},
   idealPrompts:{
     cs:["Fotografie kávového šálku na dřevěném stole, teplé světlo, rozostřené pozadí",
         "Profesionální portrét ženy v kanceláři, přirozené světlo z okna, neutrální pozadí",
         "Logo pro [typ firmy], minimalistické, moderní, barvy: [barvy]"],
     en:["Photo of coffee cup on wooden table, warm light, blurred background","Professional portrait of woman in office, natural window light, neutral background","Logo for [type of business], minimalist, modern, colors: [colors]"],
   },
   versions:{cs:"Nano Banana Pro — zdarma s limity, placený plán pro více obrázků.",en:"Nano Banana Pro — free with limits, paid plan for more images."},
   tags:["obrázky","začátečníci","jednoduché","zdarma"],
  },
  {name:"ElevenLabs",maker:"ElevenLabs",url:"https://elevenlabs.io",price:"freemium",
   oneLiner:{cs:"Nejrealističtější AI hlasy — klonování hlasu, podcasty, dubbing videí a hlasové API.",en:"Most realistic AI voices — voice cloning, podcasts, video dubbing and voice API."},
   bestFor:{cs:["Klonování vlastního hlasu (stačí 1 minuta nahrávky)","Podcasty, videokurzy a audio obsah bez studia","Dubbing a překlad videí do dalších jazyků","Hlasový agent v aplikaci — API integrace"],en:["Voice cloning (just 1 minute recording)","Podcasts, video courses and audio content without studio","Video dubbing and translation to other languages","Voice agent in app — API integration"]},
   notFor:{cs:["Rychlé jednoduché prototypy — Google TTS je rychlejší a levnější","Masová produkce bez kontroly kvality"],en:["Quick simple prototypes — Google TTS is faster and cheaper","Mass production without quality control"]},
   idealPrompts:{
     cs:["Vytvořte hlas s těmito vlastnostmi:\nKlidný ženský hlas, profesionální jako novinářka.\nMírně pomalejší tempo. Středoevropský přízvuk.",
         "Postup pro dabování videa:\n1. Nahrajte video\n2. Zvolte cílový jazyk\n3. ElevenLabs zachová váš hlas i emoce — jen v jiném jazyce",
         "Naklonovat svůj hlas:\n1. Nahrajte 1 minutu čistého záznamu vašeho hlasu\n2. Pojmenujte hlas\n3. Použijte ho pro generování libovolného textu"],
     en:["Create a voice with these qualities:\nCalm female voice, professional like a journalist.\nSlightly slower pace. Central European accent.","Steps for video dubbing:\n1. Upload video\n2. Choose target language\n3. ElevenLabs preserves your voice and emotions — just in a different language","Clone your own voice:\n1. Upload 1 minute of clean voice recording\n2. Name the voice\n3. Use it to generate any text"],
   },
   versions:{cs:"Free (10k znaků/měs) · Starter $5 · Creator $22 · Pro $99/měs.",en:"Free (10k chars/mo) · Starter $5 · Creator $22 · Pro $99/mo."},
   tags:["hlas","audio","klonování","dubbing"],
  },
  {name:"Claude Code",maker:"Anthropic",url:"https://claude.ai/code",price:"paid",
   oneLiner:{cs:"Terminálový AI vývojář — čte celý projekt, píše, edituje a testuje kód přímo ve vašem repozitáři.",en:"Terminal AI developer — reads entire project, writes, edits and tests code directly in your repo."},
   bestFor:{cs:["Multi-file editace celého projektu v terminálu","Claude Skills (~/.claude/skills/) — uložte coding standards jako .md","SEO audit přes /seo skill, CI/CD pipeline generování","Sub-agent orchestrace: Sonnet plánuje, Haiku vykonává paralelně"],en:["Multi-file editing of entire project in terminal","Claude Skills (~/.claude/skills/) — save coding standards as .md","SEO audit via /seo skill, CI/CD pipeline generation","Sub-agent orchestration: Sonnet plans, Haiku executes in parallel"]},
   notFor:{cs:["Jednorázové jednoduché skripty — claude.ai chat stačí","Bez Claude Pro nebo API klíče"],en:["One-off simple scripts — claude.ai chat is enough","Without Claude Pro or API key"]},
   idealPrompts:{
     cs:["/init  ← tímto začněte každý nový projekt\nClaude prozkoumá vaše soubory a vytvoří dokumentaci\n\n/clear  ← použijte když Claude začne dávat horší odpovědi\nVyresetuje paměť a znovu se soustředí",
         "Přečti ARCHITECTURE.md a CLAUDE.md.\nPak přidej tuto funkci: [popis co chcete]\nDodržuj stávající styl kódu.\nPo každé změně otestuj jestli vše funguje.",
         "Vytvoř složku ~/.claude/skills/ a v ní soubor [název].md\nTento soubor bude obsahovat instrukce jak [co má dělat — např. psát emaily, dělat SEO audit, zapisovat poznámky ze schůzek]"],
     en:["/init  ← start every new project with this\nClaude explores your files and creates documentation\n\n/clear  ← use when Claude starts giving worse answers\nResets memory and refocuses","Read ARCHITECTURE.md and CLAUDE.md.\nThen add this feature: [description of what you want]\nFollow the existing code style.\nAfter each change test that everything works.","Create folder ~/.claude/skills/ and in it a file [name].md\nThis file will contain instructions for how to [what it should do — e.g. write emails, do SEO audit, take meeting notes]"],
   },
   versions:{cs:"Terminál — npm install -g @anthropic/claude-code. Potřebuje Claude Pro nebo API klíč.",en:"Terminal — npm install -g @anthropic/claude-code. Requires Claude Pro or API key."},
   tags:["kódování","terminál","multi-agent","SEO"],
  },
];

// ─── PROMPTS ──────────────────────────────────────────────────────────────────
const PROMPTS = {
  beginner:[
    {task:{cs:"Psaní emailu",en:"Writing emails"},icon:"▸",mods:["Claude","ChatGPT"],
     ptip:{cs:"Klíč je kontext: komu, proč, co chcete dosáhnout. Čím víc řeknete, tím méně budete muset opravovat.",en:"Key is context: who, why, what you want to achieve. The more you say, the less you'll have to fix."},
     ps:[
       {label:{cs:"Formální email — šablona",en:"Formal email — template"},p:{
         cs:"Napiš formální email.\n\nKomu: [šéf / klient / úřad / kolega]\nTéma: [o čem píšete]\nSituace: [1–2 věty co se stalo nebo co chcete]\nPožadovaný výsledek: [co má příjemce udělat]\n\nPravidla:\n• Max 100 slov\n• Profesionální, věcný tón\n• Na konci jasný next step nebo termín\n• Předmět emailu jako první řádek",
         en:"Write a formal email.\n\nTo: [boss / client / office / colleague]\nSubject: [what it's about]\nSituation: [1–2 sentences about what happened]\nDesired outcome: [what recipient should do]\n\nRules:\n• Max 100 words\n• Professional, factual tone\n• Clear next step or deadline at the end\n• Email subject as the first line",
       }},
       {label:{cs:"Omluva za zpoždění",en:"Apology for delay"},p:{
         cs:"Napiš email — omluva za zpoždění.\n\nKomu: [šéf / klient]\nCo bylo zpožděno: [projekt / dodávka / odpověď]\nPříčina: [1 věta — krátce]\nCo teď udělám: [konkrétní krok + termín]\n\nMax 80 slov. Formální tón. Jednou se omluv — pak přejdi na řešení.",
         en:"Write email — apology for delay.\n\nTo: [boss / client]\nWhat was delayed: [project / delivery / response]\nReason: [1 sentence — briefly]\nWhat I'll do now: [concrete step + deadline]\n\nMax 80 words. Formal tone. Apologize once — then move to solution.",
       }},
       {label:{cs:"Žádost o schůzku",en:"Meeting request"},p:{
         cs:"Napiš email — žádost o 30minutovou schůzku.\n\nKomu: [jméno / pozice]\nProč: [1 věta — jasný důvod]\nCo jim přinesu: [1–2 věty hodnoty pro ně]\nNabízené časy: [2–3 možnosti]\n\nMax 5 vět v těle emailu. Předmět: max 6 slov.",
         en:"Write email — request for 30-minute meeting.\n\nTo: [name / position]\nWhy: [1 sentence — clear reason]\nWhat I bring them: [1–2 sentences of value for them]\nSuggested times: [2–3 options]\n\nMax 5 sentences in email body. Subject: max 6 words.",
       }},
     ],
    },
    {task:{cs:"Vysvětlení a shrnutí",en:"Explanation and summary"},icon:"▸",mods:["Claude","ChatGPT"],
     ptip:{cs:"Vždy specifikujte KOMU je vysvětlení určeno — 'jako laik' vs 'jako expert' výrazně mění odpověď.",en:"Always specify WHO the explanation is for — 'as a layperson' vs 'as an expert' significantly changes the response."},
     ps:[
       {label:{cs:"Vysvětlení pro laika",en:"Layperson explanation"},p:{
         cs:"Vysvětli mi tento text srozumitelně.\nJsem [vaše profese / vzdělání].\n\n[Vložte text nebo popište téma]\n\nChci vědět:\n1. Hlavní myšlenka v 1–2 větách\n2. Co to znamená pro mě v praxi?\n3. Jsou v tom rizika nebo věci na pozor?\n4. Co udělat jako první krok?\n\nPoužívej příklady z každodenního života. Bez odborného žargonu bez vysvětlení.",
         en:"Explain this text to me simply.\nI am [your profession / background].\n\n[Paste text or describe topic]\n\nI want to know:\n1. Main idea in 1–2 sentences\n2. What does it mean for me in practice?\n3. Are there risks or things to watch out for?\n4. What to do as first step?\n\nUse everyday examples. No jargon without explanation.",
       }},
       {label:{cs:"Shrnutí dokumentu pro manažera",en:"Document summary for manager"},p:{
         cs:"Shrň tento dokument.\n\n[nahrajte soubor nebo vložte text]\n\nVýstup:\n• 5 klíčových bodů (bullet points)\n• Co je nejdůležitější pro osobu v roli [vaše role]?\n• Jaké jsou moje povinnosti nebo nutné akce?\n\nMax 200 slov. Bez přímého citování celých vět.",
         en:"Summarize this document.\n\n[upload file or paste text]\n\nOutput:\n• 5 key points (bullet points)\n• What's most important for someone in role [your role]?\n• What are my obligations or required actions?\n\nMax 200 words. No direct quotation of full sentences.",
       }},
     ],
    },
    {task:{cs:"Stížnosti a úřední dopisy",en:"Complaints and official letters"},icon:"▸",mods:["Claude","ChatGPT"],
     ptip:{cs:"AI je výborný na formální dopisy — ví jak komunikovat věcně a citovat zákon bez emocí.",en:"AI is excellent at formal letters — knows how to communicate factually and reference law without emotion."},
     ps:[
       {label:{cs:"Odvolání nebo stížnost",en:"Appeal or complaint"},p:{
         cs:"Pomoz mi napsat formální stížnost nebo odvolání.\n\nKomu: [úřad / firma / pojišťovna / banka]\nCo se stalo: [přesný popis s daty a čísly]\nCo jsem už zkusil/a: [předchozí kroky]\nCo konkrétně chci: [přesný výsledek]\n\nPožadavky:\n• Tón: věcný, bez emocí\n• S odkazem na zákon nebo smlouvu (pokud relevantní)\n• Formát: datum — věc — tělo — žádost s termínem odpovědi\n• Působím jako někdo kdo zná svá práva",
         en:"Help me write a formal complaint or appeal.\n\nTo: [office / company / insurance / bank]\nWhat happened: [exact description with dates and numbers]\nWhat I've already tried: [previous steps]\nWhat I specifically want: [exact outcome]\n\nRequirements:\n• Tone: factual, without emotion\n• Reference law or contract (if relevant)\n• Format: date — subject — body — request with response deadline\n• I come across as someone who knows their rights",
       }},
       {label:{cs:"Motivační dopis",en:"Cover letter"},p:{
         cs:"Napiš motivační dopis na tuto pozici.\n\nPozice: [název]\nFirma: [název — doplň co víš]\nMoje zkušenosti: [2–3 věty co umíš]\nJejich požadavky: [hlavní body z inzerátu]\n\nPravidla:\n• Max 180 slov\n• Začni PROČ tě tato firma zajímá — NE 'Dovolte mi představit se'\n• Žádná klišé (komunikativní, týmový hráč)\n• Ukaž co přineseš jim, ne jen co hledáš ty\n• Výzva k dalšímu kroku na konci",
         en:"Write a cover letter for this position.\n\nPosition: [title]\nCompany: [name — add what you know]\nMy experience: [2–3 sentences about skills]\nTheir requirements: [key points from job posting]\n\nRules:\n• Max 180 words\n• Start with WHY this company interests you — NOT 'I would like to introduce myself'\n• No clichés (communicative, team player)\n• Show what you bring them, not just what you want\n• Call to action at the end",
       }},
     ],
    },
  ],
  intermediate:[
    {task:{cs:"Copywriting a prodejní texty",en:"Copywriting and sales texts"},icon:"▸",mods:["Claude","ChatGPT"],
     ptip:{cs:"Tip: Vždy napište co zákazník NAMÍTÁ — proč by nekoupil. Tato jedna informace navíc je rozdíl mezi textem který prodává a textem který jen informuje.",en:"Tip: Always write what the customer OBJECTS to — why they wouldn't buy. This one extra piece of information is the difference between copy that sells and copy that just informs."},
     ps:[
       {label:{cs:"Prodejní text (AIDA metoda)",en:"Sales copy (AIDA method)"},p:{
         cs:"Napiš prodejní text pro: [produkt nebo služba]\n\nPro koho to je: [věk, profese, hlavní problém který řeší]\nHlavní výhoda (proč zrovna ty): [buď konkrétní — ne 'kvalita a spolehlivost']\nProč by zákazník nekoupil: [co ho od koupě odrazuje — cena, nedůvěra, alternativa]\n\nChci text ve 4 částech:\n1. ZAUJMI: Nadpis který zasáhne jejich největší bolest nebo problém — ne 'Představujeme náš produkt'\n2. ZAUJMI VÍC: Vysvětli proč je jejich problém závažnější než si myslí\n3. TOUHA: Popiš konkrétní výsledek — ne vlastnosti produktu. Místo 'náš produkt umí X' napiš 'za 3 týdny budete mít Y'\n4. AKCE: Jedna věta co mají udělat teď a proč zrovna teď\n\nMax 300 slov.\n\n--- PŘÍKLAD VYPLNĚNÉHO PROMPTU ---\nProdukt: online kurz focení na mobil\nPro koho: maminky 30-45 let, chtějí hezké fotky dětí ale nemají čas učit se fotit\nHlavní výhoda: výsledky viditelné po 1. lekci, lekce trvají 15 minut\nProč by nekoupila: myslí si že na hezké fotky potřebuje drahý foťák",
         en:"Write sales copy for: [product or service]\n\nWho it's for: [age, profession, main problem they solve]\nMain advantage (why you): [be specific — not 'quality and reliability']\nWhy customer wouldn't buy: [what puts them off — price, distrust, alternatives]\n\nI want text in 4 parts:\n1. GRAB ATTENTION: Headline hitting their biggest pain — not 'Introducing our product'\n2. BUILD INTEREST: Explain why their problem is more serious than they think\n3. CREATE DESIRE: Describe specific outcome — not product features. Instead of 'our product does X' write 'in 3 weeks you'll have Y'\n4. CALL TO ACTION: One sentence what to do now and why right now\n\nMax 300 words.",
       }},
       {label:{cs:"Cold email — oslovení neznámého klienta",en:"Cold email — reaching unknown client"},p:{
         cs:"Cold email = email člověku který vás nezná a nečekal váš kontakt. Cílem NENÍ prodat hned — cílem je dostat 20minutový hovor.\n\nNapiš cold email pro:\nKomu píšu: [typ firmy nebo člověka]\nCo nabízím: [stručně]\nProč mu píšu teď: [konkrétní důvod proč právě teď — např. viděl jsem že hledáte nového zaměstnance, blíží se vám sezóna, váš konkurent právě udělal X]\nCo chci: 20minutový hovor\n\nPravidla:\n• Max 5 vět v těle emailu\n• První věta mluví o nich — ne o mně\n• Zmiň jeden konkrétní problém který pravděpodobně mají\n• Nepodepisuji se 'Dobrý den, jmenuji se...'\n• Předmět: max 6 slov\n\nNapiš 2 varianty — A) kratší a přímější, B) s konkrétním příkladem nebo výsledkem\n\n--- PŘÍKLAD VYPLNĚNÉHO PROMPTU ---\nKomu: majitelé e-shopů s módou\nCo nabízím: správu Instagram reklam\nProč teď: blíží se Vánoce — nejdůležitější sezóna pro prodeje\nCo chci: 20minutový hovor",
         en:"Cold email = email to someone who doesn't know you and wasn't expecting your contact. Goal is NOT to sell immediately — goal is to get a 20-minute call.\n\nWrite cold email for:\nWho I'm writing to: [type of company or person]\nWhat I offer: [briefly]\nWhy I'm writing now: [specific reason why right now]\nWhat I want: 20-minute call\n\nRules:\n• Max 5 sentences in body\n• First sentence about them — not me\n• Mention one specific problem they likely have\n• Don't start with 'My name is...'\n• Subject: max 6 words\n\nWrite 2 variants — A) shorter and more direct, B) with specific example or result",
       }},
       {label:{cs:"LinkedIn příspěvek",en:"LinkedIn post"},p:{
         cs:"Napiš LinkedIn příspěvek na téma: [téma nebo příběh]\n\nKdo to bude číst: [popis lidí na vašem LinkedIn]\nCo si mají odnést: [jedna hlavní myšlenka]\nJak chci působit: [odborně / osobně / inspirativně]\n\nStruktura příspěvku:\n• První věta (tzv. hook = háček): musí být tak zajímavá že lidé kliknou na 'Zobrazit více'. Příklad: šokující číslo, kontroverze, nebo neočekávaný výrok. NIKDY nezačínej 'Dnes bych chtěl/a sdílet...'\n• Prázdný řádek (LinkedIn ukrývá text za 'Zobrazit více' — prázdný řádek hned za hookem nutí lidi kliknout)\n• 2–4 věty vysvětlení proč je to důležité\n• Krátký seznam (odrážky = krátké body jedna pod druhou): 3–5 konkrétních tipů nebo poznatků\n• Závěr: otázka pro čtenáře nebo výzva k reakci\n• Max 3 hashtagy (slova s # na konci)\n\nDélka: 150–300 slov. Krátké odstavce — jeden nápad = jeden odstavec.\n\n--- PŘÍKLAD VYPLNĚNÉHO PROMPTU ---\nTéma: Jak jsem přestala trávit 2 hodiny denně psaním emailů díky AI\nKdo to čte: freelanceři a OSVČ\nCo si odnesou: AI může ušetřit hodiny administrativy\nJak chci působit: osobně a prakticky",
         en:"Write a LinkedIn post on: [topic or story]\n\nWho will read it: [description of people in your LinkedIn network]\nWhat they should take away: [one main idea]\nHow I want to come across: [professional / personal / inspirational]\n\nPost structure:\n• First sentence (hook): must be interesting enough that people click 'See more'. Example: shocking number, controversy, or unexpected claim. NEVER start with 'Today I'd like to share...'\n• Empty line (LinkedIn hides text behind 'See more' — empty line right after hook forces people to click)\n• 2–4 sentences explaining why it matters\n• Short list (bullet points): 3–5 specific tips or insights\n• Closing: question for readers or call to engage\n• Max 3 hashtags\n\nLength: 150–300 words. Short paragraphs — one idea = one paragraph.",
       }},
     ],
    },
    {task:{cs:"Analýza dat a reporty",en:"Data analysis and reports"},icon:"▸",mods:["Claude","ChatGPT"],
     ptip:{cs:"Bez předepsané struktury AI vyprodukuje zeď textu. Klíč: řekněte přesně jaký výstup chcete a co s ním budete dělat.",en:"Without prescribed structure AI produces a wall of text. Key: say exactly what output you want and what you'll do with it."},
     ps:[
       {label:{cs:"Analýza dat (tabulka, CSV, Excel)",en:"Data analysis (spreadsheet, CSV, Excel)"},p:{
         cs:"Dataset = jakákoliv tabulka s daty — Excel, CSV soubor, nebo zkopírovaná tabulka.\n\nAnalyzuj přiložená data a dej mi výstup v této struktuře:\n\n1) PŘEHLED\nKolik řádků a sloupců? Jaká data tam jsou? Chybí něco?\n\n2) TOP 3 ZJIŠTĚNÍ\nCo jsou nejdůležitější věci které data říkají? Každé zjištění = 1 věta + konkrétní číslo.\n\n3) CO VYPADÁ DIVNĚ\n(Anomálie = hodnota nebo vzor který se výrazně liší od ostatních — např. jeden měsíc s extrémně nízkými prodeji, nebo zákazník s neobvykle vysokou objednávkou.) Pokud něco takového vidíš, řekni mi to a proč by to mohlo být důležité.\n\n4) DOPORUČENÍ\nCo bych měl/a udělat jako první a proč?\n\nPozn. k grafům: AI ti nevykreslí graf přímo, ale navrhne co zobrazit — ty pak graf uděláš v Excelu nebo Google Sheets.\n\nMax 3–5 vět na každý bod. Chci stručný report, ne akademickou práci.\n\n[nahrajte soubor nebo zkopírujte a vložte data]",
         en:"Dataset = any table with data — Excel, CSV file, or copied table.\n\nAnalyze the attached data and give me output in this structure:\n\n1) OVERVIEW\nHow many rows and columns? What data is there? Is anything missing?\n\n2) TOP 3 FINDINGS\nWhat are the most important things the data says? Each finding = 1 sentence + specific number.\n\n3) WHAT LOOKS UNUSUAL\n(Anomaly = a value or pattern that differs significantly from others — e.g. one month with extremely low sales, or a customer with unusually high order.) If you see anything like this, tell me and why it might matter.\n\n4) RECOMMENDATIONS\nWhat should I do first and why?\n\nNote on charts: AI won't draw a chart directly, but will suggest what to show — you then make the chart in Excel or Google Sheets.\n\nMax 3–5 sentences per point. I want a brief report, not an academic paper.\n\n[upload file or copy and paste data]",
       }},
       {label:{cs:"Analýza zákaznických recenzí",en:"Customer review analysis"},p:{
         cs:"Analyzuj tato zákaznická hodnocení a řekni mi co z nich vyplývá.\n\n[vložte text recenzí — zkopírujte je přímo sem]\n\nChci vědět:\n1) TOP 3 věci zákazníci CHVÁLÍ — u každé dej příklad přesné citace z recenze\n2) TOP 3 věci zákazníci KRITIZUJÍ — u každé dej příklad přesné citace\n3) CO ZÁKAZNÍCI CHTĚJÍ ALE PŘÍMO NEŘÍKAJÍ — co opakovaně naznačují nebo z čeho je cítit frustrace?\n4) CO UDĚLAT JAKO PRVNÍ — jedna konkrétní věc a proč právě ta\n5) CELKOVÉ VYZNĚNÍ (sentiment = zda jsou recenze spíš pozitivní, negativní nebo smíšené): odhadni přibližně kolik procent je pozitivních vs negativních\n\nIgnoruj obecné fráze jako 'doporučuji' nebo 'dobrá kvalita'. Hledej konkrétní vzory.",
         en:"Analyze these customer reviews and tell me what they reveal.\n\n[paste review text — copy them directly here]\n\nI want to know:\n1) TOP 3 things customers PRAISE — include an example exact quote from a review for each\n2) TOP 3 things customers CRITICIZE — include an example exact quote for each\n3) WHAT CUSTOMERS WANT BUT DON'T SAY DIRECTLY — what do they repeatedly hint at or what frustration comes through?\n4) WHAT TO DO FIRST — one concrete thing and why that one\n5) OVERALL TONE (sentiment = whether reviews are mostly positive, negative or mixed): estimate roughly what % are positive vs negative\n\nIgnore generic phrases like 'would recommend' or 'good quality'. Look for specific patterns.",
       }},
     ],
    },
    {task:{cs:"Kódování — pomoc s kódem",en:"Coding — help with code"},icon:"▸",mods:["Claude Sonnet","ChatGPT"],
     ptip:{cs:"Nemusíte umět programovat — stačí popsat co chcete a Claude kód napíše za vás. Čím přesněji popíšete co dovnitř vstupuje a co má vyjít ven, tím lepší kód dostanete.",en:"You don't need to know programming — just describe what you want and Claude writes the code. The more precisely you describe what goes in and what should come out, the better code you'll get."},
     ps:[
       {label:{cs:"Napsat jednoduchý skript (pro začátečníky v kódu)",en:"Write a simple script (for coding beginners)"},p:{
         cs:"Chci napsat jednoduchý skript (= krátký program) v [jazyk — napiš Python pokud nevíte jiný].\n\nCo má skript dělat:\n[popište česky co chcete — co se stane na začátku, co se zpracuje, co dostanu na konci]\n\nVstup (co do skriptu dám):\n[příklad: 'soubor CSV s názvy produktů a cenami' nebo 'jméno zákazníka' nebo 'číslo']\n\nVýstup (co chci dostat zpět):\n[příklad: 'nový soubor kde jsou ceny zvýšené o 10%' nebo 'vypočítaná suma' nebo 'zpráva v textu']\n\nPravidla:\n• Piš kód jednoduše — jsem začátečník, chci aby byl čitelný\n• Přidej krátký komentář u každého kroku co dělá\n• Na konci mi řekni jak skript spustit\n\n--- PŘÍKLAD VYPLNĚNÉHO PROMPTU ---\nJazyk: Python\nCo má dělat: Přečíst soubor s emaily zákazníků a vyfiltrovat jen ty kteří mají gmail.com adresu\nVstup: soubor zakaznici.csv kde první sloupec je jméno, druhý email\nVýstup: nový soubor gmail_zakaznici.csv jen s gmail uživateli",
         en:"I want to write a simple script (= short program) in [language — write Python if you don't know another].\n\nWhat the script should do:\n[describe in plain language — what happens at the start, what gets processed, what I get at the end]\n\nInput (what I put into the script):\n[example: 'CSV file with product names and prices' or 'customer name' or 'a number']\n\nOutput (what I want to get back):\n[example: 'new file with prices increased by 10%' or 'calculated sum' or 'a message in text']\n\nRules:\n• Write code simply — I'm a beginner, I want it to be readable\n• Add a short comment at each step explaining what it does\n• At the end tell me how to run the script",
       }},
       {label:{cs:"Opravit nefungující kód",en:"Fix broken code"},p:{
         cs:"Tenhle kód nefunguje a nevím proč. Pomoz mi to opravit.\n\nJazyk: [Python / JavaScript / jiný]\n\nKód který nefunguje:\n```\n[vložte kód sem — zkopírujte ho]\n```\n\nCo se děje (chyba nebo špatné chování):\n[napište přesně co vidíte — buď chybovou hlášku nebo popište co se děje špatně]\nPříklad: 'Zobrazuje se červená hláška: NameError: name x is not defined'\nNebo: 'Skript se spustí ale vrátí prázdný výsledek místo dat'\n\nCo by se místo toho mělo dít:\n[popište co jste čekali]\n\nProsím:\n1) Najdi a vysvětli mi co je špatně a PROČ k tomu dochází — chci rozumět, ne jen zkopírovat opravu\n2) Oprav to\n3) Řekni mi jak příště podobné chybě předejít\n\n--- PŘÍKLAD VYPLNĚNÉHO PROMPTU ---\nJazyk: Python\nChyba: TypeError: can only concatenate str (not 'int') to str — na řádku 5\nOčekávání: skript měl sečíst dvě čísla a vypsat výsledek, místo toho se zastavil s chybou",
         en:"This code doesn't work and I don't know why. Help me fix it.\n\nLanguage: [Python / JavaScript / other]\n\nCode that doesn't work:\n```\n[paste code here — copy it]\n```\n\nWhat's happening (error or wrong behavior):\n[write exactly what you see — either the error message or describe what's going wrong]\nExample: 'Red message appears: NameError: name x is not defined'\nOr: 'Script runs but returns empty result instead of data'\n\nWhat should happen instead:\n[describe what you expected]\n\nPlease:\n1) Find and explain what's wrong and WHY it happens — I want to understand, not just copy a fix\n2) Fix it\n3) Tell me how to prevent similar errors in the future",
       }},
     ],
    },
    {task:{cs:"Research a průzkum trhu",en:"Research and market analysis"},icon:"▸",mods:["Perplexity","Claude","Gemini"],
     ptip:{cs:"Na faktuální research (aktuální data, čísla, zdroje) použijte Perplexity — vždy ukáže odkud info vzal. Na analýzu a závěry z dat použijte Claude.",en:"For factual research (current data, numbers, sources) use Perplexity — always shows where info came from. For analysis and conclusions from data use Claude."},
     ps:[
       {label:{cs:"Průzkum trhu nebo tématu",en:"Market or topic research"},p:{
         cs:"KDY TO POUŽÍT: Chystáte se začít podnikat, přidáváte nový produkt, nebo jen chcete vědět co se děje ve vašem oboru. Místo hodin googlení dostanete přehled za minuty.\n\nProveď průzkum na téma: [vaše téma]\n\nProč to zjišťuji: [napište co s tím budete dělat — pomůže AI vybrat správné informace]\nPříklad: 'rozhoduji se jestli začít s e-shopem s ekologickými produkty' nebo 'připravuji prezentaci pro klienta'\n\nChci vědět:\n1) Jak to dnes vypadá — 3 až 5 klíčových faktů o tomto trhu nebo tématu\n2) Kdo jsou největší hráči — největší firmy nebo lidé v tomto oboru a co dělají\n3) Co se mění — jaké trendy nebo změny nastaly za poslední 2 roky (konkrétně, ne obecně)\n4) Kde jsou příležitosti — co zatím nikdo nedělá dobře nebo co zákazníci postrádají\n5) Co čekat — co se pravděpodobně stane v tomto oboru za 2–3 roky\n\nU každé informace uveď odkud to víš (odkaz nebo název zdroje).\n\n--- PŘÍKLAD VYPLNĚNÉHO PROMPTU ---\nTéma: trh s online kurzy v ČR\nProč zjišťuji: zvažuji spustit vlastní online kurz o fotografii\nKlíčová otázka: Je tam místo pro nové kurzy nebo je trh přeplněný?",
         en:"WHEN TO USE: You're about to start a business, adding a new product, or just want to know what's happening in your field. Instead of hours of googling you get an overview in minutes.\n\nConduct research on: [your topic]\n\nWhy I'm finding this out: [write what you'll do with it — helps AI pick the right info]\nExample: 'deciding whether to start an e-shop with eco products' or 'preparing a client presentation'\n\nI want to know:\n1) What it looks like today — 3 to 5 key facts about this market or topic\n2) Who are the biggest players — largest companies or people in this field and what they do\n3) What's changing — what trends or changes happened in the last 2 years (specific, not general)\n4) Where the opportunities are — what nobody does well yet or what customers are missing\n5) What to expect — what will probably happen in this field in 2–3 years\n\nFor each piece of information state where you know it from (link or source name).",
       }},
       {label:{cs:"Porovnání nástrojů nebo produktů",en:"Tool or product comparison"},p:{
         cs:"KDY TO POUŽÍT: Nevíte jaký nástroj, software nebo produkt vybrat. Místo čtení desítek recenzí dostanete přehledné srovnání.\n\nPorovnej tyto možnosti: [A] vs [B] vs [C]\n\nPro jaký účel to hledám: [popište konkrétně k čemu to budete používat — to je nejdůležitější část]\nKdo to bude používat: [vy sami / váš tým / zákazníci]\n\nZajímá mě:\n• Cena — kolik to stojí a jak se platí (měsíčně / jednorázově / podle počtu uživatelů)\n• Co to umí — hlavní funkce které jsou důležité pro můj účel\n• Co to neumí nebo v čem je to slabé\n• S čím to funguje dohromady — například: 'propojí se to s mým Gmailem nebo Excelem?'\n• Pro koho se každá možnost hodí nejlépe\n\nNa konci: dej mi konkrétní doporučení pro moji situaci — ne 'záleží na situaci' bez vysvětlení.\n\n--- PŘÍKLAD VYPLNĚNÉHO PROMPTU ---\nMožnosti: Notion vs Google Docs vs Confluence\nÚčel: sdílení dokumentů a poznámek v týmu 5 lidí, hlavně zapisujeme schůzky a projekty\nKdo to používá: já + 4 kolegové, různá technická zdatnost\nNejdůležitější: jednoduchost, cena, propojení s Google kalendářem",
         en:"WHEN TO USE: You don't know which tool, software or product to choose. Instead of reading dozens of reviews you get a clear comparison.\n\nCompare these options: [A] vs [B] vs [C]\n\nWhat I'm looking for it for: [describe specifically what you'll use it for — this is the most important part]\nWho will use it: [yourself / your team / customers]\n\nI care about:\n• Price — how much it costs and how you pay (monthly / one-time / per user)\n• What it can do — main features important for my purpose\n• What it can't do or where it's weak\n• What it works with — for example: 'will it connect with my Gmail or Excel?'\n• Who each option is best suited for\n\nAt the end: give me a specific recommendation for my situation — not 'it depends' without explanation.",
       }},
     ],
    },
    {task:{cs:"Tvorba videí — jak napsat dobrý prompt",en:"Video creation — how to write a good prompt"},icon:"▸",mods:["Runway","Higgsfield","Kling"],
     ptip:{cs:"AI videa nevycházejí špatně kvůli nástroji — ale kvůli nepřesnému popisu. Čím konkrétněji popíšete pohyb a scénu, tím lepší výsledek dostanete.",en:"AI videos don't fail due to the tool — but due to imprecise description. The more specifically you describe the motion and scene, the better the result."},
     ps:[
       {label:{cs:"Kompletní video prompt s vysvětlením",en:"Complete video prompt with explanation"},p:{
         cs:"Napiš popis pro AI video generátor (Runway / Kling / Higgsfield) takto:\n\nKDO nebo CO je ve videu:\n[přesný popis — ne jen 'žena', ale 'mladá žena v červeném kabátu, tmavé vlasy']\n\nCO SE DĚJE (pohyb):\n[konkrétní pohyb — ne jen 'jde', ale 'pomalu kráčí ulicí, dívá se do vitríny']\n\nKDE a KDY:\n[místo + atmosféra — 'centrum Prahy, večer, mokrá dlažba odráží světla reklam']\n\nVIZUÁLNÍ STYL:\n[jak má video vypadat — vyberte jedno:\n• jako film — 'filmový styl, cinematická kvalita'\n• jako dokument — 'dokumentární styl, přirozené světlo'\n• zpomaleně — 'slow motion, každý detail viditelný'\n• z ruky — 'kamera z ruky, pohyblivý obraz jako reportáž']\n\nPOHYB KAMERY:\n[jak se kamery pohybuje — vyberte jedno:\n• 'kamera se pomalu přibližuje' (zoom in)\n• 'kamera sleduje postavu' (sledovací záběr)\n• 'kamera se pomalu posouvá doprava' (panorama)\n• 'kamera stojí na místě' (statický záběr)]\n\nOSVĚTLENÍ:\n['zlaté světlo západu slunce' / 'studené modré světlo noci' / 'teplé studijní osvětlení' / 'přirozené denní světlo']\n\nCO NECHCI (negativní prompt = seznam věcí které AI má vyloučit):\n['rozmazaný obraz, nerealistické ruce, zkreslené proporce, špatná kvalita']\n\n--- VYPLNĚNÝ PŘÍKLAD ---\nKdo: mladá žena v červeném kabátu, tmavé vlasy\nCo se děje: pomalu kráčí ulicí, zastaví se, otočí hlavu a usměje se na kameru\nKde: centrum Prahy, večer po dešti, lesklá dlažba odráží světla\nStyl: filmový, cinematická kvalita\nPohyb kamery: kamera se pomalu přibližuje k obličeji\nOsvětlení: teplé zlaté světlo z výlohy obchodu\nNechci: rozmazaný obraz, nerealistický pohyb, špatné ruce\n\nTip: Nevíte jak začít? Dejte tento seznam Claude a řekněte: 'Napiš mi hotový video prompt podle těchto bodů. Moje vize je: [popište česky co chcete]'",
         en:"Write description for AI video generator (Runway / Kling / Higgsfield) like this:\n\nWHO or WHAT is in the video:\n[exact description — not just 'woman' but 'young woman in red coat, dark hair']\n\nWHAT HAPPENS (motion):\n[specific movement — not just 'walks' but 'slowly walks down a street, looks into a shop window']\n\nWHERE and WHEN:\n[location + atmosphere — 'Prague city center, evening, wet cobblestones reflecting billboard lights']\n\nVISUAL STYLE:\n[how the video should look — choose one:\n• like a film — 'cinematic style, film quality'\n• like a documentary — 'documentary style, natural light'\n• slow motion — 'slow motion, every detail visible'\n• handheld — 'handheld camera, moving image like a news report']\n\nCAMERA MOVEMENT:\n[how camera moves — choose one:\n• 'camera slowly zooms in'\n• 'camera follows the subject'\n• 'camera slowly pans right'\n• 'camera stays still (static shot)']\n\nLIGHTING:\n['golden sunset light' / 'cold blue night light' / 'warm studio lighting' / 'natural daylight']\n\nWHAT I DON'T WANT (negative prompt = list of things AI should exclude):\n['blurry image, unrealistic hands, distorted proportions, low quality']\n\nTip: Not sure how to start? Give this list to Claude and say: 'Write me a finished video prompt based on these points. My vision is: [describe in plain language what you want]'",
       }},
     ],
    },
  ],
  advanced:[
    {task:{cs:"Marketing: Obsahová strategie",en:"Marketing: Content strategy"},icon:"▸",mods:["Claude Opus","Claude Sonnet"],section:"marketing",
     ptip:{cs:"Strategie nejdřív, obsah potom. Bez jasného zaměření budete produkovat příspěvky do prázdna. Claude Opus je na strategii nejlepší — přemýšlí víc do hloubky než Sonnet.",en:"Strategy first, content second. Without clear focus you'll produce posts into a void. Claude Opus is best for strategy — thinks more deeply than Sonnet."},
     ps:[
       {label:{cs:"90denní obsahová strategie",en:"90-day content strategy"},p:{
         cs:"Pojmy které potřebujete znát:\n• Ideální zákazník = přesný popis člověka pro koho tvoříte obsah — věk, profese, co ho trápí, kde tráví čas online\n• Obsahové pilíře = 3–4 hlavní témata o kterých budete pravidelně psát nebo točit videa\n• Cíl obsahu: brand awareness = chci aby mě lidé znali / leads = chci poptávky / retence = chci aby zákazníci zůstali\n• KPI (klíčový ukazatel úspěchu) = konkrétní číslo kterým měříte jestli to funguje — počet sledujících, počet poptávek, otevíratelnost emailů\n\nSestav mi 90denní obsahovou strategii:\n\nFirma nebo projekt: [popište co děláte a co prodáváte]\nMůj ideální zákazník: [věk, profese, největší problém který řeší]\nPlatformy kde chci být aktivní: [Instagram / LinkedIn / email / YouTube / TikTok]\nCo chci obsahem dosáhnout: [znají mě víc lidí / dostávám víc poptávek / zákazníci zůstávají]\nKolik času mám na tvorbu obsahu: [hodin týdně]\nKdo jsou moji největší konkurenti v obsahu: [jméno nebo popis]\n\nChci:\n1) Popis mého ideálního zákazníka — kdo je, co ho trápí, kde ho najdu online\n2) 3–4 hlavní témata o kterých budu pravidelně komunikovat + proč zrovna tato\n3) Týdenní plán: co zveřejnit každý den, v jakém formátu a na které platformě\n4) Jak každý kus obsahu použít víckrát — příspěvek z LinkedIn přepracovat na email, video na carousel\n5) 3 čísla která budu sledovat každý týden abych věděl/a jestli to funguje\n6) 3 věci které udělám tento týden jako první\n\n--- PŘÍKLAD VYPLNĚNÉHO PROMPTU ---\nFirma: fotografka zaměřená na portréty a rodinné focení v Praze\nIdeální zákazník: maminky 30–45 let, chtějí profesionální fotky rodiny, ale bojí se že výsledek bude stiff a neautentický\nPlatformy: Instagram, email\nCo chci: dostávat víc poptávek, být první volba pro rodinné focení v Praze\nČas: 3 hodiny týdně\nKonkurenti: ostatní rodinní fotografové v Praze na Instagramu",
         en:"Terms you need to know:\n• Ideal customer = exact description of the person you create content for — age, profession, what troubles them, where they spend time online\n• Content pillars = 3–4 main topics you'll regularly write about or make videos on\n• Content goal: awareness = I want people to know me / leads = I want inquiries / retention = I want customers to stay\n• KPI (key performance indicator) = specific number measuring if it's working — followers count, inquiry count, email open rate\n\nBuild me a 90-day content strategy:\n\nCompany or project: [describe what you do and what you sell]\nMy ideal customer: [age, profession, biggest problem they solve]\nPlatforms I want to be active on: [Instagram / LinkedIn / email / YouTube / TikTok]\nWhat I want to achieve with content: [more people know me / more inquiries / customers stay longer]\nHow much time I have for content creation: [hours per week]\nWho are my biggest content competitors: [name or description]\n\nI want:\n1) Description of my ideal customer — who they are, what troubles them, where I find them online\n2) 3–4 main topics I'll regularly communicate about + why these specifically\n3) Weekly plan: what to publish each day, in what format and on which platform\n4) How to reuse each piece of content — LinkedIn post turned into email, video into carousel\n5) 3 numbers I'll track each week to know if it's working\n6) 3 things to do this week first",
       }},
       {label:{cs:"Email sekvence pro nové zákazníky (5 emailů)",en:"Email sequence for new customers (5 emails)"},p:{
         cs:"KDY TO POUŽÍT: Máte produkt nebo kurz a chcete aby noví zákazníci nebo odběratelé ho opravdu začali používat — ne jen si zaplatili a zapomněli.\n\nPojmy:\n• Onboarding sekvence = série emailů která provede nového zákazníka od registrace k prvnímu úspěchu\n• Hlavní překážka = největší důvod proč zákazníci produkt přestanou používat (nechápou ho, zdá se jim složitý, nemají čas)\n• Náhled emailu = krátký text viditelný v emailovém klientu před otevřením, hned za předmětem — láká k otevření\n\nNapiš mi sérii 5 emailů pro nové zákazníky:\n\nProdukt nebo služba: [co jste prodali nebo k čemu se přihlásili]\nKdo jsou noví zákazníci: [popište kdo to je]\nNejvětší důvod proč přestanou používat: [co je obvykle odradí]\n\nStruktura:\nEmail 1 (ihned po registraci nebo koupi): Uvítání + jeden konkrétní výsledek který mohou mít do 5 minut\nEmail 2 (2. den): Nejčastější chyba kterou lidé dělají a jak ji vyhnout\nEmail 3 (4. den): Příběh zákazníka který to zvládl — co přesně udělal\nEmail 4 (7. den): Pokročilý tip pro ty kteří chtějí víc\nEmail 5 (14. den): Jak se daří? + jedna otázka pro zpětnou vazbu\n\nKaždý email musí mít:\n• Předmět: 3 varianty (osobní / vzbuzuje zvědavost / říká přínos)\n• Náhled emailu: max 90 znaků — doplňuje předmět, neopakuje ho\n• Tělo emailu: max 200 slov\n• Jedno jasné tlačítko nebo odkaz na konci\n\n--- PŘÍKLAD VYPLNĚNÉHO PROMPTU ---\nProdukt: online kurz fotografování pro maminky\nKdo jsou zákazníci: maminky 28–40 let, koupily kurz ale nemají čas ho procházet\nNejvětší překážka: cítí že nemají čas, neví odkud začít, kurz jim přijde složitý\nOčekávaný výsledek po absolvování: hezké přirozené fotky dětí telefonem za 15 minut denně",
         en:"WHEN TO USE: You have a product or course and want new customers or subscribers to actually start using it — not just pay and forget.\n\nTerms:\n• Onboarding sequence = series of emails guiding a new customer from registration to first success\n• Main barrier = biggest reason customers stop using the product (don't understand it, seems complex, no time)\n• Email preview = short text visible in email client before opening, right after the subject — entices to open\n\nWrite me a series of 5 emails for new customers:\n\nProduct or service: [what they bought or signed up for]\nWho are new customers: [describe who they are]\nBiggest reason they stop using it: [what usually puts them off]\n\nStructure:\nEmail 1 (immediately after registration or purchase): Welcome + one concrete result they can have in 5 minutes\nEmail 2 (day 2): Most common mistake people make and how to avoid it\nEmail 3 (day 4): Story of a customer who succeeded — exactly what they did\nEmail 4 (day 7): Advanced tip for those who want more\nEmail 5 (day 14): How's it going? + one feedback question\n\nEach email must have:\n• Subject: 3 variants (personal / creates curiosity / states benefit)\n• Email preview: max 90 characters — complements subject, doesn't repeat it\n• Email body: max 200 words\n• One clear button or link at the end",
       }},
       {label:{cs:"Instagram Carousel (série slidů)",en:"Instagram Carousel (slide series)"},p:{
         cs:"KDY TO POUŽÍT: Chcete vytvořit sérii obrázků na Instagramu kde se swipuje zleva doprava — každý slide = jeden tip, krok nebo myšlenka.\n\nJděte na claude.ai a zadejte tento prompt:\n\nVytvoř vizuální sérii slidů pro Instagram jako HTML stránku.\n\nTéma: [vaše téma]\nPro koho: [popis vaší cílovky]\nStyl a barvy: [tmavý / světlý, hlavní barva, tón — přátelský / odborný]\n\nStruktura (7–10 slidů):\nSlide 1: Zaujmutí — překvapivé tvrzení nebo číslo které nutí swipnout dál\nSlide 2–3: Problém — proč na tomto tématu záleží\nSlide 4–7: Řešení — 1 konkrétní bod na každý slide\nSlide 8–9: Jak začít hned — co udělat jako první krok\nSlide 10: Výzva k akci — uložte si to / sledujte / napište do komentářů\n\nKaždý slide: nadpis max 5 slov, text max 3 věty.\nDesign: čistý, velká písma, vysoký kontrast, připravený pro mobilní telefon.\n\nClaude vygeneruje celou sérii jako vizuální HTML stránku přímo v chatu. Na mobilu udělejte screenshot každého slidu a přidejte na Instagram.\n\n--- PŘÍKLAD VYPLNĚNÉHO PROMPTU ---\nTéma: 5 chyb které dělají začínající fotografové\nPro koho: začátečníci v fotografii, hlavně mileniálové\nStyl: tmavé pozadí, zlatá písma, profesionální ale přátelský",
         en:"WHEN TO USE: You want to create a series of images on Instagram that users swipe through — each slide = one tip, step or idea.\n\nGo to claude.ai and enter this prompt:\n\nCreate a visual slide series for Instagram as an HTML page.\n\nTopic: [your topic]\nFor whom: [description of your audience]\nStyle and colors: [dark / light, main color, tone — friendly / professional]\n\nStructure (7–10 slides):\nSlide 1: Hook — surprising claim or number that makes people swipe further\nSlide 2–3: Problem — why this topic matters\nSlide 4–7: Solution — 1 concrete point per slide\nSlide 8–9: How to start now — what to do as first step\nSlide 10: Call to action — save this / follow / write in comments\n\nEach slide: heading max 5 words, text max 3 sentences.\nDesign: clean, large text, high contrast, ready for mobile.\n\nClaude generates the entire series as a visual HTML page directly in chat. On mobile screenshot each slide and add to Instagram.",
       }},
     ],
    },
    {task:{cs:"SEO: Obsah a audit",en:"SEO: Content and audit"},icon:"▸",mods:["Claude Sonnet","Claude Code","Perplexity"],section:"seo",
     ptip:{cs:"Moderní SEO nevyhraje ten kdo má nejvíc klíčových slov — vyhraje ten kdo má nejdůvěryhodnější a nejužitečnější obsah. AI vám pomůže napsat takový článek i prověřit celý web za zlomek času.",en:"Modern SEO isn't won by who has the most keywords — it's won by who has the most trustworthy and useful content. AI helps you write such articles and audit your whole website in a fraction of the time."},
     ps:[
       {label:{cs:"SEO článek (1800–2200 slov)",en:"SEO article (1800–2200 words)"},p:{
         cs:"Pojmy:\n• Klíčové slovo = fráze kterou lidé zadávají do Googlu, pro kterou chcete být nalezeni\n• Záměr hledání = proč to lidé hledají — chtějí se jen dozvědět (informační), porovnat možnosti (srovnávací), nebo rovnou koupit (transakční)? Google zobrazuje různý obsah podle záměru\n• EEAT = čtyři věci které Google hodnotí: zkušenost (píšete z přímé zkušenosti?), odbornost (jste expert?), důvěryhodnost webu (odkazují na vás jiné weby?), důvěra (je web bezpečný a transparentní?)\n• Titulek stránky (H1) = hlavní nadpis článku — Google ho čte jako první\n• Popis ve výsledcích (meta description) = krátký text pod odkazem ve Googlu který láká ke kliknutí — píšete ho vy\n\nCo tím dosáhnete: Google váš článek zobrazí výš ve výsledcích → více lidí klikne → více návštěvníků na vašem webu → více zákazníků.\n\nNapiš SEO článek pro klíčové slovo: '[vaše klíčové slovo]'\n\nZáměr hledání: [informační — chce se dozvědět / srovnávací — porovnává možnosti / transakční — chce koupit]\nKdo to bude číst: [popište čtenáře a co potřebuje vyřešit]\n\nStruktura:\n• Hlavní nadpis (H1): klíčové slovo + přínos pro čtenáře, max 60 znaků\n• Úvod (150 slov): problém čtenáře → proč je tento článek odpovědí → co se dozví\n• Podnadpisy (H2): [vyjmenujte hlavní sekce článku]\n• Časté otázky: 5 otázek které lidé skutečně googlejí k tomuto tématu\n• Závěr: shrnutí + co má čtenář udělat jako další krok (kontaktovat vás, stáhnout, koupit)\n\nSignály důvěryhodnosti — přidejte přirozeně do textu:\n• Konkrétní číslo nebo statistika s odkazem na zdroj\n• Reálný příklad nebo krátký příběh z praxe\n• Proč právě vy máte právo o tomto tématu psát\n\nTitulek pro Google: klíčové slovo + přínos, max 60 znaků\nPopis pro Google: problém čtenáře → co článek řeší → výzva k kliknutí, max 155 znaků\nDélka: 1800–2200 slov\n\n--- PŘÍKLAD VYPLNĚNÉHO PROMPTU ---\nKlíčové slovo: rodinné focení Praha\nZáměr: informační + transakční — hledají fotografa a chtějí vědět co čekat\nKdo to čte: rodiče 28–40 let kteří chtějí profesionální fotky rodiny ale nevědí co focení obnáší\nHlavní sekce: Jak probíhá rodinné focení / Jak se připravit / Co ovlivňuje cenu / Jak vybrat fotografa\nZdůvodnění autority: 8 let fotím rodiny v Praze, přes 200 spokojených rodin",
         en:"Terms:\n• Keyword = phrase people type into Google that you want to be found for\n• Search intent = why people search it — do they just want to learn (informational), compare options (comparative), or buy right away (transactional)? Google shows different content based on intent\n• EEAT = four things Google evaluates: experience (writing from direct experience?), expertise (are you an expert?), authoritativeness (do other sites link to you?), trust (is the site safe and transparent?)\n• Page title (H1) = main article heading — Google reads it first\n• Search result description (meta description) = short text under the link in Google that entices clicking — you write it\n\nWhat you achieve: Google shows your article higher in results → more people click → more website visitors → more customers.\n\nWrite SEO article for keyword: '[your keyword]'\n\nSearch intent: [informational — wants to learn / comparative — comparing options / transactional — wants to buy]\nWho will read it: [describe the reader and what they need to solve]\n\nStructure:\n• Main heading (H1): keyword + reader benefit, max 60 characters\n• Intro (150 words): reader's problem → why this article answers it → what they'll learn\n• Subheadings (H2): [list main article sections]\n• Frequently asked questions: 5 questions people actually google about this topic\n• Conclusion: summary + what reader should do as next step (contact you, download, buy)\n\nTrust signals — add naturally into text:\n• Specific number or statistic with source reference\n• Real example or short story from practice\n• Why you specifically have the right to write about this topic\n\nGoogle title: keyword + benefit, max 60 characters\nGoogle description: reader's problem → what article solves → click prompt, max 155 characters\nLength: 1800–2200 words",
       }},
       {label:{cs:"SEO audit + průzkum klíčových slov",en:"SEO audit + keyword research"},p:{
         cs:"Pojmy:\n• SEO audit = systematická kontrola vašeho webu — co Google vidí, co mu vadí a co zlepšit\n• Interní prolinkování = kdy odkazujete z jednoho článku na jiný na vašem webu — pomáhá Googlu pochopit strukturu a distribuuje sílu stránek\n• Kotevní text = slova na kterých je odkaz — místo 'klikněte zde' napište 'rodinné focení Praha' — Google to čte jako signál o čem je cílová stránka\n• Strukturovaná data (schema markup) = skrytý kód který říká Googlu přesně o co jde — může způsobit hvězdičkové hodnocení nebo FAQ přímo ve výsledcích Googlu\n• Průzkum klíčových slov = systematické hledání frází pro které se vyplatí optimalizovat\n• Základní klíčová slova (seed keywords) = obecné fráze o vašem oboru od kterých odvozujete konkrétnější varianty\n• Dlouhé fráze (long-tail) = delší specifické dotazy (3–5 slov) — méně lidí hledá ale snáze se na ně dostat vysoko\n• Zvýraznění ve výsledcích (featured snippets) = rámeček s přímou odpovědí který Google zobrazí nad ostatními výsledky — získáte ho odpovídáním na konkrétní otázky\n• Tematický cluster = skupina článků kolem jednoho hlavního tématu — pilíř + podpůrné články\n• Mezera oproti konkurenci = témata nebo klíčová slova která konkurenti mají a vy ne\n\nCo tím dosáhnete: přehled o stavu vašeho webu + mapa klíčových slov která přivede správné návštěvníky.\n\nProveď SEO audit a průzkum klíčových slov pro: [URL webu nebo popis]\n\n[AUDIT]\n• Zkontroluj titulky stránek, popisy pro Google, strukturu nadpisů H1–H3\n• Zkontroluj interní prolinkování — odkazují stránky na sebe navzájem?\n• Ověř jestli má web strukturovaná data pro FAQ, články nebo recenze\n• Navrhni 5 konkrétních věcí ke zlepšení do 30 dní s odhadovaným dopadem\n\n[PRŮZKUM KLÍČOVÝCH SLOV]\nHlavní téma: [vaše hlavní klíčové slovo]\nGeografie: [ČR / SR / celá Evropa]\n\n1) 10 základních klíčových slov s odhadovanou měsíční hledaností\n2) 20 dlouhých frází s nízkou konkurencí — snazší dostat se na první stranu\n3) 10 otázkových frází vhodných pro zvýraznění ve výsledcích Googlu\n4) 3 tematické clustery: hlavní článek + 4–5 podpůrných článků ke každému\n5) Co má konkurence a vy ne: témata nebo fráze kde mají obsah a vy chybíte\n\nKonkurenti: [URL 1], [URL 2]\n\n--- PŘÍKLAD VYPLNĚNÉHO PROMPTU ---\nWeb: fotografka-jana-novak.cz — rodinná a portrétnová fotografie Praha\nHlavní téma: rodinné focení Praha\nGeografie: Praha a okolí\nKonkurenti: fotoatelier-viktorova.cz, rodinky-photos.cz",
         en:"Terms:\n• SEO audit = systematic check of your website — what Google sees, what bothers it and what to improve\n• Internal linking = linking from one article to another on your website — helps Google understand structure and distributes page strength\n• Anchor text = words that carry a link — instead of 'click here' write 'family photography Prague' — Google reads it as a signal about what the target page is about\n• Structured data (schema markup) = hidden code telling Google exactly what something is — can trigger star ratings or FAQ directly in Google results\n• Keyword research = systematically finding phrases worth optimizing for\n• Seed keywords = general industry phrases from which you derive more specific variants\n• Long-tail = longer specific queries (3–5 words) — fewer people search but easier to rank high\n• Featured snippets = answer box Google shows above other results — you earn it by directly answering specific questions\n• Content cluster = group of articles around one main topic — pillar + supporting articles\n• Competitor gap = topics or keywords competitors have that you don't\n\nWhat you achieve: overview of your website's state + keyword map that brings the right visitors.\n\nConduct SEO audit and keyword research for: [website URL or description]\n\n[AUDIT]\n• Check page titles, Google descriptions, H1–H3 heading structure\n• Check internal linking — do pages link to each other?\n• Verify if site has structured data for FAQ, articles or reviews\n• Suggest 5 specific improvements within 30 days with estimated impact\n\n[KEYWORD RESEARCH]\nMain topic: [your main keyword]\nGeography: [country/region]\n\n1) 10 seed keywords with estimated monthly search volume\n2) 20 long-tail phrases with low competition — easier to reach first page\n3) 10 question phrases suitable for featured snippets\n4) 3 content clusters: main article + 4–5 supporting articles each\n5) What competitors have that you don't: topics or phrases where they have content and you're missing\n\nCompetitors: [URL 1], [URL 2]",
       }},
     ],
    },
    {task:{cs:"Byznys: Strategie a plánování",en:"Business: Strategy and planning"},icon:"▸",mods:["Claude Opus"],section:"business",
     ptip:{cs:"Pro byznys analýzy vždy použijte Claude — přemýšlí do hloubky a vidí věci z více úhlů. Čím více kontextu mu dáte, tím konkrétnější a použitelnější výstup dostanete.",en:"For business analyses always use Claude — thinks in depth and sees things from multiple angles. The more context you give, the more specific and usable the output."},
     ps:[
       {label:{cs:"Najdi svůj ideální byznys (Claude vás vyzvívá otázkami)",en:"Find your ideal business (Claude asks you questions)"},p:{
         cs:"KDY TO POUŽÍT: Nevíte co podnikat, máte více nápadů a chcete si ujasnit co je pro vás nejlepší. Claude s vámi udělá hloubkový pohovor — jako kariérní poradce který vás prozkoumá a najde byznys příležitosti sedící přesně vám.\n\nNapište do Claude.ai:\n\nChci přijít na ideální byznys nebo projekt pro sebe. Udělej se mnou hloubkový pohovor a prozkoumej mě — jako kariérní poradce. Neptej se na vše najednou. Vždy jen jedna otázka, počkej na moji odpověď a pak pokračuj.\n\nZeptej se mě postupně na tyto oblasti:\n\n1) PRACOVNÍ ZKUŠENOSTI:\n• Kde jsem pracoval/a a co přesně jsem tam dělal/a\n• Co mi v práci šlo nejlépe — co mi kolegové nebo šéf chválili\n• Na co se mě lidé opakovaně ptají — v čem jsem pro ně expertem\n• Co jsem se naučil/a co jiní lidé obvykle nevědí\n• Jaké projekty nebo výsledky jsem nejvíc hrdý/á\n\n2) OSOBNOST A PREFERENCE:\n• Co mě baví (i ve volném čase)\n• Co mě vyčerpává a nechci dělat\n• S kým chci pracovat\n• Sám/a nebo s týmem — fyzický produkt nebo digitální nebo služba\n\n3) FINANČNÍ CÍLE:\n• Kolik chci vydělávat a za jak dlouho\n• Pravidelný příjem z klientů nebo pasivní příjem z produktu\n\nAž budeš mít dostatek, udělej:\n1) Shrnutí — co jsi o mně zjistil/a, jaké jsou moje silné stránky\n2) 3 konkrétní byznys nápady šité přesně na mě — ne obecné\n3) Ke každému: co přesně prodám, komu, za kolik a jak začnu za 30 dní\n4) Řekni který z nich mi sedí nejvíc a proč\n\nZačni první otázkou o mých pracovních zkušenostech.",
         en:"WHEN TO USE: You don't know what business to start and want clarity on what fits you best. Claude conducts a deep interview with you — like a career advisor who researches you and finds business opportunities that fit exactly you.\n\nType into Claude.ai:\n\nI want to find the ideal business or project for myself. Conduct a deep interview and research with me — like a career advisor. Don't ask everything at once. Always just one question, wait for my answer, then continue.\n\nAsk me about these areas:\n\n1) WORK EXPERIENCE:\n• Where I've worked and exactly what I did\n• What went best — what colleagues or bosses praised me for\n• What people repeatedly ask me about — where I'm their expert\n• What I've learned that others usually don't know\n• Which projects or results I'm most proud of\n\n2) PERSONALITY AND PREFERENCES:\n• What I enjoy (even in free time)\n• What drains me and I don't want to do\n• Who I want to work with\n• Alone or with team — physical, digital or service\n\n3) FINANCIAL GOALS:\n• How much I want to earn and by when\n• Regular income from clients or passive income from a product\n\nOnce you have enough:\n1) Summary — what you learned about me, my strengths\n2) 3 specific business ideas tailored exactly to me — not generic\n3) For each: what I'll sell, to whom, for how much and how to start in 30 days\n4) Tell me which one fits me best and why\n\nStart with the first question about my work experience.",
       }},
       {label:{cs:"Kompletní byznys plán",en:"Complete business plan"},p:{
         cs:"Pojmy:\n• Shrnutí pro investora (executive summary) = stručný přehled celého plánu na max 200 slov — to první co investor čte\n• Analýza trhu = kdo jsou vaši zákazníci, jak velký je trh a co se na něm děje\n• TAM/SAM/SOM = tři kruhy trhu: celkový trh (TAM) → část kterou reálně oslovíte (SAM) → část kterou získáte (SOM)\n• Plátno byznys modelu (Business Model Canvas) = přehled 9 klíčových prvků vašeho byznysu na jedné stránce\n• Plán vstupu na trh (GTM strategie) = jak konkrétně oslovíte první zákazníky\n• Klíčové ukazatele úspěchu (KPIs) = měřitelná čísla podle kterých poznáte jestli to funguje\n• Finanční projekce = odhad příjmů, výdajů a zisku na 3 roky\n\nXML závorky (jako <firma>...</firma>) jsou speciální formát — Claude je čte lépe než volný text. Ohraničují jednotlivé části vašeho zadání.\n\nNyní vyplňte a odešlete:\n\n<firma>\nCo děláme: [popis produktu nebo služby]\nJak to vydělává peníze: [poplatky / předplatné / provize / jednorázový prodej]\n</firma>\n<trh>\nKdo jsou zákazníci: [věk, profese, největší problém který řeší]\nGeografie: [ČR / Evropa / online]\nOdhad velikosti trhu: [kolik lidí nebo firem by to mohlo chtít]\n</trh>\n<cíle>\nCíl za 6 měsíců: [konkrétní číslo — zákazníci / tržby]\nCíl za 1 rok: [konkrétní číslo]\n</cíle>\n<omezení>\nTým: [kolik lidí, jaké role]\nRozpočet: [malý do 50 tis / střední do 500 tis / velký]\nHlavní rizika: [co by mohlo nevyjít]\n</omezení>\n\nVytvoř kompletní byznys plán s:\n1) Shrnutí pro investora (max 200 slov)\n2) Kdo jsou zákazníci a jak velký je trh (s čísly)\n3) Minimálně 3 přímí konkurenti — co dělají a kde jsou slabí\n4) Přehled 9 klíčových prvků byznysu (Business Model Canvas)\n5) Plán prvních 3 měsíců — konkrétní kroky jak oslovit zákazníky\n6) Finanční odhad na 3 roky (optimistická / realistická / pesimistická varianta)\n7) Největší rizika a jak jim předejít\n8) 3 čísla která budu sledovat každý týden\n\nBuď kritický — pojmenuj slabiny plánu přímo.\n\n--- PŘÍKLAD VYPLNĚNÉHO PROMPTU ---\n<firma>\nCo děláme: online kurzy fotografování pro maminky na mateřské\nJak to vydělává peníze: jednorázový poplatek 1 990 Kč za kurz\n</firma>\n<trh>\nKdo jsou zákazníci: maminky 28–40 let, fotí děti telefonem, chtějí lepší výsledky\nGeografie: ČR a SK, online\nOdhad velikosti trhu: odhaduji 150 000 maminek které aktivně fotí\n</trh>\n<cíle>\nCíl za 6 měsíců: 100 prodaných kurzů = 199 000 Kč tržby\nCíl za 1 rok: 400 kurzů, přidat druhý kurz o editaci\n</cíle>\n<omezení>\nTým: jen já\nRozpočet: malý, max 5 000 Kč/měs na reklamu\nHlavní rizika: lidé nekoupí od neznámé lektorky, YouTube má zdarma podobný obsah\n</omezení>",
         en:"Terms:\n• Executive summary = brief overview of the whole plan in max 200 words — first thing an investor reads\n• Market analysis = who your customers are, how big the market is and what's happening in it\n• TAM/SAM/SOM = three market circles: total market (TAM) → part you can realistically reach (SAM) → part you'll win (SOM)\n• Business Model Canvas = overview of 9 key elements of your business on one page\n• Go-to-market strategy = exactly how you'll reach first customers\n• KPIs (Key Performance Indicators) = measurable numbers that tell you if it's working\n• Financial projections = estimate of revenue, costs and profit over 3 years\n\nXML tags (like <company>...</company>) are a special format — Claude reads them better than plain text. They separate different parts of your input.\n\nFill in and send:\n\n<company>\nWhat we do: [product or service description]\nHow it makes money: [fees / subscription / commission / one-time sale]\n</company>\n<market>\nWho are customers: [age, profession, biggest problem they solve]\nGeography: [local / Europe / online]\nEstimated market size: [how many people or companies might want this]\n</market>\n<goals>\nGoal in 6 months: [specific number — customers / revenue]\nGoal in 1 year: [specific number]\n</goals>\n<constraints>\nTeam: [how many people, what roles]\nBudget: [small / medium / large]\nMain risks: [what could go wrong]\n</constraints>\n\nCreate complete business plan with:\n1) Investor summary (max 200 words)\n2) Who the customers are and market size (with numbers)\n3) At least 3 direct competitors — what they do and where they're weak\n4) Overview of 9 key business elements (Business Model Canvas)\n5) First 3 months plan — specific steps to reach customers\n6) 3-year financial estimate (optimistic / realistic / pessimistic)\n7) Biggest risks and how to prevent them\n8) 3 numbers I'll track each week\n\nBe critical — name the plan's weaknesses directly.",
       }},
       {label:{cs:"Dražší nabídka vašich služeb — Claude vás provede",en:"Premium service offer — Claude guides you"},p:{
         cs:"KDY TO POUŽÍT: Jste specialista, konzultant, kouč nebo freelancer a chcete strukturovat dražší nabídku (od 15 000 Kč výše) zaměřenou na konkrétní výsledek pro klienta — ne jen svůj čas.\n\nProč to dělat: hodinová sazba stropuje váš příjem. Nabídka postavená na výsledku (ne hodinách) umožňuje účtovat 5–10× více a zákazníci jsou spokojenější — platí za výsledek který chtějí.\n\nNapište do Claude.ai:\n\nPomoz mi sestavit dražší nabídku mých služeb. Jsem [váš obor] a chci strukturovat nabídku za [odhadovaná cena] Kč.\n\nZeptej se mě postupně na:\n1) Moje největší odborné zkušenosti a výsledky které jsem klientům přinesl/a\n2) Jaký konkrétní problém řeším a kdo ho má\n3) Co dělám jinak než ostatní v mém oboru\n4) Proč by klient vybral mě a ne konkurenci\n5) Co klientovi zaručím na konci spolupráce\n\nPo každé odpovědi se zeptej na další. Až budeš mít dostatek, navrhni:\n• Jak nabídku pojmenovat (název který zákazník okamžitě pochopí)\n• Co přesně zahrnuje\n• Jak ji nacenit — ne podle mého času ale podle hodnoty pro klienta\n• Jak ji představit za 60 sekund\n• Tři nejčastější námitky klientů a jak na ně odpovědět\n\nZačni první otázkou.",
         en:"WHEN TO USE: You're a specialist, consultant, coach or freelancer and want to structure a premium offer (from $1,000+) focused on a specific result for the client — not just your time.\n\nWhy do this: hourly rates cap your income. An offer built on results (not hours) allows charging 5–10× more and clients are happier — they pay for the result they want.\n\nType into Claude.ai:\n\nHelp me build a premium offer for my services. I am [your field] and want to structure an offer for [estimated price].\n\nAsk me step by step about:\n1) My biggest professional experiences and results I've delivered to clients\n2) What specific problem I solve and who has it\n3) What I do differently than others in my field\n4) Why a client would choose me over competition\n5) What I guarantee the client at the end of the collaboration\n\nAfter each answer ask the next. Once you have enough, suggest:\n• How to name the offer (name the customer immediately understands)\n• What exactly it includes\n• How to price it — not by my time but by value to the client\n• How to present it in 60 seconds\n• Three most common client objections and how to answer them\n\nStart with the first question.",
       }},
     ],
    },
    {task:{cs:"Vývoj aplikací: Vibe Coding",en:"App development: Vibe Coding"},icon:"▸",mods:["Claude Code","Cursor","Bolt","Lovable"],section:"development",
     ptip:{cs:"Vibe coding = popisujete co chcete přirozenou řečí, AI napíše kód. Nevývojář → Bolt nebo Lovable (výsledek za minuty, žádný kód). Vývojář → Claude Code nebo Cursor (plná kontrola). Obě cesty fungují.\n\nJak přejít z nevývojáře na vývojáře pomocí AI: Nejrychlejší cesta je učení přes vlastní projekt — ne kurzy. Postup: 1) Začněte s Bolt.new — sledujte co AI generuje a čtěte kód. 2) Začněte měnit malé věci ručně — barvy, texty, pak celé sekce. 3) Když něčemu nerozumíte, zeptejte se Claudea — rozumí každé úrovni a vysvětlí vám cokoliv jako úplnému začátečníkovi. Napište: 'Vysvětli mi tento kód. Jsem úplný začátečník, nikdy jsem neprogramoval/a. Projdi mě tím krok za krokem.' Claude vás celým procesem vždy provede. 4) Přejděte na Cursor — editor s AI přímo uvnitř. Vidíte kód, AI ho píše vedle vás. 5) Nakonec Claude Code v terminálu — plná kontrola nad celým projektem. Celý přechod zvládnete za 2–3 měsíce práce na vlastním projektu. Žádný kurz vás nenaučí víc než projekt který chcete doopravdy dokončit.",en:"Vibe coding = describe what you want in plain language, AI writes the code. Non-developer → Bolt or Lovable (results in minutes, no code). Developer → Claude Code or Cursor (full control). Both paths work.\n\nHow to transition from non-developer to developer using AI: The fastest path is learning through your own project — not courses. Steps: 1) Start with Bolt.new — watch what AI generates and read the code. 2) Start changing small things manually — colors, texts, then whole sections. 3) When you don't understand something, ask Claude: 'Explain this code as if I've only been coding for a year.' 4) Move to Cursor — editor with AI built in. You see the code, AI writes alongside you. 5) Finally Claude Code in terminal — full control over the entire project. The whole transition takes 2–3 months working on your own project. No course will teach you more than a project you genuinely want to finish."},
     ps:[
       {label:{cs:"Landing page (jedna stránka, jeden cíl)",en:"Landing page (one page, one goal)"},p:{
         cs:"Landing page = jedna webová stránka s jediným cílem — přesvědčit návštěvníka k jedné akci (zaregistrovat se, koupit, kontaktovat, stáhnout). Na rozdíl od webu s více stránkami nemá menu ani navigaci — vede vás jedním směrem.\n\n── NEVÝVOJÁŘ → Bolt.new nebo v0.dev ──\nJděte na bolt.new a napište:\n\nVytvoř landing page pro: [co prodáváte nebo nabízíte]\nPro koho: [popis cílové skupiny]\nHlavní akce: [co má návštěvník udělat — tlačítko 'Objednat' / 'Kontaktujte nás' / 'Stáhnout zdarma']\nStyl: [tmavý nebo světlý, hlavní barva, nálada — 'elegantní' / 'hravý' / 'důvěryhodný']\n\nSekce které chci:\n• Hlavní banner s nadpisem a tlačítkem\n• Proč si mě vybrat (3 výhody)\n• Jak to funguje (3 kroky)\n• Co říkají zákazníci (2–3 citace)\n• Ceny nebo nabídka\n• Kontakt nebo formulář\n\n── VÝVOJÁŘ → Claude Code nebo Cursor ──\nVytvoř landing page. Framework: [React + Tailwind / Next.js / plain HTML]\n\nProdukt: [popis]\nHlavní tlačítko: [text a kam vede]\nVizuální styl: [tmavý/světlý, barvy, reference — web který se vám líbí]\n\nSekce v pořadí: Hlavní banner → Důkaz důvěryhodnosti (loga nebo čísla) → Výhody (3–4 karty) → Jak to funguje (3 kroky) → Citace zákazníků → Ceny (3 varianty, prostřední zvýrazněná) → Časté otázky → Patička\n\nPožadavky: mobilní verze, plynulé scrollování, čistý kód s komentáři připravený k nasazení.",
         en:"Landing page = one web page with one goal — convince the visitor to take one action. Unlike a multi-page website it has no menu or navigation — it leads you one direction.\n\n── NON-DEVELOPER → Bolt.new or v0.dev ──\nGo to bolt.new and type:\n\nCreate a landing page for: [what you sell or offer]\nFor whom: [target audience]\nMain action: [what visitor should do]\nStyle: [dark or light, main color, mood]\n\nSections I want: main banner with headline and button / why choose me (3 benefits) / how it works (3 steps) / customer quotes (2–3) / pricing / contact form\n\n── DEVELOPER → Claude Code or Cursor ──\nCreate a landing page. Framework: [React + Tailwind / Next.js / plain HTML]\n\nProduct: [description]\nMain button: [text and destination]\nVisual style: [dark/light, colors, reference site]\n\nSections in order: Hero → Social proof → Benefits (3–4 cards) → How it works → Customer quotes → Pricing (3 plans, middle highlighted) → FAQ → Footer\n\nRequirements: mobile version, smooth scrolling, clean code with comments ready to deploy.",
       }},
       {label:{cs:"Vícestránkový web (portfolio, firemní web)",en:"Multi-page website (portfolio, company site)"},p:{
         cs:"Vícestránkový web = klasický web s navigací a více stránkami (domů, o mně, služby, blog, kontakt). Hodí se pro freelancery, firmy, fotografy, restaurace — kohokoliv kdo potřebuje představit více věcí najednou.\n\n── NEVÝVOJÁŘ → Bolt.new nebo Lovable ──\nJděte na bolt.new a napište:\n\nVytvoř vícestránkový web pro: [vaše jméno / název firmy / typ podnikání]\nStránky které chci: [Domů / O mně nebo O nás / Služby nebo Portfolio / Blog / Kontakt]\nPro koho web je: [popis návštěvníků]\nStyl a nálada: [barvy, tón — 'profesionální' / 'kreativní' / 'minimalistický']\n\nNa hlavní stránce chci: [hlavní sdělení, výhody, ukázky práce nebo produktů, kontaktní formulář]\n\n── VÝVOJÁŘ → Claude Code nebo Cursor ──\nVytvoř vícestránkový web. Framework: [Next.js / Astro / plain HTML + CSS]\n\nStruktura stránek: [seznam stránek a co na každé má být]\nNavigace: [položky v menu a jejich pořadí]\nGlobální prvky: [záhlaví, zápatí, barvy, písma]\n\nPožadavky: [SEO základy / blog s redakčním systémem / vícejazyčná verze / kontaktní formulář]",
         en:"Multi-page website = classic website with navigation and multiple pages. Great for freelancers, companies, photographers, restaurants.\n\n── NON-DEVELOPER → Bolt.new or Lovable ──\nGo to bolt.new and type:\n\nCreate a multi-page website for: [your name / company name / business type]\nPages I want: [Home / About / Services or Portfolio / Blog / Contact]\nWho the site is for: [visitor description]\nStyle and mood: [colors, tone — 'professional' / 'creative' / 'minimalist']\n\nOn the home page I want: [main message, benefits, work samples, contact form]\n\n── DEVELOPER → Claude Code or Cursor ──\nCreate a multi-page website. Framework: [Next.js / Astro / plain HTML + CSS]\n\nPage structure: [list of pages and what each should contain]\nNavigation: [menu items and order]\nGlobal elements: [header, footer, colors, fonts]\n\nRequirements: [SEO basics / blog with CMS / multilingual / contact form]",
       }},
       {label:{cs:"Webová aplikace (přihlašování, data, platby)",en:"Web application (login, data, payments)"},p:{
         cs:"Webová aplikace = web kde se uživatelé registrují, přihlašují a ukládají svá data. Na rozdíl od webu je personalizovaná — každý uživatel vidí svůj účet. Příklady: správce úkolů, rezervační systém, e-learning platforma, předplacený nástroj.\n\n── NEVÝVOJÁŘ → Lovable nebo Bolt.new ──\nJděte na lovable.dev a napište:\n\nVytvoř webovou aplikaci: [co aplikace dělá]\nKdo ji bude používat: [popis uživatelů]\n\nFunkce které potřebuji:\n• Registrace a přihlašování: [ano/ne — přes email nebo Google]\n• Co uživatel může dělat po přihlášení: [vytvářet záznamy / sledovat pokrok / rezervovat termíny / jiné]\n• Platby: [ano/ne — pokud ano, co se platí a kolik]\n• Emailová oznámení: [ano/ne]\n\nStyl: [tmavý/světlý, barvy, nálada]\n\nLovable propojí databázi a přihlašování automaticky — nemusíte nic nastavovat ručně.\n\n── VÝVOJÁŘ → Claude Code ──\nVytvoř webovou aplikaci. Stack: [Next.js + Supabase / jiný]\n\nFunkce:\n• Přihlašování: [email + heslo / Google / GitHub]\n• Databázové schéma (= jak jsou data uložena a provázána): [popište tabulky]\n• Platby: [Stripe — jednorázové / předplatné]\n• Role uživatelů: [admin / běžný uživatel]\n\nBezpečnost: ověřování přístupu na serveru i v databázi.",
         en:"Web application = a website where users register, log in and save their data. Unlike a website it's personalized. Examples: task manager, booking system, e-learning platform, SaaS tool.\n\n── NON-DEVELOPER → Lovable or Bolt.new ──\nGo to lovable.dev and type:\n\nCreate a web application: [what the app does]\nWho will use it: [user description]\n\nFeatures I need: login (yes/no) / what user does after logging in / payments (yes/no) / email notifications (yes/no)\n\nStyle: [dark/light, colors, mood]\n\nLovable connects database and login automatically.\n\n── DEVELOPER → Claude Code ──\nCreate a web application. Stack: [Next.js + Supabase / other]\n\nFeatures: authentication type / database schema / payments (Stripe) / user roles\n\nSecurity: server-side validation and database access control.",
       }},
       {label:{cs:"Aplikace ke stažení (desktop nebo mobil)",en:"Downloadable app (desktop or mobile)"},p:{
         cs:"Aplikace ke stažení = program který si uživatel nainstaluje do počítače nebo telefonu. Na rozdíl od webové aplikace funguje i offline a má přímý přístup k souborům a systému zařízení.\n\nTypy:\n• Desktop (Windows/Mac/Linux): Electron nebo Tauri (obojí používá webové technologie + balí se jako .exe nebo .app)\n• Mobilní (Android/iOS): React Native nebo Flutter\n• Nástroj příkazové řádky: Python nebo Node.js\n\n── NEVÝVOJÁŘ — popište záměr a Claude navrhne cestu ──\nNapište do Claude.ai:\n\nChci vytvořit aplikaci ke stažení. Poraď mi jak na to.\n\nTyp: [pro počítač Windows a Mac / pro mobil Android a iOS / obojí]\nCo aplikace dělá: [přesný popis co uživatel otevře, co udělá, co dostane]\nHlavní obrazovky: [seznam s popisem každého okna nebo obrazovky]\nData: [ukládají se jen lokálně v zařízení / synchronizují se přes cloud / žádná data]\nPotřebuje internet: [vždy / jen pro synchronizaci / vůbec ne]\n\nNavrhni technologii, strukturu a jak začít.\n\n── VÝVOJÁŘ → Claude Code ──\nVytvoř [desktop / mobilní / CLI] aplikaci.\n\nFramework: [Electron + React / Tauri + React / React Native / Flutter / Python]\nPlatforma: [Windows / Mac / Linux / Android / iOS / více najednou]\n\nFunkce: [seznam co aplikace umí]\nArchitektura: [jak jsou data uložena / jak komunikují části]\nDistribuce: [App Store / Google Play / přímé stažení / npm balíček]",
         en:"Downloadable app = a program the user installs on their computer or phone. Works offline and has direct access to files and system.\n\nTypes: Desktop (Electron/Tauri) / Mobile (React Native/Flutter) / CLI tool (Python/Node.js)\n\n── NON-DEVELOPER — describe intent, Claude suggests path ──\nType into Claude.ai:\n\nI want to create a downloadable app. Advise me how to proceed.\n\nType: [desktop Windows and Mac / mobile Android and iOS / both]\nWhat app does: [exact description]\nMain screens: [list with description]\nData: [stored locally / cloud sync / no data]\nNeeds internet: [always / only for sync / no]\n\nSuggest technology, structure and how to start.\n\n── DEVELOPER → Claude Code ──\nCreate a [desktop / mobile / CLI] app.\n\nFramework: [Electron + React / Tauri / React Native / Flutter / Python]\nPlatform: [Windows / Mac / Linux / Android / iOS / cross-platform]\n\nFeatures: [list] / Architecture: [data storage / communication] / Distribution: [App Store / direct download / npm]",
       }},
       {label:{cs:"Claude Code: inicializace projektu",en:"Claude Code: project initialization"},p:{
         cs:"KDY POUŽÍT: Na začátku každého nového projektu v terminálu nebo když přistoupíte k cizímu kódu.\n\nTerminál = okno kde píšete textové příkazy počítači (Mac: aplikace Terminal, Windows: PowerShell).\n\n/init\n\nPo prozkoumání projektu vytvoř dva soubory:\n\n1) ARCHITECTURE.md — přehled projektu:\n• Struktura složek (= jak jsou soubory uspořádány) a k čemu každá slouží\n• Klíčové části kódu a jak spolu komunikují\n• Databázové schéma (= jak jsou data uložena a provázána)\n• Jak projekt spustit lokálně\n\n2) CLAUDE.md — pravidla pro AI:\n• Tech stack a verze (= jaké technologie a jejich verze používáme)\n• Styl kódu a pojmenování proměnných (= jak pojmenovat věci aby byl kód čitelný)\n• Co nikdy neměnit bez konzultace\n• Pravidlo: 'Vždy přečti tento soubor před každou změnou'\n\nProjekt:\n• Typ: [webová aplikace / API / nástroj / jiné]\n• Co dělá: [popis v 1–2 větách]\n• Tech stack: [Next.js + Supabase / Python + FastAPI / jiný]\n\nPo vytvoření souborů každý nový požadavek začínej:\n'Přečti ARCHITECTURE.md a CLAUDE.md. Pak implementuj: [co chcete přidat]'",
         en:"WHEN TO USE: At the start of every new project in the terminal or when accessing someone else's code.\n\nTerminal = window where you type text commands to the computer (Mac: Terminal app, Windows: PowerShell).\n\n/init\n\nAfter exploring the project create two files:\n\n1) ARCHITECTURE.md — project overview: folder structure / key code parts and how they communicate / database schema / how to run locally\n\n2) CLAUDE.md — rules for AI: tech stack and versions / code style and variable naming / what never to change / rule: 'Always read this file before any change'\n\nProject: type / what it does / tech stack\n\nAfter creating files start every new request:\n'Read ARCHITECTURE.md and CLAUDE.md. Then implement: [what you want to add]'",
       }},
       {label:{cs:"Startup stack — co použít a jak to propojit",en:"Startup stack — what to use and how to connect it"},p:{
         cs:"KDY POUŽÍT: Chcete spustit webovou aplikaci nebo online nástroj na předplatné s minimálními náklady.\n\nTento stack pokrývá vše co potřebujete za přibližně 700 Kč/měs:\n• Claude Pro (700 Kč/měs) — AI asistent pro vývoj\n• Next.js (zdarma) — základ aplikace, stránky co uživatel vidí\n• Supabase (zdarma do 50 000 uživatelů) — databáze (kde se ukládají data) + přihlašování + ukládání souborů\n• Vercel (zdarma) — hosting (server kde aplikace běží online)\n• Stripe — platební brána (0% poplatek do prvních transakcí)\n• GitHub Actions (zdarma) — automatické nasazení po každém uložení kódu\n\nAplikace:\n[co dělá a pro koho]\n\nFunkce které potřebuji:\n[registrace uživatelů ano/ne / platby ano/ne / nahrávání souborů ano/ne / odesílání emailů ano/ne]\n\nSestav mi postup krok za krokem:\n1) Jak nainstalovat a poprvé spustit Next.js projekt\n2) Jak propojit Supabase — přihlašování a databáze\n3) Jak přidat Stripe platby\n4) Jak nastavit automatické nasazení na Vercel po každém uložení kódu\n5) Co zkontrolovat před spuštěním pro veřejnost\n\nPro každý krok: přesné příkazy a kód.",
         en:"WHEN TO USE: You want to launch a web application or subscription online tool with minimal costs.\n\nThis stack covers everything for approximately $20/month: Claude Pro / Next.js (free) / Supabase (free up to 50k users — database + login + files) / Vercel (free hosting) / Stripe (payment gateway) / GitHub Actions (free auto-deployment)\n\nApplication: [what it does and for whom]\n\nFeatures I need: [user registration / payments / file uploads / emails — yes/no for each]\n\nBuild me step by step: 1) Install and first run Next.js / 2) Connect Supabase login and database / 3) Add Stripe payments / 4) Set up auto-deployment to Vercel / 5) Pre-launch checklist\n\nFor each step: exact commands and code.",
       }},
     ],
    },
    {task:{cs:"Workflow a automatizace",en:"Workflow and automation"},icon:"▸",mods:["Make","n8n","Claude"],section:"agents",
     ptip:{cs:"Nejdřív popište workflow slovy — co přijde dovnitř, co se má stát, co vyjde ven. Pak teprve Claude nebo Make navrhne technické řešení. Bez tohoto popisu dostanete obecný výsledek.",en:"First describe the workflow in words — what comes in, what should happen, what comes out. Then Claude or Make suggests the technical solution. Without this description you get a generic result."},
     ps:[
       {label:{cs:"Návrh automatizace — popis workflow",en:"Automation design — workflow description"},p:{
         cs:"Chci zautomatizovat tento proces:\n\nCo se stane na začátku (trigger = spouštěč):\n[co spustí celý proces — příklady: 'přijde nový email', 'zákazník vyplní formulář', 'každé pondělí v 9:00', 'přidám nový řádek do tabulky']\n\nCo se má stát uprostřed (kroky):\n[popište co se má stát — příklady: 'AI přečte email a zjistí o co jde', 'vytvoří se záznam v tabulce', 'odešle se notifikace']\n\nCo je na konci (výstup):\n[co dostanu — příklady: 'email v Gmailu jako koncept', 'nový řádek v Google Sheets', 'zpráva ve Slacku']\n\nNástroje které používám:\n[Gmail / Google Sheets / Slack / HubSpot / Notion / jiné]\n\nÚroveň technické zdatnosti: [začátečník / středně pokročilý / vývojář]\n\nNavrhni:\n1) Nejjednodušší způsob jak toto realizovat\n2) Které nástroje použít a proč\n3) Postup krok za krokem\n4) Co nesmím zapomenout (bezpečnost, lidská kontrola)\n\n--- PŘÍKLAD ---\nTrigger: zákazník vyplní kontaktní formulář na webu\nKroky: AI přečte dotaz → zjistí kategorii (zájem o produkt / reklamace / obecný dotaz) → připraví návrh odpovědi\nVýstup: email připravený ke schválení v Gmailu (neodesílá se automaticky)\nNástroje: Gmail, Google Forms, Make.com",
         en:"I want to automate this process:\n\nWhat happens at the start (trigger):\n[what starts the whole process — examples: 'new email arrives', 'customer fills out form', 'every Monday at 9:00', 'I add a new row to a spreadsheet']\n\nWhat should happen in the middle (steps):\n[describe what should happen — examples: 'AI reads email and finds out what it's about', 'a record is created in a spreadsheet', 'a notification is sent']\n\nWhat's at the end (output):\n[what I get — examples: 'email in Gmail as a draft', 'new row in Google Sheets', 'message in Slack']\n\nTools I use:\n[Gmail / Google Sheets / Slack / HubSpot / Notion / other]\n\nTechnical level: [beginner / intermediate / developer]\n\nSuggest:\n1) Simplest way to achieve this\n2) Which tools to use and why\n3) Step-by-step process\n4) What I must not forget (security, human review)",
       }},
       {label:{cs:"Systémový prompt pro AI agenta — šablona",en:"System prompt for AI agent — template"},p:{
         cs:"Napiš systémový prompt pro AI agenta s těmito informacemi:\n\nJméno a role agenta:\n[příklad: 'Jana, asistentka zákaznické podpory firmy XY']\n\nCo agent dělá:\n[příklad: 'Odpovídá na dotazy zákazníků o doručení, vrácení a reklamacích přes chat na webu']\n\nJak se chová:\n[tón, délka odpovědí, co vždy dělá — příklad: 'přátelský, stručný, vždy osloví zákazníka jménem']\n\nCo agent NESMÍ dělat:\n[příklad: 'Nesděluje informace o cenách bez ověření. Neslibuje termíny které nezná.']\n\nKdy předat člověku:\n[příklad: 'Pokud zákazník vyjadřuje frustraci nebo problém přesahuje znalostní bázi']\n\nZnalostní báze (co agent ví):\n[příklad: 'Otevírací doba, podmínky vrácení, nejčastější dotazy — viz přiložené PDF']\n\nVytvoř systémový prompt který:\n• Je jasný a jednoznačný — agent nepotřebuje hádat\n• Má přirozený tón odpovídající značce\n• Obsahuje příklady správných odpovědí pro typické situace\n• Jasně ohraničuje co agent smí a nesmí\n\n--- PŘÍKLAD VYPLNĚNÉHO ---\nJméno: Jana\nRole: zákaznická podpora e-shopu s kosmetikou\nDělá: odpovídá na dotazy o objednávkách, doručení a vrácení zboží\nChování: přátelská, empatická, max 3 věty na odpověď\nNesmí: přislíbit vrácení peněz bez schválení nadřízeného\nPředání: zákazník je naštvaný nebo chce mluvit s vedoucím",
         en:"Write a system prompt for an AI agent with this information:\n\nAgent name and role:\n[example: 'Jana, customer support assistant for company XY']\n\nWhat the agent does:\n[example: 'Answers customer questions about delivery, returns and complaints via website chat']\n\nHow it behaves:\n[tone, response length, what it always does — example: 'friendly, concise, always addresses customer by name']\n\nWhat agent MUST NOT do:\n[example: 'Does not share pricing without verification. Does not promise deadlines it doesn't know.']\n\nWhen to hand off to a human:\n[example: 'If customer expresses frustration or problem exceeds knowledge base']\n\nKnowledge base (what agent knows):\n[example: 'Opening hours, return policy, FAQ — see attached PDF']\n\nCreate a system prompt that:\n• Is clear and unambiguous — agent doesn't need to guess\n• Has natural tone matching the brand\n• Contains examples of correct responses for typical situations\n• Clearly defines what agent can and cannot do",
       }},
       {label:{cs:"Make.com: návrh scénáře krok za krokem",en:"Make.com: scenario design step by step"},p:{
         cs:"Pomoz mi navrhnout Make.com scénář (= automatizaci) pro tento úkol:\n\nÚkol: [popište co chcete automatizovat]\n\nAplikace které používám: [Gmail / Sheets / Slack / Notion / HubSpot / jiné]\n\nPotřebuji:\n1) Seznam modulů (bloků) v Make.com v pořadí jak mají být zapojeny\n2) Co každý modul dělá a jaká nastavení potřebuje\n3) Kde přidat AI (Claude nebo ChatGPT) a co přesně mu napsat\n4) Jak otestovat jestli to funguje správně\n5) Na co si dát pozor — typické chyby a jak jim předejít\n\nDůležité: výstup nikdy neodesílej automaticky bez mého schválení.\n\n--- PŘÍKLAD ---\nÚkol: Každý nový řádek přidaný do Google Sheets → Claude napíše personalizovaný uvítací email → email jde do Gmailu jako koncept → já schválím a odešlu\nAplikace: Google Sheets, Gmail, Claude API",
         en:"Help me design a Make.com scenario (= automation) for this task:\n\nTask: [describe what you want to automate]\n\nApps I use: [Gmail / Sheets / Slack / Notion / HubSpot / other]\n\nI need:\n1) List of modules (blocks) in Make.com in order they should be connected\n2) What each module does and what settings it needs\n3) Where to add AI (Claude or ChatGPT) and exactly what to write to it\n4) How to test that it works correctly\n5) What to watch out for — common mistakes and how to avoid them\n\nImportant: never auto-send any output without my approval.",
       }},
     ],
    },
    {task:{cs:"AI Agenti: Hlasový agent, n8n, Claude Skills",en:"AI Agents: Voice agent, n8n, Claude Skills"},icon:"▸",mods:["Retell AI","n8n","Claude Code","Perplexity","agentskill.sh"],section:"agents",
     ptip:{cs:"AI agenti pracují samostatně — vy je nastavíte jednou, pak fungují sami. Nejjednodušší start: Claude.ai Projects — napíšete instrukce jednou a Claude si je pamatuje v celém projektu. Perplexity Computer (perplexity.ai) je pak výkonnější varianta — agent který sám autonomně prochází web a sbírá informace.",en:"AI agents work independently — you set them up once, then they run on their own. Easiest start: Claude.ai Projects — write instructions once and Claude remembers them across the whole project. Perplexity Computer (perplexity.ai) is then a more powerful option — an agent that autonomously browses the web and collects information."},
     ps:[
       {label:{cs:"Hlasový recepční agent (Retell AI)",en:"Voice receptionist agent (Retell AI)"},p:{
         cs:"Pojmy:\n• Znalostní báze = soubor (PDF nebo text) s informacemi které agent zná — otevírací doba, ceny, FAQ\n• LLM = mozek agenta — jazykový model který zpracovává řeč (doporučujeme Gemini 2.5 Flash — nejrychlejší odezva pro hovory)\n• Latence = prodleva mezi tím co volající řekne a kdy agent odpoví — čím nižší, tím přirozenější hovor\n• Alternativa bez telefonu: Perplexity Computer (perplexity.ai) zvládne webový výzkum a sbírání dat autonomně — bez nutnosti stavět vlastního agenta\n\nJsi [Jméno], recepční [Název firmy].\n\nCíl: Pomoci volajícím získat informace a zamluvit termín.\n\nJak se chováš:\n• Mluv přirozeně a přátelsky — jsi recepční, ne robot\n• Nikdy nenechávej ticho — řekni 'Nechte mě to zkontrolovat...'\n• Vždy zopakuj co jsi pochopil/a před každou akcí\n• Pokud nevíš: 'To musím zjistit — mohu zavolat zpět?'\n\nCo umíš udělat (použij v tomto pořadí):\n• Zkontrolovat volný čas v kalendáři\n• Zarezervovat termín\n• Přepojit hovor na [telefonní číslo] pokud je zákazník naštvaný nebo chce mluvit s člověkem\n\nInformace které znáš: [nahrajte PDF s cenami, otevírací dobou a nejčastějšími otázkami]\n\nHlas: [ženský / mužský], přirozený (nastavte přes ElevenLabs)\nZvuk na pozadí: šum kanceláře\n\nZačínáš každý hovor: '[Jméno] z [Firma], dobrý den, jak vám mohu pomoci?'\n\n--- PŘÍKLAD JAK VYPADÁ HOVOR ---\nVolající: 'Dobrý den, chtěl bych se objednat na středu.'\nAgent: 'Dobrý den, ráda vám pomůžu. Na středu mám volné 10:00 nebo 14:30 — co by vám vyhovovalo lépe?'",
         en:"Terms:\n• Knowledge base = file (PDF or text) with information the agent knows — opening hours, prices, FAQ\n• LLM = agent's brain — language model processing speech (recommend Gemini 2.5 Flash — fastest response for calls)\n• Latency = delay between what caller says and when agent responds — the lower, the more natural the conversation\n• Alternative without phone: Perplexity Computer (perplexity.ai) handles web research and data collection autonomously — no need to build your own agent\n\nYou are [Name], receptionist at [Company Name].\n\nGoal: Help callers get information and book appointments.\n\nHow you behave:\n• Speak naturally and friendly — you're a receptionist, not a robot\n• Never leave silence — say 'Let me check that for you...'\n• Always repeat what you understood before each action\n• If you don't know: 'I'll need to find that out — can I call back?'\n\nWhat you can do (use in this order):\n• Check availability in the calendar\n• Book an appointment\n• Transfer call to [phone number] if customer is angry or wants to speak with a human\n\nInformation you know: [upload PDF with prices, opening hours and FAQ]\n\nVoice: [female / male], natural (set up via ElevenLabs)\nBackground sound: office noise\n\nStart every call: 'Hello, [Name] from [Company], how can I help you today?'",
       }},
       {label:{cs:"Emailový AI agent (n8n nebo Make)",en:"Email AI agent (n8n or Make)"},p:{
         cs:"N8n vs Make: obě jsou nástroje pro automatizaci. Make (make.com) je jednodušší — pro začátečníky. N8n (n8n.io) je výkonnější a zdarma ke stažení — pro pokročilejší uživatele.\n\nAlternativa: Perplexity Computer umí sám prohledávat příchozí emaily pokud mu dáte přístup — bez nutnosti stavět celý workflow.\n\nVytvoř automatizaci pro zpracování příchozích emailů:\n\n1) SPOUŠTĚČ: Nový email dorazí do Gmailu\n\n2) FILTR: Je to newsletter nebo spam? → pokud ano, přeskoč a nedělej nic\n\n3) AI TŘÍDĚNÍ (Claude Haiku — nejrychlejší a nejlevnější):\nPrompt: 'Zařaď tento email do jedné kategorie: срочно / nový zákazník / podpora / interní / ostatní. Odpověz POUZE názvem kategorie.'\n\n4) ROZDĚLENÍ podle kategorie:\n• Срочно → pošli zprávu na Slack nebo SMS + připrav návrh odpovědi\n• Nový zákazník → přidej do tabulky kontaktů nebo CRM systému\n• Podpora → přidej do systému pro správu požadavků\n• Ostatní → archivuj\n\n5) AI NÁVRH ODPOVĚDI (Claude Sonnet):\n'Napiš profesionální odpověď na tento email. Tón: [formální/přátelský]. Kontext o zákazníkovi: [data z tabulky]'\n\n6) LIDSKÁ KONTROLA: Návrh jde do Gmailu jako rozepsaný email — člověk přečte, případně upraví a teprve pak odešle\n\nDůležité: Nikdy neodesílej email automaticky bez schválení člověkem.",
         en:"N8n vs Make: both are automation tools. Make (make.com) is simpler — for beginners. N8n (n8n.io) is more powerful and free to download — for advanced users.\n\nAlternative: Perplexity Computer can search incoming emails if given access — without building a whole workflow.\n\nCreate automation for processing incoming emails:\n\n1) TRIGGER: New email arrives in Gmail\n\n2) FILTER: Is it a newsletter or spam? → if yes, skip and do nothing\n\n3) AI CLASSIFICATION (Claude Haiku — fastest and cheapest):\nPrompt: 'Classify this email into one category: urgent / new customer / support / internal / other. Reply ONLY with category name.'\n\n4) ROUTING by category:\n• Urgent → send message to Slack or SMS + prepare draft reply\n• New customer → add to contacts spreadsheet or CRM system\n• Support → add to request management system\n• Other → archive\n\n5) AI DRAFT REPLY (Claude Sonnet):\n'Write a professional reply to this email. Tone: [formal/friendly]. Customer context: [data from spreadsheet]'\n\n6) HUMAN REVIEW: Draft goes to Gmail as a composed email — person reads, optionally edits and only then sends\n\nImportant: Never auto-send any email without human approval.",
       }},
       {label:{cs:"Claude Skills — naučte Claudea váš styl",en:"Claude Skills — teach Claude your style"},p:{
         cs:"Co jsou Claude Skills: složky s instrukcemi které Claude Code přečte před každým úkolem. Funguje jako trvalá paměť — Claude vždy ví jak psát vaším hlasem nebo jakým stylem kódovat.\n\nKde najít hotové Skills: agentskill.sh — největší katalog hotových Skills (přes 100 000, většina zdarma z GitHubu). Hledejte podle kategorie nebo klíčového slova. Instalace jedním příkazem přímo z Claude Code: '/plugin marketplace add [jméno]'. Není potřeba nic stahovat ručně.\n\nAlternativa bez terminálu: Claude Projects (claude.ai → Projects → Project Instructions) — napište instrukce přímo do nastavení projektu, bez jakýchkoliv souborů.\n\nPro Claude Code (vývojáři — spustíte v terminálu):\n\nJednoduché vytvoření prvního Skill přes Claude Code:\n\n'Vytvoř složku ~/.claude/skills/ a v ní soubor brand-voice.md s těmito pravidly pro psaní:\n- Tón: přátelský ale profesionální\n- Délka emailů: max 5 vět v těle\n- Vždy začni jménem příjemce\n- Předmět: max 6 slov\n- Zakončení: S pozdravem, [vaše jméno]\nAž bude soubor vytvořen, potvrď mi to.'\n\nAktivace: napište do Claude Code 'Přečti skill brand-voice a napiš email pro: [komu / o čem]'\n\nDoporučené Skills:\n• brand-voice.md — jak psát vaším hlasem a stylem\n• meeting-notes.md — šablona pro zápisky ze schůzek (Rozhodnutí / Úkoly / Otevřené otázky)\n• seo-checklist.md — co zkontrolovat u každého článku před publikací\n\nPřidat nový Skill: 'Vytvoř skill [název] pro: [co má Claude dělat — napiš přesné instrukce]'",
         en:"What are Claude Skills: folders with instructions that Claude Code reads before each task. Works like permanent memory — Claude always knows how to write in your voice or what coding style to use.\n\nAlternative without terminal: Perplexity Computer and Claude Projects (claude.ai → Projects → Project Instructions) can do similar things — write instructions directly into project settings, without any files or terminal.\n\nFor Claude Code (developers — run in terminal):\n\nSimple creation of first Skill via Claude Code:\n\n'Create folder ~/.claude/skills/ and in it a file brand-voice.md with these writing rules:\n- Tone: friendly but professional\n- Email length: max 5 sentences in body\n- Always start with recipient's name\n- Subject: max 6 words\n- Closing: Best regards, [your name]\nOnce file is created, confirm to me.'\n\nActivation: type into Claude Code 'Read skill brand-voice and write email for: [to whom / about what]'\n\nRecommended Skills:\n• brand-voice.md — how to write in your voice and style\n• meeting-notes.md — meeting notes template (Decisions / Tasks / Open questions)\n• seo-checklist.md — what to check for every article before publishing\n\nAdd new Skill: 'Create skill [name] for: [what Claude should do — write exact instructions]'",
       }},
     ],
    },
  ],
};

// ─── UI COMPONENTS ────────────────────────────────────────────────────────────
function PriceBadge({ price, lang }) {
  const map = {
    free:{cs:"Zdarma",en:"Free",c:T.green},
    freemium:{cs:"Freemium",en:"Freemium",c:T.accent},
    paid:{cs:"Placený",en:"Paid",c:T.purple}
  };
  const d = map[price]; if(!d) return null;
  return <span style={{fontSize:10,fontWeight:700,color:d.c,border:`1px solid ${d.c}33`,borderRadius:4,padding:"2px 7px",letterSpacing:"0.06em",textTransform:"uppercase"}}>{d[lang]}</span>;
}

function SectionChip({ s }) {
  const map = {
    marketing:{bg:T.purpleLo,border:T.purpleBorder,text:T.purple,label:"Marketing"},
    seo:{bg:T.tealLo,border:T.tealBorder,text:T.teal,label:"SEO"},
    business:{bg:T.accentLo,border:T.accentBorder,text:T.accent,label:"Byznys"},
    development:{bg:T.blueLo,border:T.blueBorder,text:T.blue,label:"Vývoj"},
    agents:{bg:"rgba(239,68,68,0.08)",border:"rgba(239,68,68,0.28)",text:T.red,label:"Agenti"},
  };
  const d = map[s]; if(!d) return null;
  return <span style={{fontSize:9,fontWeight:700,letterSpacing:"0.09em",textTransform:"uppercase",background:d.bg,border:`1px solid ${d.border}`,color:d.text,borderRadius:4,padding:"2px 7px",marginLeft:5}}>{d.label}</span>;
}

function Acc({ expanded, onToggle, icon, title, sub, children, badge, section, acc=T.accent }) {
  return (
    <div style={{marginBottom:5,borderRadius:10,border:`1px solid ${expanded?T.borderHover:T.border}`,overflow:"hidden",transition:"border-color .2s"}}>
      <button onClick={onToggle} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"12px 15px",background:"transparent",border:"none",cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}>
        <span style={{color:acc,fontSize:12,flexShrink:0,opacity:.75}}>{icon}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:5}}>
            <span style={{fontSize:13,fontWeight:600,color:T.text,lineHeight:1.4}}>{title}</span>
            {section && <SectionChip s={section} />}
            {badge && <PriceBadge price={badge} lang="cs" />}
          </div>
          {sub && <div style={{fontSize:11,color:T.muted,marginTop:2,lineHeight:1.4}}>{sub}</div>}
        </div>
        <span style={{color:T.muted,fontSize:16,flexShrink:0,transition:"transform .2s",transform:expanded?"rotate(90deg)":"none"}}>›</span>
      </button>
      {expanded && (
        <div style={{padding:"0 15px 15px",borderTop:`1px solid ${T.border}`}}>
          <div style={{height:11}} />
          {children}
        </div>
      )}
    </div>
  );
}

function TipBox({ text, acc=T.accent, accLo=T.accentLo, accBrd=T.accentBorder }) {
  return <div style={{fontSize:12.5,color:acc,padding:"8px 12px",background:accLo,borderRadius:8,border:`1px solid ${accBrd}`,lineHeight:1.62,marginBottom:12}}>{text}</div>;
}

function CopyBtn({ text, id, copied, cp, t }) {
  const done = copied===id;
  return (
    <button aria-label={t.copyAria} onClick={()=>cp(text,id)} style={{
      position:"absolute",top:10,right:10,
      background:done?T.green:"rgba(255,255,255,0.05)",
      border:`1px solid ${done?T.green+"55":T.border}`,
      borderRadius:5,padding:"4px 10px",fontSize:10.5,
      color:done?"#fff":T.muted,
      cursor:"pointer",fontFamily:"inherit",fontWeight:600,
      transition:"all .2s",whiteSpace:"nowrap",
    }}>{done?t.copied:t.copy}</button>
  );
}

function AnatomyCard({ lang, acc=T.accent, accLo=T.accentLo, accBrd=T.accentBorder }) {
  const t = L[lang];
  const parts = [
    {label:{cs:"Role",en:"Role"},ex:{cs:"Jsi zkušený obchodní stratég se zaměřením na technologické startupy.",en:"You are an experienced business strategist specializing in tech startups."},color:T.accent},
    {label:{cs:"Úkol",en:"Task"},ex:{cs:"Vytvoř 90denní plán jak dostat nový AI nástroj k prvním zákazníkům.",en:"Create a 90-day plan to get a new AI tool to its first customers."},color:T.teal},
    {label:{cs:"Kontext",en:"Context"},ex:{cs:"Produkt: AI správce úkolů. Tým: 2 lidé. Rozpočet: malý. 15–20 beta testovatelů. Největší rizika: lidé nástroj nepoužijí, nevydrží u něj.",en:"Product: AI task manager. Team: 2 people. Budget: small. 15–20 beta testers. Biggest risks: people won't use it, won't stick with it."},color:T.purple},
    {label:{cs:"Reasoning (proč to tak je)",en:"Reasoning (why)"},ex:{cs:"Jasné zaměření na konkrétního zákazníka a zdůvodnění každého kroku zajistí výsledek který jde opravdu použít — ne jen hezky vypadající plán.",en:"Clear focus on a specific customer and justification for each step ensures a result that's actually usable — not just a nice-looking plan."},color:T.blue},
    {label:{cs:"Stop podmínky",en:"Stop conditions"},ex:{cs:"Piš dokud nemáš plán s 3–4 konkrétními akcemi na každý týden a jasným bodem kdy přehodnotit celou strategii.",en:"Keep writing until you have a plan with 3–4 concrete actions each week and a clear point to reconsider the whole strategy."},color:T.orange},
    {label:{cs:"Výstup",en:"Output"},ex:{cs:"Týdenní přehled: co udělat, kdo za to odpovídá, jaké je riziko a proč to dává smysl.",en:"Weekly overview: what to do, who is responsible, what the risk is and why it makes sense."},color:T.green},
  ];
  return (
    <div style={{borderRadius:12,border:`1px solid ${accBrd}`,background:accLo,padding:"18px 20px",marginBottom:24}}>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:acc,marginBottom:6}}>{t.anatomyTitle}</div>
      <div style={{fontSize:12,color:"inherit",opacity:.65,marginBottom:14,lineHeight:1.5}}>
        {lang==="cs"
          ? "Čím víc AI řeknete, tím lepší dostanete odpověď. Takhle vypadá dobře sestavený dotaz:"
          : "The more you tell AI, the better the answer. Here's what a well-structured prompt looks like:"}
      </div>
      {parts.map((p,i)=>(
        <div key={i} style={{display:"flex",gap:12,marginBottom:8}}>
          <div style={{borderLeft:`3px solid ${p.color}`,paddingLeft:10,flex:1}}>
            <div style={{fontSize:10,fontWeight:700,color:p.color,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:1}}>{p.label[lang]}</div>
            <div style={{fontSize:12.5,color:"inherit",lineHeight:1.55,opacity:.85}}>{p.ex[lang]}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function PromptujAI() {
  const [lang,setLang]         = useState("cs");
  const [level,setLevel]       = useState(null);
  const [tab,setTab]           = useState("tools");
  const [expTool,setExpTool]   = useState(null);
  const [expP,setExpP]         = useState(null);
  const [expM,setExpM]         = useState(null);
  const [expG,setExpG]         = useState(null);
  const [pLang,setPLang]       = useState("cs");
  const [pView,setPView]       = useState("byTask");
  const [copied,setCopied]     = useState(null);
  const [showGuide,setShowGuide] = useState(false);
  const [search,setSearch]     = useState("");
  const [dark,setDark]         = useState(true);
  const [advSec,setAdvSec]     = useState(null);
  const [makerFilter,setMakerFilter] = useState(null);

  const t = L[lang];
  const bg      = dark?"#06060A":"#FAFAF8";
  const surface = dark?"rgba(255,255,255,0.036)":"rgba(0,0,0,0.04)";
  const border  = dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.08)";
  const text    = dark?"#F1F0EE":"#111118";
  const muted   = dark?"#8A8A9A":"#6B6B7A";
  const hBg     = dark?"rgba(6,6,10,0.9)":"rgba(250,250,248,0.92)";
  // Theme-aware accent — bright amber in dark, deep amber in light
  const acc     = dark?"#F59E0B":"#92400E";
  const accLo   = dark?"rgba(245,158,11,0.10)":"rgba(146,64,14,0.09)";
  const accBrd  = dark?"rgba(245,158,11,0.28)":"rgba(146,64,14,0.25)";

  const cp = useCallback((txt,id)=>{
    navigator.clipboard.writeText(txt).catch(()=>{});
    setCopied(id);
    setTimeout(()=>setCopied(null),2200);
  },[]);

  const handleLevel = id => {
    setLevel(id); setExpTool(null); setExpP(null); setExpM(null); setExpG(null);
    setTab("tools"); setShowGuide(false); setSearch(""); setAdvSec(null); setMakerFilter(null);
    window.scrollTo(0,0);
  };
  const goHome = () => { setLevel(null); setSearch(""); };

  const guides     = GUIDE[level]?.[lang] || [];
  const levelTools = TOOLS[level] || [];
  const levelPros  = PROMPTS[level] || [];

  const sq = search.trim().toLowerCase();
  const fTools = sq.length<2 ? levelTools : levelTools.filter(x=>x.task[lang]?.toLowerCase().includes(sq)||x.desc[lang]?.toLowerCase().includes(sq));
  const fPros  = sq.length<2 ? levelPros  : levelPros.filter(x=>x.task[lang]?.toLowerCase().includes(sq));

  const ADV = ["marketing","seo","business","development","agents"];
  const ADVL = {marketing:{cs:"Marketing",en:"Marketing"},seo:{cs:"SEO",en:"SEO"},business:{cs:"Byznys",en:"Business"},development:{cs:"Vývoj",en:"Dev"},agents:{cs:"Agenti",en:"Agents"}};
  const shownPros = (level==="advanced"&&advSec) ? fPros.filter(p=>p.section===advSec) : fPros;

  const MAKERS = [...new Set(ALL_MODELS.map(m=>m.maker))];
  const shownModels = makerFilter ? ALL_MODELS.filter(m=>m.maker===makerFilter) : ALL_MODELS;

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:${bg};transition:background .3s}
    @keyframes f1{0%,100%{transform:translate(0,0)}50%{transform:translate(28px,18px)}}
    @keyframes f2{0%,100%{transform:translate(0,0)}50%{transform:translate(-22px,26px)}}
    @keyframes f3{0%,100%{transform:translate(0,0)}50%{transform:translate(14px,-22px)}}
    @keyframes fi{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
    .fi{animation:fi .3s ease forwards}
    input::placeholder{color:${muted};opacity:.65}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:${T.accentBorder};border-radius:4px}
    button{transition:all .18s}
    a{text-decoration:none}
  `;

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:bg,color:text,minHeight:"100vh"}}>
      <style>{css}</style>

      {/* BG */}
      <div style={{position:"fixed",inset:0,zIndex:0,overflow:"hidden",pointerEvents:"none"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(circle,${dark?"rgba(255,255,255,0.045)":"rgba(0,0,0,0.035)"} 1px,transparent 1px)`,backgroundSize:"28px 28px",maskImage:"radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%)"}} />
        <div style={{position:"absolute",width:560,height:560,left:"-10%",top:"-8%",background:"radial-gradient(circle,rgba(45,212,191,0.09) 0%,transparent 65%)",borderRadius:"50%",animation:"f1 18s ease-in-out infinite"}} />
        <div style={{position:"absolute",width:480,height:480,right:"-8%",top:"14%",background:"radial-gradient(circle,rgba(245,158,11,0.07) 0%,transparent 65%)",borderRadius:"50%",animation:"f2 22s ease-in-out infinite"}} />
        <div style={{position:"absolute",width:380,height:380,left:"28%",bottom:"-8%",background:"radial-gradient(circle,rgba(167,139,250,0.07) 0%,transparent 65%)",borderRadius:"50%",animation:"f3 26s ease-in-out infinite"}} />
      </div>

      <div style={{position:"relative",zIndex:1}}>
        {/* Header */}
        <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 22px",height:56,borderBottom:`1px solid ${border}`,position:"sticky",top:0,zIndex:100,background:hBg,backdropFilter:"blur(24px)"}}>
          <div onClick={goHome} style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer"}}>
            <div style={{width:28,height:28,borderRadius:6,background:`linear-gradient(135deg,${T.accent},${T.orange})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#000",boxShadow:`0 0 16px rgba(245,158,11,0.32)`,flexShrink:0}}>P</div>
            <span style={{fontSize:15,fontWeight:700,color:text,letterSpacing:"-0.025em"}}>promptuj<span style={{color:T.accent}}>AI</span><span style={{fontSize:10,color:muted,opacity:.6,marginLeft:1,letterSpacing:"0.03em"}}>.cz</span></span>
          </div>
          <div style={{display:"flex",gap:4,alignItems:"center"}}>
            {["cs","en"].map(l=>(
              <button key={l} onClick={()=>setLang(l)} style={{padding:"3px 10px",borderRadius:5,border:`1px solid ${lang===l?acc:border}`,background:lang===l?accLo:"transparent",color:lang===l?acc:muted,cursor:"pointer",fontSize:10.5,fontWeight:700,fontFamily:"inherit",letterSpacing:"0.07em"}}>{l.toUpperCase()}</button>
            ))}
            <span style={{width:1,height:14,background:border,margin:"0 2px"}} />
            <button onClick={()=>setDark(!dark)} style={{padding:"3px 9px",borderRadius:5,border:`1px solid ${border}`,background:"transparent",color:muted,cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>{dark?"○":"●"}</button>
          </div>
        </header>

        <main style={{maxWidth:720,margin:"0 auto",padding:"26px 14px 80px"}}>

          {/* HOME */}
          {!level && (
            <div className="fi">
              <div style={{textAlign:"center",marginBottom:32,paddingTop:10}}>
                <div style={{fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:acc,marginBottom:12,fontWeight:700}}>promptujai.cz</div>
                <h1 style={{fontSize:"clamp(22px,5vw,36px)",fontWeight:700,letterSpacing:"-0.03em",lineHeight:1.15,marginBottom:10}}>{t.sub}</h1>
                <p style={{color:muted,fontSize:14,lineHeight:1.65}}>{t.pick}</p>
              </div>
              <AnatomyCard lang={lang} acc={acc} accLo={accLo} accBrd={accBrd} />
              {[
                {id:"beginner",label:t.beg,desc:t.begD,color:T.green},
                {id:"intermediate",label:t.mid,desc:t.midD,color:acc},
                {id:"advanced",label:t.adv,desc:t.advD,color:T.purple},
              ].map(({id,label,desc,color})=>(
                <div key={id} onClick={()=>handleLevel(id)}
                  style={{padding:"17px 19px",borderRadius:11,border:`1px solid ${border}`,background:surface,marginBottom:8,cursor:"pointer"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=color+"55";e.currentTarget.style.background="rgba(255,255,255,0.048)"}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=border;e.currentTarget.style.background=surface}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                        <span style={{width:5,height:5,borderRadius:"50%",background:color,display:"inline-block",flexShrink:0}} />
                        <span style={{fontSize:14,fontWeight:700}}>{label}</span>
                      </div>
                      <p style={{fontSize:12.5,color:muted,lineHeight:1.5}}>{desc}</p>
                    </div>
                    <span style={{color:color,fontSize:18,opacity:.6}}>›</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LEVEL CONTENT */}
          {level && (
            <div className="fi">
              {/* Breadcrumb */}
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:16}}>
                <button onClick={goHome} style={{background:"none",border:"none",color:muted,cursor:"pointer",fontSize:12.5,fontFamily:"inherit"}}>{t.back}</button>
                <span style={{color:T.faint}}>›</span>
                <span style={{fontSize:12.5,color:text,fontWeight:600}}>{level==="beginner"?t.beg:level==="intermediate"?t.mid:t.adv}</span>
              </div>

              {/* Search */}
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.searchPH}
                style={{width:"100%",padding:"9px 13px",borderRadius:8,background:surface,border:`1px solid ${border}`,color:text,fontSize:12.5,fontFamily:"inherit",outline:"none",marginBottom:13,transition:"border-color .2s"}}
                onFocus={e=>e.target.style.borderColor=accBrd}
                onBlur={e=>e.target.style.borderColor=border}
              />

              {/* Tabs */}
              <div style={{display:"flex",gap:3,marginBottom:16,background:surface,borderRadius:8,padding:3}}>
                {[["tools",t.tools],["prompts",t.prompts],["models",t.models]].map(([id,label])=>(
                  <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"7px 10px",borderRadius:6,border:"none",background:tab===id?acc:"transparent",color:tab===id?(dark?"#000":"#fff"):muted,cursor:"pointer",fontSize:11.5,fontWeight:600,fontFamily:"inherit",letterSpacing:"0.02em"}}>{label}</button>
                ))}
              </div>

              {/* ── TOOLS TAB ── */}
              {tab==="tools" && (
                <div>
                  <button onClick={()=>setShowGuide(!showGuide)} style={{width:"100%",padding:"9px 14px",borderRadius:8,border:`1px solid ${showGuide?accBrd:border}`,background:showGuide?accLo:surface,color:showGuide?acc:muted,cursor:"pointer",fontSize:12.5,fontWeight:600,fontFamily:"inherit",textAlign:"left",marginBottom:11}}>
                    {showGuide?"▾":"▸"} {t.guide} — <span style={{fontWeight:400,opacity:.7}}>{t.guideIntro}</span>
                  </button>
                  {showGuide && guides.map((g,i)=>(
                    <Acc key={i} expanded={expG===i} onToggle={()=>setExpG(expG===i?null:i)} icon="▸" title={g.title.replace(/^[\W\s]+/,"")} acc={acc}>
                      <div style={{fontSize:13,color:text,lineHeight:1.78,whiteSpace:"pre-wrap",opacity:.87}}>{g.text}</div>
                    </Acc>
                  ))}
                  <div style={{fontSize:11,color:muted,marginBottom:11,lineHeight:1.5}}>{t.toolsDesc}</div>
                  {fTools.length===0
                    ? <div style={{textAlign:"center",padding:"36px 0",color:muted}}>{t.noResults}<br/><span style={{fontSize:11}}>{t.noResultsSub}</span></div>
                    : fTools.map((tool,i)=>(
                      <Acc key={i} expanded={expTool===i} onToggle={()=>setExpTool(expTool===i?null:i)} icon={tool.icon} title={tool.task[lang]} sub={tool.desc[lang]} acc={acc}>
                        <div style={{marginBottom:12}}>
                          <div style={{fontSize:10,fontWeight:700,color:acc,letterSpacing:"0.09em",textTransform:"uppercase",marginBottom:6}}>{t.recommended}</div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                            {tool.recommended.map((r,ri)=>(
                              <span key={ri} style={{fontSize:11,padding:"3px 9px",borderRadius:5,border:`1px solid ${accBrd}`,background:accLo,color:acc,fontWeight:600}}>{r}</span>
                            ))}
                          </div>
                        </div>
                        <div style={{marginBottom:12}}>
                          <div style={{fontSize:10,fontWeight:700,color:muted,letterSpacing:"0.09em",textTransform:"uppercase",marginBottom:6}}>{t.howTo}</div>
                          {tool.steps[lang].map((step,si)=>(
                            <div key={si} style={{display:"flex",gap:10,marginBottom:6}}>
                              <span style={{fontSize:10,fontWeight:700,color:acc,minWidth:16,marginTop:2,flexShrink:0}}>{si+1}.</span>
                              <span style={{fontSize:12.5,color:text,lineHeight:1.6,opacity:.88}}>{step}</span>
                            </div>
                          ))}
                        </div>
                        {tool.tip && <TipBox text={tool.tip[lang]} acc={acc} accLo={accLo} accBrd={accBrd} />}
                        {tool.url && (
                          <a href={tool.url} target="_blank" rel="noopener noreferrer" style={{
                            display:"inline-flex", alignItems:"center", gap:6,
                            marginTop:4, padding:"7px 14px", borderRadius:7,
                            background:accLo, border:`1px solid ${accBrd}`,
                            color:acc, fontSize:12, fontWeight:700, letterSpacing:"0.02em",
                            textDecoration:"none",
                          }}>
                            {tool.urlLabel?.[lang] || t.open} →
                          </a>
                        )}
                      </Acc>
                    ))
                  }
                </div>
              )}

              {/* ── PROMPTS TAB ── */}
              {tab==="prompts" && (
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:13,flexWrap:"wrap"}}>
                    <span style={{fontSize:11,color:muted}}>{t.pLang}:</span>
                    {["cs","en"].map(l=>(
                      <button key={l} onClick={()=>setPLang(l)} style={{padding:"3px 9px",borderRadius:5,border:`1px solid ${pLang===l?acc:border}`,background:pLang===l?accLo:"transparent",color:pLang===l?acc:muted,cursor:"pointer",fontSize:10.5,fontWeight:700,fontFamily:"inherit"}}>{l==="cs"?t.cs2:t.en2}</button>
                    ))}
                    <div style={{flex:1}} />
                    {[["byTask",t.byTask],["byModel",t.byModel]].map(([id,label])=>(
                      <button key={id} onClick={()=>setPView(id)} style={{padding:"3px 9px",borderRadius:5,border:`1px solid ${pView===id?acc:border}`,background:pView===id?accLo:"transparent",color:pView===id?acc:muted,cursor:"pointer",fontSize:10.5,fontWeight:700,fontFamily:"inherit"}}>{label}</button>
                    ))}
                  </div>

                  {level==="advanced" && (
                    <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:11}}>
                      <button onClick={()=>setAdvSec(null)} style={{padding:"3px 9px",borderRadius:5,fontSize:10.5,fontWeight:700,border:`1px solid ${!advSec?acc:border}`,background:!advSec?accLo:"transparent",color:!advSec?acc:muted,cursor:"pointer",fontFamily:"inherit"}}>Vše</button>
                      {ADV.map(s=>(
                        <button key={s} onClick={()=>setAdvSec(advSec===s?null:s)} style={{padding:"3px 9px",borderRadius:5,fontSize:10.5,fontWeight:700,border:`1px solid ${advSec===s?acc:border}`,background:advSec===s?accLo:"transparent",color:advSec===s?acc:muted,cursor:"pointer",fontFamily:"inherit"}}>{ADVL[s][lang]}</button>
                      ))}
                    </div>
                  )}

                  {pView==="byTask" && shownPros.map((item,i)=>(
                    <Acc key={i} expanded={expP===i} onToggle={()=>setExpP(expP===i?null:i)} icon={item.icon} title={item.task[lang]} sub={"Modely: "+item.mods.join(", ")} section={item.section} acc={acc}>
                      {item.ptip && <div style={{fontSize:13,color:acc,padding:"9px 13px",background:accLo,borderRadius:10,border:`1px solid ${accBrd}`,marginBottom:14,lineHeight:1.6}}>{t.promptTip} {item.ptip[lang]}</div>}
                      {item.ps.map((p,pi)=>(
                        <div key={pi} style={{marginBottom:11}}>
                          <div style={{fontSize:10.5,fontWeight:600,color:muted,marginBottom:5,letterSpacing:"0.04em"}}>{p.label[lang]}</div>
                          <div style={{padding:"13px 15px",borderRadius:10,background:surface,border:`1px solid ${border}`,position:"relative"}}>
                            <pre style={{fontFamily:"'DM Mono',monospace",fontSize:11,lineHeight:1.88,color:text,whiteSpace:"pre-wrap",wordBreak:"break-word",paddingRight:88}}>{p.p[pLang]||p.p["cs"]}</pre>
                            <CopyBtn text={p.p[pLang]||p.p["cs"]} id={`p${i}-${pi}`} copied={copied} cp={cp} t={t} />
                          </div>
                        </div>
                      ))}
                    </Acc>
                  ))}

                  {pView==="byModel" && ALL_MODELS.map((m,i)=>{
                    const mp = levelPros.filter(item=>item.mods.some(mod=>mod.toLowerCase().includes(m.name.split(" ")[0].toLowerCase())));
                    if(!mp.length) return null;
                    return (
                      <Acc key={i} expanded={expM===`pm${i}`} onToggle={()=>setExpM(expM===`pm${i}`?null:`pm${i}`)} icon="◆" title={m.name} sub={m.oneLiner[lang]} badge={m.price} acc={acc}>
                        {mp.map((item,pi)=>item.ps.map((p,pj)=>(
                          <div key={`${pi}-${pj}`} style={{marginBottom:9}}>
                            <div style={{fontSize:10.5,color:muted,marginBottom:4,fontWeight:500}}>{item.task[lang]} — {p.label[lang]}</div>
                            <div style={{padding:"11px 13px",borderRadius:9,background:surface,border:`1px solid ${border}`,position:"relative"}}>
                              <pre style={{fontFamily:"'DM Mono',monospace",fontSize:11,lineHeight:1.88,color:text,whiteSpace:"pre-wrap",wordBreak:"break-word",paddingRight:85}}>{p.p[pLang]||p.p["cs"]}</pre>
                              <CopyBtn text={p.p[pLang]||p.p["cs"]} id={`pm${i}-${pi}-${pj}`} copied={copied} cp={cp} t={t} />
                            </div>
                          </div>
                        )))}
                      </Acc>
                    );
                  })}
                </div>
              )}

              {/* ── MODELS TAB ── */}
              {tab==="models" && (
                <div>
                  <div style={{fontSize:11,color:muted,marginBottom:11,lineHeight:1.5}}>{t.modelsDesc}</div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:13}}>
                    <button onClick={()=>setMakerFilter(null)} style={{padding:"3px 9px",borderRadius:5,fontSize:10.5,fontWeight:700,border:`1px solid ${!makerFilter?acc:border}`,background:!makerFilter?accLo:"transparent",color:!makerFilter?acc:muted,cursor:"pointer",fontFamily:"inherit"}}>Vše</button>
                    {MAKERS.map(mk=>(
                      <button key={mk} onClick={()=>setMakerFilter(makerFilter===mk?null:mk)} style={{padding:"3px 9px",borderRadius:5,fontSize:10.5,fontWeight:700,border:`1px solid ${makerFilter===mk?acc:border}`,background:makerFilter===mk?accLo:"transparent",color:makerFilter===mk?acc:muted,cursor:"pointer",fontFamily:"inherit"}}>{mk}</button>
                    ))}
                  </div>
                  {shownModels.map((m,i)=>(
                    <Acc key={i} expanded={expM===`m${i}`} onToggle={()=>setExpM(expM===`m${i}`?null:`m${i}`)} icon="◆" title={m.name} sub={m.oneLiner[lang]} badge={m.price} acc={acc}>
                      <div style={{fontSize:11,color:muted,marginBottom:10,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                        <span style={{fontWeight:700,color:acc}}>{m.maker}</span>
                        {m.url && <a href={m.url} target="_blank" rel="noopener noreferrer" style={{color:muted,fontSize:10.5}}>{t.open} ›</a>}
                      </div>
                      {m.versions && <div style={{padding:"9px 13px",borderRadius:9,background:accLo,marginBottom:12,fontSize:12.5,color:acc,lineHeight:1.6,border:`1px solid ${accBrd}`}}><span style={{fontWeight:600}}>{t.mv}</span> {m.versions[lang]}</div>}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                        <div>
                          <div style={{fontSize:10,fontWeight:700,color:T.green,letterSpacing:"0.09em",textTransform:"uppercase",marginBottom:5}}>{t.bestFor}</div>
                          {m.bestFor[lang].map((item,j)=>(
                            <div key={j} style={{fontSize:12,color:text,lineHeight:1.55,display:"flex",gap:6,marginBottom:4,opacity:.87}}>
                              <span style={{color:T.green,flexShrink:0,marginTop:2}}>+</span><span>{item}</span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <div style={{fontSize:10,fontWeight:700,color:T.red,letterSpacing:"0.09em",textTransform:"uppercase",marginBottom:5}}>{t.notFor}</div>
                          {m.notFor[lang].map((item,j)=>(
                            <div key={j} style={{fontSize:12,color:text,lineHeight:1.55,display:"flex",gap:6,marginBottom:4,opacity:.87}}>
                              <span style={{color:T.red,flexShrink:0,marginTop:2}}>−</span><span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {m.tags && (
                        <div style={{marginBottom:12,display:"flex",flexWrap:"wrap",gap:4}}>
                          {m.tags.map((tag,ti)=>(
                            <span key={ti} style={{fontSize:10,padding:"2px 7px",borderRadius:4,border:`1px solid ${border}`,color:muted,fontWeight:600,letterSpacing:"0.04em"}}>{tag}</span>
                          ))}
                        </div>
                      )}
                      <div style={{fontSize:10,fontWeight:700,color:acc,letterSpacing:"0.09em",textTransform:"uppercase",marginBottom:7}}>{t.idealPrompts}</div>
                      {m.idealPrompts[lang].map((pr,pi)=>(
                        <div key={pi} style={{padding:"11px 13px",borderRadius:9,background:surface,border:`1px solid ${border}`,marginBottom:7,position:"relative"}}>
                          <pre style={{fontFamily:"'DM Mono',monospace",fontSize:10.5,lineHeight:1.88,color:text,whiteSpace:"pre-wrap",wordBreak:"break-word",paddingRight:84}}>{pr}</pre>
                          <CopyBtn text={pr} id={`mp${i}-${pi}`} copied={copied} cp={cp} t={t} />
                        </div>
                      ))}
                    </Acc>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        <footer style={{textAlign:"center",padding:"18px 16px 26px",borderTop:`1px solid ${border}`,color:muted,fontSize:11.5}}>
          <span style={{color:acc,fontWeight:700,letterSpacing:"-0.01em"}}>promptujai.cz</span>
          <span style={{margin:"0 7px",opacity:.35}}>·</span>
          <span>Průvodce světem AI</span>
          <span style={{margin:"0 7px",opacity:.35}}>·</span>
          <span style={{opacity:.55}}>2026</span>
        </footer>
      </div>
    </div>
  );
}
