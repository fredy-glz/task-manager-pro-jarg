import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthResponse, LoginPayload, RegisterPayload, User } from '../models/auth.types';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  iat?: number;
  exp?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/auth';

  login(payload: LoginPayload) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload);
  }

  register(payload: RegisterPayload) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload);
  }

  saveSession(token: string) {
    const decoded = jwtDecode<TokenPayload>(token);

    const user: User = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');

    if (!user) {
      return null;
    }

    return JSON.parse(user) as User;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}
