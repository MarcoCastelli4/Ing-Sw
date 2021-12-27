import { Component } from "@angular/core";
import { NbLoginComponent } from "@nebular/auth";
import { DataManagement } from "../../../models/class/data_management";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["../auth.scss"],
})
export class LoginComponent extends NbLoginComponent {
  private dataManagement;
  private authService;
  // Varibabile funzionale per la vista, serve a mostrare come input email se è true e codice operatore se false
  public citizen: boolean = true;
  public user: {
    email: string;
    password: string;
  } = {
      email: "antonelgabor@gmail.com",
      password: "Password..99",
    };

  ngOnInit() {
    this.dataManagement = DataManagement.injector.get(DataManagement);
    //TODO da togliere
    this.authService = AuthService.injector.get(AuthService);

    if (localStorage.getItem("accessToken")) location.href = "/pages/dashboard";
  }

  login() {
    this.dataManagement.login({
      email: this.citizen ? this.user.email : "",
      password: this.user.password,
      opCode: !this.citizen ? this.user.email : "",
    }).subscribe(
        (response) => {
          this.authService.setAccessToken(response.accessToken);
          this.authService.setRefreshToken(response.refreshToken);
          this.showMessages.success = true;
          location.href = "/pages/dashboard";
        },
        (error) => {
          this.showMessages.error = true;
          console.log(error.error.message);
          if (error.error.message == "BadRequestError: Wrong password")
            this.errors.push("Password errata");
          else if (error.error.message == "BadRequestErrorUser does not exist")
            this.errors.push("L'utente non esiste");
          else this.errors.push("Riprova più tardi");

          console.log(error);
        }
      );
  }

  public showPassword = false;

  public changeLogin(val: boolean): void {
    this.citizen = val;
    if (this.citizen) {
      this.user = {
        email: "antonelgabor@gmail.com",
        password: "Password..99",
      };
    } else {
      this.user = {
        email: "0001",
        password: "operatore1",
      };
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
