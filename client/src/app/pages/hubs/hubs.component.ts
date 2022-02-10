import { Component } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { NbToastrService } from "@nebular/theme";
import { DataManagement } from "../../models/class/data_management";
import { Hub } from "../../models/class/hub";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "ngx-hubs",
  styleUrls: ["./hubs.component.scss"],
  templateUrl: "./hubs.component.html",
})
export class HubsComponent {
  public dataSource;
  public displayedColumns: string[] = ["name", "city", "address", "maps"];
  public hubs: Hub[];

  constructor(
    private authService: AuthService,
    private toastrService: NbToastrService,
    private dataManagement: DataManagement
  ) {
    if (this.authService.getAccessToken == null) {
      this.authService.logout();
    }
    this.hubs = this.dataManagement.hubs;
    console.log(this.hubs);
    if (!this.dataManagement.isDoneApi.hubs) {
      this.dataManagement.getHubsApi().subscribe(
        (response) => {
          this.dataSource = new MatTableDataSource(response);
          this.toastrService.success("", "Ambulatori caricati correttamente!");
        },
        (error) => {
          console.log(error);
          this.toastrService.danger(
            "Caricamento ambulatori non riuscito",
            "Si è verificato un errore:"
          );
        }
      );
    } else {
      this.dataSource = new MatTableDataSource(this.hubs);
    }
  }
}
