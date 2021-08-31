import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import { CalendarCellComponent } from './calendar-cell/calendar-cell.component';
import { CreateReservationComponent } from './create-reservation/create-reservation.component';

@Component({
  selector: 'ngx-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
  entryComponents: [CalendarCellComponent]
})
export class ReservationComponent implements OnInit {

  public reservationForm: FormGroup;
  public hubs;
  public userRole: string;
  public reservations;
  public calendarCellComponent = CalendarCellComponent;
  public data = new Date();

  public slots = [];

  constructor(
    private apiService: ApiService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private dataService: DataService
  ) {

    this.apiService.getHubs().subscribe(
      (res) => {
        this.hubs = res.hubs;
        this.userRole = res.role;
        this.toastrService.success("Ambulatori caricati correttamente", "Operazione avvenuta con successo:");
      },
      (err) => {
        this.toastrService.danger("Caricamento ambulatori fallito", "Si è verificato un errore:");
        console.log(err)
      }
    )
  }

  get campaign() { return this.reservationForm.get('campaign') }
  get hub() { return this.reservationForm.get('hub') }
  get date() { return this.reservationForm.get('date') }
  get slot() { return this.reservationForm.get('slot') }
  get quantity() { return this.reservationForm.get('quantity') }

  ngOnInit(): void { }

  public createSlot() {
    this.dialogService.open(CreateReservationComponent, {
      context: {
        hubs: this.hubs
      }
    }).onClose.subscribe(res => {
      if (res) {
        console.log(res);
      }
    })
  }

  public getSlots(_id: string) {
    this.slots = [];
    this.apiService.getSlots(_id).subscribe(
      (res) => {
        this.reservations = res;
        this.reservations.forEach(x => {
          if (x.date > Date.now()) {
            this.slots.push(x)
          }
        });
        this.dataService.sendSlots(this.slots)

        this.toastrService.success("Ambulatori caricati correttamente", "Operazione avvenuta con successo:");
      },
      (err) => {
        this.toastrService.danger("Caricamento ambulatori fallito", "Si è verificato un errore:");
        console.log(err)
      }
    )
  }

  public exit() { }

}
