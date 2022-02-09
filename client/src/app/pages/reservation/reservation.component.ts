import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";

import { MatTableDataSource } from "@angular/material/table";
import { NbDialogService, NbToastrService } from "@nebular/theme";
import { DataManagement } from "../../models/class/data_management";
import { Hub } from "../../models/class/hub";
import { Slot } from "../../models/class/slot";
import { CalendarCellComponent } from "./calendar-cell/calendar-cell.component";
import { OperatorReservationComponent } from "./operator-reservation/operator-reservation.component";

@Component({
  selector: "ngx-reservation",
  templateUrl: "./reservation.component.html",
  styleUrls: ["./reservation.component.scss"],
  entryComponents: [CalendarCellComponent],
})
export class ReservationComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public selectedSlots = [];
  public hubs: Hub[];
  public userRole: string;
  public reservationForm: FormGroup;
  public calendarCellComponent = CalendarCellComponent;
  public data = new Date();
  public displayedColumns: string[];
  public dataSource;
  public campaign_id = location.href.split("=")[1];
  public selectedHub = "";

  constructor(
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private dataManagement: DataManagement
  ) {
    this.hubs = this.dataManagement.hubs;
    if (!this.dataManagement.isDoneApi.hubs) {
      this.dataManagement.getHubsApi().subscribe(
        (response) => {
          this.hubs = response;
          this.userRole = this.dataManagement.userRole;
          this.displayedColumns = this.userRole == 'Operator' ? ["day", "slot", "quantity"] : ["day", "slot", "actions"]
          this.toastrService.success("", "Ambulatori caricati correttamente!");
        },
        (error) => {
          this.toastrService.danger(
            "Caricamento ambulatori non riuscito",
            "Si è verificato un errore:"
          );
        }
      );
    } else {
      this.userRole = this.dataManagement.userRole;
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

  ngOnInit(): void { }

  public createSlot(): void {
    this.dialogService
      .open(OperatorReservationComponent, {
        context: {
          hubs: this.hubs,
        },
      })
  }

  /**
   * Funzione che seleziona gli slot degli hub da mandare alle celle.
   * @param inHub hub dell'hub degli slot che si vogliono visualizzare
   */

  public getSlots(inHub: Hub): void {
    this.selectedHub = inHub._id;
    this.selectedSlots = [];
    for (let hub of this.hubs) {
      if (hub._id == inHub._id) {
        for (let slot of hub.slots) {
          if (
            slot.date > Date.now() &&
            slot.quantity > 0 &&
            slot.campaign_id == this.campaign_id
          ) {
            this.selectedSlots?.push(slot);
          }
        }
        this.dataSource = new MatTableDataSource(this.selectedSlots);
        this.dataSource.paginator = this.paginator;

        console.info(this.selectedSlots.length);
        if (this.selectedSlots.length == 0) {
          this.toastrService.warning(
            "Nessuno slot disponibile per questo hub",
            "Seleziona un altro hub o attendi che vengano inserite nuove disponibilità"
          );
        }
      }
    }
  }

  public reserve(slot: Slot): void {
    if (!this.campaign_id || !this.selectedHub) {
      console.log(
        "Campaign: ",
        this.campaign_id,
        ", SelectedHub: ",
        this.selectedHub
      );
      location.href = "pages/dashboard";
    } else {
      console.log(slot);
      this.dataManagement.createReservationApi(new Slot(slot)).subscribe(
        () => {
          this.toastrService.success(
            "",
            "Prenotazione effettuata correttamente!"
          );
          this.dataManagement.isDoneApi.citizen = false;
        },
        (error) => {
          console.log(error);
          if (
            error.error.message ==
            "BadRequestError: User already reserved a vaccine for this campaign"
          )
            this.toastrService.danger(
              "Hai già prenotato un vaccino per questa campagna",
              "Si è verificato un errore:"
            );
          else
            this.toastrService.danger(
              "Prenotazione fallita",
              "Si è verificato un errore:"
            );
        }
      );
    }
  }

  public hasSlotHub(hub: Hub): string {
    if (Array.isArray(hub.slots)) {
      for (let slot of hub.slots) {
        if (slot.campaign_id == this.campaign_id) return "Slot presenti";
      }
    }
    return "Nessuno slot presente";
  }
}
