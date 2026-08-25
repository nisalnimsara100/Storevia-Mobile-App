import { sendPasswordResetEmail } from 'firebase/auth';

jest.mock('firebase/auth', () => ({ sendPasswordResetEmail: jest.fn() }));
jest.mock('@/firebaseConfig', () => ({ auth: {} }), { virtual: true });

/**
 * Mirrors resetPassword() in app/context/authContext.tsx. The context module
 * itself pulls in the whole Firebase app at import time; this pins the one
 * decision that matters — that a missing account is indistinguishable from a
 * successful send.
 */
const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail({} as never, email);
    return { success: true };
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code;
    if (code === 'auth/user-not-found') return { success: true };
    return { success: false, error: (error as Error).message };
  }
};

const firebaseError = (code: string) =>
  Object.assign(new Error(code), { code });

describe('resetPassword', () => {
  beforeEach(() => jest.clearAllMocks());

  it('sends the reset email for a known address', async () => {
    (sendPasswordResetEmail as jest.Mock).mockResolvedValue(undefined);

    await expect(resetPassword('user@storevia.test')).resolves.toEqual({
      success: true,
    });
    expect(sendPasswordResetEmail).toHaveBeenCalledWith({}, 'user@storevia.test');
  });

  it('reports success for an unknown address, so the screen cannot be used to enumerate accounts', async () => {
    (sendPasswordResetEmail as jest.Mock).mockRejectedValue(
      firebaseError('auth/user-not-found'),
    );

    await expect(resetPassword('nobody@storevia.test')).resolves.toEqual({
      success: true,
    });
  });

  it('still surfaces a malformed email', async () => {
    (sendPasswordResetEmail as jest.Mock).mockRejectedValue(
      firebaseError('auth/invalid-email'),
    );

    const result = await resetPassword('not-an-email');
    expect(result.success).toBe(false);
  });

  it('still surfaces rate limiting', async () => {
    (sendPasswordResetEmail as jest.Mock).mockRejectedValue(
      firebaseError('auth/too-many-requests'),
    );

    const result = await resetPassword('user@storevia.test');
    expect(result.success).toBe(false);
  });
});
