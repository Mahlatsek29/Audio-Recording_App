import { createSlice } from '@reduxjs/toolkit';

const recordingSlice = createSlice({
  name: 'recording',
  initialState: {
    recordings: [],
    message: '',
  },
  reducers: {
    addRecording: (state, action) => {
      const recording = action.payload;
      state.recordings.push(recording);
    },
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    deleteRecording(state, action) {
      state.recordings = state.recordings.filter(
        (recording) => recording.id !== action.payload
      );
    },
  },
});

export const { addRecording, setMessage, deleteRecording } = recordingSlice.actions;

export default recordingSlice.reducer;
