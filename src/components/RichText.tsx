import { StyleSheet, Text } from "react-native";

interface RichTextProps {
  content: string;
}

export function RichText({ content }: RichTextProps) {
  const parts = content.split(/(\*\*.*?\*\*)/g);

  return (
    <Text style={styles.text}>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          const boldText = part.slice(2, -2);
          return (
            <Text key={index} style={styles.bold}>
              {boldText}
            </Text>
          );
        }
        return <Text key={index}>{part}</Text>;
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#333333",
    fontSize: 16,
    lineHeight: 22,
  },
  bold: {
    fontWeight: "bold",
    color: "#000000",
  },
});
