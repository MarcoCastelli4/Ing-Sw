import { ChangeDetectorRef, Component } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import {
  NbDialogService,
  NbToastrService,
} from "@nebular/theme";
import { DataManagement } from "../../models/class/data_management";
import { ApiService } from "../../services/api.service";
import { AuthService } from "../../services/auth.service";
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
  public userRole: string;
  public displayedColumns: string[] = ["name", "type", "totQty", "actions"];
  public citizen;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public changeDetector: ChangeDetectorRef,
    private router: Router,
    private dataManagement: DataManagement
  ) {
    if (this.authService.getAccessToken == null) {
      this.authService.logout();
    }
    this.userRole = "Citizen";
    this.citizen = this.dataManagement.citizen;
    if (!this.dataManagement.isDoneApi.citizen) {
      this.dataManagement.getCitizenApi().subscribe(
        (response) => {
          this.citizen = response;
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
    }

    this.campaigns = this.dataManagement.campaigns;
    if (!this.dataManagement.isDoneApi.campaigns) {
      this.dataManagement.getCampaignsApi().subscribe(
        (response) => {
          this.dataSource = new MatTableDataSource(response);
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
  }

  public createCampaign(): void {
    this.dialogService
      .open(CreateCampaingComponent, {
        context: {
          operation: "create",
        },
      })
      .onClose.subscribe((res) => {
        if (res) {
          //TODO Verificare la chiusura del modal createCampaign
          //res = this.enumToString(res);
          this.campaigns.push(res);
          this.dataSource = new MatTableDataSource(this.campaigns);
        }
      });
  }

  public checkType(element) {
    if (Object.values(element.type).includes(this.citizen?.type))
      return true;
    else
      return false;
  }

  public edit(_id: string): void {
    let campaign = this.campaigns.filter((x) => x._id === _id)[0];
    localStorage.setItem("campaign", JSON.stringify(campaign));
    this.dialogService
      .open(CreateCampaingComponent, {
        context: {
          operation: "edit",
        },
      })
      .onClose.subscribe((res) => {
        if (res) {
          //TODO Verificare la chiusura del modal di modifica
          //res = this.enumToString(res);
          this.campaigns.forEach((x) => {
            if (x._id === res._id) {
              let index = this.campaigns.indexOf(x);
              this.campaigns[index] = res;
            }
          });
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
          this.apiService.deleteCampaign(_id).subscribe(
            (response) => {
              this.campaigns.forEach((x, i) => {
                if (x._id === response) this.campaigns.splice(i, 1);
              });
              this.dataSource = new MatTableDataSource(this.campaigns);
              this.toastrService.success(
                "Campagna eliminata correttamente",
                "Operazione avvenuta con successo:"
              );
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

  public reserve(id: string) {
    this.router.navigate(["/pages/reservation"], { queryParams: { id: id } });
  }
}
