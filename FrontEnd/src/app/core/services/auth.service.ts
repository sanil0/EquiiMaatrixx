import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

export interface LoginResponse {
  token: string;
  role: string;
  employeeId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7132/api/auth/login';
  private logoutUrl = 'https://localhost:7132/api/auth/logout';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string, role: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl, {
      email,
      password,
      role
    });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const decoded: any = jwtDecode(token);
      return decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    } catch {
      return null;
    }
  }

  getUserName(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const decoded: any = jwtDecode(token);
      return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    } catch {
      return null;
    }
  }

  getUserEmail(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const decoded: any = jwtDecode(token);
      // Standard email claim
      return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || decoded.email || null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      return exp > currentTime;
    } catch {
      return false;
    }
  }

  logout() {
    // Call backend logout FIRST while token is still in localStorage
    this.http.post(this.logoutUrl, {}).subscribe({
      next: () => {
        console.log('Backend logout successful');
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log('Backend logout error:', error);
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }
}