import { useRouter } from 'expo-router';
import  React, { useEffect } from 'react';
import { View } from 'react-native';

export default function AuthIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('./LoginSignup');
  }, [router]);

  return <View />;
}
