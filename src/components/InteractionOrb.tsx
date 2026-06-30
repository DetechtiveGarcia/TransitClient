import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

import { useOrbAnimations } from "../hooks/useOrbAnimations";
import { InteractionState } from "../types";
import { RadarRing } from "./RadarRing";
import SlLogo from "./SlLogo";

interface BlobProps {
  appState: InteractionState;
  onToggle: () => void;
}

export default function InteractionOrb({ appState, onToggle }: BlobProps) {
  const { animatedBlobStyle, blueOpacity, redOpacity, blackOpacity } =
    useOrbAnimations(appState);

  const isProcessing = appState === InteractionState.PROCESSING;

  return (
    <Pressable
      onPress={onToggle}
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      {/* Radarringen (syns endast under PROCESSING) */}
      {isProcessing && <RadarRing />}

      {/* Behåll samma form på huvudbehållaren */}
      <Animated.View style={[animatedBlobStyle, { overflow: "hidden" }]}>
        {/* Lager 1: Blå Gradient (syns i IDLE / när appen pratar) */}
        <Animated.View style={[StyleSheet.absoluteFill, blueOpacity]}>
          <LinearGradient
            colors={["#0f6ee4", "#1d4ed8"]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Lager 2: Röd Gradient (syns under RECORDING) */}
        <Animated.View style={[StyleSheet.absoluteFill, redOpacity]}>
          <LinearGradient
            colors={["#a51e1e", "#dc2626"]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Lager 3: Svart (massiv färg eller gradient, syns under PROCESSING) */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            blackOpacity,
            { backgroundColor: "#000000" },
          ]}
        />
      </Animated.View>

      <View style={{ position: "absolute" }} pointerEvents="none">
        <SlLogo width={150} height={150} />
      </View>
    </Pressable>
  );
}
