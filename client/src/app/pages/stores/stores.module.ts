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
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { StoresComponent } from "./stores.component";

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
  ],
  declarations: [StoresComponent],
})
export class StoresModule {}
