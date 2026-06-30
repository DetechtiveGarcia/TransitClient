import { useEffect } from "react";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

export function RadarRing() {
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0);

  useEffect(() => {
    ringScale.value = 1;
    ringOpacity.value = 0.8;

    ringScale.value = withRepeat(
      withTiming(2.0, { duration: 1500, easing: Easing.out(Easing.ease) }),
      -1,
      false,
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 0 }),
        withTiming(0, { duration: 1500, easing: Easing.out(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, []);

  const animatedRingStyle = useAnimatedStyle(() => {
    return {
      width: 150,
      height: 150,
      borderRadius: 75,
      borderWidth: 1,
      borderColor: "#000",
      position: "absolute",
      transform: [{ scale: ringScale.value }],
      opacity: ringOpacity.value,
    };
  });

  return <Animated.View style={animatedRingStyle} />;
}
