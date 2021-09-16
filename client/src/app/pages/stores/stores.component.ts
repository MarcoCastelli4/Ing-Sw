import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import {
  NbDialogService,
  NbSortDirection,
  NbSortRequest,
  NbToastrService,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
} from "@nebular/theme";
import { ApiService } from "../../services/api.service";
import { AuthService } from "../../services/auth.service";
import { ConfirmComponent } from "../../widgets/confirm/confirm.component";
import { CreateCampaingComponent } from "../../widgets/create-campaign/create-campaing.component";

@Component({
  selector: "ngx-stores",
  styleUrls: ["./stores.component.scss"],
  templateUrl: "./stores.component.html",
})
export class StoresComponent {
  public campaigns = [];
  public dataSource;
  public userRole: string;
  public displayedColumns: string[] = ["name", "type", "totQty"];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public changeDetector: ChangeDetectorRef,
    private router: Router
  ) {
    if (this.authService.getAccessToken == null) {
      this.authService.logout();
    }

    this.apiService.getCampaigns().subscribe(
      (response) => {
        this.userRole = response.role;
        if (this.userRole !== "Operator") {
          this.router.navigate(["pages/dashboard"]);
        }
        response.campaigns.forEach((element) => {
          element = this.enumToString(element);
          this.campaigns.push(element);
        });
        this.dataSource = new MatTableDataSource(this.campaigns);
        this.toastrService.success(
          "Campagne caricate correttamente",
          "Operazione avvenuta con successo:"
        );
      },
      (error) => {
        this.toastrService.danger(
          "Caricamento campagne non riuscito",
          "Si è verificato un errore:"
        );
      }
    );
  }

  public changeQty(_id: string, toIncrease: boolean): void {
    const campaign = this.campaigns.filter((x) => x._id === _id)[0];
    campaign.totQty += (toIncrease ? 1 : -1) * 50;
    this.apiService.putCampaign(campaign).subscribe(
      (value) => {
        this.toastrService.success(
          "Magazzino aggiornato correttamente",
          "Operazione avvenuta con successo:"
        );
      },
      (error) => {
        this.toastrService.danger(
          "Modifica campagna fallita",
          "Si è verificato un errore:"
        );
      }
    );
  }

  public enumToString(element): any {
    let stringType = "";
    if (Array.isArray(element.type)) {
      element.type.forEach((x) => {
        if (stringType !== "") stringType = stringType + ",\n" + x;
        else stringType = x;
      });
      element.type = stringType;
    }
    return element;
  }
}
