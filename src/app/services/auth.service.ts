import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { setUser, unsetUser } from '../auth/auth.actions';
import { unsetItems } from '../ingreso-egreso/ingreso-egreso.actions';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user: User;

  get user(): User {
    return { ...this._user };
  }

  constructor(
    private angularFireAuth: AngularFireAuth,
    public firestore: AngularFirestore,
    private store: Store<AppState>
  ) {}

  initAuthListener(): void {
    this.angularFireAuth.authState
      .pipe(
        tap((user) => {
          if (!user) {
            this.store.dispatch(unsetUser());
            this.store.dispatch(unsetItems());
            this._user = null;
          }
        }),
        filter((user) => !!user),
        switchMap((user) =>
          this.firestore.doc(user.uid + '/usuario').valueChanges()
        ),
        catchError(() => of(null))
      )
      .subscribe((user: User) => {
        this.store.dispatch(setUser({ user }));
        this._user = user;
      });
  }

  createUser(nombre: string, email: string, password: string): Promise<any> {
    return this.angularFireAuth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new User(user.uid, nombre, user.email);
        return this.firestore.doc(user.uid + '/usuario').set({ ...newUser });
      });
  }

  loginUser(email: string, password: string): Promise<any> {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password);
  }

  logout(): Promise<any> {
    return this.angularFireAuth.signOut();
  }

  isAuth(): Observable<boolean> {
    return this.angularFireAuth.authState.pipe(map((user) => !!user));
  }
}
