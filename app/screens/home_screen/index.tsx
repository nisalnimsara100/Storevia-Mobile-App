import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Button } from '@react-navigation/elements'

const index = () => {
  return (
    <View>
      <Text className='text-4xl mt-20 text-center font-poppinsBold color-yellow-400'>index</Text>
      <Button onPress={() => alert('Button Clicked!')}>Click Me</Button>
    </View>
  )
}

export default index
