// Mirrors EMAIL_PATTERN in app/(auth)/LoginSignup.tsx, which gates the reset
// request so an obvious typo is caught before it reaches Firebase.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

describe('email validation', () => {
  it.each([
    'user@storevia.test',
    'first.last@sub.domain.lk',
    'nisal+tag@gmail.com',
  ])('accepts %s', (email) => {
    expect(EMAIL_PATTERN.test(email)).toBe(true);
  });

  it.each([
    ['', 'empty'],
    ['user', 'no domain'],
    ['user@', 'no host'],
    ['user@host', 'no TLD'],
    ['user @host.com', 'contains a space'],
    ['@host.com', 'no local part'],
  ])('rejects %p (%s)', (email) => {
    expect(EMAIL_PATTERN.test(email)).toBe(false);
  });
});
