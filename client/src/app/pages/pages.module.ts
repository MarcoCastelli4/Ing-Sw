import { NgModule } from "@angular/core";
import {
  NbButtonModule,
  NbCalendarModule,
  NbCardModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbMenuModule,
  NbSelectModule,
} from "@nebular/theme";

import { ThemeModule } from "../@theme/theme.module";
import { PagesComponent } from "./pages.component";
import { DashboardModule } from "./dashboard/dashboard.module";
import { PagesRoutingModule } from "./pages-routing.module";
import { MiscellaneousModule } from "./miscellaneous/miscellaneous.module";
import { ConfirmComponent } from "../widgets/confirm/confirm.component";
import { HubsComponent } from "./hubs/hubs.component";
import { MatTableModule } from "@angular/material/table";
import { ReservationComponent } from "./reservation/reservation.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CalendarCellComponent } from "./reservation/calendar-cell/calendar-cell.component";
import { FlagComponent } from "./reservation/calendar-cell/flag.component";
import { OperatorReservationComponent } from "./reservation/operator-reservation/operator-reservation.component";
import { CitizenReservationComponent } from "./reservation/citizen-reservation/citizen-reservation.component";
import { my_vax_reservationComponent } from "./my_vax_reservation/my_vax_reservation.component";
import { ConfirmNotificationComponent } from "../widgets/confirm-notification/confirm-notification.component";
import { MatPaginatorIntl, MatPaginatorModule } from "@angular/material/paginator";
import { CustomPaginator } from "../widgets/custom-paginator";

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    MiscellaneousModule,
    NbCardModule,
    NbButtonModule,
    MatTableModule,
    MatPaginatorModule,
    NbDatepickerModule.forRoot(),
    NbInputModule,
    NbSelectModule,
    NbButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NbCalendarModule,
    NbIconModule,
  ],
  declarations: [
    PagesComponent,
    ConfirmComponent,
    ConfirmNotificationComponent,
    HubsComponent,
    ReservationComponent,
    OperatorReservationComponent,
    CalendarCellComponent,
    FlagComponent,
    CitizenReservationComponent,
    my_vax_reservationComponent,
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useValue: CustomPaginator()
    }
  ]
})
export class PagesModule {}
