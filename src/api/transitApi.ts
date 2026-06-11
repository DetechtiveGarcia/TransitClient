const API_URL = "http://192.168.1.130:5286";

export async function askAi(message: string) {
  const response = await fetch(API_URL + "/api/ai/ask", {
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

export function sendAudio(uri: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append("file", {
      uri: uri,
      name: "audio.m4a",
      type: "audio/m4a",
    } as any);

    xhr.open("POST", `${API_URL}/api/audio/transcribe`);

    // Hantera när det lyckas
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.response);
          resolve(response);
        } catch (e) {
          resolve(xhr.response);
        }
      } else {
        reject(
          new Error(`Server returned status ${xhr.status}: ${xhr.response}`),
        );
      }
    };

    // Hantera nätverksfel
    xhr.onerror = () => {
      reject(new Error("Network request failed"));
    };

    // Skicka! (Sätt INTE Content-Type header manuellt här heller)
    xhr.send(formData);
  });
}
