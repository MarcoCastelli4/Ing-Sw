import { Component } from '@angular/core';
import { NbLoginComponent } from '@nebular/auth';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
})
export class LoginComponent extends NbLoginComponent {

  private apiService;
  private authService;

  ngOnInit() {
    this.user.email = "antonelgabor@gmail.com";
    this.user.password = "Eskere..99";
    this.apiService = ApiService.injector.get(ApiService)
    this.authService = AuthService.injector.get(AuthService)
  }

  login() {
    this.apiService.login({ email: this.user.email, password: this.user.password }).subscribe(
      (response) => {
        this.authService.setAccessToken(response.accessToken);
        this.authService.setRefreshToken(response.refreshToken);
        localStorage.setItem("email", this.user.email);
        this.showMessages.success = true;
        this.messages.push("Login completed successfully")
        //location.href = "/pages/dashboard"
      },
      (error) => {
        this.showMessages.error = true;
        this.errors.push("Something went wrong");
        console.log(error);
      }
    );
  }
}