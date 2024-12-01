import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs';
import { User } from '@app/shared/utils/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USER_KEY = 'user';
  private readonly AUTH_KEY = 'auth';

  private mockUserData: User = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  };

  user = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.user());

  constructor() {
    this.initializeMockUser();
  }

  private initializeMockUser(): void {
    if (this.isBrowser()) {
      const savedUser = localStorage.getItem(this.USER_KEY);

      if (!savedUser) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(this.mockUserData));
      }

      this.user.set(JSON.parse(savedUser || JSON.stringify(this.mockUserData)));

      const authStatus = localStorage.getItem(this.AUTH_KEY) === 'true';
      if (authStatus) {
        this.user.set(this.getSavedUser());
      } else {
        this.user.set(null);
      }
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  login(email: string, password: string): Observable<boolean> {
    return of({ email, password }).pipe(
      delay(1000),
      map((credentials) => {
        const savedUser = this.getSavedUser();

        if (!savedUser) {
          throw new Error('No user found.');
        }

        const isAuthenticated =
          credentials.email === savedUser.email && credentials.password === savedUser.password;

        if (isAuthenticated) {
          this.setSession(savedUser);
          return true;
        }

        throw new Error('Invalid credentials.');
      })
    );
  }

  register(name: string, email: string, password: string): Observable<boolean> {
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format.');
    }

    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    return of(true).pipe(
      delay(1000),
      map(() => {
        const newUser = { name, email, password };
        this.setSession(newUser);
        return true;
      })
    );
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.AUTH_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.user.set(null);
  }

  isAvailable(email: string): Observable<{ isAvailable: boolean }> {
    const isAvailable = email !== this.mockUserData.email;
    return of({ isAvailable }).pipe(delay(1000));
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private getSavedUser(): User | null {
    if (this.isBrowser()) {
      const savedUser = localStorage.getItem(this.USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  }

  private setSession(user: User): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      localStorage.setItem(this.AUTH_KEY, 'true');
    }
    this.user.set(user);
  }
}
