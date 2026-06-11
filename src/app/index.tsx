import { sendAudio } from "@/api/transitApi";
import * as Speech from "expo-speech";
import { useState } from "react";
import { Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecorder } from "../hooks/useRecorder";
export default function Index() {
  const { isRecording, startRecording, stopRecording } = useRecorder();
  const [text, setText] = useState<string>("");

  const handlePress = async () => {
    try {
      if (isRecording) {
        const uri = await stopRecording();
        if (!uri) return;

        // Innan vi skickar, kan vi stoppa eventuellt pågående tal
        Speech.stop();

        const result = await sendAudio(uri);
        setText(result.text);

        // 2. Tvinga mobilen att läsa upp svaret på svenska!
        Speech.speak(result.text, {
          language: "sv", // Sätter språket till svenska
          pitch: 1.0, // Tonhöjd (0.5 - 2.0)
          rate: 1.0, // Hastighet (0.5 - 2.0)
        });
      } else {
        // Om användaren startar en ny inspelning, tysta mobilen om den pratar
        Speech.stop();
        await startRecording();
      }
    } catch (err) {
      console.log("handlePress error:", err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Pressable
        onPress={handlePress}
        style={{
          padding: 15,
          backgroundColor: isRecording ? "red" : "green",
        }}
      >
        <Text style={{ color: "white" }}>
          {isRecording ? "Stoppa inspelning" : "Starta tal"}
        </Text>
      </Pressable>

      <Text style={{ marginTop: 20 }}>Resultat: {text || "Inget ännu"}</Text>
    </SafeAreaView>
  );
}
