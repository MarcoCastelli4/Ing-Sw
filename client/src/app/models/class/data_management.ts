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
    return this._userRole;
  }
  public set userRole(value: string) {
    this._userRole = value;
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

  //--------------------------------------------------CAMPAIGN APIS--------------------------------------------------//

  /**
   * Richiesta GET delle campagne
   * @returns Array di campagne
   */
  public getCampaignsApi(): Observable<Campaign[]> {
    return ApiService.instance.getCampaigns().pipe(
      map((response) => {
        for (let campaign of response.campaigns) {
          let obj = new Campaign(campaign);
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
        campaign.id = response;
        this.campaigns.push(campaign);
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
          if (campaign.id === campaign.id) {
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

  /**
   * Richiesta DELETE della campagna
   * Aggiorna anche le campagne
   * @param _id della campagna da eliminare
   * @returns void
   */

  public deleteCampaignApi(_id: string): Observable<void> {
    return ApiService.instance.deleteCampaign(_id).pipe(
      map((response) => {
        this.campaigns.forEach((x, i) => {
          if (x.id === response) this.campaigns.splice(i, 1);
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
  public getCitizenApi(): Observable<Citizen> {
    return ApiService.instance.getCitizen().pipe(
      map((response) => {
        this.citizen = new Citizen(response);
        this.isDoneApi.citizen = true;
        return this.citizen;
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

  /**
   * Richiesta POST per gli slot degli hub
   * @param slot oggetto da caricare nel database
   * @returns id dell'oggetto inserito se l'operazione è andata a buon fine, errore altrimenti
   */

  public createSlotApi(slot: Slot): Observable<void> {
    return ApiService.instance.postSlot(slot).pipe(
      map((response) => {
        console.log(response);
        slot.id = response;
        for (let hub of this.hubs) {
          if (hub.id == slot.hub_id) {
            hub.availableSlot.push(new Slot(slot));
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
      map((val) => {
        //this.citizen.reservations.push();
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  //--------------------------------------------------END SLOTS APIS--------------------------------------------------//

  //--------------------------------------------------AUTH APIS--------------------------------------------------//

  public loginApi(obj: LoginRequest): Observable<Tokens> {
    return ApiService.instance.login(obj).pipe(
      map((response) => {
        if (response.user.role == "Citizen")
          this.citizen = new Citizen(response.user);
        else this.operator = new Operator(response.user);

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
}

