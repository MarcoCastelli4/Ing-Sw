import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { CampaignEnum } from '../../models/enumerations/campaign';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'ngx-create-campaing',
  templateUrl: './create-campaing.component.html',
  styleUrls: ['./create-campaing.component.scss']
})
export class CreateCampaingComponent implements OnInit {

  @Input() operation: string;

  campaign: any;
  public campaingForm: FormGroup;
  public enum = [];

  constructor(
    private fb: FormBuilder,
    public ref: NbDialogRef<CreateCampaingComponent>,
    private apiService: ApiService,
    private toastrService: NbToastrService
  ) {
    this.campaign = JSON.parse(localStorage.getItem("campaign"));
    localStorage.removeItem("campaign");
    if (!this.campaign && this.operation == "edit") {
      this.toastrService.danger("Si è verificato un errore in fase di modifica, riprova", "Siamo spiacenti:");
      this.ref.close(false);
    }
    let res = this.campaign?.type.split(",\n");
    //TODO get hubs from BE
    this.enum = this.getEnum();
    this.campaingForm = this.fb.group({
      _id: [this.campaign?._id ? this.campaign?._id : ""],
      name: [this.campaign?.name ? this.campaign?.name : "", Validators.required],
      totQty: [this.campaign?.totQty ? this.campaign?.totQty : "", Validators.required],
      type: [res ? res : [], Validators.required],
      hubs: [this.campaign?.hubs ? this.campaign?.hubs : ""],
      priority: [this.campaign?.priority ? this.campaign?.priority : "", Validators.required],
    })
  }

  // Getter for the view to be able to see form's values
  get name() { return this.campaingForm.get('name') }
  get totQty() { return this.campaingForm.get('totQty') }
  get type() { return this.campaingForm.get('type') }
  get priority() { return this.campaingForm.get('priority') }

  getEnum() {
    let keys = Object.keys(CampaignEnum);
    return keys.slice(keys.length / 2)
  }

  ngOnInit(): void { }

  public submit() {
    if (this.operation == "create") {
      this.apiService.postCampaign(this.campaingForm.value).subscribe(
        (response) => {
          this.toastrService.success("Campagna creata correttamente", "Operazione avvenuta con successo:");
          let campaign = this.campaingForm.value;
          campaign._id = response
          this.ref.close(campaign);
        },
        (error) => {
          console.log(error)
          this.toastrService.danger("Creazione campagna fallita", "Si è verificato un errore:");
        }
      );
    }else{
      this.apiService.putCampaign(this.campaingForm.value).subscribe(
        (response) => {
          this.toastrService.success("Campagna modificata correttamente", "Operazione avvenuta con successo:");
          this.ref.close(this.campaingForm.value);
        },
        (error) => {
          console.log(error)
          this.toastrService.danger("Modifica campagna fallita", "Si è verificato un errore:");
        }
      );
    }
  }
}
