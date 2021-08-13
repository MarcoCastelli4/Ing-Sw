import { Component } from '@angular/core';
import { NbLoginComponent } from '@nebular/auth';
import { Citizen } from '../../../models/class/citizen';
import { Operator } from '../../../models/class/operator';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends NbLoginComponent {

  private apiService;
  private authService;
  //Varibabile funzionale per la vista, serve a mostrare come input email se è true e codice operatore se false
  public citizen: boolean = true;

  ngOnInit() {
    this.user.email = "antonelgabor@gmail.com";
    this.user.password = "Password..99";
    this.apiService = ApiService.injector.get(ApiService)
    this.authService = AuthService.injector.get(AuthService)

    if(localStorage.getItem("accessToken"))
      location.href = "/pages/dashboard"
  }

  login() {
    this.apiService.login({ email: this.user.email, password: this.user.password, opCode: this.user.opCode }).subscribe(
      (response) => {

        if(this.user.email)
          this.authService.citizen = new Citizen(response.user);
        else
          this.authService.operator = new Operator(response.user);
        
        console.log(this.authService.citizen)
        console.log(this.authService.operator)
        this.authService.setAccessToken(response.accessToken);
        this.authService.setRefreshToken(response.refreshToken);
        this.showMessages.success = true;
        this.messages.push("")
        location.href = "/pages/dashboard"
      },
      (error) => {
        this.showMessages.error = true;
        console.log(error.error.message)
        if(error.error.message == "BadRequestError: Wrong password")
          this.errors.push("Password errata");
        else if(error.error.message == "BadRequestErrorUser does not exist")
          this.errors.push("L'utente non esiste");
        else
          this.errors.push("Riprova più tardi");
        
        console.log(error);
      }
    );
  }
}