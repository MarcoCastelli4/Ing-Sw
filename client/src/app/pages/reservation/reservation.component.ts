import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { ApiService } from '../../services/api.service';
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
  public reservations;
  public calendarCellComponent = CalendarCellComponent;
  public data = new Date();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService
  ) {

    this.apiService.getHubs().subscribe(
      (res) => { 
        this.hubs = res;
        console.log(res)
        this.toastrService.success("Ambulatori caricati correttamente", "Operazione avvenuta con successo:");
      },
      (err) => { 
        this.toastrService.danger("Caricamento ambulatori fallito", "Si è verificato un errore:");
        console.log(err) 
      }
    )
    //this.apiService.getSlots().subscribe(
    //  (res) => { console.log(res) },
    //  (err) => { console.log(err) }
    //)
  }

  get campaign() { return this.reservationForm.get('campaign') }
  get hub() { return this.reservationForm.get('hub') }
  get date() { return this.reservationForm.get('date') }
  get slot() { return this.reservationForm.get('slot') }
  get quantity() { return this.reservationForm.get('quantity') }

  ngOnInit(): void {
  }

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

  public getSlots(_id: string){
    this.apiService.getSlots(_id).subscribe(
      (res) => { 
        this.reservations = res;
        console.log(res)
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
