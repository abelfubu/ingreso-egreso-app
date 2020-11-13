import { createAction, props } from '@ngrx/store';
import { User } from '../models/user.model';

export const setUser = createAction('[AUTH] Set User', props<{ user: User }>());
export const unsetUser = createAction('[AUTH] Unset User');
