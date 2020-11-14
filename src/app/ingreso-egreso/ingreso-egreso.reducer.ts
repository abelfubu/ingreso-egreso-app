import { Action, createReducer, on } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { deleteItem, setItems, unsetItems } from './ingreso-egreso.actions';

export interface State {
  items: IngresoEgreso[];
}

export interface AppStateWithIngreso extends AppState {
  ingresosEgresos: State;
}

export const initialState: State = {
  items: [],
};

const _ingresoEgresoReducer = createReducer(
  initialState,
  on(setItems, (state, { items }) => ({ ...state, items: [...items] })),
  on(unsetItems, (state) => ({ ...state, items: [] })),
  on(deleteItem, (state, { uid }) => ({
    ...state,
    items: state.items.filter((item) => item.uid !== uid),
  }))
);

export function ingresoEgresoReducer(
  state: State | undefined,
  action: Action
): State {
  return _ingresoEgresoReducer(state, action);
}
