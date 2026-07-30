export enum InteractionState {
  IDLE = "IDLE",
  RECORDING = "RECORDING",
  PROCESSING = "PROCESSING",
  SPEAKING = "SPEAKING",
  INTERRUPTED = "INTERRUPTED",
  ERROR = "ERROR",
}

export enum InteractionMode {
  MANUAL = "MANUAL",
  PUSH_TO_TALK = "PUSH_TO_TALK",
  ABUELITA = "ABUELITA",
}

export interface LanguageOption {
  label: string;
  value: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { label: "Svenska", value: "sv-SE" },
  { label: "English", value: "en-US" },
  { label: "Español", value: "es-ES" },
];
