import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Spec {
  label: string;
  value: string;
}

const SPECIFICATIONS: Spec[] = [
  { label: 'Brand', value: 'ProMate' },
  { label: 'Battery Capacity', value: '20,000mAh' },
  { label: 'Output', value: '22.5W Fast Charging (USB-A, USB-C)' },
  { label: 'Input', value: 'USB-C, Micro USB' },
  { label: 'Cell Type', value: 'Lithium Polymer' },
  {
    label: 'Box Content',
    value: '1 x Power Bank, 1 x USB-C Cable, 1 x User Manual',
  },
];

const SPEC_SUMMARY = 'Brand, Battery Capacity, etc';

const HIGHLIGHTS = [
  '20,000mAh High Capacity: Charge your smartphone up to 5 times or your tablet twice on a single full charge, perfect for long trips and daily backup power.',
  '22.5W Fast Charging: Supports simultaneous fast charging for multiple devices via USB-A and USB-C ports, cutting charging time significantly.',
  'Smart LED Display: Real-time percentage display lets you monitor remaining battery life at a glance, no more guessing.',
  'Safety Certified: Built-in over-charge, over-discharge, short-circuit and temperature protection keeps your devices safe every time.',
];

const DESCRIPTION_IMAGE_SOURCES = [
  require('../../../assets/products/laptop.jpg'),
  require('../../../assets/products/phone.jpg'),
  require('../../../assets/products/tab.jpg'),
  require('../../../assets/products/watch.jpg'),
  require('../../../assets/products/wallet.png'),
  require('../../../assets/products/WhatsApp Image 2025-08-02 at 13.31.12_cfe1f534.jpg'),
];

// Local assets carry their real pixel dimensions, so each image renders at
// its native aspect ratio instead of being cropped to a fixed box.
const DESCRIPTION_IMAGES = DESCRIPTION_IMAGE_SOURCES.map((source) => {
  const { width, height } = Image.resolveAssetSource(source);
  return { source, aspectRatio: width / height };
});

const COLLAPSED_IMAGE_COUNT = 2;

const ProductDetails = () => {
  const [specsModalVisible, setSpecsModalVisible] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const visibleImages = descriptionExpanded
    ? DESCRIPTION_IMAGES
    : DESCRIPTION_IMAGES.slice(0, COLLAPSED_IMAGE_COUNT);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Product Details</Text>

      <TouchableOpacity
        style={styles.specsRow}
        activeOpacity={0.7}
        onPress={() => setSpecsModalVisible(true)}
      >
        <Text style={styles.specsLabel}>Specifications</Text>
        <View style={styles.specsRight}>
          <Text style={styles.specsSummary} numberOfLines={1}>
            {SPEC_SUMMARY}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </View>
      </TouchableOpacity>

      <View style={styles.divider} />

      <Text style={styles.subTitle}>Highlights</Text>
      {HIGHLIGHTS.map((line, idx) => (
        <Text key={idx} style={styles.highlightText}>
          {line}
        </Text>
      ))}

      <View style={styles.divider} />

      <Text style={styles.subTitle}>Description</Text>
      <View style={styles.descriptionImages}>
        {visibleImages.map((image, idx) => (
          <Image
            key={idx}
            source={image.source}
            style={[styles.descriptionImage, { aspectRatio: image.aspectRatio }]}
            resizeMode="cover"
          />
        ))}
      </View>

      {DESCRIPTION_IMAGES.length > COLLAPSED_IMAGE_COUNT && (
        <TouchableOpacity
          style={styles.seeMoreBtn}
          activeOpacity={0.7}
          onPress={() => setDescriptionExpanded((v) => !v)}
        >
          <Text style={styles.seeMoreText}>{descriptionExpanded ? 'See less' : 'See more'}</Text>
          <Ionicons
            name={descriptionExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#666"
          />
        </TouchableOpacity>
      )}

      <Modal
        visible={specsModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setSpecsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setSpecsModalVisible(false)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Specifications</Text>
              <TouchableOpacity
                onPress={() => setSpecsModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {SPECIFICATIONS.map((spec) => (
                <View key={spec.label} style={styles.specItem}>
                  <Text style={styles.specItemLabel}>{spec.label}</Text>
                  <View style={styles.specItemValueRow}>
                    <Text style={styles.specItemBullet}>▪</Text>
                    <Text style={styles.specItemValue}>{spec.value}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 14,
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  specsLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },
  specsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginLeft: 12,
  },
  specsSummary: {
    fontSize: 13,
    color: '#999',
    marginRight: 4,
    flexShrink: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },
  highlightText: {
    fontSize: 13.5,
    color: '#444',
    lineHeight: 21,
    marginBottom: 12,
  },
  descriptionImages: {
    marginTop: 2,
  },
  descriptionImage: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    marginBottom: 10,
  },
  seeMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  seeMoreText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    marginRight: 4,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 34,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },
  modalCloseBtn: {
    padding: 4,
  },
  specItem: {
    marginBottom: 16,
  },
  specItemLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
  },
  specItemValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  specItemBullet: {
    fontSize: 8,
    color: '#999',
    marginRight: 8,
    marginTop: 5,
  },
  specItemValue: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 19,
  },
});
