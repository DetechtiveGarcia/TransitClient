import { DMSans_400Regular, DMSans_700Bold } from "@expo-google-fonts/dm-sans";
import { Poppins_400Regular } from "@expo-google-fonts/poppins";
import {
  SpecialGothic_400Regular,
  useFonts,
} from "@expo-google-fonts/special-gothic";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// Håller splash-screenen synlig tills typsnitten är klara
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  let [fontsLoaded] = useFonts({
    SpecialGothic_400Regular,
    DMSans_400Regular,
    DMSans_700Bold,
    Poppins_400Regular,
  });

  useEffect(() => {
    console.log("Fonts loaded status:", fontsLoaded); // KOLLA DIN TERMINAL
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#00132D" }}>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
