import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";

import DecibelMeter from "@/components/DecibelMeter";
import InteractionOrb from "@/components/InteractionOrb";
import { useRecorder } from "@/hooks/useRecorder";
import { InteractionState } from "@/types";

export default function TransitScreen() {
  const {
    isRecording,
    startRecording,
    stopRecording,
    audioLevel,
    uploadAudio,
  } = useRecorder();
  const [state, setState] = useState<InteractionState>(InteractionState.IDLE);
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const volumeSharedValue = useSharedValue(0);

  useEffect(() => {
    volumeSharedValue.value = audioLevel;
  }, [audioLevel]);

  const handleToggle = async () => {
    console.log(
      "--- handleToggle tryckt. Nuvarande state:",
      state,
      "isRecording:",
      isRecording,
    );

    if (state === InteractionState.RECORDING) {
      console.log("Försöker stoppa inspelning...");
      const audioFile = await stopRecording();
      console.log("Inspelning stoppad, URI:", audioFile);

      setState(InteractionState.PROCESSING);

      try {
        console.log("Startar uppladdning till backend...");
        const response = await uploadAudio(audioFile);
        console.log("Backend svarade:", response);

        const text = response.text;
        setChatResponse(text);
        setState(InteractionState.ANSWER);

        Speech.speak(text, {
          language: "sv-SE",
          onDone: () => {
            console.log("Uppläsning klar, återgår till IDLE");
            setState(InteractionState.IDLE);
          },
        });
      } catch (error) {
        console.error("FEL I UPP-LADDNING ELLER BACKEND:", error);
        setState(InteractionState.ERROR);
        setTimeout(() => setState(InteractionState.IDLE), 2000);
      }
    } else {
      console.log("Startar inspelning...");
      Speech.stop();
      setChatResponse(null);
      setState(InteractionState.RECORDING);
      await startRecording();
      console.log("startRecording anropat.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.blobContainer}>
        <InteractionOrb
          isRecording={state === InteractionState.RECORDING}
          onToggle={handleToggle}
        />
      </View>
      <View style={styles.bottomContainer}>
        {state === InteractionState.RECORDING ? (
          <DecibelMeter audioLevel={volumeSharedValue} />
        ) : chatResponse ? (
          <Animated.View style={styles.textBox}>
            <Text style={styles.text}>{chatResponse}</Text>
          </Animated.View>
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
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  textBox: { padding: 10 },
  text: { fontSize: RFValue(16), color: "#334155", textAlign: "center" },
});
