import { ChangeDetectorRef, Component, Input, NgZone } from "@angular/core";
import { NbDialogService } from "@nebular/theme";
import { Subscription } from "rxjs";
import { DataService } from "../../../services/data.service";
import { CitizenReservationComponent } from "../citizen-reservation/citizen-reservation.component";

@Component({
    selector: "ngx-flag",
    templateUrl: './flag.component.html',
    styleUrls: ['./calendar-cell.component.scss'],
})
export class FlagComponent {
    @Input() date: Date;
    @Input() day: number;

    public subscription: Subscription;
    public cellColor: string;
    public hub_id: string;
    public slots: [];

    constructor(
        private dataService: DataService,
        private ref: ChangeDetectorRef,
        private dialogService: NbDialogService
    ) {
        this.subscription = this.dataService.getSlots().subscribe(slots => {
            // Pulisci l'eventuale valore di un hub selezionato precedentemente
            this.cellColor = "";
            this.ref.markForCheck();
            this.slots = slots;
            slots?.forEach(x => {
                if (this.date.getTime() == x.date) {
                    this.hub_id = x.hub_id;
                    if (x.quantity == 0) {
                        this.cellColor = "red";
                        this.ref.markForCheck();
                    } else {
                        this.cellColor = "green";
                        this.ref.markForCheck();
                    }
                }
            });
        })

    }

    public openDialog() {
        if (localStorage.getItem("user_type") == "Citizen") {
            this.dialogService.open(CitizenReservationComponent, {
                context: {
                    date: this.date,
                    hub_id: this.hub_id,
                    slots: this.slots
                }
            }).onClose.subscribe(
                res => {
                }
            );
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}