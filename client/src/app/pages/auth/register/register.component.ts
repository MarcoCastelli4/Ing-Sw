import { Component } from '@angular/core';
import { NbRegisterComponent } from '@nebular/auth';
import { Tokens } from '../../../models/class/auth';
import { DataManagement } from '../../../models/class/data_management';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['../auth.scss']
})
export class RegisterComponent extends NbRegisterComponent {
    private authService;
    private dataManagement;

    ngOnInit() {
        this.user.email = "antonelgabor@gmail.com";
        this.user.fcCode = "GBRNNL99A04Z129A"
        this.user.password = "Password..99";
        this.user.confirmPassword = "Password..99";

        if (localStorage.getItem("accessToken"))
            location.href = "/pages/dashboard"

        this.dataManagement = DataManagement.injector.get(DataManagement)
        this.authService = AuthService.injector.get(AuthService)
    }

    public checkBirthDate(): boolean {
        if (this.user.birthday && (Date.now() > Date.parse(this.user.birthday)))
            return true;
        else
            return false;
    }

    public register(): void {
        this.dataManagement.registerApi(this.user).subscribe(
            (response: Tokens) => {
                this.authService.setAccessToken(response.accessToken);
                this.authService.setRefreshToken(response.refreshToken);
                localStorage.setItem("email", this.user.email);
                localStorage.setItem("userRole", "Citizen")
                this.showMessages.success = true;
                this.messages.push("")
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
    public showPassword = false;
    public showPasswordConfirm = false;

    public getInputType(buttonNumber: number): string {
        if (buttonNumber == 1) {
            if (this.showPassword) {
                return 'text';
            }
            return 'password';
        }
        else if (buttonNumber == 2) {
            if (this.showPasswordConfirm) {
                return 'text';
            }
            return 'password';
        }

    }

    public toggleShowPassword(buttonNumber: number): void {
        if (buttonNumber == 1)
            this.showPassword = !this.showPassword;
        else if (buttonNumber == 2)
            this.showPasswordConfirm = !this.showPasswordConfirm;
    }
}