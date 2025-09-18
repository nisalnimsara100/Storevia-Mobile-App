import { Stack } from "expo-router";

const stacklayout = ()=>{
  return(
    <Stack>
      <Stack.Screen name="screens" options={{headerShown: false}}/>
    </Stack>
  )
}

export default stacklayout;