import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, pluck, switchMap, tap } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { setItems } from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { User } from '../models/user.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  ingresoEgresoData: Observable<IngresoEgreso[]> = this.store
    .select('auth')
    .pipe(
      pluck('user'),
      filter((user) => !!user),
      switchMap<User, Observable<IngresoEgreso[]>>((user) =>
        this.ingresoEgresoService.initIngresosEgresosListener(user.uid)
      ),
      tap((items) =>
        this.store.dispatch(setItems({ items: items as IngresoEgreso[] }))
      )
    );

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnInit(): void {}
}
