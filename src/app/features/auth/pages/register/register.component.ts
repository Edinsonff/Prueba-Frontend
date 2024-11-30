import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RegisterFormComponent } from '@app/features/auth/forms/register-form/register-form.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RegisterFormComponent, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {

}
