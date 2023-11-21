// src/app/store.ts

import {configureStore, ThunkAction, Action, combineReducers} from '@reduxjs/toolkit';
import tagReducer from '../features/tag/tagSlice';
import noteReducer from '../features/note/noteSlice';

const rootReducer = combineReducers({
  tag: tagReducer,
  note: noteReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
