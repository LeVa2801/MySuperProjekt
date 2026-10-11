import { useState } from "react";

/**
 * Custom hook to copy text to the clipboard.
 * @param resetAfterMs - Time in milliseconds after which the copied state resets (default: 1800ms).
 * @returns An object containing the copied state, error message, and copy function.
 */
export function useCopyToClipboard(resetAfterMs = 1800) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError("");
      window.setTimeout(() => setCopied(false), resetAfterMs);
    } catch (copyError) {
      console.error("Der Text konnte nicht in die Zwischenablage kopiert werden.", copyError);
      setCopied(false);
      setError("Kopieren ist nicht verfügbar. Markiere den Text und kopiere ihn manuell.");
    }
  }

  return { copied, error, copy };
}
