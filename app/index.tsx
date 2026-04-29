import { View, Text, Pressable, Image, ActivityIndicator } from 'react-native'
import '../global.css'
import { Link, useRouter } from 'expo-router'
import { useEffect } from 'react'
import * as React from 'react';

const Index = () => {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/(tabs)/Home') 
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#f57c00" />
    </View>
  )
}

export default Index