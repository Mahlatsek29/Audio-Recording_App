import React, { useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Audio } from 'expo-av';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addRecording,
  setMessage,
  deleteRecording,
  setPlayingSoundUri,
} from '../redux/recordingSlice';

function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const recordings = useSelector((state) => state.recording.recordings);
  const message = useSelector((state) => state.recording.message);
  const recording = useRef(null);

  useEffect(() => {
    loadRecordingsFromStorage();
  }, []);

  async function loadRecordingsFromStorage() {
    try {
      const recordingsFromStorage = await AsyncStorage.getItem('recordings');
      if (recordingsFromStorage) {
        dispatch(setRecordings(JSON.parse(recordingsFromStorage)));
      }
    } catch (error) {
      console.error('Error loading recordings from AsyncStorage:', error);
    }
  }

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingObject = new Audio.Recording();
      await recordingObject.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      recordingObject.setOnRecordingStatusUpdate(onRecordingStatusUpdate);
      await recordingObject.startAsync();
      recording.current = recordingObject;
      dispatch(setMessage('Recording...'));
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  }

  async function stopRecording() {
    if (!recording.current) {
      return;
    }

    try {
      await recording.current.stopAndUnloadAsync();
      const { status } = await recording.current.createNewLoadedSoundAsync();

      dispatch(
        addRecording({
          id: Date.now().toString(),
          duration: getDurationFormatted(status.durationMillis),
          file: recording.current.getURI(),
        })
      );
      dispatch(setMessage('Recording stopped'));
    } catch (error) {
      console.error('Failed to stop recording', error);
    } finally {
      recording.current = null;
    }
  }

  function onRecordingStatusUpdate(status) {
    // Handle recording status update if needed
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function onDeleteRecording(id) {
    dispatch(deleteRecording(id));
  }

  async function playRecording(uri) {
    try {
      const sound = new Audio.Sound(); // Create a new instance of Audio.Sound
      await sound.loadAsync({ uri }); // Load the audio file
      await sound.playAsync(); // Play the audio
      dispatch(setPlayingSoundUri(uri));
    } catch (error) {
      console.error('Failed to play recording sound', error);
    }
  }
  
function getRecordingLines() {
  return recordings.map((recordingLine, index) => {
    console.log('Recording URI:', recordingLine.file); // Log the file URI
    return (
      <View key={recordingLine.id} style={styles.row}>
        <Text style={styles.fill}>{`Recording ${index + 1} - ${recordingLine.duration}`}</Text>
        <View style={styles.buttonContainer}>
          <Button onPress={() => playRecording(recordingLine.file)} title="Play" color="#007BFF" />
          <Button
            onPress={() => shareRecording(recordingLine.file)}
            title="Share"
            color="#00BFA5"
          />
          <Button
            onPress={() => onDeleteRecording(recordingLine.id)}
            title="Delete"
            color="#FF3D00"
            />
          </View>
        </View>
      );
    });
  }

  function logout() {
    if (recording.current) {
      stopRecording();
    }
    navigation.navigate('Welcome');
  }

  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      <Button
        title={recording.current ? 'Stop Recording' : 'Start Recording'}
        onPress={recording.current ? stopRecording : startRecording}
      />
      {getRecordingLines()}
      <Button title="Logout" onPress={logout} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC0CB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    borderRadius: 75,
  },
  fill: {
    flex: 1,
    marginHorizontal: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
});

export default HomeScreen;
