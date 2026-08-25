import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import tokens from '../theme/tokens';

const ROOT = path.resolve(__dirname, '..');

const SOURCE_FILES = execSync(
  "git ls-files 'app/*.ts' 'app/*.tsx' 'components/*.ts' 'components/*.tsx'",
  { cwd: ROOT, encoding: 'utf8' },
)
  .split('\n')
  .filter(Boolean);

/** Every size the design system sanctions, e.g. {10, 11, 12, 13, ...}. */
const ALLOWED_SIZES = new Set<number>(
  Object.values(tokens.font.size as Record<string, number>),
);

/**
 * Matches `fontSize: 14`, `fontSize: moderateScale(14)`, `fontSize: s(12)` —
 * i.e. a literal number, optionally wrapped in one scaling helper. Anything
 * that resolves through a token reference or a variable is skipped: those are
 * already on-scale by construction.
 */
const FONT_SIZE = /fontSize:\s*([^,\n}]+)/g;
const LITERAL =
  /^(?:moderateScale|responsiveFontSize|verticalScale|scale|s|vs|ms)\(\s*(\d+(?:\.\d+)?)\s*\)$|^(\d+(?:\.\d+)?)$/;

interface Offender {
  file: string;
  line: number;
  expression: string;
  size: number;
}

const findOffenders = (): Offender[] => {
  const offenders: Offender[] = [];

  for (const file of SOURCE_FILES) {
    const lines = readFileSync(path.join(ROOT, file), 'utf8').split('\n');

    lines.forEach((line, index) => {
      for (const match of line.matchAll(FONT_SIZE)) {
        const expression = match[1].trim();
        const literal = LITERAL.exec(expression);
        if (!literal) continue;

        const size = Number(literal[1] ?? literal[2]);
        if (!ALLOWED_SIZES.has(size)) {
          offenders.push({ file, line: index + 1, expression, size });
        }
      }
    });
  }

  return offenders;
};

describe('typography', () => {
  it('exposes a font scale with no duplicate values', () => {
    const sizes = Object.values(tokens.font.size);
    expect(new Set(sizes).size).toBe(sizes.length);
  });

  it('has a line height for every font size', () => {
    expect(Object.keys(tokens.font.lineHeight).sort()).toEqual(
      Object.keys(tokens.font.size).sort(),
    );
  });

  it('uses only font sizes from the design token scale', () => {
    const offenders = findOffenders();

    const report = offenders
      .map((o) => `  ${o.file}:${o.line}  fontSize: ${o.expression}`)
      .join('\n');

    expect(
      offenders.length === 0
        ? ''
        : `${offenders.length} off-scale font size(s). Allowed: ${[
            ...ALLOWED_SIZES,
          ]
            .sort((a, b) => a - b)
            .join(', ')}\n${report}`,
    ).toBe('');
  });
});
