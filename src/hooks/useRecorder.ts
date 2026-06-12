import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useEffect, useState } from "react";

export function useRecorder() {
  const recordingOptions = RecordingPresets.HIGH_QUALITY;
  const recorder = useAudioRecorder(recordingOptions);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceVolume, setVoiceVolume] = useState(0);

  // Använd Expos inbyggda state-övervakare. Vi pollar var 60:e millisekund.
  const recorderState = useAudioRecorderState(recorder, 60);

  useEffect(() => {
    if (isRecording && recorderState.isRecording) {
      // Eftersom det nya API:et döljer rå dB, skapar vi en röstvåg
      // vars intensitet styrs dynamiskt av inspelningens duration.
      // Det gör att den inte upprepar sig statiskt, utan rör sig i vågor.
      const timeFactor = Math.sin(recorderState.durationMillis / 200);
      const dynamicVolume = Math.abs(timeFactor) * 60 + Math.random() * 40;

      setVoiceVolume(dynamicVolume);
    } else {
      setVoiceVolume(0);
    }
  }, [recorderState.durationMillis, isRecording]);

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
      recorder.stop();
      setIsRecording(false);
      setVoiceVolume(0);
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
    dbVolume: voiceVolume, // Exportera det dynamiska värdet till Blobben
  };
}
