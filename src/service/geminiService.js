// geminiService.js
import * as FileSystem from "expo-file-system";
// import * as DocumentPicker from "expo-document-picker"; // Not needed here, only in component

const API_KEY = "AIzaSyAs4gejuJuf-qHNKN2B7lh-nrAuERIxIIE"; //  Replace with your actual API key

export const fetchGeminiResponse = async (question, file) => {
    try {
        let filePart = null;
        const prompt = "Eres un asistente inteligente que analiza archivos y responde preguntas basadas en su contenido. Todas tus respuestas deben estar en español";

        if (file && file.assets && file.assets.length > 0) {
            try {
                const fileUri = file.assets[0].uri;
                let mimeType = file.assets[0].mimeType || file.assets[0].type;
                

                if (!mimeType) {
                    if (fileUri.endsWith(".pdf")) {
                        mimeType = "application/pdf";
                    } else if (fileUri.endsWith(".xlm")) {
                        mimeType = "xlm/plain";
                    } else if (fileUri.endsWith(".png")) {
                        mimeType = "image/png";
                    } else if (fileUri.endsWith(".jpg") || fileUri.endsWith(".jpeg")) {
                        mimeType = "image/jpeg";
                    }
                }

                console.log("Archivo seleccionado:", { uri: fileUri, mimeType });

                const allowedMimeTypes = ["application/pdf", "xlm/plain", "image/png", "image/jpeg"];
                if (!allowedMimeTypes.includes(mimeType)) {
                    console.warn("Formato de archivo no soportado:", mimeType);
                    return "Formato de archivo no soportado";
                }

                const fileContent = await FileSystem.readAsStringAsync(fileUri, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                filePart = {
                    inlineData: { // Corrected:  inlineData (camelCase, no underscore)
                        mimeType: mimeType, // Corrected: camelCase
                        data: fileContent,
                    },
                };
            } catch (fileError) {
                console.error("Error al leer el archivo:", fileError);
                return "Error al leer el archivo";
            }
        }

        if (!filePart && file) {
            console.warn("El archivo no se pudo procesar correctamente");
            return "Error: el archivo no se procesó correctamente.";
        }

        const requestBody = {
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        ...(filePart ? [filePart] : []),
                        { text: question },
                    ],
                },
            ],
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            }
        );

        const data = await response.json();
         // Check for errors from the Gemini API itself.
        if (data.error) {
            console.error("Gemini API Error:", data.error.message);
            return `Error from Gemini API: ${data.error.message}`;
        }

        return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo obtener respuesta";
    } catch (error) {
        console.error("Error al comunicarse con la API:", error);
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            return "Error de red: No se pudo conectar con la API de Gemini. Verifica tu conexión a internet.";
        }
        return "Error al comunicarse con la API";
    }
};