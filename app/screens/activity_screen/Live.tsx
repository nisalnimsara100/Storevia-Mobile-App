"use client"

import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as React from "react"
import { useState, useRef, useEffect } from "react"

const Live = () => {
  const [liveSessions] = useState([
    {
      id: 1,
      title: "Mega Sale Live",
      host: "FashionApple",
      viewers: "12.3k",
      image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&h=300&fit=crop",
      products: [
        {
          id: 101,
          name: "Trendy Summer Dress",
          price: 1499,
          discount: "-25%",
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop",
          dealEndsAt: Date.now() + 1000 * 60 * 5,
        },
        {
          id: 102,
          name: "Wireless Earbuds Pro",
          price: 2999,
          discount: "-40%",
          image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200&h=200&fit=crop",
          dealEndsAt: Date.now() + 1000 * 60 * 3,
        },
      ],
    },

    
  ])

  const [reactions, setReactions] = useState<{ id: number; x: Animated.Value; y: Animated.Value }[]>([])
  const reactionCount = useRef(0)
  const pulse = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.5, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start()
  }, [])

  const addReaction = () => {
    const id = reactionCount.current + 1
    reactionCount.current = id
    const x = new Animated.Value(0)
    const y = new Animated.Value(0)
    setReactions((r) => [...r, { id, x, y }])
    Animated.parallel([
      Animated.timing(y, { toValue: -150, duration: 2000, useNativeDriver: true }),
      Animated.timing(x, { toValue: Math.random() * 100 - 50, duration: 2000, useNativeDriver: true }),
    ]).start(() => {
      setReactions((r) => r.filter((item) => item.id !== id))
    })
  }

  const renderCountdown = (endsAt: number) => {
    const [remaining, setRemaining] = useState<number>(Math.max(0, endsAt - Date.now()))
    useEffect(() => {
      const interval = setInterval(() => {
        setRemaining(Math.max(0, endsAt - Date.now()))
      }, 1000)
      return () => clearInterval(interval)
    }, [])
    const minutes = Math.floor(remaining / 1000 / 60)
    const seconds = Math.floor((remaining / 1000) % 60)
    return <Text style={styles.countdownText}>{`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`}</Text>
  }

  return (
    <View style={styles.container}>
      
      <ScrollView style={styles.content}>
        {liveSessions.length > 0 ? (
          liveSessions.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <Image source={{ uri: session.image }} style={styles.sessionImage} />
              <View style={styles.sessionOverlay}>
                <Text style={styles.sessionHost}>{session.host}</Text>
                <Text style={styles.sessionViewers}>{session.viewers} watching</Text>
              </View>

              <View style={styles.sessionInfo}>
                <Text style={styles.sessionTitle}>{session.title}</Text>

                <View style={styles.productRow}>
                  {session.products.map((product) => (
                    <View key={product.id} style={styles.productCard}>
                      <Image source={{ uri: product.image }} style={styles.productImage} />
                      <Text style={styles.productName} numberOfLines={1}>
                        {product.name}
                      </Text>
                      <Text style={styles.productPrice}>Rs.{product.price}</Text>
                      <Text style={styles.productDiscount}>{product.discount}</Text>
                      <View style={styles.countdownWrapper}>{renderCountdown(product.dealEndsAt)}</View>
                      <TouchableOpacity style={styles.addToCartButton}>
                        <Ionicons name="cart" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>

                <TouchableOpacity style={styles.joinButton}>
                  <Text style={styles.joinText}>Join Live</Text>
                </TouchableOpacity>

                

                
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No live broadcasts right now</Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

export default Live

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 12,
  },
  sessionCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    overflow: "hidden",
    fontFamily: "PoppinsBold",
  },
  sessionImage: {
    width: "100%",
    height: 180,
  },
  sessionOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sessionHost: {
    color: "#fff",
    fontWeight: "700",
    fontFamily: "PoppinsBold",
  },
  sessionViewers: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "PoppinsMedium",
  },
  sessionInfo: {
    padding: 12,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    fontFamily: "PoppinsBold",
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  productCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: 80,
    borderRadius: 6,
    marginBottom: 6,
  },
  productName: {
    fontSize: 12,
    color: "#333",
    marginBottom: 2,
    fontFamily: "PoppinsMedium",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f57c00",
    fontFamily: "PoppinsMedium",
  },
  productDiscount: {
    fontSize: 11,
    color: "#4caf50",
    fontFamily: "PoppinsMedium",
  },
  countdownWrapper: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  countdownText: {
    color: "#fff",
    fontSize: 12,
  },
  addToCartButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#f57c00",
    borderRadius: 16,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  joinButton: {
    backgroundColor: "#f57c00",
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 8,
  },
  joinText: {
    color: "#fff",
    
    fontFamily: "PoppinsBold",
  },
  reactButton: {
    position: "absolute",
    bottom: 12,
    left: 12,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 6,
    fontFamily: "PoppinsMedium",
  },
})
