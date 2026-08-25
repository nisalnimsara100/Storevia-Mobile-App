import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');

const files = (globs: string) =>
  execSync(`git ls-files ${globs}`, { cwd: ROOT, encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);

const SCREENS = files("'app/*.tsx'").filter((f) => !f.includes('components/ui'));

const read = (file: string) => readFileSync(path.join(ROOT, file), 'utf8');

describe('design system consistency', () => {
  it('defines the responsive scaling helpers in exactly one place', () => {
    // These were copy-pasted byte-for-byte into six screens; a change to the
    // curve then applied to some screens and not others.
    const definitions = [...SCREENS, ...files("'components/*.tsx'")].filter(
      (file) => /const\s+(scale|responsiveFontSize)\s*=\s*\(size/.test(read(file)),
    );

    expect(definitions).toEqual([]);
  });

  it('routes every raw TextInput through the shared Input component', () => {
    // A screen rendering its own TextInput re-invents label spacing, the
    // placeholder font and the password toggle — which is how the auth form
    // drifted from the rest of the app.
    const offenders = SCREENS.filter((file) => /<TextInput\b/.test(read(file)));

    expect(offenders.sort()).toEqual(KNOWN_RAW_TEXTINPUT_SCREENS.sort());
  });
});

/**
 * Screens still rendering a bare TextInput. This list may only ever shrink —
 * adding to it means a new screen skipped the design system.
 */
const KNOWN_RAW_TEXTINPUT_SCREENS = [
  'app/(tabs)/Cart.tsx',
  'app/screens/chat_screen/[chatId].tsx',
  'app/screens/checkout_screen/index.tsx',
  'app/screens/my_orders_screen/index.tsx',
  'app/screens/my_reviews_screen/WriteReview.tsx',
  'app/screens/search_screen/index.tsx',
  'app/screens/settings_screen/AccountInformaton.tsx',
  'app/screens/settings_screen/AddressBook.tsx',
  'app/search/index.tsx',
];
