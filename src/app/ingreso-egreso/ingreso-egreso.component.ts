import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { pluck } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { isLoading, stopLoading } from '../shared/UI.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [''],
})
export class IngresoEgresoComponent implements OnInit {
  form: FormGroup;
  tipo = 'ingreso';
  isLoading = this.store.select('ui').pipe(pluck('isLoading'));

  constructor(
    fb: FormBuilder,
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) {
    this.form = fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.invalid) return;
    this.store.dispatch(isLoading());
    const { descripcion, monto } = this.form.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);
    this.ingresoEgresoService
      .crearIngresoEgreso(ingresoEgreso)
      .then((response) => {
        this.form.reset();
        console.log(this.isLoading);

        Swal.fire('Registro creado!', descripcion, 'success');
        console.log(response);
      })
      .catch((error) => Swal.fire('Error!', error.message, 'error'))
      .finally(() => this.store.dispatch(stopLoading()));
  }
}
