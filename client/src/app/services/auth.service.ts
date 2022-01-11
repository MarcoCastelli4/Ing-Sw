import { Injectable, Injector } from '@angular/core';
import { Citizen } from '../models/class/citizen';
import { Operator } from '../models/class/operator';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  static injector: Injector;

  constructor() { }

  private citizen: Citizen;
  private operator: Operator;
  public type: string;
  public id: string = localStorage.getItem("id");
  public email: string = localStorage.getItem("email");

  public get Citizen(): Citizen{
    return this.citizen;
  }

  public get Operator(): Operator{
    return this.operator;
  }

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
    localStorage.clear();
    location.href = "auth/login"
  }
}
