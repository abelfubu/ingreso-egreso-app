import { ActionReducerMap } from '@ngrx/store';
import * as UI from './shared/UI.reducer';
import * as auth from './auth/auth.reducer';

export interface AppState {
  ui: UI.State;
  auth: auth.State;
}

export const appReducers: ActionReducerMap<AppState> = {
  ui: UI.uiReducer,
  auth: auth.authReducer,
};
