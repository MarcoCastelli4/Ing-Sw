import { CampaignEnum } from "../enumerations/campaign";
import { Hub } from "./hub";

export class Campaign {
    private name: string;
    private totQty: number;
    private type: CampaignEnum[];
    private hubs: Hub[];
    private priority: CampaignEnum;

    constructor(campaign: Campaign) {
        this.name = campaign.name;
        this.totQty = campaign.totQty;
        this.type = campaign.type;
        this.hubs = campaign.hubs;
        this.priority = campaign.priority;
    }

    public getName(): string {
        return this.name;
    }
    public getTotQty(): number {
        return this.totQty;
    }
    public getType(): CampaignEnum[] {
        return this.type;
    }
    public getHubs(): Hub[] {
        return this.hubs;
    }
    public getPriority(): CampaignEnum {
        return this.priority;
    }

    public setName(input: string): void {
        this.name = input;
    }
    public setTotQty(input: number): void {
        this.totQty = input;
    }
    public setType(input: CampaignEnum[]): void {
        this.type = input;
    }
    public setHubs(input: Hub[]): void {
        this.hubs = input;
    }
    public setPriority(input: CampaignEnum): void {
        this.priority = input;
    }
}