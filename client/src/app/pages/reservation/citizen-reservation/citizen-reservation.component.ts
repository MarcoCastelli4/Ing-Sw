import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { ApiService } from '../../../services/api.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'ngx-citizen-reservation',
  templateUrl: './citizen-reservation.component.html',
  styleUrls: ['./citizen-reservation.component.scss']
})
export class CitizenReservationComponent implements OnInit {
  @Input() date: Date;
  @Input() hub_id: string;
  @Input() slots: [];

  public reservationForm: FormGroup;
  public showDate: string;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastrService: NbToastrService,
    private ref: NbDialogRef<CitizenReservationComponent>,
    public dataService: DataService

  ) {
    //this.showDate = this.date.getDate() + "/" + this.date.getMonth() + "/" + this.date.getFullYear()
    this.reservationForm = this.fb.group({
      slot: ["", Validators.required],
    })
  }

  get slot() { return this.reservationForm.get('slot') }

  ngOnInit(): void { }

  public submit() {
    let campaign_id = location.href.split("=")[1];
    let request = {
      campaign_id: campaign_id,
      hub_id: this.hub_id,
      date: this.date.getTime(),
      slot: this.reservationForm.value.slot
    }
    this.apiService.postReservation(request).subscribe(
      (response) => {
        this.toastrService.success("Prenotazione effettuata correttamente", "Operazione avvenuta con successo:");
        this.ref.close();
      },
      (error) => {
        console.log(error)
        if(error.error.message=="BadRequestError: User already reserved a vaccine for this campaign")
          this.toastrService.danger("Hai già prenotato un vaccino per questa campagna", "Si è verificato un errore:");
        else 
          this.toastrService.danger("Prenotazione fallita", "Si è verificato un errore:");
      }
    );
  }
  public exit() {
    this.ref.close();
  }
}
