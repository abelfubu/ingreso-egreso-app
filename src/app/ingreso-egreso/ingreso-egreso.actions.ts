import { createAction, props } from '@ngrx/store';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

export const setItems = createAction(
  '[ING-EGR] Set Items',
  props<{ items: IngresoEgreso[] }>()
);
export const unsetItems = createAction('[ING-EGR] Unset Items');
export const deleteItem = createAction(
  '[ING-EGR] Delete Item',
  props<{ uid: string }>()
);
