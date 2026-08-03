import RNToast from 'react-native-toast-message';

/**
 * Fire-and-forget, non-blocking notices (see /docs/design.md "Toast vs. Alert").
 * The <Toast /> root is already mounted once in app/context/cartProviderWrapper.tsx.
 * Reserve Alert.alert for blocking decisions the user must confirm.
 */
export const toast = {
  success: (message: string) =>
    RNToast.show({ type: 'success', text1: message }),
  error: (message: string) => RNToast.show({ type: 'error', text1: message }),
  info: (message: string) => RNToast.show({ type: 'info', text1: message }),
};

export default toast;
