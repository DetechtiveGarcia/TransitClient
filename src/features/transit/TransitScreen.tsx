import DecibelMeter from "@/components/DecibelMeter";
import InteractionOrb from "@/components/InteractionOrb";
import { RichText } from "@/components/RichText";
import { useInteraction } from "@/hooks/useInteraction";
import { InteractionMode, SUPPORTED_LANGUAGES } from "@/types";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Animated from "react-native-reanimated";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
const modeOptions = [
  { label: "Manuellt läge", value: InteractionMode.MANUAL },
  { label: "Push-To-Talk", value: InteractionMode.PUSH_TO_TALK },
  { label: "Abuelita Mode", value: InteractionMode.ABUELITA },
];

export default function TransitScreen() {
  const [selectedMode, setSelectedMode] = useState<InteractionMode>(
    InteractionMode.MANUAL,
  );

  const {
    appState,
    chatResponse,
    audioLevel,
    onPress,
    handlePttStart,
    handlePttEnd,
    language,
    setLanguageStorage,
  } = useInteraction(selectedMode);

  // Avgör om vi är i PTT-läge för att binda om knapptrycken
  const isPtt = selectedMode === InteractionMode.PUSH_TO_TALK;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header med två dropdowns: Läge till vänster, Språk i mitten/höger */}
      <View style={styles.headerContainer}>
        {/* Välj läge */}
        <View style={styles.dropdownWrapper}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={modeOptions}
            maxHeight={150}
            labelField="label"
            valueField="value"
            placeholder="Välj läge"
            value={selectedMode}
            onChange={(item) => setSelectedMode(item.value)}
          />
        </View>

        {/* Välj språk */}
        <View style={styles.dropdownWrapper}>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={SUPPORTED_LANGUAGES}
            maxHeight={150}
            labelField="label"
            valueField="value"
            placeholder="Välj språk"
            value={language}
            onChange={(item) => setLanguageStorage(item.value)}
          />
        </View>
      </View>

      <View style={styles.blobContainer}>
        <InteractionOrb
          appState={appState}
          onToggle={isPtt ? undefined : onPress}
          onPressIn={isPtt ? handlePttStart : undefined}
          onPressOut={isPtt ? handlePttEnd : undefined}
        />
      </View>

      <View style={styles.bottomContainer}>
        {appState === "RECORDING" ? (
          <DecibelMeter audioLevel={audioLevel} />
        ) : chatResponse ? (
          <Animated.View style={styles.textBox}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <RichText content={chatResponse} />
            </ScrollView>
          </Animated.View>
        ) : (
          <Text style={styles.instructionsText}>
            {isPtt
              ? "Håll in mickrofonen för att prata, släpp för att skicka"
              : "Tryck på mickrofonen för att ställa en fråga"}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  // Uppdaterad header för att hantera fler element snyggt bredvid varandra
  headerContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropdownWrapper: {
    width: "48%", // Dela upp ytan så båda får plats
  },
  dropdown: {
    height: 40,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  placeholderStyle: {
    fontSize: RFValue(13),
    color: "#64748b",
  },
  selectedTextStyle: {
    fontSize: RFValue(13),
    color: "#134386",
    fontWeight: "600",
  },
  blobContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  bottomContainer: {
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  textBox: {
    flex: 1,
    width: "100%",
    padding: 10,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  instructionsText: {
    fontSize: RFValue(16),
    color: "#334155",
    textAlign: "center",
  },
});
