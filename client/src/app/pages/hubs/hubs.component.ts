import {Component} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NbToastrService } from '@nebular/theme';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'ngx-hubs',
  styleUrls: ['./hubs.component.scss'],
  templateUrl: './hubs.component.html',
})

export class HubsComponent {

  public dataSource;
  public displayedColumns: string[] = ["name", "city", "address", "actions"];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private toastrService: NbToastrService
    )
  {

    if (this.authService.getAccessToken == null) {
      this.authService.logout();
    }
    this.apiService.getHubs().subscribe(
      (response) => {
        this.dataSource = new MatTableDataSource(response.hubs)
        this.toastrService.success("Ambulatori caricati correttamente", "Operazione avvenuta con successo:");
      },
      (error) => {
        console.log(error)
        this.toastrService.danger("Caricamento ambulatori non riuscito", "Si è verificato un errore:");
      }
    );
  }
}