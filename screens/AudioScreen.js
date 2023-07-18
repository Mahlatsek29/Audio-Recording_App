import React, { useRef } from 'react';
import { Button, StyleSheet, Text, View, StatusBar } from 'react-native';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';

function AudioScreen() {
  const recording = useRef(null);
  const [recordings, setRecordings] = React.useState([]);
  const [message, setMessage] = React.useState('');

  async function startRecording() {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const recordingInstance = new Audio.Recording();
        await recordingInstance.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        recording.current = recordingInstance;

        recordingInstance.setOnRecordingStatusUpdate(onRecordingStatusUpdate);
        await recordingInstance.startAsync(); // Start recording

        setMessage('Recording started');
      } else {
        setMessage('Please grant permission to the app to access the microphone');
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  function onRecordingStatusUpdate(status) {
    // Perform your custom logic here
    console.log('Recording status update:', status);
  }

  async function stopRecording() {
    if (!recording.current) {
      return;
    }

    try {
      await recording.current.stopAndUnloadAsync();
      const { sound, status } = await recording.current.createNewLoadedSoundAsync();

      const updatedRecordings = [
        ...recordings,
        {
          id: Date.now().toString(),
          sound: sound,
          duration: getDurationFormatted(status.durationMillis),
          file: recording.current.getURI(),
        },
      ];
      setRecordings(updatedRecordings);
      setMessage('Recording stopped');
    } catch (err) {
      console.error('Failed to stop recording', err);
    } finally {
      recording.current = null;
    }
  }

  function deleteRecording(id) {
    const updatedRecordings = recordings.filter(recording => recording.id !== id);
    setRecordings(updatedRecordings);
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function playRecording(sound) {
    if (sound && typeof sound.replayAsync === 'function') {
      sound.replayAsync();
    }
  }

  async function shareRecording(file) {
    if (file) {
      await Sharing.shareAsync(file);
    }
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={recordingLine.id} style={styles.row}>
          <Text style={styles.fill}>{`Recording ${index + 1} - ${recordingLine.duration}`}</Text>
          <Button
            style={styles.button}
            onPress={() => playRecording(recordingLine.sound)}
            title="Play"
          />
          <Button
            style={styles.button}
            onPress={() => shareRecording(recordingLine.file)}
            title="Share"
          />
          <Button
            style={styles.button}
            onPress={() => deleteRecording(recordingLine.id)}
            title="Delete"
          />
        </View>
      );
    });
  }

  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      <Button
        title={recording.current ? 'Stop Recording' : 'Start Recording'}
        onPress={recording.current ? stopRecording : startRecording}
      />
      {getRecordingLines()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#89CFF0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  button: {
    margin: 16,
  },
});

export default AudioScreen;
