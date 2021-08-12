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
    public today = new Date;

    ngOnInit() {
        //this.user.email = "antonelgabor@gmail.com";
        //this.user.password = "Eskere..99";
        //this.user.confirmPassword = "Eskere..99";
        this.apiService = ApiService.injector.get(ApiService)
        this.authService = AuthService.injector.get(AuthService)
        console.log(this.today)
        console.log(this.user.birthday)
    }

    register() {
        this.apiService.signUp({ email: this.user.email, password: this.user.password }).subscribe(
            (response) => {
                this.authService.setAccessToken(response.accessToken);
                this.authService.setRefreshToken(response.refreshToken);
                localStorage.setItem("email", this.user.email);
                this.showMessages.success = true;
                this.messages.push("Registration completed successfully")
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