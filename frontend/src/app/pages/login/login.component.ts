import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        alert('Login successful!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        alert(err.error?.error || 'Login failed.');
      },
    });
  }
}
