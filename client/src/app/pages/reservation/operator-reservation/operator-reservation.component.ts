import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { Campaign } from '../../../models/class/campaign';
import { Hub } from '../../../models/class/hub';
import { ApiService } from '../../../services/api.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'ngx-operator-reservation',
  templateUrl: './operator-reservation.component.html',
  styleUrls: ['./operator-reservation.component.scss']
})
export class OperatorReservationComponent implements OnInit {

  @Input() hubs: Hub[];

  public reservationForm: FormGroup;
  public campaigns: Campaign[];
  public slotsSelect = this.dataService.slotsSelect;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastrService: NbToastrService,
    private ref: NbDialogRef<OperatorReservationComponent>,
    public dataService: DataService

  ) {
    this.apiService.getCampaigns().subscribe(
      (res) => {
        this.campaigns = res;
        //this.toastrService.success("Campagne caricate correttamente", "Operazione avvenuta con successo:");
      },
      (err) => {
        console.log(err)
        //this.toastrService.danger("Caricamento campagne non riuscito", "Si è verificato un errore:");
      }
    );

    this.reservationForm = this.fb.group({
      campaign_id: ["", Validators.required],
      hub_id: ["", Validators.required],
      date: [new Date(Date.now()), Validators.required],
      slots: [[], Validators.required],
      quantity: [0, Validators.required],
    })
  }

  get campaign_id() { return this.reservationForm.get('campaign_id') }
  get hub_id() { return this.reservationForm.get('hub_id') }
  get date() { return this.reservationForm.get('date') }
  get slots() { return this.reservationForm.get('slots') }
  get quantity() { return this.reservationForm.get('quantity') }

  ngOnInit(): void { }

  public submit() {
    console.log("Log form: ", this.reservationForm.value);
    this.reservationForm.value.date = (this.reservationForm.value.date).getTime();
    this.reservationForm.value.campaign_id = location.href.split("=")[1];
    this.apiService.postSlot(this.reservationForm.value).subscribe(
      (response) => {
        this.toastrService.success("Slot inseriti correttamente", "Operazione avvenuta con successo:");
        // Alla chiusura ritorna true per far ricaricare gli hubs
        this.ref.close(true);
      },
      (error) => {
        console.log(error)
        this.toastrService.danger("Inserimento slot fallito", "Si è verificato un errore:");
      }
    );
  }
  public exit() {
    this.ref.close();
  }

}
