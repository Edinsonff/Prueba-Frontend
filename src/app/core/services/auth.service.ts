import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs';
import { User } from '@app/shared/utils/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly USER_KEY = 'user';
  private readonly AUTH_KEY = 'auth';

  private mockUserData = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
  };

  private loggedInUser: User | null = null;

  constructor() {
    if (this.isBrowser()) {
      const savedUser = localStorage.getItem(this.USER_KEY);
      if (savedUser) {
        this.loggedInUser = JSON.parse(savedUser);
      } else {
        this.loggedInUser = this.mockUserData;
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
        let savedUser = this.getSavedUser();

        if (!savedUser) {
          savedUser = this.mockUserData;
          localStorage.setItem(this.USER_KEY, JSON.stringify(this.mockUserData));
        }

        const isAuthenticated = credentials.email === savedUser.email && credentials.password === savedUser.password;

        if (isAuthenticated) {
          this.loggedInUser = savedUser;
          localStorage.setItem(this.AUTH_KEY, 'true');
        }

        return isAuthenticated;
      })
    );
  }

  register(name: string, email: string, password: string): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      map(() => {
        const newUser = { name, email, password };
        this.loggedInUser = newUser;
        if (this.isBrowser()) {
          localStorage.setItem(this.USER_KEY, JSON.stringify(newUser));
          localStorage.setItem(this.AUTH_KEY, 'true');
        }
        return true;
      })
    );
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.setItem(this.AUTH_KEY, 'false');
    }
    this.loggedInUser = null;
  }

  isLoggedIn(): boolean {
    if (this.isBrowser()) {
      const authStatus = localStorage.getItem(this.AUTH_KEY);
      return authStatus === 'true';
    }
    return false;
  }

  isAvailable(email: string): Observable<{ isAvailable: boolean }> {
    const isAvailable = email !== this.mockUserData.email;
    return of({ isAvailable }).pipe(delay(1000));
  }

  private getSavedUser(): any {
    if (this.isBrowser()) {
      const savedUser = localStorage.getItem(this.USER_KEY);
      return savedUser ? JSON.parse(savedUser) : this.mockUserData;
    }
    return null;
  }
}
