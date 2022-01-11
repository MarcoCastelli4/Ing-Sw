import { ChangeDetectorRef, Component } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import {
  NbDialogService,
  NbToastrService,
} from "@nebular/theme";
import { DataManagement } from "../../models/class/data_management";
import { AuthService } from "../../services/auth.service";
import { ConfirmNotificationComponent } from "../../widgets/confirm-notification/confirm-notification.component";
import { ConfirmComponent } from "../../widgets/confirm/confirm.component";
import { CreateCampaingComponent } from "../../widgets/create-campaign/create-campaing.component";

@Component({
  selector: "ngx-dashboard",
  styleUrls: ["./dashboard.component.scss"],
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent {
  public campaigns = [];
  public dataSource;
  public userRole: string =
    this.dataManagement.userRole ?? localStorage.getItem("userRole");
  public displayedColumns: string[] = ["name", "type", "actions"];
  public citizen;
  
  constructor(
    private authService: AuthService,
    private toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public changeDetector: ChangeDetectorRef,
    private router: Router,
    private dataManagement: DataManagement
  ) {
    if (this.authService.getAccessToken == null) {
      this.authService.logout();
    }
    if (this.userRole == "Citizen") {
      this.citizen = this.dataManagement.citizen;
      if (!this.dataManagement.isDoneApi.citizen) {
        this.dataManagement.getCitizenApi().subscribe(
          (response) => {
            this.citizen = response;
            //TODO da verificare
            this.userRole = "Citizen";
            this.toastrService.success("", "Utente caricato correttamente!");
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
    } else if (!this.userRole)
      // Dati corrotti, è necessario ri-eseguire il login
      this.authService.logout();

    this.campaigns = this.dataManagement.campaigns;
    if (!this.dataManagement.isDoneApi.campaigns) {
      this.dataManagement.getCampaignsApi().subscribe(
        (response) => {
          this.dataSource = new MatTableDataSource(response);
          this.campaigns = response;
          changeDetector.detectChanges();
          this.toastrService.success(
            "",
            "Campagne caricate correttamente!"
          );
        },
        (error) => {
          console.log(error);
          this.toastrService.danger(
            "Caricamento campagne non riuscito",
            "Si è verificato un errore:"
          );
        }
      );
    } else {
      this.dataSource = new MatTableDataSource(this.campaigns);
    }
    console.log(this.campaigns);
  }

  public create(): void {
    this.dialogService
      .open(CreateCampaingComponent, {
        context: {
          operation: "create",
        },
      })
      .onClose.subscribe((res) => {
        // se res è true (creazione andata a buon fine), aggiorna la tabella
        if (res) {
          this.toastrService.success("", "Campagna creata correttamente!");
          this.campaigns = this.dataManagement.campaigns;
          this.dataSource = new MatTableDataSource(this.campaigns);
        }
      });
  }

  public edit(_id: string): void {
    let campaign = this.campaigns.filter((x) => x._id === _id)[0];
    localStorage.setItem("campaign", JSON.stringify(campaign));
    this.dialogService
      .open(CreateCampaingComponent, {
        context: {
          operation: "edit",
          campaign: campaign,
        },
      })
      .onClose.subscribe((res) => {
        if (res) {
          //TODO Verificare la chiusura del modal di modifica
          this.toastrService.success("", "Campagna modificata correttamente!");
          this.campaigns = this.dataManagement.campaigns;
          this.dataSource = new MatTableDataSource(this.campaigns);
        }
      });
  }

  public delete(_id: string): void {
    this.dialogService
      .open(ConfirmComponent, {
        context: {
          name: "a campagna",
        },
      })
      .onClose.subscribe((res) => {
        if (res) {
          this.dataManagement.deleteCampaignApi(_id).subscribe(
            () => {
              this.toastrService.success(
                "",
                "Campagna eliminata correttamente!"
              );
              this.campaigns = this.dataManagement.campaigns;
              this.dataSource = new MatTableDataSource(this.campaigns);
            },
            (error) => {
              console.log(error);
              this.toastrService.danger(
                "Cancellazione campagna non riuscita",
                "Si è verificato un errore:"
              );
            }
          );
        }
      });
  }

  public reserve(id: string): void {
    this.router.navigate(["/pages/reservation"], { queryParams: { id: id } });
  }

  public checkType(row): boolean {
    if (Object.values(row.type).includes(this.citizen?.type)) {
      row.disable = true;
      return true;
    }
    else {
      row.disable = false;
      return false;
    }
  }

  public notify(_id: string, on: boolean): void {
    this.dialogService.open(ConfirmNotificationComponent).onClose.subscribe((res) => {
      
      // ha cliccato su si
      if (res) {
        this.dataManagement.notification(_id, on).subscribe(
          () => {
            this.toastrService.success(
              "",
              "Ora sei nella mailing list di questa campagna!"
            );
          },
          (error) => {
            console.log(error);
            this.toastrService.danger(
              "Caricamento campagne non riuscito",
              "Si è verificato un errore:"
            );
          }
        );
      }
    });
  }
}
