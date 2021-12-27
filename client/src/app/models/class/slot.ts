export class Slot {
    private _id?: string;
    private _hub_id?: string;
    private _campaign_id?: string;
    private _date?: number;
    private _slot?: string;
    private _user_ids?: string[];
    private _quantity?: number;

    constructor(slot: Slot) {
        this.id = slot.id;
        this.campaign_id = slot.campaign_id;
        this.hub_id = slot.hub_id;
        this.date = slot.date;
        this.slot = slot.slot;
        this.user_ids = slot.user_ids;
        this.quantity = slot.quantity;
    }

    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get hub_id(): string {
        return this._hub_id;
    }
    public set hub_id(value: string) {
        this._hub_id = value;
    }
    public get campaign_id(): string {
        return this._campaign_id;
    }
    public set campaign_id(value: string) {
        this._campaign_id = value;
    }
    public get date(): number {
        return this._date;
    }
    public set date(value: number) {
        this._date = value;
    }
    public get slot(): string {
        return this._slot;
    }
    public set slot(value: string) {
        this._slot = value;
    }
    public get user_ids(): string[] {
        return this._user_ids;
    }
    public set user_ids(value: string[]) {
        this._user_ids = value;
    }
    public get quantity(): number {
        return this._quantity;
    }
    public set quantity(value: number) {
        this._quantity = value;
    }
}