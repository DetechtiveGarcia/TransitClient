const API_URL = "http://192.168.1.130:5286/api/ai/ask";
// Android emulator

export async function askAi(message: string) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to call API");
  }

  return response.json();
}
