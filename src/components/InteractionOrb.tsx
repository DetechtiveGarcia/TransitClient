import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

import { useOrbAnimations } from "../hooks/useOrbAnimations";
import { InteractionState } from "../types";
import MicLogo from "./MicLogo";
import { RadarRing } from "./RadarRing";

interface BlobProps {
  appState: InteractionState;
  onToggle?: () => void; // Gör den valfri eftersom vi kanske använder PTT
  onPressIn?: () => void; // Ny prop för när man trycker ner
  onPressOut?: () => void; // Ny prop för när man släpper
}

export default function InteractionOrb({
  appState,
  onToggle,
  onPressIn,
  onPressOut,
}: BlobProps) {
  const { animatedBlobStyle, blueOpacity, redOpacity, blackOpacity } =
    useOrbAnimations(appState);

  const isProcessing = appState === InteractionState.PROCESSING;

  return (
    <Pressable
      onPress={onToggle}
      onPressIn={onPressIn} // Kopplas till hookens start-funktion
      onPressOut={onPressOut} // Kopplas till hookens stopp-funktion
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      {/* Radarringen (syns endast under PROCESSING) */}
      {isProcessing && <RadarRing />}

      {/* Behåll samma form på huvudbehållaren */}
      <Animated.View style={[animatedBlobStyle, { overflow: "hidden" }]}>
        {/* Lager 1: Blå Gradient */}
        <Animated.View style={[StyleSheet.absoluteFill, blueOpacity]}>
          <LinearGradient
            colors={["#00132D", "#134386"]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Lager 2: Röd Gradient */}
        <Animated.View style={[StyleSheet.absoluteFill, redOpacity]}>
          <LinearGradient
            colors={["#a51e1e", "#dc2626"]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Lager 3: Svart */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            blackOpacity,
            { backgroundColor: "#000000" },
          ]}
        />
      </Animated.View>

      <View style={{ position: "absolute" }} pointerEvents="none">
        <MicLogo width={150} height={150} />
      </View>
    </Pressable>
  );
}
