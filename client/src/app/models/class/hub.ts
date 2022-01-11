import { Slot } from "./slot";

export class Hub {
    private __id: string;
    private _name: string;
    private _city: string;
    private _address: string;
    private _totQty: number;
    // TODO: Controllare se serve
    private _availableQty: number;
    // TODO: Controllare se serve
    private _slots: Slot[];

    constructor(hub: Hub) {
        this._id = hub._id;
        this.name = hub.name;
        this.city = hub.city;
        this.address = hub.address;
        this.totQty = hub.totQty;
        this.availableQty = hub.availableQty;
        this.slots = hub.slots;
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
    public get city(): string {
        return this._city;
    }
    public set city(value: string) {
        this._city = value;
    }
    public get address(): string {
        return this._address;
    }
    public set address(value: string) {
        this._address = value;
    }
    public get totQty(): number {
        return this._totQty;
    }
    public set totQty(value: number) {
        this._totQty = value;
    }
    public get slots(): Slot[] {
        return this._slots;
    }
    public set slots(value: Slot[]) {
        this._slots = value;
    }
    public get availableQty(): number {
        return this._availableQty;
    }
    public set availableQty(value: number) {
        this._availableQty = value;
    }
}