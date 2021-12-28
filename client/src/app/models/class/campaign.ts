import { CampaignEnum } from "../enumerations/campaign";
import { Hub } from "./hub";

export class Campaign {
    private _id: string;
    private _name: string;
    private _type: CampaignEnum[];
    private _hubs: Hub[];
    private _deletalble: boolean;

    constructor(campaign: Campaign) {
        this.id = campaign.id;
        this.name = campaign.name;
        this.type = campaign.type;
        this.hubs = campaign.hubs;
        this.deletalble = campaign.deletalble;
    }

    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
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
    public get deletalble(): boolean {
        return this._deletalble;
    }
    public set deletalble(value: boolean) {
        this._deletalble = value;
    }
}