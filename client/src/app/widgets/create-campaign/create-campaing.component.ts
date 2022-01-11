import { Component, Inject, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbDialogRef, NbToastrService } from "@nebular/theme";
import { Campaign } from "../../models/class/campaign";
import { DataManagement } from "../../models/class/data_management";
import { CampaignEnum } from "../../models/enumerations/campaign";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "ngx-create-campaing",
  templateUrl: "./create-campaing.component.html",
  styleUrls: ["./create-campaing.component.scss"],
})
export class CreateCampaingComponent implements OnInit {
  @Input() operation: string;
  @Input() campaign: Campaign;

  public campaingForm: FormGroup;
  public enum = [];

  constructor(
    private fb: FormBuilder,
    public ref: NbDialogRef<CreateCampaingComponent>,
    private toastrService: NbToastrService,
    private dataManagement: DataManagement
  ) {}

  // Getter for the view to be able to see form's values
  get name() {
    return this.campaingForm.get("name");
  }
  get type() {
    return this.campaingForm.get("type");
  }

  getEnum() {
    const keys = Object.keys(CampaignEnum);
    return keys.slice(keys.length / 2);
  }

  ngOnInit(): void {
    if (!this.campaign && this.operation == "edit") {
      this.toastrService.danger(
        "Si è verificato un errore in fase di modifica, riprova",
        "Siamo spiacenti:"
      );
      this.ref.close(false);
    }
    this.enum = this.getEnum();
    this.campaingForm = this.fb.group({
      _id: [this.campaign ? this.campaign.id : ""],
      name: [this.campaign ? this.campaign.name : "", Validators.required],
      type: [this.campaign ? this.campaign.type : [], Validators.required],
    });
  }

  public submit(): void {
    if (this.operation == "create") {
      this.dataManagement.createCampaignApi(this.campaingForm.value).subscribe(
        () => {
          this.ref.close(true);
        },
        (error) => {
          console.log(error);
          this.toastrService.danger(
            "Creazione campagna fallita",
            "Si è verificato un errore:"
          );
        }
      );
    } else {
      this.dataManagement.editCampaignApi(this.campaingForm.value).subscribe(
        () => {
          this.ref.close(true);
        },
        (error) => {
          console.log(error);
          this.toastrService.danger(
            "Modifica campagna fallita",
            "Si è verificato un errore:"
          );
        }
      );
    }
  }
}
