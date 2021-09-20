import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { NotFoundComponent } from "./miscellaneous/not-found/not-found.component";
import { HubsComponent } from "./hubs/hubs.component";
import { ReservationComponent } from "./reservation/reservation.component";
import { StoresComponent } from "./stores/stores.component";
import { my_vax_reservationComponent } from "./my_vax_reservation/my_vax_reservation.component";

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "dashboard",
        component: DashboardComponent,
      },
      {
        path: "hubs",
        component: HubsComponent,
      },
      {
        path: "reservation",
        component: ReservationComponent,
      },
      {
        path: "my_vax_reservation",
        component: my_vax_reservationComponent,
      },
      {
        path: "stores",
        component: StoresComponent,
      },
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "**",
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
