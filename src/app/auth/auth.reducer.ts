import { Action, createReducer, on } from '@ngrx/store';
import { User } from '../models/user.model';
import { setUser, unsetUser } from './auth.actions';

export interface State {
  user: User;
}

export const initialState: State = {
  user: null,
};

const _authReducer = createReducer(
  initialState,
  on(setUser, (state, { user }) => ({ ...state, user: { ...user } })),
  on(unsetUser, (state) => ({ ...state, user: null }))
);

export function authReducer(state: State | undefined, action: Action): State {
  return _authReducer(state, action);
}
