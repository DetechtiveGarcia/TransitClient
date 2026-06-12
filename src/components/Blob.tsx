import { sendAudio } from "@/api/transitApi";
import DecibelMeter from "@/components/DecibelMeter";
import * as Speech from "expo-speech";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import SlLogo from "../components/SlLogo";
import { useRecorder } from "../hooks/useRecorder";

interface AudioBarProps {
  volumeValue: SharedValue<number>;
  multiplier: number;
  index: number; // Ny: Används för att ge varje stapel en unik röst-rytm
}

export default function Blob() {
  const { isRecording, startRecording, stopRecording, dbVolume } =
    useRecorder();

  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const skewX = useSharedValue(0);
  const skewY = useSharedValue(0);
  const recordingProgress = useSharedValue(0);

  const volumeSharedValue = useSharedValue(0);

  // Skjut in röstvolymen till Reanimateds UI-tråd
  useEffect(() => {
    if (isRecording) {
      volumeSharedValue.value = dbVolume;
    } else {
      volumeSharedValue.value = 0;
    }
  }, [dbVolume, isRecording]);

  // Den organiska bakgrundsbloben
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
    if (isRecording) {
      recordingProgress.value = withTiming(1, { duration: 300 });
    } else {
      recordingProgress.value = withTiming(0, { duration: 300 });
    }
  }, [isRecording]);

  const animatedStyle = useAnimatedStyle(() => {
    const animatedBackgroundColor =
      recordingProgress.value > 0.5 ? "rgb(239, 68, 68)" : "rgb(40, 112, 240)";

    return {
      width: 150,
      height: 150,
      borderTopLeftRadius: 55 + skewX.value * 8,
      borderTopRightRadius: 70 - skewY.value * 5,
      borderBottomRightRadius: 60 + skewX.value * 6,
      borderBottomLeftRadius: 65 - skewY.value * 7,
      backgroundColor: animatedBackgroundColor,
      transform: [
        { scale: scale.value },
        { rotate: `${rotate.value}deg` },
        { skewX: `${skewX.value}deg` },
        { skewY: `${skewY.value}deg` },
      ],
    };
  });

  const handlePress = async () => {
    try {
      if (isRecording) {
        const uri = await stopRecording();
        if (!uri) return;

        Speech.stop();
        const result = await sendAudio(uri);

        Speech.speak(result.text, {
          language: "sv",
          pitch: 1.0,
          rate: 1.0,
        });
      } else {
        Speech.stop();
        await startRecording();
      }
    } catch (err) {
      console.log("handlePress error:", err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.blobCenterContainer}>
        <Pressable
          onPress={handlePress}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Animated.View
            style={[
              animatedStyle,
              { alignItems: "center", justifyContent: "center" },
            ]}
          />
          <View style={styles.logoContainer} pointerEvents="none">
            <SlLogo width={110} height={110} />
          </View>
        </Pressable>
      </View>

      <View style={styles.bottomContainer}>
        {!isRecording ? (
          <Text style={styles.text}>Tryck på SL logot för att prata</Text>
        ) : (
          <DecibelMeter />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, padding: 20 },
  blobCenterContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#334155",
    textAlign: "center",
  },
  spectrumContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 60,
  },
  audioBar: { width: 5, borderRadius: 3, backgroundColor: "rgb(239, 68, 68)" },
});
