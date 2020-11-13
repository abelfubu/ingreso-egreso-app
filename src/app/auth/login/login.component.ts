import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import { isLoading, stopLoading } from 'src/app/shared/UI.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  loadingSub$: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.subscribeToStore();
  }

  private subscribeToStore(): void {
    this.loadingSub$ = this.store
      .select('ui')
      .pipe(pluck('isLoading'))
      .subscribe((loading) => (this.loading = loading));
  }

  private createForm(): void {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.store.dispatch(isLoading());

    // Swal.fire({
    //   title: 'Haciendo magia',
    //   timerProgressBar: true,
    //   willOpen: () => {
    //     Swal.showLoading();
    //   },
    // });

    const { correo, password } = this.loginForm.value;
    this.authService
      .loginUser(correo, password)
      .then(() => {
        this.store.dispatch(stopLoading());
        this.router.navigateByUrl('/');
        // Swal.close();
      })
      .catch((error) => {
        this.store.dispatch(stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        });
      });
  }

  ngOnDestroy(): void {
    this.loadingSub$.unsubscribe();
  }
}
