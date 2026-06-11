import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  useAudioRecorder,
} from "expo-audio";
import { useState } from "react";

export function useRecorder() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    try {
      console.log("STARTING RECORDING");

      const { status } = await requestRecordingPermissionsAsync();

      if (status !== "granted") {
        console.log("NO MIC PERMISSION");
        return;
      }

      await recorder.prepareToRecordAsync();
      recorder.record();

      setIsRecording(true);
    } catch (err) {
      console.log("Start error:", err);
    }
  };

  const stopRecording = async () => {
    try {
      await recorder.stop();
      setIsRecording(false);

      return recorder.uri;
    } catch (err) {
      console.log("Stop error:", err);
      return null;
    }
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
  };
}
