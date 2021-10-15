import { Component } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { NbToastrService } from "@nebular/theme";
import { ApiService } from "../../services/api.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "ngx-my_vax_reservation",
  styleUrls: ["./my_vax_reservation.component.scss"],
  templateUrl: "./my_vax_reservation.component.html",
})
export class my_vax_reservationComponent {
  public dataSource;
  public displayedColumns: string[] = ["campaign", "hub", "date", "timeSlot"];  //my reservation has name campaign, hub name, date and time slot
  public citizen;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private toastrService: NbToastrService
    
  ) {
    if (this.authService.getAccessToken == null) {
      this.authService.logout();
    }

    //ottengo il mio cittadino con le sue prenotazioni 
    this.apiService.getCitizen().subscribe(
      (response) => {
        this.citizen = response;
        console.log(this.citizen); //togliere
        this.dataSource = new MatTableDataSource(this.citizen.reservations);
        //Da settare il timestamp
        //let month = this.date.getMonth() + 1;
        //this.showDate = this.date.getDate() + '/' + month + '/' + this.date.getFullYear();
      },
      (error) => {
        console.log(error);
        this.toastrService.danger(
          "Caricamento utente non riuscito",
          "Si è verificato un errore:"
        );
      }
    );
  }
}
