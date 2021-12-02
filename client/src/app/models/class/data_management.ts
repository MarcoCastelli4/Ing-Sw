import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ApiService } from "../../services/api.service";
import { Campaign } from "./campaign";
import { Citizen } from "./citizen";
import { Hub } from "./hub";
import { Operator } from "./operator";

@Injectable({
    providedIn: 'root'
})

export class DataManagement {
    private _citizen: Citizen;
    private _campaigns: Campaign[] = [];
    private _hubs: Hub[] = [];
    private _operator: Operator;

    private _isDoneApi = {
        citizen: false,
        campaigns: false,
        hubs: false,
        operator: false
    };

    //--------------------------------------------------CAMPAIGN APIS--------------------------------------------------//

    public getCampaignsApi(): Observable<Campaign[]> {
        return ApiService.instance.getCampaigns().pipe(map((response) => {
            response.campaigns.forEach((element) => {
                this.campaigns.push(new Campaign(element));
            });
            this.isDoneApi.campaigns = true;
            return this.campaigns;
        }), catchError((error) => {
            return throwError(error);
        }))
    }

    //--------------------------------------------------END CAMPAIGN APIS--------------------------------------------------//

    //--------------------------------------------------CITIZEN APIS--------------------------------------------------//
    public getCitizenApi(): Observable<Citizen> {
        return ApiService.instance.getCitizen().pipe(map((response) => {
            this.citizen = new Citizen(response);
            this.isDoneApi.citizen = true;
            return this.citizen;
        }), catchError((error) => {
            return throwError(error);
        }))
    }
    //--------------------------------------------------END APIS--------------------------------------------------//

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

}