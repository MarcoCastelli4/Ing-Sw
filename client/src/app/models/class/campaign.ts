import { CampaignEnum } from "../enumerations/campaign";
import { Hub } from "./hub";

export class Campaign {
    private __id: string;
    private _name: string;
    private _type: CampaignEnum[];
    private _hubs: Hub[];
    private _deletable: boolean;
    // false: si mostra il bottone per ricevere la notifica via mail
    // true: si mostra il bottone per togliere la notifica via mail
    private _notify: boolean;

    constructor(campaign: Campaign) {
        this._id = campaign._id;
        this.name = campaign.name;
        this.type = campaign.type;
        this.hubs = campaign.hubs;
        this.deletable = campaign.deletable ?? true;
        this.notify = campaign.notify ?? false;
    }

    public get _id(): string {
        return this.__id;
    }
    public set _id(value: string) {
        this.__id = value;
    }
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    public get type(): CampaignEnum[] {
        return this._type;
    }
    public set type(value: CampaignEnum[]) {
        this._type = value;
    }
    public get hubs(): Hub[] {
        return this._hubs;
    }
    public set hubs(value: Hub[]) {
        this._hubs = value;
    }
    public get deletable(): boolean {
        return this._deletable;
    }
    public set deletable(value: boolean) {
        this._deletable = value;
    }
    public get notify(): boolean {
        return this._notify;
    }
    public set notify(value: boolean) {
        this._notify = value;
    }
}