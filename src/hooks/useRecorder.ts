import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useEffect, useState } from "react";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function useRecorder() {
  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const recorderState = useAudioRecorderState(recorder, 50);

  useEffect(() => {
    if (isRecording && recorderState.metering !== undefined) {
      setAudioLevel(Math.max(0, (recorderState.metering + 60) * 0.2));
    } else {
      setAudioLevel(0);
    }
  }, [recorderState.metering, isRecording]);

  const startRecording = async () => {
    const { status } = await requestRecordingPermissionsAsync();
    if (status !== "granted") return;
    await recorder.prepareToRecordAsync();
    await recorder.record();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    await recorder.stop();
    setIsRecording(false);
    return recorder.uri;
  };

  const uploadAudio = async (uri: string | null) => {
    if (!uri) throw new Error("No audio file found");

    console.log("Försöker hämta binärdata via fetch direkt...");

    // Vi använder fetch() som en fil-läsare.
    // Detta fungerar för filer som Expo själv har skapat.
    const response = await fetch(uri);

    // Istället för .blob(), läser vi som arrayBuffer för att undvika BlobManager
    const arrayBuffer = await response.arrayBuffer();

    // Konvertera till Base64
    const bytes = new Uint8Array(arrayBuffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);

    console.log("Base64 genererad via ArrayBuffer, skickar JSON...");

    const uploadResponse = await fetch(`${API_URL}/api/audio/transcribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audioBase64: base64 }),
    });

    if (!uploadResponse.ok) {
      // Läs ut feltexten som servern skickar med
      const errorText = await uploadResponse.text();
      console.error("Detaljerat fel från Azure:", errorText);

      throw new Error(
        `Backend svarade med fel: ${uploadResponse.status} - ${errorText}`,
      );
    }

    return await uploadResponse.json();
  };
  return {
    isRecording,
    startRecording,
    stopRecording,
    audioLevel,
    uploadAudio,
  };
}
