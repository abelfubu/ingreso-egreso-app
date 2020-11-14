import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): Observable<boolean> {
    return this.authService
      .isAuth()
      .pipe(tap((user) => !user && this.router.navigateByUrl('/login')));
  }
  canLoad(): Observable<boolean> {
    return this.authService.isAuth().pipe(
      tap((user) => !user && this.router.navigateByUrl('/login')),
      take(1)
    );
  }
}
