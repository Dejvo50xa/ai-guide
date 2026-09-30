// Keyword hints for the prompt practice exercise. Runs locally; it only detects typical words for
// each prompt part and never judges quality.
import { normalize } from './text.mjs';

const patterns = {
  cs: {
    role: /\b(jsi|jste|budes|v roli|role|chovej(te)? se jako|predstav(te)? si)\b|(^|[.!?]\s+)jako [a-z]+/,
    context: /\b(mam|mame|jsem|jsme|vedu|vedeme|pracuj\w*|potrebuj\w*|chci|chceme|nas|nase|nasi|muj|moje|moji|protoze|publikum|zakaznic\w*|cilim\w*|situace|firma|klient\w*)\b/,
    task: /\b(napis|shrn|navrhn|vytvor|porovne?j|vysvetl|analyzuj|prepis|najd|oprav|zkontroluj|priprav|sestav|vypis|doporuc|zhodnot|preloz|udelej|spocitej|seskup|extrahuj|vygeneruj|pomoz)(te|i|ete)?\b/,
    format: /\b(odrazk\w*|tabulk\w*|json|seznam\w*|bod\w*|slov|vet|odstav\w*|format\w*|osnov\w*|slajd\w*|kapitol\w*|diff|sloupc\w*|nadpis\w*)\b|\d+\s*(slov|vet|bod|odrazek|slajd|znak|radk)/,
    limits: /\b(nepouzivej(te)?|nevymyslej(te)?|nedomyslej(te)?|nemen(te)?|nepis(te)?|neuvadej(te)?|bez|jen|pouze|nesmi|vynech\w*|nic ne\w+|zadn[aeyouy]\w*)\b|(pokud|kdyz|kde) (nevis|nevite|chybi|je nejasn\w*)/,
  },
  en: {
    role: /\b(you are|you're|act as|role|pretend you're|imagine you're)\b|(^|[.!?]\s+)as an? [a-z]+/,
    context: /\b(i am|i'm|i run|i have|i work|i need|i want|we are|we're|we have|we run|we sell|i sell|because|audience|customers?|clients?|goal|my (team|company|business|shop|store|boss|manager|audience|function|project|app|site|website))\b/,
    task: /\b(write|summari[sz]e|draft|create|compare|explain|analy[sz]e|rewrite|find|fix|review|check|propose|suggest|list|outline|plan|translate|recommend|prepare|build|design|group|extract|calculate|generate|give|make|turn|help)\b/,
    format: /\b(bullets?|bullet points?|table|json|list|words|sentences|paragraphs?|format|outline|slides?|chapters?|diff|headline|columns?)\b|\d+\s*(words|sentences|bullets|slides|characters|points)/,
    limits: /\b(don't|do not|never|without|avoid|only|must not|leave out)\b|\bno (more than|longer than|jargon|hashtags?|emojis?|intro|fluff|filler|invented|made-up)\b|\bif (you're |you are )?(unsure|not sure)\b|\bif (you )?(don't|do not) know\b|\b(where|if) (the )?data is missing\b/,
  },
};

export const partIds = ['role', 'context', 'task', 'format', 'limits'];
export const MIN_LENGTH = 40;

export function checkPrompt(text, lang = 'cs') {
  const value = normalize(text).trim();
  const set = patterns[lang] || patterns.cs;
  return partIds.map(id => ({ id, found: set[id].test(value) }));
}
