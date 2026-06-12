import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native"; // <-- Import StyleSheet här
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import SlLogo from "./SlLogo";

interface BlobProps {
  isRecording: boolean;
  onToggle: () => void;
  dbVolume?: number;
}

export default function InteractionOrb({ isRecording, onToggle }: BlobProps) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const skewX = useSharedValue(0);
  const skewY = useSharedValue(0);
  const colorProgress = useSharedValue(0);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.15, { duration: 400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    rotate.value = withRepeat(
      withTiming(3600, { duration: 8000, easing: Easing.linear }),
      -1,
      false,
    );
    skewX.value = withRepeat(
      withTiming(5, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    skewY.value = withRepeat(
      withTiming(-3, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  useEffect(() => {
    colorProgress.value = withTiming(isRecording ? 1 : 0, { duration: 300 });
  }, [isRecording]);

  const animatedFormStyle = useAnimatedStyle(() => {
    return {
      width: 150,
      height: 150,
      borderTopLeftRadius: 55 + skewX.value * 8,
      borderTopRightRadius: 70 - skewY.value * 5,
      borderBottomRightRadius: 60 + skewX.value * 6,
      borderBottomLeftRadius: 65 - skewY.value * 7,
      transform: [
        { scale: scale.value },
        { rotate: `${rotate.value}deg` },
        { skewX: `${skewX.value}deg` },
        { skewY: `${skewY.value}deg` },
      ],
    };
  });

  return (
    <Pressable
      onPress={onToggle}
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <Animated.View style={[animatedFormStyle, { overflow: "hidden" }]}>
        {/* Bas-gradient (Blå) */}
        <LinearGradient
          colors={["#0f6ee4", "#1d4ed8"]}
          style={StyleSheet.absoluteFill}
        />

        {/* Overlay-gradient (Röd) som fadas in */}
        <Animated.View style={[{ flex: 1, opacity: colorProgress }]}>
          {/* eller #e46f0f? */}
          <LinearGradient colors={["#a51e1e", "#dc2626"]} style={{ flex: 1 }} />
        </Animated.View>
      </Animated.View>

      <View style={{ position: "absolute" }} pointerEvents="none">
        <SlLogo width={150} height={150} />
      </View>
    </Pressable>
  );
}
