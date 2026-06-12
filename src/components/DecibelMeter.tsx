import {
    RecordingPresets,
    requestRecordingPermissionsAsync,
    useAudioRecorder,
    useAudioRecorderState, // Vi använder den här för att läsa mätvärden
} from "expo-audio";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

function DecibelBar({
  volume,
  multiplier,
}: {
  volume: any;
  multiplier: number;
}) {
  const barStyle = useAnimatedStyle(() => {
    // Om volume är undefined, sätt till 0
    const val = volume.value || 0;
    const calculatedHeight = 8 + val * multiplier * 2.5;

    return {
      height: withTiming(Math.max(8, calculatedHeight), {
        duration: 60,
        easing: Easing.linear,
      }),
    };
  });

  return <Animated.View style={[styles.bar, barStyle]} />;
}

export default function DecibelMeter() {
  const liveVolume = useSharedValue(0);

  // Vi skapar recordern med preset direkt
  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });
  const state = useAudioRecorderState(recorder, 100);

  useEffect(() => {
    if (state?.metering !== undefined) {
      // 1. dB ligger ofta mellan -160 (tyst) och 0 (max).
      // Låt oss säga att allt under -60 dB är "tyst".
      const db = Math.max(-60, Math.min(0, state.metering));

      // 2. Mappa om från intervallet -60 till 0 till 0 till 30
      const normalized = (db + 60) * 0.2;

      liveVolume.value = normalized;
    }
  }, [state]);

  useEffect(() => {
    async function start() {
      const { status } = await requestRecordingPermissionsAsync();
      if (status !== "granted") return;

      // ISTÄLLET FÖR ATT SKICKA KONFIGURATION HÄR:
      // Använd recorder-objektets inbyggda egenskaper om möjligt,
      // eller bara kör prepare utan argument om preset redan är satt vid skapandet.
      try {
        await recorder.prepareToRecordAsync();
        await recorder.record();
      } catch (e) {
        console.log("Fel vid start:", e);
      }
    }

    start();

    return () => {
      recorder.stop().catch(() => {});
    };
  }, []); // Körs en gång

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rösttest</Text>
      <View style={styles.spectrumContainer}>
        <DecibelBar volume={liveVolume} multiplier={0.5} />
        <DecibelBar volume={liveVolume} multiplier={1.2} />
        <DecibelBar volume={liveVolume} multiplier={2.0} />
        <DecibelBar volume={liveVolume} multiplier={2.0} />
        <DecibelBar volume={liveVolume} multiplier={1.2} />
        <DecibelBar volume={liveVolume} multiplier={0.5} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  title: { fontSize: 20, marginBottom: 20 },
  spectrumContainer: {
    flexDirection: "row",
    gap: 8,
    height: 120,
    alignItems: "center",
  },
  bar: { width: 8, borderRadius: 4, backgroundColor: "#2870f0" },
});
