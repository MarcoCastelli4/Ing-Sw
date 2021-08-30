import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NbDialogService, NbSortDirection, NbSortRequest, NbToastrService, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ConfirmComponent } from '../../widgets/confirm/confirm.component';
import { CreateCampaingComponent } from '../../widgets/create-campaign/create-campaing.component';


@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})

export class DashboardComponent {

  public campaigns = [];
  public dataSource;
  public userRole: string;
  public displayedColumns: string[] = ["name", "type", "totQty", "actions"];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private toastrService: NbToastrService,
    public dialogService: NbDialogService,
    public changeDetector: ChangeDetectorRef
  ) {
    if (this.authService.getAccessToken == null) {
      this.authService.logout();
    }

    this.apiService.getCampaigns().subscribe(
      (response) => {
        this.userRole = response.role; 
        response.campaigns.forEach(element => {
          element = this.enumToString(element);
          this.campaigns.push(element);
        });
        this.dataSource = new MatTableDataSource(this.campaigns)
        this.toastrService.success("Campagne caricate correttamente", "Operazione avvenuta con successo:");
      },
      (error) => {
        console.log(error)
        this.toastrService.danger("Caricamento campagne non riuscito", "Si è verificato un errore:");
      }
    );
  }

  public createCampaign(): void {
    this.dialogService.open(CreateCampaingComponent, {
      context: {
        operation: "create"
      }
    }).onClose.subscribe(res => {
      if (res) {
        res = this.enumToString(res);
        this.campaigns.push(res);
        this.dataSource = new MatTableDataSource(this.campaigns)
      }
    })
  }

  public edit(_id: string): void {
    let campaign = this.campaigns.filter(x => x._id === _id)[0]
    localStorage.setItem("campaign", JSON.stringify(campaign))
    this.dialogService.open(CreateCampaingComponent, {
      context: {
        operation: "edit",
      }
    }).onClose.subscribe(res => {
      if (res) {
        res = this.enumToString(res);
        this.campaigns.forEach(x => {
          if (x._id === res._id) {
            let index = this.campaigns.indexOf(x);
            this.campaigns[index] = res;
          }
        });
        this.dataSource = new MatTableDataSource(this.campaigns)
      }
    })

  }

  public delete(_id: string): void {
    this.dialogService.open(ConfirmComponent, {
      context: {
        name: "a campagna"
      }
    }).onClose.subscribe(
      res => {
        if (res) {
          this.apiService.deleteCampaign(_id).subscribe(
            response => {
              this.campaigns.forEach((x, i) => {
                if (x._id === response)
                  this.campaigns.splice(i, 1)
              })
              this.dataSource = new MatTableDataSource(this.campaigns)
              this.toastrService.success("Campagna eliminata correttamente", "Operazione avvenuta con successo:");
            },
            error => {
              console.log(error);
              this.toastrService.danger("Cancellazione campagna non riuscita", "Si è verificato un errore:");
            }
          )
        }
      }
    )
  }

  public enumToString(element): any {
    let stringType = "";
    element.type.forEach(x => {
      if (stringType != "")
        stringType = stringType + ",\n" + x
      else
        stringType = x;
    });
    element.type = stringType;
    return element;
  }

  public reserve(id: string){
    location.href = "/pages/reservation?id=" + id;
  }
}