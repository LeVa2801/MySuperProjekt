export const starterColors = ["#38BDF8", "#A78BFA", "#FB7185", "#FBBF24", "#34D399", "#F8FAFC", "#0F172A", "#F97316"];
export const DEFAULT_ACCENT = "#38BDF8";

// Utility function to check if a string is a valid hex color code
// @param value - The string to check
// @returns True if the string is a valid hex color code, false otherwise
// @example
// isHexColor("#38BDF8"); // true
// isHexColor("38BDF8");  // false

export function isHexColor(value: string) {
  return /^#[\da-f]{6}$/i.test(value); 
}
