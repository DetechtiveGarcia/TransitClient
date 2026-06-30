import { useEffect } from "react";
import {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { InteractionState } from "../types";

export function useOrbAnimations(appState: InteractionState) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const skewX = useSharedValue(0);
  const skewY = useSharedValue(0);

  // Färgfas: 0 = Blå, 1 = Röd, 2 = Svart
  const colorPhase = useSharedValue(0);

  // Standard-animationer för formen
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

  // Växla fas beroende på appState
  useEffect(() => {
    if (appState === InteractionState.RECORDING) {
      colorPhase.value = withTiming(1, { duration: 600 }); // Tonar till Röd
    } else if (appState === InteractionState.PROCESSING) {
      colorPhase.value = withTiming(2, { duration: 600 }); // Tonar till Svart
    } else if (
      appState === InteractionState.SPEAKING ||
      appState === InteractionState.IDLE
    ) {
      colorPhase.value = withTiming(0, { duration: 600 }); // Tonar tillbaka till Blå
    }
  }, [appState]);

  // Gemensam form och storlek för alla lager
  const animatedBlobStyle = useAnimatedStyle(() => {
    if (appState === InteractionState.PROCESSING) {
      return {
        width: 150,
        height: 150,
        borderRadius: 75,
        transform: [{ scale: 1 }],
      };
    }

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

  // Skapa opacitets-värden via interpolation för de tre färgerna
  const blueOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(colorPhase.value, [0, 1, 2], [1, 0, 0]),
  }));

  const redOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(colorPhase.value, [0, 1, 2], [0, 1, 0]),
  }));

  const blackOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(colorPhase.value, [0, 1, 2], [0, 0, 1]),
  }));

  return { animatedBlobStyle, blueOpacity, redOpacity, blackOpacity };
}
