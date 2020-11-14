import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { pluck } from 'rxjs/operators';

import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [],
})
export class EstadisticaComponent implements OnInit, OnDestroy {
  ingresos = 0;
  egresos = 0;

  totalEgresos = 0;
  totalIngresos = 0;

  public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: MultiDataSet;
  public doughnutChartType: ChartType = 'doughnut';

  ingresosEgresosData: Subscription;

  constructor(private store: Store<AppStateWithIngreso>) {}

  ngOnInit(): void {
    this.ingresosEgresosData = this.store
      .select('ingresosEgresos')
      .pipe(pluck('items'))
      .subscribe((items) => {
        items.forEach((item) => {
          if (item.tipo === 'ingreso') {
            this.totalIngresos += item.monto;
            this.ingresos += 1;
          } else {
            this.totalEgresos += item.monto;
            this.egresos += 1;
          }
        });
        this.doughnutChartData = [[this.totalIngresos, this.totalEgresos]];
      });
  }

  ngOnDestroy(): void {
    this.ingresosEgresosData.unsubscribe();
  }
}
