import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { DataManagement } from "../../models/class/data_management";
import { Hub } from "../../models/class/hub";
import { ApiService } from "../../services/api.service";
import { DataService } from "../../services/data.service";
import { CalendarCellComponent } from "./calendar-cell/calendar-cell.component";
import { OperatorReservationComponent } from "./operator-reservation/operator-reservation.component";

@Component({
  selector: "ngx-reservation",
  templateUrl: "./reservation.component.html",
  styleUrls: ["./reservation.component.scss"],
  entryComponents: [CalendarCellComponent],
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
    private dataService: DataService,
    private dataManagement: DataManagement
  ) {
    this.hubs = this.dataManagement.hubs;
    if (!this.dataManagement.isDoneApi.hubs) {
      this.dataManagement.getHubsApi().subscribe(
        (response) => {
          this.hubs = response;
          this.userRole = this.dataManagement.userRole;
          this.toastrService.success("", "Ambulatori caricati correttamente!");
        },
        (error) => {
          console.log(error);
          this.toastrService.danger(
            "Caricamento ambulatori non riuscito",
            "Si è verificato un errore:"
          );
        }
      );
    }
  }

  get campaign() {
    return this.reservationForm.get("campaign");
  }
  get hub() {
    return this.reservationForm.get("hub");
  }
  get date() {
    return this.reservationForm.get("date");
  }
  get slot() {
    return this.reservationForm.get("slot");
  }
  get quantity() {
    return this.reservationForm.get("quantity");
  }

  ngOnInit(): void {}

  public createSlot(): void {
    this.dialogService
      .open(OperatorReservationComponent, {
        context: {
          hubs: this.hubs,
        },
      })
      .onClose.subscribe((res) => {
        if (res) {
        }
      });
  }

  public getSlots(hub: Hub): void {
    this.slots = [];
    this.apiService.getSlots(hub.id).subscribe(
      (res) => {
        this.reservations = res;
        for (let x of this.reservations) {
          if (x.date > Date.now() && x.availableQty > 0) {
            this.slots.push(x);
          }
        }
        this.dataService.sendSlots(this.slots);

        this.toastrService.success(
          "Ambulatori caricati correttamente",
          "Operazione avvenuta con successo:"
        );
      },
      (err) => {
        this.toastrService.danger(
          "Caricamento ambulatori fallito",
          "Si è verificato un errore:"
        );
        console.log(err);
      }
    );
  }
}
