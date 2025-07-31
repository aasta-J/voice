import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, Alert } from 'react-native';
import Voice from '@react-native-voice/voice';

export default function App() {
  const [result, setResult] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    Voice.onSpeechResults = (e) => {
      if (e.value && e.value.length > 0) {
        const text = e.value[0];
        setResult(text);
        sendToBackend(text);
      }
    };

    Voice.onSpeechError = (e) => {
      console.error('Speech error:', e);
      Alert.alert('語音辨識錯誤', JSON.stringify(e.error));
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      setIsListening(true);
      await Voice.start('zh-TW'); // 支援中文
    } catch (e) {
      console.error('Start error:', e);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error('Stop error:', e);
    }
  };

  const sendToBackend = async (text: string) => {
    try {
      const res = await fetch('http://你的IP或網域:8000/save-speech/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      console.log('Server response:', data);
      Alert.alert('伺服器回應', data.message);
    } catch (error) {
      console.error('Error sending to backend:', error);
      Alert.alert('錯誤', '無法傳送到伺服器');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎙 語音轉文字 + 傳送後端</Text>
      <Button
        title={isListening ? '🛑 停止辨識' : '🎤 開始說話'}
        onPress={isListening ? stopListening : startListening}
      />
      <Text style={styles.result}>{result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },
});
