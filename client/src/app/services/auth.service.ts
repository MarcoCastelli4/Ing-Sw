import { Injectable, Injector } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  static injector: Injector;

  constructor() { }

  public id: string = localStorage.getItem("id");
  public email: string = localStorage.getItem("email");

  /// MANAGE REFRESH TOKEN
  private refreshToken: string = localStorage.getItem("refreshToken");

  public setRefreshToken(token: string): void {
    this.refreshToken = token;
    localStorage.setItem("refreshToken", token);
  }

  public get getRefreshToken(): string {
    return this.refreshToken;
  }

  /// MANAGE ACCESS TOKEN
  private accessToken: string = localStorage.getItem("accessToken");

  public setAccessToken(token: string): void {
    localStorage.setItem("accessToken", token);
    this.accessToken = token;
  }

  public get getAccessToken(): string {
    return this.accessToken;
  }

  /// LOGOUT
  public logout(): void {
    this.id = undefined;
    this.email = undefined;
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");
    localStorage.removeItem("id");
    location.href = "auth/login"
  }
}
