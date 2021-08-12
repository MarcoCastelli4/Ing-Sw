import { Component, ComponentFactoryResolver } from '@angular/core';
import { NbRegisterComponent } from '@nebular/auth';
import { NbDateService } from '@nebular/theme';
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
        console.log(this.user.birthday)

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
                this.showMessages.success = true;
                this.messages.push("Ben fatto")
                console.log("Success")
                //TODO open modal con categoria di appartenenza
                //location.href = "/pages/dashboard"
            },
            (error) => {
                this.showMessages.error = true;
                this.errors.push("Riprova più tardi")
                console.log(error);
            }
        );
    }
}