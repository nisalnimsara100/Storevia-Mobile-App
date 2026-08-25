import { Dimensions } from 'react-native';

/**
 * Shared responsive scaling. These were previously copy-pasted, byte for byte,
 * into six screens; keeping one copy means a change to the scaling curve can't
 * apply to some screens and not others.
 *
 * Note there are two different curves on purpose:
 *  - `scale` is linear, for spacing and icon dimensions.
 *  - `responsiveFontSize` clamps, because linear scaling makes text unreadably
 *    small on narrow devices.
 */
const BASE_WIDTH = 375; // iPhone 11 Pro / X logical width, the design baseline.

const { width: screenWidth } = Dimensions.get('window');

export const scale = (size: number): number => (screenWidth / BASE_WIDTH) * size;

export const responsiveFontSize = (size: number): number => {
  const scaled = size * (screenWidth / BASE_WIDTH);
  return Math.max(scaled, size * 0.85);
};
