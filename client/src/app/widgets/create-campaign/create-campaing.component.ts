import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbDialogRef, NbToastrService } from "@nebular/theme";
import { DataManagement } from "../../models/class/data_management";
import { CampaignEnum } from "../../models/enumerations/campaign";

@Component({
  selector: "ngx-create-campaing",
  templateUrl: "./create-campaing.component.html",
  styleUrls: ["./create-campaing.component.scss"],
})
export class CreateCampaingComponent implements OnInit {
  @Input() operation: string;

  campaign: any;
  public campaingForm: FormGroup;
  public enum = [];

  constructor(
    private fb: FormBuilder,
    public ref: NbDialogRef<CreateCampaingComponent>,
    private toastrService: NbToastrService,
    private dataManagement: DataManagement
  ) {
    this.campaign = JSON.parse(localStorage.getItem("campaign"));
    localStorage.removeItem("campaign");
    if (!this.campaign && this.operation == "edit") {
      this.toastrService.danger(
        "Si è verificato un errore in fase di modifica, riprova",
        "Siamo spiacenti:"
      );
      this.ref.close(false);
    }
    const res = this.campaign?.type.split(",\n");
    this.enum = this.getEnum();
    this.campaingForm = this.fb.group({
      _id: [this.campaign?._id ? this.campaign?._id : ""],
      name: [
        this.campaign?.name ? this.campaign?.name : "",
        Validators.required,
      ],
      type: [res ? res : [], Validators.required],
    });
  }

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

  ngOnInit(): void { }

  public submit() {
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
      )
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
      )
    }
  }
}
