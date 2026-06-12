// DecibelMeter.tsx
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface DecibelBarProps {
  level: SharedValue<number>; // Här säger vi exakt vad det är
  multiplier: number;
}

function DecibelBar({ level, multiplier }: DecibelBarProps) {
  const barStyle = useAnimatedStyle(() => {
    // Nu vet TS att level.value är ett nummer
    const calculatedHeight = 8 + (level.value || 0) * multiplier * 2.5;
    return {
      height: withTiming(Math.max(8, calculatedHeight), {
        duration: 60,
        easing: Easing.linear,
      }),
    };
  });
  return <Animated.View style={[styles.bar, barStyle]} />;
}

interface DecibelMeterProps {
  audioLevel: SharedValue<number>; // Även här
}

export default function DecibelMeter({ audioLevel }: DecibelMeterProps) {
  return (
    <View style={styles.spectrumContainer}>
      <DecibelBar level={audioLevel} multiplier={0.5} />
      <DecibelBar level={audioLevel} multiplier={1.2} />
      <DecibelBar level={audioLevel} multiplier={2.0} />
      <DecibelBar level={audioLevel} multiplier={2.0} />
      <DecibelBar level={audioLevel} multiplier={1.2} />
      <DecibelBar level={audioLevel} multiplier={0.5} />
    </View>
  );
}

const styles = StyleSheet.create({
  spectrumContainer: {
    flexDirection: "row",
    gap: 8,
    height: 120,
    alignItems: "center",
  },
  bar: { width: 8, borderRadius: 4, backgroundColor: "#2870f0" },
});
