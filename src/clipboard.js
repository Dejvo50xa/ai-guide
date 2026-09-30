// Copies text; returns false when the Clipboard API is unavailable or blocked so callers can show a fallback.
export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}
