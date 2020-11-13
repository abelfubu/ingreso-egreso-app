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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
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
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    this.store.dispatch(isLoading());
    // this.showSuccessModal();
    const { nombre, correo, password } = this.registerForm.value;
    this.authService
      .createUser(nombre, correo, password)
      .then(() => this.router.navigateByUrl(''))
      .catch((error) => this.showErrorModal(error))
      .finally(() => this.store.dispatch(stopLoading()));
  }

  private showErrorModal(error: Error): void {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.message,
      footer: '<a href>Why do I have this issue?</a>',
    });
  }

  private showSuccessModal(): void {
    Swal.fire({
      title: 'Haciendo magia',
      timerProgressBar: true,
      willOpen: () => {
        Swal.showLoading();
      },
    });
  }

  ngOnDestroy(): void {
    this.loadingSub$.unsubscribe();
  }
}
