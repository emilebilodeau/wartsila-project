import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { SurveyStateService } from '../state/survey-state.service';

@Injectable({ providedIn: 'root' })
// service for login and register page
export class AuthService {
  private baseUrl = 'http://localhost:8800/api';

  constructor(
    private http: HttpClient,
    private surveyState: SurveyStateService
  ) {}

  register(email: string, password: string) {
    return this.http.post(`${this.baseUrl}/register`, { email, password });
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, {
      email,
      password,
    });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.surveyState.setSurvey(null);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      const now = Math.floor(Date.now() / 1000);
      return exp < now;
    } catch {
      return true; // assume invalid if decode fails
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    if (this.isTokenExpired(token)) {
      this.logout();
      return false;
    }
    return true;
  }
}
