/**
 * Code 39 barcode encoder (no external dependency).
 * Returns bar segments (width + dark/light) for an SVG renderer.
 * Supported charset: 0-9 A-Z space - . $ / + % and the * delimiter.
 */
const CODE39: Record<string, string> = {
  '0': 'nnnwwnwnn', '1': 'wnnwnnnnw', '2': 'nnwwnnnnw', '3': 'wnwwnnnnn',
  '4': 'nnnwwnnnw', '5': 'wnnwwnnnn', '6': 'nnwwwnnnn', '7': 'nnnwnnwnw',
  '8': 'wnnwnnwnn', '9': 'nnwwnnwnn', 'A': 'wnnnnwnnw', 'B': 'nnwnnwnnw',
  'C': 'wnwnnwnnn', 'D': 'nnnnwwnnw', 'E': 'wnnnwwnnn', 'F': 'nnwnwwnnn',
  'G': 'nnnnnwwnw', 'H': 'wnnnnwwnn', 'I': 'nnwnnwwnn', 'J': 'nnnnwwwnn',
  'K': 'wnnnnnnww', 'L': 'nnwnnnnww', 'M': 'wnwnnnnwn', 'N': 'nnnnwnnww',
  'O': 'wnnnwnnwn', 'P': 'nnwnwnnwn', 'Q': 'nnnnnnwww', 'R': 'wnnnnnwwn',
  'S': 'nnwnnnwwn', 'T': 'nnnnwnwwn', 'U': 'wwnnnnnnw', 'V': 'nwwnnnnnw',
  'W': 'wwwnnnnnn', 'X': 'nwnnwnnnw', 'Y': 'wwnnwnnnn', 'Z': 'nwwnwnnnn',
  '-': 'nwnnnnwnw', '.': 'wwnnnnwnn', ' ': 'nwwnnnwnn', '$': 'nwnwnwnnn',
  '/': 'nwnwnnnwn', '+': 'nwnnnwnwn', '%': 'nnnwnwnwn', '*': 'nwnnwnwnn',
};

export interface BarSegment {
  x: number;
  width: number;
  dark: boolean;
}

const NARROW = 1;
const WIDE = 2.6;

/** Encode text into positioned bar segments; returns null width on bad input. */
export function encodeCode39(raw: string): { segments: BarSegment[]; totalWidth: number } {
  const text = `*${raw.toUpperCase().replace(/[^0-9A-Z\-. $/+%]/g, '-')}*`;
  const segments: BarSegment[] = [];
  let x = 0;
  for (const char of text) {
    const pattern = CODE39[char] ?? CODE39['-'];
    for (let i = 0; i < pattern.length; i++) {
      const width = pattern[i] === 'w' ? WIDE : NARROW;
      segments.push({ x, width, dark: i % 2 === 0 });
      x += width;
    }
    segments.push({ x, width: NARROW, dark: false });
    x += NARROW;
  }
  return { segments, totalWidth: x };
}
