import { createReducer, on } from '@ngrx/store';
import { isLoading, stopLoading } from './UI.actions';

export interface State {
  isLoading: boolean;
}

export const initialState: State = {
  isLoading: false,
};

const _uiReducer = createReducer(
  initialState,
  on(isLoading, (state) => ({ ...state, isLoading: true })),
  on(stopLoading, (state) => ({ ...state, isLoading: false }))
);

export function uiReducer(state, action): State {
  return _uiReducer(state, action);
}
