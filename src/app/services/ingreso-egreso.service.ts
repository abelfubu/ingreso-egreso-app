import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  DocumentChangeAction,
  DocumentReference,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class IngresoEgresoService {
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso): Promise<DocumentReference> {
    const uid = this.authService.user.uid;
    const { descripcion, monto, tipo } = ingresoEgreso;
    return this.firestore
      .doc(uid + '/ingresos-egresos')
      .collection('items')
      .add({ descripcion, monto, tipo });
  }

  initIngresosEgresosListener(uid: string): Observable<IngresoEgreso[]> {
    return this.firestore
      .collection(uid + '/ingresos-egresos/items')
      .snapshotChanges()
      .pipe(
        map((snapShot) =>
          snapShot.map((item) => ({
            ...(item.payload.doc.data() as IngresoEgreso),
            uid: item.payload.doc.id,
          }))
        )
      );
  }

  borrarIngresoEgreso(uid: string): Promise<void> {
    const userId = this.authService.user.uid;
    return this.firestore
      .doc(userId + '/ingresos-egresos/items/' + uid)
      .delete();
  }
}
