import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

export default function CustomSplashScreen() {
  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync();
      // Simulamos una espera de 3 segundos
      await new Promise(resolve => setTimeout(resolve, 3000));
      await SplashScreen.hideAsync();
    };

    prepare();
  });

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/cne.png')} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  logo: {
    flex: 1,
    width: 100,  // Ajusta el tamaño del logo aquí
    height: 100, // Ajusta el tamaño del logo aquí
  },
});
  