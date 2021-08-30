import { Component } from '@angular/core';
import { NbCalendarDayCellComponent } from '@nebular/theme';

@Component({
    selector: "ngx-calendar-cell",
    styleUrls: ['./calendar-cell.component.scss'],
    templateUrl: './calendar-cell.component.html'
})

export class CalendarCellComponent extends NbCalendarDayCellComponent<Date>{}