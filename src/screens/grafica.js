import { Text, View, TouchableOpacity, ScrollView, TextInput, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'; // Import KeyboardAvoidingView, Platform
import React, { useState, useRef, useEffect } from 'react'; // Import useRef, useEffect
import MessageBubble from "../components/mensaje";
import { fetchGeminiResponse } from "../service/geminiService"
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from '@expo/vector-icons';

export default function TabTwoScreen() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const scrollViewRef = useRef(null); // Ref para el ScrollView


    // Función para hacer scroll al final del chat
    const scrollToBottom = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    // Efecto para hacer scroll al final cuando se añaden nuevos mensajes
    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    const handleFileUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
            if (result.canceled || !result.assets || result.assets.length === 0) return;

            setSelectedFile(result);

            const fileMessage = {
                role: "user",
                text: `Archivo subido: ${result.assets[0].name}`,
                file: result.assets[0].uri,
            };
            setMessages((prevMessages) => [...prevMessages, fileMessage]);
            // No se llama a scrollToBottom aquí, se maneja en el useEffect

        } catch (error) {
            console.error("Error al subir archivo: ", error);
            // Mostrar un mensaje de error al usuario
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() && !selectedFile) return;

        setLoading(true);

        const userMessage = {
            role: "user",
            text: inputText || `Pregunta sobre archivo: ${selectedFile?.assets?.[0].name}`,
            file: selectedFile?.assets?.[0]?.uri || null,
        };

        setMessages((prevMessages) => [...prevMessages, userMessage]);
         // No se llama a scrollToBottom aquí, se maneja en el useEffect

        try {
            const response = await fetchGeminiResponse(inputText, selectedFile);
            const botMessage = { role: "bot", text: response };

            setMessages((prevMessages) => [...prevMessages, botMessage]);
            // No se llama a scrollToBottom aquí, se maneja en el useEffect

        } catch (error) {
            console.error("Error al obtener respuesta: ", error);
            setMessages((prevMessages) => [...prevMessages, { role: "bot", text: "Error al comunicarse con la API.  Por favor, intenta de nuevo." }]);
        } finally {
            setLoading(false);
            setInputText("");
            setSelectedFile(null);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}  // Importante:  Asegura que KeyboardAvoidingView ocupe todo el espacio
            keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} // Ajuste para iOS
        >
            <View style={styles.container}>
                <ScrollView style={styles.scrollView} ref={scrollViewRef}>
                    {messages.map((msg, index) => (
                        <MessageBubble key={index} role={msg.role} text={msg.text} />
                    ))}
                    {loading && <ActivityIndicator size="large" color="#007bff" style={styles.spinner} />}
                </ScrollView>

                {selectedFile?.assets?.[0] && (
                    <View style={styles.fileContainer}>
                        <Ionicons name="document-attach-outline" size={24} color="#007bff" />
                        <Text style={styles.fileName}>{selectedFile.assets[0].name}</Text>
                        <TouchableOpacity onPress={() => setSelectedFile(null)}>
                            <Ionicons name="close-circle" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
                        <Ionicons name="attach" size={24} color="white" />
                    </TouchableOpacity>

                    <TextInput
                        style={styles.textInput}
                        placeholder='Escribe un mensaje...'
                        value={inputText}
                        onChangeText={setInputText}
                        placeholderTextColor="#777"
                        onSubmitEditing={handleSend} // Envía el mensaje al presionar Enter
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={styles.sendButtonText}>Enviar</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 12,
    },
    fileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e8f0fe',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 12,
        marginBottom: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
    },
    fileName: {
        flex: 1,
        color: '#007bff',
        marginLeft: 8,
        fontSize: 14,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 25,
        paddingVertical: 8,
        paddingHorizontal: 12,
        margin: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    uploadButton: {
        backgroundColor: '#007bff',
        borderRadius: 20,
        padding: 10,
        marginRight: 8,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingVertical: 10,
        paddingRight: 10,
    },
    sendButton: {
        backgroundColor: '#007bff',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginLeft: 8,
    },
    sendButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    spinner: {
        marginVertical: 20,
    },
});