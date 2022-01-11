import { Slot } from "./slot";

export class Hub {
  private _name: string;
  private _id: string;
  private _city: string;
  private _address: string;
  private _totQty: number;
  // TODO: Controllare se serve
  private _availableQty: number;
  // TODO: Controllare se serve
  private _availableSlot: Slot[] = [];

  constructor(hub: Hub) {
    this.id = hub._id;
    this.name = hub.name;
    this.city = hub.city;
    this.address = hub.address;
    this.totQty = hub.totQty;
    this.availableQty = hub.availableQty;
    this.availableSlot = hub.availableSlot ? hub.availableSlot : [];
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
  public get availableSlot(): Slot[] {
    return this._availableSlot;
  }
  public set availableSlot(value: Slot[]) {
    this._availableSlot = value;
  }
  public get availableQty(): number {
    return this._availableQty;
  }
  public set availableQty(value: number) {
    this._availableQty = value;
  }
}

