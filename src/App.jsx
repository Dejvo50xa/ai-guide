import { useState, useRef, useEffect, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════
   PROMPTUJ.AI v2 — Interaktivní akademie promptování, agentů a smyček
   Single-file React. Zero deps. Czech-first.
   ═══════════════════════════════════════════════════════════════════ */

var T = {
  bg: "#050507", bg2: "#0A0A10", bg3: "#0E0E16",
  surface: "rgba(255,255,255,0.035)", surfaceHi: "rgba(255,255,255,0.065)",
  border: "rgba(255,255,255,0.08)", borderHi: "rgba(139,92,246,0.5)",
  violet: "#8B5CF6", violetLo: "rgba(139,92,246,0.12)",
  cyan: "#22D3EE", cyanLo: "rgba(34,211,238,0.1)",
  amber: "#F59E0B", amberLo: "rgba(245,158,11,0.1)",
  green: "#34D399", greenLo: "rgba(52,211,153,0.1)",
  red: "#F87171", redLo: "rgba(248,113,113,0.1)",
  text: "#EDEDF2", muted: "#9494A6", faint: "#55556A",
  sans: "'Inter','DM Sans',-apple-system,sans-serif",
  mono: "'JetBrains Mono','SF Mono',monospace",
  r: 18, rs: 12,
};

var CSS = "\n@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');\n*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}\nhtml{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}\nbody{background:" + T.bg + ";color:" + T.text + ";font-family:" + T.sans + ";overflow-x:hidden}\n::selection{background:rgba(139,92,246,0.4)}\n.mx{max-width:1140px;margin:0 auto;padding:0 28px}\ntextarea,select,input{font-family:inherit}\ntextarea:focus,select:focus,input:focus{outline:none;border-color:rgba(139,92,246,0.55)!important}\n@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}\n@keyframes pulsed{0%,100%{opacity:0.45}50%{opacity:1}}\n@keyframes floaty{0%{transform:translate(0,0)}50%{transform:translate(-20px,16px)}100%{transform:translate(14px,-12px)}}\n@keyframes marq{to{transform:translateX(-50%)}}\n.marq{display:flex;gap:52px;width:max-content;animation:marq 32s linear infinite;align-items:center}\n.marq:hover{animation-play-state:paused}\n.gradtxt{background:linear-gradient(95deg,#8B5CF6 5%,#22D3EE 95%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}\n.lift{transition:transform 0.3s cubic-bezier(.4,0,.2,1),box-shadow 0.3s ease,border-color 0.3s ease,background 0.3s ease}\n.lift:hover{transform:translateY(-4px);border-color:rgba(139,92,246,0.45)!important;background:rgba(255,255,255,0.055)!important}\n.navlink{position:relative;cursor:pointer}\n.navlink::after{content:'';position:absolute;left:0;bottom:-4px;width:0;height:2px;border-radius:2px;background:linear-gradient(90deg,#8B5CF6,#22D3EE);transition:width 0.25s ease}\n.navlink:hover::after{width:100%}\n@media(max-width:880px){.g2,.g3,.g4,.split{grid-template-columns:1fr!important}.hideMob{display:none!important}}\ncode.inl{font-family:'JetBrains Mono',monospace;font-size:0.86em;background:rgba(139,92,246,0.14);padding:2px 7px;border-radius:6px;color:#C4B5FD}\n";

/* ══════════════ DATA: TECHNIKY ══════════════ */
var TECHNIKY = [
  { id: "role", icon: "\u{1F3AD}", name: "Role & persona", lvl: 1, tag: "základ",
    kdy: "Vždy, když chcete konzistentní tón, perspektivu a úroveň odbornosti.",
    co: "Přidělte modelu konkrétní roli s kontextem — ne jen „jsi expert“, ale kdo, pro koho a s jakým cílem pracuje. Role aktivuje relevantní znalosti a kalibruje jazyk.",
    spatne: "Napiš mi něco o investování.",
    dobre: "Jsi finanční poradce, který 15 let vysvětluje investování úplným začátečníkům v ČR. Vysvětli rozdíl mezi ETF a podílovým fondem — česky, bez žargonu, s příkladem v korunách.",
    tip: "Čím konkrétnější role (obor + publikum + styl), tím méně generická odpověď." },
  { id: "context", icon: "\u{1F9E9}", name: "Kontext před úkolem", lvl: 1, tag: "základ",
    kdy: "Kdykoli model nezná vaši situaci — tedy skoro vždy.",
    co: "Model nevidí do vaší hlavy. Řekněte: kdo jste, co řešíte, co jste zkusili, jaká jsou omezení. Kontext je největší páka kvality vůbec.",
    spatne: "Jak mám marketovat svůj produkt?",
    dobre: "Mám e-shop s ručně šitými batohy (2 500–4 000 Kč, marže 40 %). Cílím na outdoor nadšence 25–40 let. Rozpočet 15 000 Kč/měsíc, zatím jen Instagram (3 200 sledujících). Navrhni 3 kanály s největší šancí a u každého první krok.",
    tip: "Pravidlo: co by potřeboval vědět nový kolega, potřebuje i model." },
  { id: "fewshot", icon: "\u{1F4CB}", name: "Few-shot příklady", lvl: 1, tag: "základ",
    kdy: "Když chcete specifický formát, styl nebo strukturu výstupu.",
    co: "Ukažte 2–5 příkladů vstup→výstup. Model napodobí vzor spolehlivěji, než když formát popíšete slovy. Jeden příklad vydá za odstavec instrukcí.",
    spatne: "Přepiš tyhle poznámky do úkolů.",
    dobre: "Přepiš poznámky do úkolů v tomto formátu:\nPoznámka: „zavolat Petrovi kvůli smlouvě“\n→ [ ] Zavolat Petrovi | téma: smlouva | priorita: vysoká | do: pátek\nTeď zpracuj: „porada k Q3, poslat fakturu Novákovi, rezervovat zasedačku“",
    tip: "Příklady volte rozmanité — pokryjte i okrajové případy." },
  { id: "structure", icon: "\u{1F9F1}", name: "Strukturovaný výstup", lvl: 1, tag: "základ",
    kdy: "Když výstup dál zpracováváte — tabulky, JSON, šablony, porovnání.",
    co: "Řekněte přesně, jak má výstup vypadat: sekce, délka, formát, co vynechat. U JSON definujte klíče. Modely strukturu drží dobře — když o ni řeknete.",
    spatne: "Porovnej tyhle tři notebooky.",
    dobre: "Porovnej 3 notebooky v markdown tabulce: Model | Cena | Výdrž | Váha | Pro koho. Pod tabulku sekce „Verdikt“ (max 3 věty) — doporuč jeden pro studenta s rozpočtem 25 000 Kč.",
    tip: "Pro strojové zpracování chtějte čistý JSON bez markdown bloků." },
  { id: "cot", icon: "\u{1F9E0}", name: "Chain-of-thought", lvl: 2, tag: "uvažování",
    kdy: "Složitější logika, matematika, plánování, rozhodování s více kritérii.",
    co: "Požádejte model, ať nejdřív přemýšlí krok za krokem a teprve pak odpoví. Mezikroky dramaticky snižují chyby. Moderní modely mají i zabudované „rozšířené přemýšlení“.",
    spatne: "Vyplatí se roční tarif za 2 880 Kč, když měsíční je 290 Kč?",
    dobre: "Vyplatí se roční tarif 2 880 Kč proti měsíčnímu 290 Kč? Postupuj krok za krokem: 1) roční náklady obou variant, 2) úspora v Kč a %, 3) rizika ročního závazku, 4) finální doporučení jednou větou.",
    tip: "U výpočtů přidejte: „výsledek zkontroluj opačným postupem“." },
  { id: "constraints", icon: "\u{1F6A7}", name: "Mantinely & zákazy", lvl: 2, tag: "uvažování",
    kdy: "Když model dělá věci, které nechcete — vata, omáčka, vymýšlení.",
    co: "Definujte, co výstup nesmí obsahovat a co dělat při nejistotě. „Když nevíš, řekni nevím“ je nejpodceňovanější věta promptování — omezuje halucinace.",
    spatne: "Shrň tenhle článek.",
    dobre: "Shrň článek v max 5 odrážkách. Pravidla: žádný úvod ani závěr; každá max 15 slov; jen fakta z textu — nic nedoplňuj; je-li článek nejednoznačný, napiš to.",
    tip: "Zákazy formulujte pozitivně: místo „nepiš dlouze“ → „max 100 slov“." },
  { id: "selfcrit", icon: "\u{1FA9E}", name: "Sebekritika & revize", lvl: 2, tag: "uvažování",
    kdy: "Texty, kód, strategie — cokoli, kde první verze nebývá nejlepší.",
    co: "Nechte model vytvořit výstup, pak ať ho sám zkritizuje z konkrétních hledisek a napíše vylepšenou verzi. Minismyčka, která zvedá kvalitu o ligu.",
    spatne: "Napiš prodejní e-mail pro náš nový kurz.",
    dobre: "Úkol: prodejní e-mail pro kurz promptování (1 990 Kč, cílovka marketéři).\n1) Napiš první verzi. 2) Zkritizuj: subject, první věta, benefit, CTA, délka — 1–10 a proč. 3) Napiš finální verzi zapracující kritiku. Ukaž vše.",
    tip: "Kritéria kritiky zadejte vy — jinak si model vybere snadná." },
  { id: "decompose", icon: "✂️", name: "Dekompozice úkolu", lvl: 2, tag: "uvažování",
    kdy: "Velké úkoly: e-book, byznys plán, refaktoring, analýza trhu.",
    co: "Velký úkol = špatný výstup. Nechte model navrhnout osnovu, tu schvalte, a pak generujte po částech. Vy jste editor, model je pero.",
    spatne: "Napiš mi e-book o zdravém spánku.",
    dobre: "Krok 1 (teď): Navrhni osnovu e-booku „Zdravý spánek pro práci z domova“ — 6 kapitol, u každé 3 odrážky a cílový počet slov. Nic nepiš, jen osnovu. Po schválení píšeme kapitolu po kapitole.",
    tip: "Mezi kroky vkládejte korekce — model se přizpůsobí směru." },
  { id: "prefill", icon: "\u{1F58A}️", name: "Předvyplnění odpovědi", lvl: 3, tag: "pokročilé",
    kdy: "Když chcete vynutit formát od prvního znaku — JSON, tabulka, začátek.",
    co: "Začněte odpověď za model: „začni rovnou znakem {“. V API jde odpověď doslova předvyplnit; v chatu funguje „začni přesně takto: …“. Model dokončí vzor.",
    spatne: "Vrať mi to jako JSON.",
    dobre: "Extrahuj kontakty z textu. Vrať POUZE validní JSON, žádný další text. Začni přesně znakem { a použij schéma: {\"kontakty\":[{\"jmeno\":\"\",\"email\":\"\",\"telefon\":null}]}. Chybějící = null.",
    tip: "Kombinujte se zákazem: „žádný text před ani za JSON“." },
  { id: "chaining", icon: "\u{1F517}", name: "Řetězení promptů", lvl: 3, tag: "pokročilé",
    kdy: "Workflow s fázemi: výzkum → osnova → draft → revize → finále.",
    co: "Výstup jednoho promptu je vstupem dalšího. Každý krok má jeden jasný úkol. Řetěz jednoduchých promptů poráží mega-prompt: líp se ladí a opravuje. Předstupeň agentů.",
    spatne: "Přečti recenze, najdi problémy, navrhni řešení a plán. (vše najednou)",
    dobre: "P1: „Z 50 recenzí extrahuj všechny stížnosti jako seznam.“\nP2: „Seskup do max 5 témat, seřaď podle četnosti.“\nP3: „Pro top 3 navrhni opatření s odhadem nákladů.“\nKaždý krok zkontrolujete.",
    tip: "Mezivýstupy ukládejte — když krok 3 selže, neopakujete 1–2." },
  { id: "meta", icon: "\u{1FA84}", name: "Meta-prompting", lvl: 3, tag: "pokročilé",
    kdy: "Když nevíte, jak prompt napsat — nebo ho chcete zlepšit.",
    co: "Nechte model napsat či vylepšit prompt za vás. Popište cíl a požádejte o prompt včetně otázek, na které se vás má zeptat. Model zná své slabiny líp než vy.",
    spatne: "(hodiny ručního ladění metodou pokus–omyl)",
    dobre: "Chci, aby mi AI pravidelně pomáhala psát LinkedIn posty v mém stylu. Navrhni znovupoužitelnou prompt-šablonu. Nejdřív se zeptej na vše potřebné (styl, témata, publikum, příklady), pak šablonu sestav s poli k doplnění.",
    tip: "Funguje i obráceně: „Tady je můj prompt a špatný výstup. Proč selhává?“" },
  { id: "verify", icon: "⚖️", name: "Ověřování & oponent", lvl: 3, tag: "pokročilé",
    kdy: "Fakta, čísla, právní/medicínské info, kritická rozhodnutí.",
    co: "Nechte model vytvořit více pohledů a porovnat je, nebo ať druhá „instance“ zkontroluje první: „zhodnoť jako nezávislý oponent“. Neshoda = signál nejistoty.",
    spatne: "Je tahle smlouva v pořádku? (jedna odpověď, slepá důvěra)",
    dobre: "F1: Analyzuj smlouvu z pohledu nájemce — rizika.\nF2 (nový prompt): „Jsi oponent. Najdi, co analytik přehlédl, a uveď protiargumenty.“\nF3: „Slouč obě do finálního stanoviska s mírou jistoty u každého bodu.“",
    tip: "U faktů chtějte zdroj + míru jistoty. „Nevím“ > vymyšlená citace." },
];

var ANTIPATTERNS = [
  { p: "Mega-prompt na všechno", fix: "Jeden prompt = jeden úkol. Velké věci dekomponujte nebo řetězte.", icon: "\u{1F4A3}" },
  { p: "Nulový kontext („model to ví“)", fix: "Nevidí vám do hlavy ani do firmy. Situace, cíl, omezení — pokaždé.", icon: "\u{1F573}️" },
  { p: "Vágní adjektiva: „lepší“, „krátký“", fix: "Měřitelně: „max 120 slov“, „tón jako Forbes“, „pro ředitele bez IT“.", icon: "\u{1F32B}️" },
  { p: "První odpověď = finální", fix: "Iterujte. „Verze 2: konkrétnější, půlka délky“ je nejmocnější follow-up.", icon: "\u{1F3C1}" },
  { p: "Slepá důvěra v čísla", fix: "Halucinace existují. Kritické údaje ověřujte, chtějte zdroje a jistotu.", icon: "\u{1F9DA}" },
  { p: "Jeden nekonečný chat", fix: "Dlouhý kontext ředí pozornost. Nové téma = nový chat; projekt průběžně shrňte.", icon: "\u{1F9F5}" },
  { p: "Ignorování trvalých instrukcí", fix: "Opakující se preference (jazyk, tón, formát) patří do system promptu.", icon: "⚙️" },
  { p: "Ladění bez testů", fix: "Mějte 3–5 vstupů, na kterých změnu promptu ověříte. Jinak ladíte poslepu.", icon: "\u{1F3B0}" },
];

/* ══════════════ DATA: AGENTI & SMYČKY ══════════════ */
var AGENT_PARTS = [
  { icon: "\u{1F9E0}", name: "Model (mozek)", desc: "LLM, který uvažuje a rozhoduje, co dál. Kvalita modelu = strop schopností agenta." },
  { icon: "\u{1F4DC}", name: "Instrukce (cíl)", desc: "System prompt: role, cíl, mantinely a kdy je úkol hotový. Bez „done“ se agent zacyklí." },
  { icon: "\u{1F6E0}️", name: "Nástroje (ruce)", desc: "Funkce, které agent volá: vyhledávání, kód, API, soubory. Mění „mluví“ na „koná“." },
  { icon: "\u{1F4BE}", name: "Paměť (kontext)", desc: "Krátkodobá (historie) i dlouhodobá (vektorová DB, soubory). Agent ví, co už zjistil." },
  { icon: "\u{1F501}", name: "Smyčka (motor)", desc: "Cyklus pozoruj → mysli → jednej → vyhodnoť, dokud není cíl splněn. Tohle dělá agenta." },
  { icon: "\u{1F441}️", name: "Dohled (brzda)", desc: "Limity kroků, rozpočtu, oprávnění + místa, kde rozhoduje člověk. Bezpečnostní pás." },
];

var ARCHITEKTURY = [
  { name: "Prompt chaining", lvl: "Základ", uses: "Pevné workflow o známých krocích: osnova → draft → revize.", how: "Výstup kroku N je vstup N+1. Žádné rozhodování — pevná linka. Spolehlivé, levné, snadno laditelné.", when: "Když znáte postup předem.", icon: "\u{1F517}", color: T.cyan },
  { name: "Routing", lvl: "Základ", uses: "Různé typy dotazů, různé zpracování (podpora: faktura vs. reklamace vs. dotaz).", how: "První model klasifikuje vstup a pošle ho do specializované větve s vlastním promptem a nástroji.", when: "Když máte několik odlišných scénářů.", icon: "\u{1F500}", color: T.cyan },
  { name: "Reflexe (self-critique)", lvl: "Střední", uses: "Kód, texty, řešení, kde kvalita roste revizí.", how: "Agent tvoří → druhá role kritizuje → agent opraví → opakuj, dokud kritika neutichne nebo nedojde limit.", when: "Když je „dost dobré“ poznat, ne napoprvé.", icon: "\u{1FA9E}", color: T.violet },
  { name: "Tool-use agent (ReAct)", lvl: "Střední", uses: "Úkoly vyžadující aktuální data nebo akce ve světě.", how: "Reasoning + Acting: model střídá myšlenku a volání nástroje. „Potřebuju cenu → API → 290 Kč → počítám.“ Páteř dnešních agentů.", when: "Když úkol přesahuje znalosti modelu.", icon: "\u{1F6E0}️", color: T.violet },
  { name: "Orchestrátor + workeři", lvl: "Pokročilé", uses: "Velké dělitelné úkoly (rešerše z 10 zdrojů, audit kódu).", how: "Hlavní agent rozdělí práci mezi sub-agenty, ti běží souběžně, orchestrátor výsledky složí.", when: "Když je úkol velký a paralelizovatelný.", icon: "\u{1F3BC}", color: T.amber },
];

var LOOP_STEPS = [
  { k: "GOAL", cz: "Cíl", icon: "\u{1F3AF}", color: T.green, txt: "Najdi 3 dodavatele obalů v ČR a srovnej ceny", detail: "Jasně definovaný cíl + podmínka ukončení. Agent ví, kdy skončit." },
  { k: "OBSERVE", cz: "Pozoruj", icon: "\u{1F441}️", color: T.cyan, txt: "Stav: zatím 0 dodavatelů, mám přístup k vyhledávání", detail: "Agent čte aktuální stav: co ví, co zbývá, co vrátil minulý nástroj." },
  { k: "THINK", cz: "Mysli", icon: "\u{1F9E0}", color: T.violet, txt: "Potřebuju vyhledat „výrobci kartonových obalů ČR“", detail: "Model rozhodne další akci podle cíle a pozorování. Tady vzniká plán." },
  { k: "ACT", cz: "Jednej", icon: "⚡", color: T.amber, txt: "search(\"výrobci kartonových obalů ČR\")", detail: "Agent zavolá nástroj s konkrétními parametry. Jeden krok, ne deset." },
  { k: "EVAL", cz: "Vyhodnoť", icon: "\u{1F4E5}", color: T.cyan, txt: "Nalezeno 8 firem, mám 1/3 potřebných cen", detail: "Agent přečte výsledek a aktualizuje paměť. Pokrok, nebo slepá ulička?" },
  { k: "CHECK", cz: "Hotovo?", icon: "✅", color: T.green, txt: "Mám 1 ze 3 → cíl nesplněn → další kolo", detail: "Podmínka ukončení. Splněno → konec. Ne → další kolo. Limit → bezpečná zastávka." },
];

var LOOP_PRINCIPY = [
  { icon: "\u{1F6D1}", name: "Vždy definuj konec", desc: "Každá smyčka potřebuje podmínku ukončení A tvrdý limit kroků. Bez brzdy agent buď utratí rozpočet, nebo se zacyklí." },
  { icon: "\u{1F465}", name: "Člověk v kritických bodech", desc: "Nevratné akce (e-mail, platba, smazání) nech schválit. Agent připraví, člověk odsouhlasí, agent provede." },
  { icon: "\u{1F4C9}", name: "Kontext je rozpočet", desc: "Každý krok plní okno kontextu. Dlouhé smyčky zahltí paměť a kvalita padá. Průběžně shrnujte místo vlečení historie." },
  { icon: "\u{1F50D}", name: "Loguj každý krok", desc: "Zaznamenávejte myšlenku, akci i výsledek. Když agent selže na kroku 12, bez logu nevíte proč. Pozorovatelnost = laditelnost." },
  { icon: "\u{1F4B0}", name: "Hlídej náklady", desc: "Autonomní smyčka = N volání modelu. Nastavte strop tokenů/peněz na úkol. Zacyklený agent utratí přes noc dost." },
  { icon: "\u{1F9EA}", name: "Začni malý a pevný", desc: "Nejdřív deterministický chain, pak přidávejte autonomii. Plná volnost je poslední krok, ne první. Většina úloh ji nepotřebuje." },
];

/* ══════════════ DATA: ŠABLONY, GLOSÁŘ, ROADMAP, FAQ ══════════════ */
var SABLONY = [
  { name: "Univerzální kvalitní prompt", tag: "začátek", text: "Role: Jsi [konkrétní expert] s [X] lety praxe.\nKontext: [Kdo jsem, co řeším, co jsem zkusil, omezení].\nÚkol: [Co přesně chci].\nFormát: [Délka, struktura, JSON/tabulka/odrážky].\nMantinely: [Co vynechat; když nevíš, řekni to].\nPříklad: [volitelně 1 ukázka dobrého výstupu]." },
  { name: "Iterativní vylepšení textu", tag: "psaní", text: "Úkol: [napiš X pro publikum Y].\nPostup, ukaž všechny kroky:\n1) Napiš první verzi.\n2) Zkritizuj podle: [jasnost, délka, tón, CTA] — 1–10 + proč.\n3) Napiš finální verzi, která kritiku zapracuje." },
  { name: "Extrakce do JSON", tag: "data", text: "Z textu níže extrahuj [co]. Vrať POUZE validní JSON, žádný text, začni znakem {.\nSchéma: {\"polozky\":[{\"nazev\":\"\",\"hodnota\":null}]}\nChybějící údaje = null. Nic nedomýšlej.\n\nTEXT:\n\"\"\"\n[vlož text]\n\"\"\"" },
  { name: "Rešerše s ověřením", tag: "fakta", text: "Téma: [X].\n1) Shrň spolehlivě známé — u každého tvrzení míra jistoty (vysoká/střední/nízká).\n2) Vyznač sporné nebo vyvíjející se.\n3) Co nevíš s jistotou, označ „nejisté“ — nevymýšlej zdroje." },
  { name: "Plán agentního úkolu", tag: "agenti", text: "Cíl: [měřitelný výsledek].\nHotovo, když: [podmínka].\nNástroje: [search, kód, …].\nLimity: max [N] kroků, rozpočet [X].\nPostup: nejdřív navrhni plán a počkej na schválení. Nevratné akce nech schválit.\nLoguj: myšlenka → akce → výsledek." },
  { name: "Meta-prompt", tag: "pokročilé", text: "Chci opakovaně používat AI pro [účel].\nNavrhni znovupoužitelnou prompt-šablonu.\nNejdřív se zeptej na vše potřebné (styl, publikum, příklady, omezení), pak ji sestav s poli k doplnění." },
];

var GLOSAR = [
  { t: "Prompt", d: "Vstup pro model — instrukce, otázka, kontext. Kvalita promptu = strop kvality výstupu." },
  { t: "Token", d: "Kousek textu (~0,75 slova). Modely čtou i účtují v tokenech; kontext i cena se měří v nich." },
  { t: "Kontextové okno", d: "Maximum tokenů, které model vidí najednou. Vše nad limit vypadne — proto dlouhé chaty ztrácejí nit." },
  { t: "System prompt", d: "Trvalá instrukce nad konverzací: role, tón, pravidla. Platí pro celý chat." },
  { t: "Halucinace", d: "Sebejisté, ale nepravdivé tvrzení. Model generuje pravděpodobný text, ne ověřenou pravdu." },
  { t: "Teplota", d: "Míra náhodnosti výstupu. Nízká = předvídatelné a faktické, vysoká = kreativní." },
  { t: "Few-shot", d: "Pár příkladů vstup→výstup přímo v promptu. Model napodobí vzor líp než slovní popis." },
  { t: "Chain-of-thought", d: "Postup „krok za krokem“ před odpovědí. Snižuje chyby u logiky a počtů." },
  { t: "RAG", d: "Retrieval-Augmented Generation: model si před odpovědí vyhledá dokumenty a opírá se o ně." },
  { t: "Agent", d: "Systém, kde LLM v smyčce sám volí a volá nástroje, dokud nesplní cíl. Nejen mluví — koná." },
  { t: "Nástroj (tool)", d: "Funkce, kterou model umí zavolat: vyhledávání, kód, API. Rozšiřuje model o akce." },
  { t: "ReAct", d: "Reasoning + Acting: vzor, kdy model střídá úvahu a akci nástroje. Páteř agentů." },
  { t: "Orchestrátor", d: "Hlavní agent, který rozděluje práci mezi sub-agenty a skládá výsledky." },
  { t: "Human-in-the-loop", d: "Architektura, kde člověk schvaluje kritické či nevratné kroky agenta." },
  { t: "MCP", d: "Model Context Protocol — standard pro připojení nástrojů a dat k modelům. „USB“ pro AI." },
  { t: "Fine-tuning", d: "Doučení modelu na vlastních datech pro konkrétní úkol. Silnější, dražší než promptování." },
  { t: "Embedding", d: "Převod textu na vektor zachycující význam. Základ vyhledávání podle smyslu a RAG." },
  { t: "Self-consistency", d: "Více nezávislých odpovědí a výběr nejlepší. Zvyšuje spolehlivost u uvažování." },
];

var ROADMAP = [
  { f: "1", name: "Mluvit s modelem", lvl: "Začátečník", weeks: "Týden 1–2", items: ["Role + kontext + jasný úkol", "Iterace: „verze 2, konkrétnější“", "Strukturovaný výstup (tabulky)", "Rozpoznat a ověřit halucinaci"] },
  { f: "2", name: "Promptovat jako profík", lvl: "Mírně pokročilý", weeks: "Týden 3–5", items: ["Few-shot příklady", "Chain-of-thought u logiky", "Mantinely a zákazy", "Sebekritika a revize", "Vlastní system prompt"] },
  { f: "3", name: "Stavět workflow", lvl: "Pokročilý", weeks: "Týden 6–9", items: ["Dekompozice úkolů", "Řetězení s kontrolami", "Meta-prompting a šablony", "Ověřování přes oponenta", "Testovací sada promptů"] },
  { f: "4", name: "Orchestrovat agenty", lvl: "Expert", weeks: "Týden 10+", items: ["Anatomie agenta", "ReAct a tool-use", "Reflexní a routing vzory", "Smyčky s limity a logy", "Orchestrátor + sub-agenti"] },
];

var FAQ_DATA = [
  { q: "Musím umět programovat, abych využil agenty?", a: "Pro pochopení principů ne. Pro stavbu vlastních agentů se hodí základy (Python, API), ale řada no-code nástrojů dnes umožní postavit funkční agentní workflow bez kódu. Začněte porozuměním smyčce a architekturám — nástroj je až druhý krok." },
  { q: "Jaký je rozdíl mezi chatbotem a agentem?", a: "Chatbot odpoví na zprávu a čeká. Agent dostane cíl a sám v smyčce rozhoduje, volá nástroje a opakuje kroky, dokud cíl nesplní — bez diktování každého kroku. Klíč je autonomní smyčka a přístup k nástrojům." },
  { q: "Halucinují i nejnovější modely?", a: "Ano, i když výrazně méně. Halucinace plyne z principu — model generuje pravděpodobný text, ne ověřenou pravdu. Proto chtějte u faktů zdroje a míru jistoty, kritické údaje ověřujte a používejte RAG či vyhledávání, které model uzemní v reálných datech." },
  { q: "Vyplatí se platit za prémiové modely?", a: "U jednoduchých úkolů stačí levnější/zdarma modely. U složitějšího uvažování, kódu, dlouhého kontextu a agentních smyček se kvalitnější model vyplatí — chybovost a počet iterací klesnou natolik, že ušetří víc času, než stojí." },
  { q: "Jak dlouhý má být ideální prompt?", a: "Tak dlouhý, aby obsahoval potřebný kontext a instrukce — a ani slovo navíc. Lepší je strukturovaný prompt o pěti jasných částech než odstavec vaty. Délka není cíl; jasnost ano." },
  { q: "Co je nejčastější chyba začátečníků?", a: "Nulový kontext a vágní zadání — lidé píší modelu, jako by jim viděl do hlavy. Druhá: spokojit se s první odpovědí místo iterace. Opravení těchto dvou věcí zvedne kvalitu víc než jakákoli pokročilá technika." },
  { q: "Kdy je čas na agenta a ne jen prompt?", a: "Když úkol vyžaduje více kroků, aktuální data nebo akce ve světě a vy byste jinak ručně kopírovali výstupy mezi prompty. Pokud to zvládne jeden dobrý prompt nebo krátký řetěz, agenta nepotřebujete — jednoduchost vyhrává." },
  { q: "Jsou moje data v promptu v bezpečí?", a: "Záleží na poskytovateli a nastavení. Nevkládejte citlivá data (hesla, rodná čísla, zdravotní záznamy) do veřejných nástrojů bez jasné garance. U firmy hledejte režim bez trénování na vašich datech a respektujte GDPR. Při pochybnostech anonymizujte." },
];

/* ══════════════ POMOCNÍCI ══════════════ */
function useReveal(th) {
  if (th === undefined) th = 0.12;
  var ref = useRef(null);
  var s = useState(false), vis = s[0], set = s[1];
  useEffect(function () {
    var el = ref.current; if (!el) return;
    var o = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { set(true); o.disconnect(); } }, { threshold: th });
    o.observe(el); return function () { o.disconnect(); };
  }, [th]);
  return [ref, vis];
}

function Reveal(props) {
  var r = useReveal(0.1), ref = r[0], vis = r[1];
  return <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)", transition: "opacity 0.7s ease " + (props.delay || 0) + "s, transform 0.7s cubic-bezier(.4,0,.2,1) " + (props.delay || 0) + "s", height: props.fill ? "100%" : undefined }}>{props.children}</div>;
}

function goTo(id) { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth" }); }

function Eyebrow(props) {
  return <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: props.color || T.violet, marginBottom: 12, fontWeight: 600 }}>{props.children}</div>;
}

function SectionHead(props) {
  return (
    <Reveal>
      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <Eyebrow color={props.color}>{props.eyebrow}</Eyebrow>
        <h2 style={{ fontFamily: T.sans, fontSize: "clamp(28px,4.4vw,46px)", fontWeight: 800, letterSpacing: -1.4, lineHeight: 1.1 }}>{props.title}</h2>
        {props.sub && <p style={{ color: T.muted, marginTop: 14, fontSize: 15.5, maxWidth: 600, margin: "14px auto 0", lineHeight: 1.7 }}>{props.sub}</p>}
      </div>
    </Reveal>
  );
}

function Pill(props) {
  var prim = props.primary;
  return (
    <button onClick={props.onClick} style={{ border: prim ? "none" : "1.5px solid " + T.border, cursor: "pointer", fontFamily: T.sans, fontWeight: 600, borderRadius: 999, padding: props.big ? "15px 34px" : "10px 22px", fontSize: props.big ? 15 : 13.5, color: prim ? "#0A0A12" : T.text, background: prim ? "linear-gradient(95deg,#8B5CF6,#22D3EE)" : T.surface, transition: "transform 0.15s ease,box-shadow 0.15s ease", boxShadow: prim ? "0 8px 26px rgba(139,92,246,0.32)" : "none", ...(props.style || {}) }}
      onMouseEnter={function (e) { e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={function (e) { e.currentTarget.style.transform = "translateY(0)"; }}>
      {props.children}
    </button>
  );
}

function CopyBtn(props) {
  var s = useState(false), done = s[0], set = s[1];
  function copy() {
    try { navigator.clipboard.writeText(props.text); } catch (e) {}
    set(true); setTimeout(function () { set(false); }, 1600);
  }
  return (
    <button onClick={copy} style={{ border: "1px solid " + (done ? "rgba(52,211,153,0.5)" : T.border), background: done ? T.greenLo : T.surface, color: done ? T.green : T.muted, fontFamily: T.mono, fontSize: 11.5, fontWeight: 600, padding: "6px 13px", borderRadius: 8, cursor: "pointer", transition: "all 0.2s ease", whiteSpace: "nowrap" }}>
      {done ? "✓ Zkopírováno" : (props.label || "Kopírovat")}
    </button>
  );
}

/* ══════════════ HERO TYPING ══════════════ */
function TypingDemo() {
  var lines = useMemo(function () { return [
    "Jsi finanční poradce pro začátečníky…",
    "Postupuj krok za krokem a výsledek ověř…",
    "Vrať POUZE validní JSON, začni znakem {…",
    "Cíl: najdi 3 dodavatele. Max 15 kroků…",
  ]; }, []);
  var s1 = useState(0), li = s1[0], setLi = s1[1];
  var s2 = useState(""), txt = s2[0], setTxt = s2[1];
  var s3 = useState(false), del = s3[0], setDel = s3[1];
  useEffect(function () {
    var full = lines[li];
    var t;
    if (!del && txt.length < full.length) t = setTimeout(function () { setTxt(full.slice(0, txt.length + 1)); }, 38);
    else if (!del && txt.length === full.length) t = setTimeout(function () { setDel(true); }, 1500);
    else if (del && txt.length > 0) t = setTimeout(function () { setTxt(full.slice(0, txt.length - 1)); }, 18);
    else { setDel(false); setLi((li + 1) % lines.length); }
    return function () { clearTimeout(t); };
  }, [txt, del, li, lines]);
  return (
    <div style={{ fontFamily: T.mono, fontSize: 14, background: "#0B0B12", border: "1px solid " + T.border, borderRadius: 14, padding: "18px 20px", textAlign: "left", maxWidth: 560, margin: "0 auto", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {["#F87171", "#F59E0B", "#34D399"].map(function (c) { return <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c, opacity: 0.8 }} />; })}
        <span style={{ marginLeft: "auto", color: T.faint, fontSize: 11 }}>prompt.txt</span>
      </div>
      <span style={{ color: T.violet }}>&gt; </span>
      <span style={{ color: T.text }}>{txt}</span>
      <span style={{ display: "inline-block", width: 8, height: 16, background: T.cyan, marginLeft: 2, verticalAlign: "text-bottom", animation: "blink 1s step-end infinite" }} />
    </div>
  );
}

/* ══════════════ INTERAKTIVNÍ PROMPT BUILDER ══════════════ */
function PromptBuilder() {
  var s = useState({ role: "", kontext: "", ukol: "", format: "Odrážky", mantinely: true, cot: false }), v = s[0], set = s[1];
  function upd(k, val) { set(function (p) { var n = Object.assign({}, p); n[k] = val; return n; }); }
  var prompt = useMemo(function () {
    var parts = [];
    parts.push("Role: Jsi " + (v.role.trim() || "[doplň konkrétního experta a pro koho pracuje]") + ".");
    parts.push("Kontext: " + (v.kontext.trim() || "[doplň svou situaci, cíl a omezení]") + ".");
    parts.push("Úkol: " + (v.ukol.trim() || "[doplň, co přesně chceš]") + ".");
    var fmap = { "Odrážky": "stručné odrážky", "Tabulka": "markdown tabulku", "JSON": "POUZE validní JSON (začni znakem {, žádný další text)", "Krátký odstavec": "jeden krátký odstavec (max 100 slov)", "Krok za krokem": "číslovaný postup" };
    parts.push("Formát: Odpověz jako " + fmap[v.format] + ".");
    if (v.cot) parts.push("Postup: Nejdřív přemýšlej krok za krokem, pak teprve odpověz.");
    if (v.mantinely) parts.push("Mantinely: Drž se faktů. Pokud něco nevíš, napiš to — nevymýšlej. Žádná zbytečná omáčka.");
    return parts.join("\n");
  }, [v]);
  var score = (v.role ? 1 : 0) + (v.kontext ? 1 : 0) + (v.ukol ? 1 : 0) + 1 + (v.cot ? 1 : 0) + (v.mantinely ? 1 : 0);
  var inp = { width: "100%", background: "#0B0B12", border: "1px solid " + T.border, borderRadius: 10, color: T.text, fontSize: 13.5, padding: "11px 13px", marginTop: 6 };
  var lab = { fontSize: 12.5, fontWeight: 600, color: T.muted };
  return (
    <div className="split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
      <div style={{ background: T.surface, border: "1px solid " + T.border, borderRadius: T.r, padding: 24 }}>
        <div style={{ marginBottom: 14 }}>
          <div style={lab}>Role <span style={{ color: T.faint }}>— kdo a pro koho</span></div>
          <input style={inp} value={v.role} placeholder="daňový poradce pro OSVČ" onChange={function (e) { upd("role", e.target.value); }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={lab}>Kontext <span style={{ color: T.faint }}>— vaše situace</span></div>
          <textarea rows={2} style={inp} value={v.kontext} placeholder="jsem OSVČ na volné noze, paušální daň, řeším přechod na s.r.o." onChange={function (e) { upd("kontext", e.target.value); }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={lab}>Úkol <span style={{ color: T.faint }}>— co chcete</span></div>
          <textarea rows={2} style={inp} value={v.ukol} placeholder="vysvětli, kdy se mi přechod na s.r.o. vyplatí" onChange={function (e) { upd("ukol", e.target.value); }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={lab}>Formát výstupu</div>
          <select style={inp} value={v.format} onChange={function (e) { upd("format", e.target.value); }}>
            {["Odrážky", "Tabulka", "JSON", "Krátký odstavec", "Krok za krokem"].map(function (o) { return <option key={o} value={o}>{o}</option>; })}
          </select>
        </div>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          {[["cot", "Chain-of-thought"], ["mantinely", "Mantinely proti halucinaci"]].map(function (c) { return (
            <label key={c[0]} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: T.text }}>
              <input type="checkbox" checked={v[c[0]]} onChange={function (e) { upd(c[0], e.target.checked); }} style={{ accentColor: T.violet, width: 16, height: 16 }} />
              {c[1]}
            </label>); })}
        </div>
      </div>
      <div style={{ background: "#0B0B12", border: "1px solid " + T.border, borderRadius: T.r, padding: 24, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: 1.5, color: T.faint, textTransform: "uppercase" }}>Tvůj prompt</span>
          <CopyBtn text={prompt} />
        </div>
        <pre style={{ fontFamily: T.mono, fontSize: 12.8, lineHeight: 1.75, color: T.text, whiteSpace: "pre-wrap", flex: 1, margin: 0 }}>{prompt}</pre>
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid " + T.border }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: T.muted, marginBottom: 6 }}>
            <span>Síla promptu</span><span style={{ color: score >= 5 ? T.green : score >= 3 ? T.amber : T.red, fontWeight: 700 }}>{score}/6</span>
          </div>
          <div style={{ height: 7, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: (score / 6 * 100) + "%", background: "linear-gradient(90deg,#8B5CF6,#22D3EE)", borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════ SIMULÁTOR AGENTNÍ SMYČKY ══════════════ */
function LoopSimulator() {
  var s1 = useState(0), step = s1[0], setStep = s1[1];
  var s2 = useState(false), playing = s2[0], setPlaying = s2[1];
  useEffect(function () {
    if (!playing) return;
    var t = setTimeout(function () { setStep(function (p) { return (p + 1) % LOOP_STEPS.length; }); }, 1700);
    return function () { clearTimeout(t); };
  }, [playing, step]);
  var cur = LOOP_STEPS[step];
  var R = 132, cx = 160, cy = 160;
  return (
    <div className="split" style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 28, alignItems: "center" }}>
      <div style={{ position: "relative", width: 320, height: 320, margin: "0 auto" }}>
        <svg viewBox="0 0 320 320" style={{ width: "100%", height: "100%" }}>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeDasharray="4 6" />
          {LOOP_STEPS.map(function (st, i) {
            var a = (i / LOOP_STEPS.length) * Math.PI * 2 - Math.PI / 2;
            var x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
            var on = i === step;
            return (
              <g key={i} style={{ cursor: "pointer" }} onClick={function () { setPlaying(false); setStep(i); }}>
                <circle cx={x} cy={y} r={on ? 26 : 20} fill={on ? st.color : "#12121C"} stroke={on ? st.color : T.border} strokeWidth={on ? 2 : 1} style={{ transition: "all 0.4s ease", filter: on ? "drop-shadow(0 0 12px " + st.color + ")" : "none" }} />
                <text x={x} y={y + 5} textAnchor="middle" fontSize={on ? 18 : 14} style={{ transition: "all 0.3s ease" }}>{st.icon}</text>
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r="42" fill={cur.color + "18"} stroke={cur.color} strokeWidth="1.5" style={{ transition: "all 0.4s ease" }} />
          <text x={cx} y={cy - 3} textAnchor="middle" fontSize="11" fill={cur.color} fontFamily={T.mono} fontWeight="700">{cur.k}</text>
          <text x={cx} y={cy + 13} textAnchor="middle" fontSize="10" fill={T.muted} fontFamily={T.sans}>{cur.cz}</text>
        </svg>
      </div>
      <div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          <Pill primary onClick={function () { setPlaying(!playing); }} style={{ padding: "9px 20px", fontSize: 13 }}>{playing ? "⏸ Pauza" : "▶ Spustit smyčku"}</Pill>
          <Pill onClick={function () { setPlaying(false); setStep((step + 1) % LOOP_STEPS.length); }} style={{ padding: "9px 18px", fontSize: 13 }}>Další krok →</Pill>
        </div>
        <div style={{ background: T.surface, border: "1px solid " + cur.color + "55", borderRadius: T.r, padding: 22, transition: "border-color 0.4s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 22 }}>{cur.icon}</span>
            <span style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 700, color: cur.color, letterSpacing: 1 }}>{cur.k} · {cur.cz}</span>
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 13.5, color: T.text, background: "#0B0B12", border: "1px solid " + T.border, borderRadius: 10, padding: "11px 14px", marginBottom: 12 }}>{cur.txt}</div>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, color: T.muted }}>{cur.detail}</p>
        </div>
        <div style={{ display: "flex", gap: 5, marginTop: 12 }}>
          {LOOP_STEPS.map(function (st, i) { return <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i === step ? cur.color : "rgba(255,255,255,0.08)", transition: "background 0.3s ease" }} />; })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════ KARTA TECHNIKY + MODAL ══════════════ */
function TechCard(props) {
  var t = props.t;
  var lvlc = t.lvl === 1 ? T.green : t.lvl === 2 ? T.amber : T.violet;
  return (
    <div className="lift" onClick={props.onOpen} style={{ background: T.surface, border: "1px solid " + T.border, borderRadius: T.r, padding: "22px 22px", cursor: "pointer", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <span style={{ fontSize: 26 }}>{t.icon}</span>
        <span style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 700, color: lvlc, background: lvlc + "18", border: "1px solid " + lvlc + "44", borderRadius: 99, padding: "3px 10px", textTransform: "uppercase", letterSpacing: 0.5 }}>{t.tag}</span>
      </div>
      <h3 style={{ fontFamily: T.sans, fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{t.name}</h3>
      <p style={{ fontSize: 13, lineHeight: 1.65, color: T.muted, marginBottom: 14 }}>{t.kdy}</p>
      <span style={{ fontSize: 12.5, color: T.cyan, fontWeight: 600 }}>Ukázat příklad →</span>
    </div>
  );
}

function TechModal(props) {
  var t = props.t;
  useEffect(function () { document.body.style.overflow = "hidden"; return function () { document.body.style.overflow = ""; }; }, []);
  if (!t) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={props.onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }} />
      <div onClick={function (e) { e.stopPropagation(); }} style={{ position: "relative", background: T.bg2, border: "1px solid " + T.border, borderRadius: 22, maxWidth: 680, width: "100%", maxHeight: "88vh", overflow: "auto", padding: "30px 34px 36px", boxShadow: "0 40px 100px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span style={{ fontSize: 32 }}>{t.icon}</span>
            <div>
              <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.violet, textTransform: "uppercase", marginBottom: 3 }}>Technika promptování</div>
              <h2 style={{ fontFamily: T.sans, fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>{t.name}</h2>
            </div>
          </div>
          <button onClick={props.onClose} style={{ width: 38, height: 38, borderRadius: 99, border: "1px solid " + T.border, background: T.surface, cursor: "pointer", fontSize: 20, color: T.muted, flexShrink: 0 }}>×</button>
        </div>
        <p style={{ fontSize: 14.5, lineHeight: 1.8, color: T.text, marginBottom: 20 }}>{t.co}</p>
        <div style={{ display: "grid", gap: 12, marginBottom: 18 }}>
          <div style={{ background: T.redLo, border: "1px solid rgba(248,113,113,0.3)", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontFamily: T.mono, fontSize: 11, color: T.red, fontWeight: 700, marginBottom: 7, letterSpacing: 0.5 }}>✗ SLABÝ PROMPT</div>
            <div style={{ fontFamily: T.mono, fontSize: 13, color: T.text, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{t.spatne}</div>
          </div>
          <div style={{ background: T.greenLo, border: "1px solid rgba(52,211,153,0.3)", borderRadius: 12, padding: "14px 16px", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
              <div style={{ fontFamily: T.mono, fontSize: 11, color: T.green, fontWeight: 700, letterSpacing: 0.5 }}>✓ SILNÝ PROMPT</div>
              <CopyBtn text={t.dobre} label="Kopírovat" />
            </div>
            <div style={{ fontFamily: T.mono, fontSize: 13, color: T.text, whiteSpace: "pre-wrap", lineHeight: 1.65 }}>{t.dobre}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: T.violetLo, border: "1px solid rgba(139,92,246,0.3)", borderRadius: 12, padding: "13px 16px" }}>
          <span style={{ fontSize: 16 }}>💡</span>
          <span style={{ fontSize: 13.5, lineHeight: 1.65, color: "#D6CCFA" }}>{t.tip}</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════ FAQ ══════════════ */
function FaqItem(props) {
  var s = useState(false), open = s[0], set = s[1];
  return (
    <div style={{ border: "1px solid " + T.border, borderRadius: 14, background: T.surface, marginBottom: 10, overflow: "hidden" }}>
      <button onClick={function () { set(!open); }} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "18px 22px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <span style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 600, color: T.text }}>{props.q}</span>
        <span style={{ flexShrink: 0, width: 27, height: 27, borderRadius: 99, border: "1.5px solid " + T.violet, color: T.violet, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.25s ease" }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 360 : 0, overflow: "hidden", transition: "max-height 0.35s cubic-bezier(.4,0,.2,1)" }}>
        <p style={{ padding: "0 22px 20px", fontSize: 14, lineHeight: 1.8, color: T.muted }}>{props.a}</p>
      </div>
    </div>
  );
}

/* ══════════════ GLOSÁŘ ══════════════ */
function Glosar() {
  var s = useState(""), q = s[0], set = s[1];
  var f = GLOSAR.filter(function (g) { return (g.t + " " + g.d).toLowerCase().indexOf(q.toLowerCase()) !== -1; });
  return (
    <div>
      <div style={{ maxWidth: 420, margin: "0 auto 30px", position: "relative" }}>
        <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: T.faint }}>🔍</span>
        <input value={q} onChange={function (e) { set(e.target.value); }} placeholder={"Hledej v " + GLOSAR.length + " pojmech…"} style={{ width: "100%", padding: "13px 20px 13px 44px", borderRadius: 999, border: "1px solid " + T.border, background: T.surface, color: T.text, fontSize: 14 }} />
      </div>
      <div className="g3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {f.map(function (g) { return (
          <div key={g.t} className="lift" style={{ background: T.surface, border: "1px solid " + T.border, borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ fontFamily: T.sans, fontSize: 14.5, fontWeight: 700, color: T.cyan, marginBottom: 6 }}>{g.t}</div>
            <p style={{ fontSize: 12.5, lineHeight: 1.65, color: T.muted }}>{g.d}</p>
          </div>); })}
      </div>
      {f.length === 0 && <p style={{ textAlign: "center", color: T.faint, marginTop: 14 }}>Nic nenalezeno pro „{q}“.</p>}
    </div>
  );
}

/* ══════════════ NAV + PROGRESS ══════════════ */
function Nav() {
  var bar = useRef(null);
  useEffect(function () {
    function on() { var h = document.documentElement; var p = h.scrollTop / (h.scrollHeight - h.clientHeight); if (bar.current) bar.current.style.width = (p * 100).toFixed(2) + "%"; }
    window.addEventListener("scroll", on, { passive: true }); on();
    return function () { window.removeEventListener("scroll", on); };
  }, []);
  var links = [["Techniky", "techniky"], ["Builder", "builder"], ["Agenti", "agenti"], ["Smyčka", "smycka"], ["Šablony", "sablony"], ["Slovník", "slovnik"]];
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(5,5,7,0.8)", backdropFilter: "blur(18px)", borderBottom: "1px solid " + T.border }}>
      <div className="mx" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 28px" }}>
        <div onClick={function () { window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 16, cursor: "pointer", letterSpacing: -0.5 }}>promptuj<span className="gradtxt">.ai</span></div>
        <div className="hideMob" style={{ display: "flex", gap: 24 }}>
          {links.map(function (l) { return <span key={l[1]} className="navlink" onClick={function () { goTo(l[1]); }} style={{ fontSize: 13.5, fontWeight: 500, color: T.muted }}>{l[0]}</span>; })}
        </div>
        <Pill primary onClick={function () { goTo("builder"); }} style={{ padding: "9px 18px", fontSize: 13 }}>Vyzkoušet builder</Pill>
      </div>
      <div style={{ height: 2, background: "transparent" }}><div ref={bar} style={{ height: "100%", width: "0%", background: "linear-gradient(90deg,#8B5CF6,#22D3EE)" }} /></div>
    </nav>
  );
}

/* ═══════════════════════════ MAIN ═══════════════════════════ */
export default function App() {
  var sm = useState(null), tech = sm[0], setTech = sm[1];
  var sf = useState("vse"), filter = sf[0], setFilter = sf[1];
  var techShown = TECHNIKY.filter(function (t) { return filter === "vse" || ("" + t.lvl) === filter; });
  var card = { background: T.surface, border: "1px solid " + T.border, borderRadius: T.r };

  return (
    <>
      <style>{CSS}</style>
      {tech && <TechModal t={tech} onClose={function () { setTech(null); }} />}
      <Nav />

      {/* HERO */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", paddingTop: 90, paddingBottom: 60, textAlign: "center" }}>
        <div style={{ position: "absolute", top: "-10%", right: "-8%", width: 540, height: 540, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.16),transparent 70%)", pointerEvents: "none", animation: "floaty 18s ease-in-out infinite alternate" }} />
        <div style={{ position: "absolute", bottom: "-12%", left: "-8%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle,rgba(34,211,238,0.12),transparent 70%)", pointerEvents: "none", animation: "floaty 22s ease-in-out infinite alternate-reverse" }} />
        <div className="mx" style={{ position: "relative", zIndex: 1, maxWidth: 860 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 99, background: T.surface, border: "1px solid " + T.border, marginBottom: 28 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.green, animation: "pulsed 2s infinite" }} />
            <span style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, letterSpacing: 1, textTransform: "uppercase" }}>Od prvního promptu k vlastním agentům</span>
          </div>
          <h1 style={{ fontFamily: T.sans, fontSize: "clamp(40px,7vw,76px)", fontWeight: 800, lineHeight: 1.02, letterSpacing: -2.5, marginBottom: 22 }}>Ovládni AI.<br /><span className="gradtxt">Od promptu k agentům.</span></h1>
          <p style={{ fontSize: "clamp(15px,2vw,19px)", color: T.muted, lineHeight: 1.7, maxWidth: 600, margin: "0 auto 34px" }}>Interaktivní česká akademie promptování, agentních systémů a smyček. Žádná teorie do šuplíku — techniky, živé nástroje a vzory, které použiješ ještě dnes.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 44 }}>
            <Pill primary big onClick={function () { goTo("techniky"); }}>Začít se učit</Pill>
            <Pill big onClick={function () { goTo("smycka"); }}>Spustit simulátor smyčky</Pill>
          </div>
          <TypingDemo />
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ padding: "18px 0", borderTop: "1px solid " + T.border, borderBottom: "1px solid " + T.border, overflow: "hidden", position: "relative", background: T.bg2 }}>
        <div className="marq">
          {[0, 1].map(function (rep) { return ["Role & kontext", "Few-shot", "Chain-of-thought", "Sebekritika", "Řetězení promptů", "ReAct agenti", "Reflexní smyčka", "Orchestrace", "RAG", "Human-in-the-loop", "Meta-prompting", "Self-consistency"].map(function (w) { return <span key={rep + w} style={{ fontFamily: T.mono, fontSize: 13, fontWeight: 600, color: T.faint, whiteSpace: "nowrap", letterSpacing: 0.5 }}>{w}</span>; }); })}
        </div>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(90deg," + T.bg2 + " 0%,transparent 10%,transparent 90%," + T.bg2 + " 100%)" }} />
      </div>

      {/* CESTA */}
      <section style={{ padding: "90px 0 70px" }}>
        <div className="mx">
          <SectionHead eyebrow="Tvoje cesta" title="Čtyři úrovně, jeden směr" sub="Od první konverzace s modelem až po orchestraci více agentů. Každá úroveň staví na předchozí." />
          <div className="g4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {ROADMAP.map(function (r, i) { return (
              <Reveal key={i} delay={i * 0.1} fill>
                <div className="lift" style={{ ...card, padding: "24px 22px", height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#8B5CF6,#22D3EE)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#0A0A12", fontFamily: T.mono }}>{r.f}</div>
                    <div style={{ fontFamily: T.mono, fontSize: 10, color: T.faint, letterSpacing: 1, textTransform: "uppercase" }}>{r.weeks}</div>
                  </div>
                  <div style={{ fontSize: 11, color: T.violet, fontWeight: 600, marginBottom: 3 }}>{r.lvl}</div>
                  <h3 style={{ fontFamily: T.sans, fontSize: 17, fontWeight: 700, marginBottom: 12, letterSpacing: -0.3 }}>{r.name}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {r.items.map(function (it, j) { return (
                      <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <span style={{ color: T.green, fontSize: 12, flexShrink: 0, marginTop: 1 }}>›</span>
                        <span style={{ fontSize: 12.5, lineHeight: 1.55, color: T.muted }}>{it}</span>
                      </div>); })}
                  </div>
                </div>
              </Reveal>); })}
          </div>
        </div>
      </section>

      {/* TECHNIKY */}
      <section id="techniky" style={{ padding: "80px 0", background: T.bg2, borderTop: "1px solid " + T.border, borderBottom: "1px solid " + T.border }}>
        <div className="mx">
          <SectionHead eyebrow="Knihovna technik" title="12 technik promptování" sub="U každé: kdy ji použít, slabá vs. silná verze promptu a tip navíc. Klikni pro příklad k okopírování." />
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 30, flexWrap: "wrap" }}>
            {[["vse", "Vše"], ["1", "Základ"], ["2", "Uvažování"], ["3", "Pokročilé"]].map(function (o) { return (
              <button key={o[0]} onClick={function () { setFilter(o[0]); }} style={{ padding: "8px 18px", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "1px solid " + (filter === o[0] ? T.violet : T.border), background: filter === o[0] ? T.violetLo : T.surface, color: filter === o[0] ? "#C4B5FD" : T.muted }}>{o[1]}</button>); })}
          </div>
          <div className="g3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {techShown.map(function (t, i) { return <Reveal key={t.id} delay={(i % 3) * 0.08} fill><TechCard t={t} onOpen={function () { setTech(t); }} /></Reveal>; })}
          </div>
        </div>
      </section>

      {/* PROMPT BUILDER */}
      <section id="builder" style={{ padding: "90px 0" }}>
        <div className="mx">
          <SectionHead eyebrow="Interaktivní nástroj" title="Postav si prompt naživo" sub="Vyplň pole vlevo, sleduj, jak vpravo roste profesionální prompt — a zkopíruj ho jedním klikem." />
          <PromptBuilder />
        </div>
      </section>

      {/* ANTIPATTERNS */}
      <section style={{ padding: "70px 0", background: T.bg2, borderTop: "1px solid " + T.border, borderBottom: "1px solid " + T.border }}>
        <div className="mx">
          <SectionHead color={T.red} eyebrow="Čemu se vyhnout" title="8 nejčastějších chyb" sub="Oprav tyhle a kvalita tvých výstupů povyskočí dřív než od jakékoli pokročilé techniky." />
          <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {ANTIPATTERNS.map(function (a, i) { return (
              <Reveal key={i} delay={(i % 2) * 0.08} fill>
                <div className="lift" style={{ ...card, padding: "18px 20px", display: "flex", gap: 14, height: "100%" }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: 700, color: T.red, marginBottom: 5, textDecoration: "line-through", textDecorationColor: "rgba(248,113,113,0.45)" }}>{a.p}</div>
                    <div style={{ fontSize: 13, lineHeight: 1.6, color: T.muted }}><span style={{ color: T.green, fontWeight: 700 }}>→ </span>{a.fix}</div>
                  </div>
                </div>
              </Reveal>); })}
          </div>
        </div>
      </section>

      {/* AGENTI */}
      <section id="agenti" style={{ padding: "90px 0" }}>
        <div className="mx">
          <SectionHead color={T.cyan} eyebrow="Agentní systémy" title="Z chatbota agentem" sub="Agent dostane cíl a sám rozhoduje, jedná a opakuje, dokud není hotovo. Tady je jeho anatomie a vzory, na kterých stojí." />
          <div className="g3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 56 }}>
            {AGENT_PARTS.map(function (p, i) { return (
              <Reveal key={i} delay={(i % 3) * 0.08} fill>
                <div className="lift" style={{ ...card, padding: "22px 22px", height: "100%" }}>
                  <div style={{ fontSize: 26, marginBottom: 12 }}>{p.icon}</div>
                  <h3 style={{ fontFamily: T.sans, fontSize: 16, fontWeight: 700, marginBottom: 7 }}>{p.name}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: T.muted }}>{p.desc}</p>
                </div>
              </Reveal>); })}
          </div>
          <Reveal>
            <h3 style={{ textAlign: "center", fontFamily: T.sans, fontSize: 22, fontWeight: 700, marginBottom: 8, letterSpacing: -0.5 }}>5 architektur — od jednoduché k mocné</h3>
            <p style={{ textAlign: "center", color: T.muted, fontSize: 14, marginBottom: 32, maxWidth: 520, margin: "0 auto 32px" }}>Pravidlo č. 1: zvol nejjednodušší vzor, který úkol zvládne. Složitost přidávej, jen když musíš.</p>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ARCHITEKTURY.map(function (a, i) { return (
              <Reveal key={i} delay={i * 0.07}>
                <div className="lift" style={{ ...card, padding: "22px 26px", display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "start" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 88 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: a.color + "18", border: "1px solid " + a.color + "55", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{a.icon}</div>
                    <span style={{ fontFamily: T.mono, fontSize: 9.5, color: a.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{a.lvl}</span>
                  </div>
                  <div>
                    <h4 style={{ fontFamily: T.sans, fontSize: 17.5, fontWeight: 700, marginBottom: 8, letterSpacing: -0.3 }}>{a.name}</h4>
                    <p style={{ fontSize: 13.5, lineHeight: 1.7, color: T.text, marginBottom: 8 }}>{a.how}</p>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12.5 }}>
                      <span style={{ color: T.muted }}><span style={{ color: a.color, fontWeight: 600 }}>Kdy:</span> {a.when}</span>
                      <span style={{ color: T.muted }}><span style={{ color: a.color, fontWeight: 600 }}>Použití:</span> {a.uses}</span>
                    </div>
                  </div>
                </div>
              </Reveal>); })}
          </div>
        </div>
      </section>

      {/* SMYČKA */}
      <section id="smycka" style={{ padding: "90px 0", background: "linear-gradient(180deg," + T.bg2 + ", #0C0C16)", borderTop: "1px solid " + T.border, borderBottom: "1px solid " + T.border }}>
        <div className="mx">
          <SectionHead color={T.green} eyebrow="Srdce každého agenta" title="Agentní smyčka naživo" sub="Klikni na „Spustit“ a sleduj, jak agent cyklí: pozoruj → mysli → jednej → vyhodnoť → opakuj, dokud nesplní cíl. Klikni na kterýkoli uzel." />
          <Reveal><LoopSimulator /></Reveal>
          <Reveal>
            <h3 style={{ textAlign: "center", fontFamily: T.sans, fontSize: 22, fontWeight: 700, margin: "64px 0 8px", letterSpacing: -0.5 }}>6 principů bezpečné smyčky</h3>
            <p style={{ textAlign: "center", color: T.muted, fontSize: 14, marginBottom: 32 }}>Rozdíl mezi užitečným agentem a tím, který přes noc utratí rozpočet.</p>
          </Reveal>
          <div className="g3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {LOOP_PRINCIPY.map(function (p, i) { return (
              <Reveal key={i} delay={(i % 3) * 0.08} fill>
                <div className="lift" style={{ ...card, padding: "22px 22px", height: "100%" }}>
                  <div style={{ fontSize: 24, marginBottom: 12 }}>{p.icon}</div>
                  <h4 style={{ fontFamily: T.sans, fontSize: 15.5, fontWeight: 700, marginBottom: 7 }}>{p.name}</h4>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: T.muted }}>{p.desc}</p>
                </div>
              </Reveal>); })}
          </div>
        </div>
      </section>

      {/* ŠABLONY */}
      <section id="sablony" style={{ padding: "90px 0" }}>
        <div className="mx">
          <SectionHead color={T.amber} eyebrow="Připravené k použití" title="Kopíruj & uprav šablony" sub="Šest osvědčených koster promptů. Zkopíruj, doplň hranaté závorky, hotovo." />
          <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {SABLONY.map(function (s, i) { return (
              <Reveal key={i} delay={(i % 2) * 0.08} fill>
                <div style={{ ...card, padding: "20px 22px", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <h4 style={{ fontFamily: T.sans, fontSize: 16, fontWeight: 700 }}>{s.name}</h4>
                    <span style={{ fontFamily: T.mono, fontSize: 10, color: T.amber, background: T.amberLo, border: "1px solid rgba(245,158,11,0.3)", borderRadius: 99, padding: "3px 10px", textTransform: "uppercase" }}>{s.tag}</span>
                  </div>
                  <pre style={{ fontFamily: T.mono, fontSize: 12.3, lineHeight: 1.7, color: T.muted, whiteSpace: "pre-wrap", background: "#0B0B12", border: "1px solid " + T.border, borderRadius: 10, padding: "14px 16px", flex: 1, margin: "0 0 12px" }}>{s.text}</pre>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}><CopyBtn text={s.text} /></div>
                </div>
              </Reveal>); })}
          </div>
        </div>
      </section>

      {/* SLOVNÍK */}
      <section id="slovnik" style={{ padding: "90px 0", background: T.bg2, borderTop: "1px solid " + T.border, borderBottom: "1px solid " + T.border }}>
        <div className="mx">
          <SectionHead color={T.cyan} eyebrow="Mluv jejich řečí" title="Slovník AI pojmů" sub="Každý termín, na který narazíš v promptování i u agentů — lidsky vysvětlený." />
          <Glosar />
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "90px 0" }}>
        <div className="mx" style={{ maxWidth: 760 }}>
          <SectionHead eyebrow="FAQ" title="Časté otázky" />
          {FAQ_DATA.map(function (f, i) { return <FaqItem key={i} q={f.q} a={f.a} />; })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 0 90px" }}>
        <div className="mx">
          <div style={{ borderRadius: 28, padding: "clamp(40px,6vw,72px) 32px", textAlign: "center", position: "relative", overflow: "hidden", background: "linear-gradient(135deg,#13102A,#0E1C2E 60%,#0C2420)", border: "1px solid " + T.border }}>
            <div style={{ position: "absolute", top: "-40%", right: "-10%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.22),transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <h2 style={{ fontFamily: T.sans, fontSize: "clamp(26px,4.5vw,42px)", fontWeight: 800, letterSpacing: -1.2, lineHeight: 1.1, marginBottom: 14 }}>Přestaň hádat. Začni <span className="gradtxt">promptovat</span>.</h2>
              <p style={{ color: T.muted, fontSize: 15.5, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 30px" }}>Otevři builder, postav první profesionální prompt a pak se pusť do agentů. Vše na téhle stránce, zdarma a česky.</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Pill primary big onClick={function () { goTo("builder"); }}>Otevřít prompt builder</Pill>
                <Pill big onClick={function () { goTo("techniky"); }}>Projít techniky</Pill>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid " + T.border, background: T.bg2 }}>
        <div className="mx" style={{ padding: "48px 28px 30px" }}>
          <div className="g4" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 28 }}>
            <div>
              <div style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 17, marginBottom: 10, letterSpacing: -0.5 }}>promptuj<span className="gradtxt">.ai</span></div>
              <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.7, maxWidth: 280 }}>Česká interaktivní akademie promptování, agentních systémů a smyček. Učení praxí, ne teorií.</p>
            </div>
            {[["Učení", [["Techniky", "techniky"], ["Prompt builder", "builder"], ["Šablony", "sablony"], ["Slovník", "slovnik"]]], ["Agenti", [["Architektury", "agenti"], ["Simulátor smyčky", "smycka"], ["Principy smyčky", "smycka"]]], ["Cesta", [["Roadmapa", "techniky"], ["FAQ", "techniky"]]]].map(function (col, ci) { return (
              <div key={ci}>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: 2, color: T.faint, textTransform: "uppercase", marginBottom: 14 }}>{col[0]}</div>
                {col[1].map(function (l, j) { return <div key={j} onClick={function () { goTo(l[1]); }} style={{ fontSize: 13, color: T.muted, marginBottom: 9, cursor: "pointer" }}>{l[0]}</div>; })}
              </div>); })}
          </div>
          <div style={{ borderTop: "1px solid " + T.border, marginTop: 36, paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ fontSize: 12, color: T.faint }}>Vzdělávací obsah · principy platí napříč modely (ChatGPT, Claude, Gemini a další).</span>
            <span style={{ fontFamily: T.mono, fontSize: 11, color: T.faint }}>© {new Date().getFullYear()} promptuj.ai</span>
          </div>
        </div>
      </footer>
    </>
  );
}
