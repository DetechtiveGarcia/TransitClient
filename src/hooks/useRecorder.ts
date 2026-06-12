import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useEffect, useState } from "react";

export function useRecorder() {
  // 1. Lägg till isMeteringEnabled här för att få faktiska värden om du vill ha det senare
  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });

  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const recorderState = useAudioRecorderState(recorder, 60);

  useEffect(() => {
    if (isRecording && recorderState.metering !== undefined) {
      // Vi mappar om det faktiska dB-värdet från mikrofonen.
      // Metering ligger ofta mellan -160 (tyst) och 0 (max).
      // Vi sätter allt under -60 till 0.
      const db = Math.max(-60, Math.min(0, recorderState.metering));
      const normalized = (db + 60) * 0.2; // Mappar -60...0 till 0...12

      setAudioLevel(normalized);
    } else {
      setAudioLevel(0);
    }
  }, [recorderState.metering, isRecording]);
  const startRecording = async () => {
    try {
      const { status } = await requestRecordingPermissionsAsync();
      if (status !== "granted") return;

      await recorder.prepareToRecordAsync();
      await recorder.record();
      setIsRecording(true);
    } catch (err) {
      console.error("Start error:", err);
    }
  };

  const stopRecording = async () => {
    try {
      await recorder.stop();
      setIsRecording(false);
      setAudioLevel(0);
      return recorder.uri;
    } catch (err) {
      console.error("Stop error:", err);
      return null;
    }
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
    audioLevel,
  };
}
