import { Component } from '@angular/core';
import { NbRegisterComponent } from '@nebular/auth';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
})
export class RegisterComponent extends NbRegisterComponent {
    private apiService;
    private authService;

    ngOnInit() {
        this.user.email = "antonelgabor@gmail.com";
        this.user.fcCode = "GBRNNL99A04Z129A"
        this.user.birthplace = "Verona"
        this.user.password = "Password..99";
        this.user.confirmPassword = "Password..99";
        this.user.birthday = new Date("Jan 1 1970");

        if (localStorage.getItem("accessToken"))
            location.href = "/pages/dashboard"

        this.apiService = ApiService.injector.get(ApiService)
        this.authService = AuthService.injector.get(AuthService)
    }

    public checkBirthDate(): boolean {
        if (this.user.birthday && (Date.now() > Date.parse(this.user.birthday)))
            return true;
        else
            return false;
    }

    register() {
        this.apiService.signUp(this.user).subscribe(
            (response) => {
                this.authService.setAccessToken(response.accessToken);
                this.authService.setRefreshToken(response.refreshToken);
                localStorage.setItem("email", this.user.email);
                localStorage.setItem("user_type", "Citizen")
                this.showMessages.success = true;
                this.messages.push("")
                console.log(response.user)
                //this.authService.citizen = new Citizen(response.user);
                //localStorage.setItem("citizen", JSON.stringify(this.authService.citizen))
                //TODO open modal con categoria di appartenenza
                
                location.href = "/pages/dashboard"
            },
            (error) => {
                console.log(error);
                this.showMessages.error = true;

                if (error.error.message == "BadRequestError: fcCode is not recorded in the DB")
                    this.errors.push("Codice fiscale non presente nel sistema, contattaci ad assistenza@prenotazioni.gov.it")
                else if (error.error.message == "BadRequestError: Email already in use")
                    this.errors.push("Email già utilizzata");
                else if (error.error.message == "BadRequestError: Citizen already registered") {
                    this.errors.push("Registrazione già effettuata");
                    location.href = "/auth/login"
                } else
                    this.errors.push("Riprova più tardi")
            }
        );
    }
}