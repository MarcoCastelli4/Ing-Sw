import { Component } from "@angular/core";
import { NbMenuItem } from "@nebular/theme";
@Component({
  selector: "ngx-pages",
  styleUrls: ["pages.component.scss"],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {
  menu;
  constructor() {
    const operator = localStorage.getItem("user_type") === "Operator";
    if (!operator) {
      this.menu = [
        {
          title: "Campagne vaccinali",
          icon: "shield-outline",
          link: "/pages/dashboard",
          home: true,
        },
        {
          title: "Ambulatori",
          icon: "home-outline",
          link: "/pages/hubs",
        },
        {
          title: "Le mie prenotazioni",
          icon: "person-outline",
          link: "/pages/my_vax_reservation",
          home: true,
        },
      ];
    } else {
      this.menu = [
        {
          title: "Campagne vaccinali",
          icon: "shield-outline",
          link: "/pages/dashboard",
          home: true,
        },
        {
          title: "Ambulatori",
          icon: "home-outline",
          link: "/pages/hubs",
        },
        {
          title: "Magazzini",
          icon: "cube-outline",
          link: "/pages/stores",
        },
      ];
    }
  }
}
