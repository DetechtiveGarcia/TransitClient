import * as Speech from "expo-speech";
import { useEffect, useRef, useState } from "react";
import { useSharedValue } from "react-native-reanimated";
import { InteractionMode, InteractionState } from "../types";
import { useRecorder } from "./useRecorder";

export function useInteraction(mode: InteractionMode) {
  const [language, setLanguage] = useState<string>("sv-SE");
  const [appState, setAppState] = useState<InteractionState>(
    InteractionState.IDLE,
  );
  const [chatResponse, setChatResponse] = useState<string | null>(null);

  const volumeSharedValue = useSharedValue(0);

  // Timer-referens för Abuelita Mode
  const abuelitaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    isRecording,
    startRecording,
    stopRecording,
    audioLevel,
    uploadAudio,
  } = useRecorder();

  // Synka decibelnivån till UI:t (utan massa tystnadstimer-logik som spökar)
  useEffect(() => {
    volumeSharedValue.value = audioLevel;
  }, [audioLevel]);

  const processAudioAndRespond = async (audioFile: string) => {
    setAppState(InteractionState.PROCESSING);

    try {
      const response = await uploadAudio(audioFile);
      const text = response.text;
      console.log(text);
      setChatResponse(text);
      setAppState(InteractionState.SPEAKING);
      const textForSpeech = cleanTextForSpeech(text);
      Speech.speak(textForSpeech, {
        language: language,
        onDone: () => {
          setAppState(InteractionState.IDLE);
        },
      });
    } catch (error) {
      console.error("Fel:", error);
      setAppState(InteractionState.ERROR);
      setTimeout(() => {
        setChatResponse(null);
        setAppState(InteractionState.IDLE);
      }, 2000);
    }
  };

  const handleManualToggle = async () => {
    if (appState === InteractionState.RECORDING) {
      Speech.stop();
      const audioFile = await stopRecording();
      if (audioFile) await processAudioAndRespond(audioFile);
    } else {
      Speech.stop();
      setChatResponse(null);
      setAppState(InteractionState.RECORDING);
      await startRecording();
    }
  };

  const handlePttStart = async () => {
    Speech.stop();
    setChatResponse(null);
    setAppState(InteractionState.RECORDING);
    await startRecording();
  };

  const handlePttEnd = async () => {
    const audioFile = await stopRecording();
    if (audioFile) await processAudioAndRespond(audioFile);
  };

  const handleAbuelitaPress = async () => {
    // Rensa eventuella gamla hängande timers innan vi påbörjar något nytt
    if (abuelitaTimerRef.current) {
      clearTimeout(abuelitaTimerRef.current);
      abuelitaTimerRef.current = null;
    }

    if (appState === InteractionState.IDLE) {
      Speech.stop();
      setChatResponse(null);
      setAppState(InteractionState.RECORDING);
      await startRecording();

      console.log(
        "Abuelita: Inspelning startad. Schemalägger automatiskt stopp om 5 sekunder...",
      );

      // Starta en bombsäker timer som stänger av inspelningen efter exakt 5 sekunder
      abuelitaTimerRef.current = setTimeout(async () => {
        console.log(
          "Abuelita: 5 sekunder har förflutit, stoppar inspelning automatiskt.",
        );

        const audioFile = await stopRecording();
        if (audioFile) {
          await processAudioAndRespond(audioFile);
        }
      }, 5000); // 5 sekunder
    } else if (appState === InteractionState.RECORDING) {
      // Om användaren trycker på knappen för att stoppa i förtid
      console.log("Abuelita: Avbryter inspelning i förtid via knapptryck.");

      const audioFile = await stopRecording();
      if (audioFile) {
        await processAudioAndRespond(audioFile);
      }
    }
  };

  const onPress = () => {
    if (mode === InteractionMode.MANUAL) handleManualToggle();
    if (mode === InteractionMode.ABUELITA) handleAbuelitaPress();
  };

  // Städa upp timern helt om skärmen/hooken avmonteras
  useEffect(() => {
    return () => {
      if (abuelitaTimerRef.current) clearTimeout(abuelitaTimerRef.current);
    };
  }, []);

  return {
    appState,
    chatResponse,
    audioLevel: volumeSharedValue,
    isRecording,
    onPress,
    handlePttStart,
    handlePttEnd,
    language,
    setLanguage,
  };
}

function cleanTextForSpeech(text: string): string {
  return text
    .replace(/kl\./gi, "klockan")
    .replace(/\*\*/g, "") // Tar bort fetstil (**)
    .replace(/\*/g, "") // Tar bort kursiv (*)
    .replace(/[-#_`]/g, " "); // Ersätter bindestreck, rubriker mm med paus/mellanslag
}
