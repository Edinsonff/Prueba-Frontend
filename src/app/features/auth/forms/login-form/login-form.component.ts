import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@app/core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthStatus } from '@app/core/enums/auth-status.enum';
import { CustomValidators } from '@app/shared/validators/validator';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email, CustomValidators.noLeadingOrTrailingWhitespaceValidator]],
    password: ['', [Validators.required, Validators.minLength(8), CustomValidators.noWhitespaceValidator]]
  });

  showPassword = signal(false);
  status = signal<AuthStatus>(AuthStatus.Init);

  AuthStatus = AuthStatus;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParamMap.subscribe(params => {
      const email = params.get('email');
      if (email) {
        this.loginForm.controls['email'].setValue(email);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.status.set(AuthStatus.Loading);
      const { email, password } = this.loginForm.getRawValue();
      this.authService.login(email, password).subscribe({
        next: (success) => {
          if (success) {
            this.status.set(AuthStatus.Success);
            this.router.navigate(['/products']);
          } else {
            this.status.set(AuthStatus.Failed);
          }
        },
        error: () => {
          this.status.set(AuthStatus.Failed);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

}
