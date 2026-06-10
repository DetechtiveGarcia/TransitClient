import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { askAi } from "../api/transitApi";
export default function Index() {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleAsk() {
    try {
      setLoading(true);

      const result = await askAi(question);

      setAnswer(result.answer);
    } catch {
      setAnswer("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Fråga SL AI..."
        value={question}
        onChangeText={setQuestion}
        style={{
          borderWidth: 1,
          padding: 12,
          marginBottom: 12,
        }}
      />

      <Button title={loading ? "Laddar..." : "Fråga"} onPress={handleAsk} />

      <View style={{ marginTop: 20 }}>
        <Text>{answer}</Text>
      </View>
    </SafeAreaView>
  );
}
