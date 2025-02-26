import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const Pdf = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [tokensUsed, setTokensUsed] = useState(null);
  const [pingResponse, setPingResponse] = useState('');

  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const { name, uri } = result.assets[0];
        setFileName(name);
        setFile(result.assets[0]);
      } else {
        Alert.alert('La selección del documento fue cancelada');
      }
    } catch (error) {
      console.error('Error al seleccionar el documento:', error);
      Alert.alert('Error', 'Hubo un error al seleccionar el documento.');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      Alert.alert('Error', 'Por favor, selecciona un archivo PDF.');
      return;
    }

    try {
      const fileUri = file.uri;
      const fileName = file.name;

      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        name: fileName,
        type: 'application/pdf'
      });
      formData.append('question', question);

      const res = await fetch('http://192.168.1.7:9012/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData
      });

      const data = await res.json();
      setResponse(data.response);
      setTokensUsed(data.tokensUsed);  // Actualiza el estado de tokens
      setFile(null);
      setFileName(null);
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      Alert.alert('Error', 'Error al subir el archivo o procesar la pregunta.');
    }
  };

  const handlePing = async () => {
    try {
      const res = await fetch('http://192.168.1.7:9012/ping');
      const data = await res.json();
      setPingResponse(data);
    } catch (error) {
      console.error('Error al hacer ping:', error);
      Alert.alert('Error', 'Error al hacer ping al servidor.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Subir Archivo PDF y Hacer Pregunta</Text>
      <Button title="Seleccionar Archivo PDF" onPress={pickDocument} />
      {fileName && <Text style={styles.fileName}>{fileName}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu pregunta aquí"
        value={question}
        onChangeText={setQuestion}
      />
      <Button title="Subir y Preguntar" onPress={handleUpload} />
      {response && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseTitle}>Respuesta:</Text>
          <Text style={styles.responseText}>{response}</Text>
        </View>
      )}
      {tokensUsed !== null && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseTitle}>Tokens Utilizados:</Text>
          <Text style={styles.responseText}>{tokensUsed}</Text>
        </View>
      )}
      <Button title="Ping al Servidor" onPress={handlePing} />
      {pingResponse && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseTitle}>Respuesta del Ping:</Text>
          <Text style={styles.responseText}>{pingResponse}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  fileName: {
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
  },
  responseContainer: {
    marginTop: 20,
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  responseText: {
    fontSize: 16,
  },
});

export default Pdf;
