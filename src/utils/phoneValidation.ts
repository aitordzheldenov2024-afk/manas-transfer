import { isValidPhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js';

/**
 * Sanitizes international phone input while typing:
 * - Allows leading '+', digits, spaces, hyphens, and parentheses for readability
 * - Automatically prepends '+' when the user enters digits without it
 * - Caps total digits at 15 (E.164 international maximum)
 */
export function sanitizePhoneInput(raw: string): string {
  const cleaned = raw.replace(/[^\d+\s()-]/g, '');
  if (!cleaned) return '';

  const hasDigits = /\d/.test(cleaned);
  let normalized = cleaned;

  const withoutExtraPlus = normalized.replace(/\+/g, '');
  if (normalized.trimStart().startsWith('+') || hasDigits) {
    normalized = `+${withoutExtraPlus}`;
  } else {
    normalized = withoutExtraPlus;
  }

  let digitCount = 0;
  let result = '';
  for (const ch of normalized) {
    if (/\d/.test(ch)) {
      if (digitCount >= 15) continue;
      digitCount += 1;
    }
    result += ch;
  }

  return result;
}

/**
 * Checks whether a digit string contains an ascending or descending
 * straight sequence of length >= minLength (e.g. 123456, 1234567, 7654321).
 */
function hasSequentialDigits(digits: string, minLength = 6): boolean {
  if (digits.length < minLength) return false;
  let ascRun = 1;
  let descRun = 1;

  for (let i = 1; i < digits.length; i += 1) {
    const prev = digits.charCodeAt(i - 1) - 48;
    const curr = digits.charCodeAt(i) - 48;

    if (curr === prev + 1) {
      ascRun += 1;
      descRun = 1;
    } else if (curr === prev - 1) {
      descRun += 1;
      ascRun = 1;
    } else {
      ascRun = 1;
      descRun = 1;
    }

    if (ascRun >= minLength || descRun >= minLength) {
      return true;
    }
  }

  return false;
}

/**
 * Validates any international phone number worldwide using libphonenumber-js
 * (isValidPhoneNumber), plus additional anti-fake checks:
 * - Must start with '+' (supports +1, +7, +44, +49, +971, +996, etc.)
 * - Must be valid per country-specific length & operator rules in libphonenumber-js
 * - Blocks obvious fake repeated digits (e.g. +996 700 000 000, +1 111 111 1111)
 * - Blocks obvious sequential patterns (e.g. 1234567, 7654321) and repeating pairs
 */
export function validateInternationalPhone(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed.startsWith('+')) return false;

  // Reject any unexpected alphabetic or symbol characters
  if (/[^\d+\s()-]/.test(trimmed)) return false;

  // Real worldwide international validation via libphonenumber-js
  if (!isValidPhoneNumber(trimmed)) return false;

  const parsed = parsePhoneNumberFromString(trimmed);
  if (!parsed || !parsed.isValid()) return false;

  const fullDigits = parsed.number.replace(/\D/g, '');
  const nationalDigits = String(parsed.nationalNumber || '');

  // Block 6+ consecutive identical digits anywhere (e.g. 000000, 111111, 999999)
  if (/(\d)\1{5,}/.test(fullDigits) || /(\d)\1{5,}/.test(nationalDigits)) {
    return false;
  }

  // Block national number composed of only 1 unique digit or operator prefix + all same digit
  if (nationalDigits.length >= 6 && new Set(nationalDigits.split('')).size <= 1) {
    return false;
  }
  const subscriberTail = nationalDigits.slice(3);
  if (subscriberTail.length >= 5 && new Set(subscriberTail.split('')).size <= 1) {
    return false;
  }

  // Block repeating 2-digit (e.g. 12121212) or 3-digit (e.g. 123123123) patterns
  if (/(\d{2})\1{3,}/.test(nationalDigits) || /(\d{3})\1{2,}/.test(nationalDigits)) {
    return false;
  }

  // Block straight ascending/descending sequences of 6+ digits inside national number
  if (hasSequentialDigits(nationalDigits, 6)) {
    return false;
  }

  return true;
}
