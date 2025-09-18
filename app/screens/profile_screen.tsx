import { Button } from '@react-navigation/elements'
import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const index = () => {
  return (
    <View>
      <Text className='text-4xl mt-20 text-center font-poppinsBold color-yellow-400'>Profile1</Text>
      <Button onPress={() => alert('Button Clicked!')}>Click Me</Button>

      <Link href="/screens/home_screen" asChild>
        <Text className='text-blue-500 underline mt-5'>Go to Home</Text>
      </Link>
    </View>
  )
}

export default index
