import { NgModule } from "@angular/core";
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbUserModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
  NbTreeGridModule,
  NbInputModule,
} from "@nebular/theme";
import { NgxEchartsModule } from "ngx-echarts";

import { ThemeModule } from "../../@theme/theme.module";
import { DashboardComponent } from "./dashboard.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { CreateCampaingComponent } from "../../widgets/create-campaign/create-campaing.component";
import { MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog";

@NgModule({
  imports: [
    FormsModule,
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbTabsetModule,
    NbActionsModule,
    NbRadioModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    NgxEchartsModule,
    NbTreeGridModule,
    ReactiveFormsModule,
    NbInputModule,
    NbSelectModule,
    MatTableModule,
    MatDialogModule
  ],
  declarations: [DashboardComponent, CreateCampaingComponent],
  providers: [{ provide: MAT_DIALOG_DATA, useValue: [] }],
})
export class DashboardModule {}
