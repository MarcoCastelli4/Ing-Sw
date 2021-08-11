import { CampaignEnum } from "../enumerations/campaign";
import { Hub } from "./hub";

export class Campaign{
    private name: string;
    private totQty: number;
    private type: CampaignEnum[];
    private hubs: Hub[];
    private priority: CampaignEnum;

    constructor(campaign: Campaign){
        this.name = campaign.name;
        this.totQty = campaign.totQty;
        this.type = campaign.type;
        this.hubs = campaign.hubs;
        this.priority = campaign.priority;
    }

    public getName(){
        return this.name;
    }
    public getTotQty(){
        return this.totQty;
    }
    public getType(){
        return this.type;
    }
    public getHubs(){
        return this.hubs;
    }
    public getPriority(){
        return this.priority;
    }

    public setName(string:string){
        this.name = string;
    }
    public setTotQty(string:number){
        this.totQty = string;
    }
    public setType(string:CampaignEnum[]){
        this.type = string;
    }
    public setHubs(string: Hub[]){
        this.hubs = string;
    }
    public setPriority(string: CampaignEnum){
        this.priority = string;
    }
}