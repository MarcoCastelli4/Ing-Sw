import { Injectable, Injector } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ApiService } from "../../services/api.service";
import { LoginRequest, SignUpRequest, Tokens } from "./auth";
import { Campaign } from "./campaign";
import { Citizen } from "./citizen";
import { Hub } from "./hub";
import { Operator } from "./operator";
import { Slot } from "./slot";

@Injectable({
  providedIn: "root",
})
export class DataManagement {
  static injector: Injector;

  private _citizen: Citizen;
  private _campaigns: Campaign[] = [];
  private _hubs: Hub[] = [];
  private _operator: Operator;
  private _userRole: string;
  private _reservations: [];

  /**
   * Oggetto usato per sapere se in questa istanza sono già state effettuate le varie richieste per ricevere i dati
   */
  private _isDoneApi = {
    citizen: false,
    campaigns: false,
    hubs: false,
    operator: false,
  };

  public get userRole(): string {
    return this._userRole ? this._userRole : localStorage.getItem("userRole");
  }
  public set userRole(value: string) {
    if (value == "Citizen" || value == "Operator") {
      this._userRole = value;
      localStorage.setItem("userRole", this._userRole);
    }
  }

  public get campaigns() {
    return this._campaigns;
  }
  public set campaigns(value) {
    this._campaigns = value;
  }

  public get citizen() {
    return this._citizen;
  }
  public set citizen(value) {
    this._citizen = value;
  }

  public get hubs() {
    return this._hubs;
  }
  public set hubs(value) {
    this._hubs = value;
  }
  public get operator() {
    return this._operator;
  }
  public set operator(value) {
    this._operator = value;
  }

  public get isDoneApi() {
    return this._isDoneApi;
  }
  public set isDoneApi(value) {
    this._isDoneApi = value;
  }
  public get reservations(): [] {
    return this._reservations;
  }
  public set reservations(value: []) {
    this._reservations = value;
  }

  /**
   * Richiesta GET delle campagne
   * @returns Array di campagne
   */
  public getCampaignsApi(): Observable<Campaign[]> {
    return ApiService.instance.getCampaigns().pipe(
      map((response) => {
        for (let campaign of response.campaigns) {
          // notify false => mostra campanella barrata => togliere la notifica
          if (
            campaign.citizen_to_notify?.includes(
              localStorage.getItem("citizenEmail")
            )
          )
            campaign.notify = false;
          else campaign.notify = true;
          this.campaigns.push(new Campaign(campaign));
        }
        this.userRole = response.role;
        this.isDoneApi.campaigns = true;
        return this.campaigns;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  /**
   * Richiesta post delle campagne
   * @param campaign oggetto da passare al server per essere salvato nel DB
   * @returns void
   */
  public createCampaignApi(campaign: Campaign): Observable<void> {
    return ApiService.instance.postCampaign(campaign).pipe(
      map((response) => {
        campaign._id = response;
        this.campaigns.push(new Campaign(campaign));
        return;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  public editCampaignApi(campaign: Campaign): Observable<void> {
    return ApiService.instance.putCampaign(campaign).pipe(
      map(() => {
        for (let campaign of this.campaigns) {
          if (campaign._id === campaign._id) {
            let index = this.campaigns.indexOf(campaign);
            this.campaigns[index] = campaign;
          }
        }
        return;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  public deleteCampaignApi(_id: string): Observable<void> {
    return ApiService.instance.deleteCampaign(_id).pipe(
      map((response) => {
        this.campaigns.forEach((x, i) => {
          if (x._id === response) this.campaigns.splice(i, 1);
        });
        return;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  //--------------------------------------------------END CAMPAIGN APIS--------------------------------------------------//

  //--------------------------------------------------CITIZEN APIS--------------------------------------------------//
  public getCitizenApi(): Observable<any> {
    return ApiService.instance.getCitizen().pipe(
      map((response) => {
        this.citizen = new Citizen(response);
        this.reservations = response.reservations;
        this.isDoneApi.citizen = true;
        return { citizen: this.citizen, reservations: this.reservations };
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  //--------------------------------------------------END CITIZEN APIS--------------------------------------------------//

  //--------------------------------------------------HUBS APIS--------------------------------------------------//
  public getHubsApi(): Observable<Hub[]> {
    return ApiService.instance.getHubs().pipe(
      map((response) => {
        for (let hub of response.hubs) {
          this.hubs.push(new Hub(hub));
        }
        this.userRole = response.role;
        this.isDoneApi.hubs = true;
        return this.hubs;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  //--------------------------------------------------END HUBS APIS--------------------------------------------------//
  //--------------------------------------------------SLOTS APIS--------------------------------------------------//

  /**
   * Richiesta GET per gli slot degli hub
   * @param hub_id id  dell'hub da cui prendere le prenotazioni
   * @returns tutti gli slot relativi a quell'ambulatorio
   */

  public getSlotsApi(hub_id: string): Observable<Slot[]> {
    return ApiService.instance.getSlots(hub_id).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  public createSlotApi(slot: Slot): Observable<void> {
    return ApiService.instance.postSlot(slot).pipe(
      map((response) => {
        slot._id = response;
        for (let hub of this.hubs) {
          if (hub._id == slot.hub_id) {
            this.hubs[this.hubs.indexOf(hub)].slots.push(new Slot(slot));
          }
        }
        return;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
  /**
   *
   * @param slot con i dati necessari per creare la prenotazione
   * Aggiorna le strutture dati presenti dentro questa classe:
   * All'utente aggiunge l'id dello slot
   * @returns
   */
  public createReservationApi(slot: Slot): Observable<void> {
    return ApiService.instance.postReservation(slot).pipe(
      map(() => {
        // this.citizen.reservations.push(slot);
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  // public getMyReservationsApi(): Observable<any> {
  //   return ApiService.instance.getCitizen().pipe(
  //     map((response) => {
  //       return response.reservations;
  //     }),
  //     catchError((error) => {
  //       return throwError(error);
  //     })
  //   );
  // }

  public notification(campaign_id: string, on: boolean): Observable<void> {
    return ApiService.instance.notification(campaign_id, on).pipe(
      map(() => {
        for (let campaign of this.campaigns) {
          if (campaign._id == campaign_id) {
            this.campaigns[this.campaigns.indexOf(campaign)].notify = !on;
          }
        }
        console.log(this.campaigns);
        return;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  //--------------------------------------------------END SLOTS APIS--------------------------------------------------//

  public loginApi(obj: LoginRequest): Observable<Tokens> {
    return ApiService.instance.login(obj).pipe(
      map((response) => {
        if (response.user.role == "Citizen")
          this.citizen = new Citizen(response.user);
        else this.operator = new Operator(response.user);

        this.userRole = response.user.role;
        localStorage.setItem("userRole", response.user.role);
        localStorage.setItem("citizenEmail", response.user.email);

        this.userRole = response.user.role;
        localStorage.setItem("userRole", response.user.role);

        delete response.user;
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  public registerApi(user: SignUpRequest): Observable<Tokens> {
    return ApiService.instance.signUp(user).pipe(
      map((response) => {
        this.citizen = new Citizen(response.user);
        this.userRole = "Citizen";
        return response;
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  //--------------------------------------------------END AUTH APIS--------------------------------------------------//

  // Utility
  /**
   * Data una data in timestamp, ritorna il corrispettivo in stringa seguendo la formattazione italiana
   * @param date data in timestamp
   */
  public italianDate(date: Date): string {
    var date = new Date(date);
    let month = date.getMonth() + 1;
    return date.getDate() + "/" + month + "/" + date.getFullYear();
  }
}
