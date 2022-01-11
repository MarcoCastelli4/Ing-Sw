<<<<<<< HEAD
import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { DataManagement } from "../../models/class/data_management";
import { Hub } from "../../models/class/hub";
import { ApiService } from "../../services/api.service";
import { DataService } from "../../services/data.service";
import { CalendarCellComponent } from "./calendar-cell/calendar-cell.component";
import { OperatorReservationComponent } from "./operator-reservation/operator-reservation.component";
=======
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { DataManagement } from '../../models/class/data_management';
import { Hub } from '../../models/class/hub';
import { Slot } from '../../models/class/slot';
import { DataService } from '../../services/data.service';
import { CalendarCellComponent } from './calendar-cell/calendar-cell.component';
import { OperatorReservationComponent } from './operator-reservation/operator-reservation.component';
>>>>>>> refactor

@Component({
  selector: "ngx-reservation",
  templateUrl: "./reservation.component.html",
  styleUrls: ["./reservation.component.scss"],
  entryComponents: [CalendarCellComponent],
})
export class ReservationComponent implements OnInit {
<<<<<<< HEAD
  public reservationForm: FormGroup;
  public hubs;
=======

  public selectedSlots: Slot[];
  public hubs: Hub[];
>>>>>>> refactor
  public userRole: string;
  public reservationForm: FormGroup;
  public calendarCellComponent = CalendarCellComponent;
  public data = new Date();

  public slots = [];

  constructor(
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

<<<<<<< HEAD
  public getSlots(hub: Hub): void {
    this.slots = [];
    this.apiService.getSlots(hub.id).subscribe(
      (res) => {
        this.reservations = res;
        for (let x of this.reservations) {
          if (x.date > Date.now() && x.availableQty > 0) {
            this.slots.push(x);
=======
  /**
   * Funzione che seleziona gli slot degli hub da mandare alle celle.
   * @param _id id dell'hub degli slot che si vogliono visualizzare
   */

  public getSlots(_id: string): void {
    if (this.userRole == 'Citizen') {
      for (let hub of this.hubs) {
        if (hub._id == _id) {
          for (let slot of hub.slots) {
            if (slot.date > Date.now() && slot.quantity > 0) {
              this.selectedSlots.push(slot)
            }
>>>>>>> refactor
          }
          console.log(this.selectedSlots);
          this.dataService.sendSlots(this.selectedSlots)
        }
<<<<<<< HEAD
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
=======
      }
    } else if (this.userRole == 'Operator') {
      // TODO
    }
>>>>>>> refactor
  }
}
