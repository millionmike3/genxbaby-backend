const ones = [
  "", "one", "two", "three", "four", "five",
  "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen",
  "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"
];

const tens = [
  "", "", "twenty", "thirty", "forty", "fifty",
  "sixty", "seventy", "eighty", "ninety"
];

function toWords(num: number): string {
  if (num === 0) return "zero";

  if (num < 20) return ones[num];

  if (num < 100) {
    return `${tens[Math.floor(num / 10)]} ${ones[num % 10]}`.trim();
  }

  if (num < 1000) {
    return `${ones[Math.floor(num / 100)]} hundred ${toWords(num % 100)}`.trim();
  }

  if (num < 1_000_000) {
    return `${toWords(Math.floor(num / 1000))} thousand ${toWords(num % 1000)}`.trim();
  }

  return String(num); // simple fallback
}

export function amountToWords(amount: number): string {
  const dollars = Math.floor(amount);
  const cents = Math.round((amount - dollars) * 100);

  const dollarWords = toWords(dollars);
  const centWords = cents > 0 ? `${cents.toString().padStart(2, "0")}/100` : "00/100";

  return `${dollarWords} dollars and ${centWords}`;
}
