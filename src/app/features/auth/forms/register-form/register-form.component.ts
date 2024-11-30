import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@app/core/services/auth.service';
import { Router } from '@angular/router';
import { CustomValidators } from '@app/shared/validators/validator';
import { CommonModule } from '@angular/common';
import { AuthStatus } from '@app/core/enums/auth-status.enum';
import { HandlerService } from '@app/core/services/handler.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterFormComponent {
  showRegister = signal(false);

  formUser = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email, CustomValidators.noLeadingOrTrailingWhitespaceValidator]],
  });

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, CustomValidators.noWhitespaceValidator]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), CustomValidators.validRegExp]],
    confirmPassword: ['', Validators.required],
    gender: ['', Validators.required],
    agreeTerms: [false, Validators.requiredTrue]
  }, {
    validators: [CustomValidators.MatchValidator('password', 'confirmPassword')]
  });

  status = signal(AuthStatus.Init);

  AuthStatus = AuthStatus;

  showPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private handler: HandlerService
  ) { }

  validateUser() {
    if (this.formUser.valid) {
      this.status.set(AuthStatus.Loading);
      const { email } = this.formUser.getRawValue();
      this.authService.isAvailable(email).subscribe({
        next: (response: { isAvailable: boolean }) => {
          this.status.set(AuthStatus.Success);
          if (response.isAvailable) {
            this.showRegister.set(true);
            this.form.controls.email.setValue(email);
          } else {
            this.router.navigate(['/login'], { queryParams: { email } });
          }
        },
        error: (err) => {
          this.handler.handleError('Error validating email', err);
          this.status.set(AuthStatus.Failed);
        }
      });
    } else {
      this.formUser.markAllAsTouched();
    }
  }

  register() {
    if (this.form.valid) {
      this.status.set(AuthStatus.Loading);
      const { name, email, password } = this.form.getRawValue();
      this.authService.register(name, email, password).subscribe({
        next: () => {
          this.status.set(AuthStatus.Success);
          this.router.navigate(['/products']);
        },
        error: () => {
          this.status.set(AuthStatus.Failed);
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

}
