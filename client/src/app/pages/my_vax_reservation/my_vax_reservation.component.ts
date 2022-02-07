import { Component } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { NbToastrService } from "@nebular/theme";
import { DataManagement } from "../../models/class/data_management";
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
    private authService: AuthService,
    private toastrService: NbToastrService,
    private dataManagement: DataManagement,

  ) {
    if (this.authService.getAccessToken == null) {
      this.authService.logout();
    }
    //ottengo il mio cittadino con le sue prenotazioni 
    this.citizen = this.dataManagement.citizen;
    if (!this.dataManagement.isDoneApi.citizen) {
      this.dataManagement.getCitizenApi().subscribe(
        (response) => {
          this.citizen = response;
          this.dataSource = new MatTableDataSource(this.citizen);
          this.toastrService.success(
            "",
            "Utente caricato correttamente!"
          );
        },
        (error) => {
          console.log(error);
          this.toastrService.danger(
            "Caricamento utente non riuscito",
            "Si è verificato un errore:"
          );
        }
      );
    }else{
      this.dataSource = new MatTableDataSource(this.citizen);
    }
  }
}
