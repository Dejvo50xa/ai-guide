// Lowercases and strips accents and curly apostrophes, so searches and checks match "obrazky" to "obrázky".
export const normalize = value => String(value).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’‘]/g, "'").toLowerCase();
