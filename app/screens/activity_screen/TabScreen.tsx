import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import All from "./All";
import Gems from "./Gems";
import Live from "./Live";
import Services from "./Services";

const { width: screenWidth } = Dimensions.get("window");

const scale = (size: number): number => (screenWidth / 375) * size;
const responsiveFontSize = (size: number): number => {
  const newSize = size * (screenWidth / 375);
  return Math.max(newSize, size * 0.85);
};

const tabs = ["All", "Gems", "Live", "Services"];

const TabScreen = () => {
  const [activeTab, setActiveTab] = useState("All");

  const renderContent = () => {
    switch (activeTab) {
      case "All":
        return <All />;
      case "Gems":
        return <Gems />;
      case "Live":
        return <Live />;
      case "Services":
        return <Services />;
      default:
        return <All />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
     
      <View style={styles.headerRow}>
        <View style={styles.leftHeader}>
          <Ionicons name="chevron-back" size={scale(22)} color="#000" />
          <Text style={styles.headerTitle}>Activities</Text>
        </View>
        <Ionicons name="settings-outline" size={scale(22)} color="#000" />
      </View>

      
      <View style={styles.tabRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabItem,
                isActive ? styles.activeTabItem : styles.inactiveTabItem,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive ? styles.activeTabText : styles.inactiveTabText,
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>

      
      <View style={styles.contentBox}>{renderContent()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
  },
  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: "700",
    color: "#000",
    marginLeft: scale(20),
    fontFamily: "PoppinsBold",
  },

    
  tabRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: scale(16),
    marginBottom: scale(-18),
  },
  tabItem: {
    paddingVertical: scale(4),
    paddingHorizontal: scale(15),
    borderRadius: scale(8),
    marginRight: scale(6),
    marginBottom: scale(6),
    justifyContent: "center",
    alignItems: "center",
  },
  inactiveTabItem: {
    backgroundColor: "#F1F1F5",
  },
  activeTabItem: {
    borderWidth: scale(1),
    borderColor: "#F99517",
    backgroundColor: "#FFECEE",
  },

  tabText: {
    fontSize: responsiveFontSize(13),
    fontFamily: "PoppinsMedium",
  },
  inactiveTabText: {
    color: "#6E6E73",
  },
  activeTabText: {
    color: "#F99414",
    fontWeight: "600",
  },

  
  contentBox: {
    flex: 1,
    width: "100%",
    marginTop: scale(20),
    paddingHorizontal: scale(16),
  },
});

export default TabScreen;
