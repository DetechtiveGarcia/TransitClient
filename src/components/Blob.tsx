import { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
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

export default function Blob({
  isRecording,
  onToggle,
  dbVolume = 0,
}: BlobProps) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const skewX = useSharedValue(0);
  const skewY = useSharedValue(0);
  const colorProgress = useSharedValue(0);

  // 1. Återställer dina organiska grundanimationer
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

  // 2. Animerar färgen när isRecording ändras
  useEffect(() => {
    colorProgress.value = withTiming(isRecording ? 1 : 0, { duration: 300 });
  }, [isRecording]);

  const animatedStyle = useAnimatedStyle(() => {
    // Använder interpolateColor för en silkeslen färgövergång
    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 1],
      ["rgb(40, 112, 240)", "rgb(239, 68, 68)"],
    );

    return {
      width: 150,
      height: 150,
      borderTopLeftRadius: 55 + skewX.value * 8,
      borderTopRightRadius: 70 - skewY.value * 5,
      borderBottomRightRadius: 60 + skewX.value * 6,
      borderBottomLeftRadius: 65 - skewY.value * 7,
      backgroundColor: backgroundColor,
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
      <Animated.View style={animatedStyle} />
      <View style={{ position: "absolute" }} pointerEvents="none">
        <SlLogo width={110} height={110} />
      </View>
    </Pressable>
  );
}
