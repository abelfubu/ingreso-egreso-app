import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private angularFireAuth: AngularFireAuth,
    public firestore: AngularFirestore
  ) {}

  initAuthListener(): void {
    this.angularFireAuth.authState.subscribe((data) => console.dir(data));
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
