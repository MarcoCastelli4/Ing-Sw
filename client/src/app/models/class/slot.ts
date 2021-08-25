export class Slot {
    private _id: string;
    private campaign_id: string;
    private hub_id: string;
    private date: Date;
    private slot: string;
    private user_ids: string[];
    private quantity: number;

    constructor(slot: Slot) {
        this._id = slot._id;
        this.campaign_id = slot.campaign_id;
        this.hub_id = slot.hub_id;
        this.date = slot.date;
        this.slot = slot.slot;
        this.user_ids = slot.user_ids;
        this.quantity = slot.quantity;
    }
}