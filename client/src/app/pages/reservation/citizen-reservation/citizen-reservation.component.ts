import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { DataManagement } from '../../../models/class/data_management';
import { Slot } from '../../../models/class/slot';
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
    private toastrService: NbToastrService,
    private ref: NbDialogRef<CitizenReservationComponent>,
    private dataManagement: DataManagement,
    public dataService: DataService
  ) {
    this.reservationForm = this.fb.group({
      slot: ["", Validators.required],
    })
  }

  get slot() { return this.reservationForm.get('slot') }

  ngOnInit(): void {
    let month = this.date.getMonth() + 1;
    this.showDate = this.date.getDate() + '/' + month + '/' + this.date.getFullYear();
  }

  public submit() {
    let campaign_id = location.href.split("=")[1];
    let request = {
      id:"",
      campaign_id: campaign_id,
      hub_id: this.hub_id,
      date: this.date.getTime(),
      slot: this.reservationForm.value.slot,
      user_ids: [],
      quantity: 0
    }
    
    this.dataManagement.createReservation(new Slot(request)).subscribe(
      () => {
        this.toastrService.success("", "Prenotazione effettuata correttamente!");
        this.ref.close();
      },
      (error) => {
        console.log(error)
        if (error.error.message == "BadRequestError: User already reserved a vaccine for this campaign")
          this.toastrService.danger("Hai già prenotato un vaccino per questa campagna", "Si è verificato un errore:");
        else
          this.toastrService.danger("Prenotazione fallita", "Si è verificato un errore:");
      }
    )
  }
  public exit() {
    this.ref.close();
  }
}
