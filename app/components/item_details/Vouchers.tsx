import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

interface Voucher {
  id: number;
  amount: string;
  condition: string;
  dateRange: string;
  bgColor: string;
  accentColor: string;
  label?: string;
}

const VoucherCarousel = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  useEffect(() => {
    const fetchVouchers = async () => {
      const jsonResponse: Voucher[] = [
        {
          id: 1,
          amount: "Rs.300",
          condition: "Min.Spend Rs. 599",
          dateRange: "01/11/2025 - 30/11/2025",
          bgColor: "#E8F9F8",
          accentColor: "#00B8A9",
        },
        {
          id: 2,
          amount: "Rs.500",
          condition: "Min.Spend Rs. 999",
          dateRange: "01/12/2025 - 31/12/2025",
          bgColor: "#FFF8EC",
          accentColor: "#FF9800",
        },
        {
          id: 3,
          amount: "Rs.750",
          condition: "Min.Spend Rs. 1499",
          dateRange: "15/11/2025 - 15/12/2025",
          bgColor: "#FFF0F0",
          accentColor: "#F44336",
          label: "Special Offer",
        },
      ];
      setVouchers(jsonResponse);
    };
    fetchVouchers();
  }, []);

  const renderTicketNotch = (
    position: "top" | "bottom",
    bgColor: string,
    borderColor: string
  ) => {
    return (
      <View
        style={[
          styles.notch,
          position === "top" ? styles.notchTop : styles.notchBottom,
        ]}
      >
        <Svg height="12" width="12">
          <Circle
            cx="6"
            cy={position === "top" ? "0" : "12"}
            r="6"
            fill={bgColor} 
          />
          <Circle
            cx="6"
            cy={position === "top" ? "0" : "12"}
            r="6"
            fill="none"
            stroke={borderColor}
            strokeWidth="1.5"
          />
        </Svg>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Vouchers</Text>
        <TouchableOpacity
          style={styles.arrowContainer}
          onPress={() => Alert.alert("All vouchers")}
        >
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Section */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {vouchers.map((item) => (
          <View key={item.id} style={styles.ticketWrapper}>
            <View
              style={[
                styles.ticketCard,
                {
                  backgroundColor: item.bgColor,
                  borderColor: item.accentColor,
                },
              ]}
            >
              {/* Left Section */}
              <View style={styles.leftSection}>
                {item.label && (
                  <View
                    style={[
                      styles.labelBadge,
                      { backgroundColor: item.accentColor },
                    ]}
                  >
                    <Text style={styles.labelText}>{item.label}</Text>
                  </View>
                )}
                <Text style={[styles.amount, { color: item.accentColor }]}>
                  {item.amount}
                </Text>
                <Text style={styles.condition}>{item.condition}</Text>
                <Text style={styles.dateRange}>{item.dateRange}</Text>
              </View>

              {/* Middle Section (Divider + Notches) */}
              <View style={styles.dividerContainer}>
                
                {renderTicketNotch("top", "#F5F5F5", item.accentColor)}

                {[...Array(12)].map((_, i) => (
                  <View key={i} style={styles.dashSegment} />
                ))}

                {renderTicketNotch("bottom", "#F5F5F5", item.accentColor)}
                
              </View>

              {/* Right Section */}
              <View style={styles.rightSection}>
                <TouchableOpacity
                  style={[
                    styles.collectBtn,
                    { backgroundColor: item.accentColor },
                  ]}
                  onPress={() => Alert.alert("Voucher collected!")}
                >
                  <Text style={styles.collectText}>Collect</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default VoucherCarousel;


const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingLeft: 16,
    backgroundColor: "#F5F5F5",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingRight: 16,
    paddingLeft: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    paddingLeft: 14,
  },
  arrowContainer: {
    padding: 5,
    paddingRight: 20,
  },
  arrow: {
    fontSize: 28,
    fontWeight: "500",
    marginTop: -6,
    color: "#666",
  },
  ticketWrapper: {
    marginRight: 12,
    paddingLeft: 20,
  },
  ticketCard: {
    width: 280,
    height: 110,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: "row",
    overflow: "visible",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  leftSection: {
    flex: 2,
    justifyContent: "center",
    paddingLeft: 16,
    paddingVertical: 12,
  },
  labelBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  labelText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  amount: {
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 2,
  },
  condition: {
    fontSize: 11,
    color: "#555",
    fontWeight: "500",
    marginBottom: 4,
  },
  dateRange: {
    fontSize: 9,
    color: "#888",
    fontWeight: "400",
  },

  /* --- DIVIDER & NOTCH LOGIC --- */
  
  dividerContainer: {
    width: 2,
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 10,
    position: "relative",
    zIndex: 10, 
  },
  
  dashSegment: {
    width: 2,
    height: 3,
    backgroundColor: "#AAA",
    marginVertical: 1.5,
  },

  notch: {
    position: "absolute",
    width: 12,
    height: 12,
    zIndex: 99,
    left: -5,
  },

  notchTop: {
    top: -3,
  },

  notchBottom: {
    bottom: -3,
  },

  rightSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  collectBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 70,
    alignItems: "center",
  },
  collectText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 13,
  },
});