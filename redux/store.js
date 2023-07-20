import { configureStore } from '@reduxjs/toolkit';
import recordingReducer from './reducers/recordingSlice';

export const store = configureStore({
  reducer: {
    recording: recordingReducer,
  },
});
