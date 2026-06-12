import DecibelMeter from "@/components/DecibelMeter";
import { useRecorder } from "@/hooks/useRecorder";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import Blob from "../../components/Blob";

// TransitScreen.tsx
export default function TransitScreen() {
  const { isRecording, startRecording, stopRecording, audioLevel } =
    useRecorder();

  // Skapa en shared value här som vi uppdaterar när dbVolume ändras
  const volumeSharedValue = useSharedValue(0);

  useEffect(() => {
    volumeSharedValue.value = audioLevel;
  }, [audioLevel]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.blobContainer}>
        <Blob
          isRecording={isRecording}
          onToggle={isRecording ? stopRecording : startRecording}
        />
      </View>

      <View style={styles.bottomContainer}>
        {isRecording ? (
          <DecibelMeter audioLevel={volumeSharedValue} />
        ) : (
          <Text style={styles.text}>
            Tryck på SL-loggan för att ställa en fråga
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  blobContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  bottomContainer: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  text: {
    fontSize: RFValue(15),
    fontWeight: "bold",
    color: "#334155",
    textAlign: "center",
  },
});
