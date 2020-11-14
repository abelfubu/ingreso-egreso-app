import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, pluck, tap } from 'rxjs/operators';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [],
})
export class DetalleComponent implements OnInit {
  ingresosEgresos: Observable<IngresoEgreso[]> = this.store
    .select('ingresosEgresos')
    .pipe(
      pluck('items'),
      filter((items) => !!items.length),
      tap(console.log),
      map((items) =>
        items.slice().sort((a: IngresoEgreso) => {
          if (a.tipo === 'ingreso') return -1;
        })
      )
    );
  constructor(
    private store: Store<AppStateWithIngreso>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnInit(): void {}

  borrar(uid: string): void {
    this.ingresoEgresoService
      .borrarIngresoEgreso(uid)
      .then(() => {
        Swal.fire('Borrado!', 'Item borrado con éxito!', 'success');
        // this.store.dispatch(deleteItem({ uid }));
      })
      .catch((error) => {
        Swal.fire('Error!', 'Algo ha fallado...', 'error');
      });
  }
}
