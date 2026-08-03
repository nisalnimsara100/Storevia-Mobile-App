import React from 'react';
import {
  Modal as RNModal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { theme } from '@/theme';

export type ModalPresentation = 'center' | 'bottomSheet' | 'fullscreen';

export interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  presentation?: ModalPresentation;
  children: React.ReactNode;
}

export function AppModal({
  visible,
  onClose,
  presentation = 'bottomSheet',
  children,
}: AppModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={[
            styles.overlay,
            {
              justifyContent: presentation === 'center' ? 'center' : 'flex-end',
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View
              style={[
                styles.content,
                presentation === 'bottomSheet' && styles.bottomSheet,
                presentation === 'center' && styles.center,
                presentation === 'fullscreen' && styles.fullscreen,
              ]}
            >
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.color.overlay,
  },
  content: {
    backgroundColor: theme.color.surface.DEFAULT,
  },
  bottomSheet: {
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    paddingTop: theme.space[4],
    paddingHorizontal: theme.space[4],
    paddingBottom: theme.space[8],
    ...theme.shadow.lg,
  },
  center: {
    margin: theme.space[6],
    borderRadius: theme.radius.lg,
    padding: theme.space[4],
    ...theme.shadow.lg,
  },
  fullscreen: {
    flex: 1,
  },
});

export default AppModal;
