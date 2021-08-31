import { NgModule } from '@angular/core';
import { NbButtonModule, NbCalendarModule, NbCardModule, NbDatepickerModule, NbIconModule, NbInputModule, NbMenuModule, NbSelectModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { ConfirmComponent } from '../widgets/confirm/confirm.component';
import { HubsComponent } from './hubs/hubs.component';
import { MatTableModule } from '@angular/material/table';
import { ReservationComponent } from './reservation/reservation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateReservationComponent } from './reservation/create-reservation/create-reservation.component';
import { CalendarCellComponent } from './reservation/calendar-cell/calendar-cell.component';
import { FlagComponent } from './reservation/calendar-cell/flag.component';
import { CitizenReserveComponent } from './reservation/citizen-reserve/citizen-reserve.component';


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
    NbDatepickerModule.forRoot(),
    NbInputModule,
    NbSelectModule,
    NbButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NbCalendarModule,
    NbIconModule
  ],
  declarations: [
    PagesComponent,
    ConfirmComponent,
    HubsComponent,
    ReservationComponent,
    CreateReservationComponent,
    CalendarCellComponent,
    FlagComponent,
    CitizenReserveComponent
  ],
})
export class PagesModule {
}
