
export class Hub {
    private name: string;
    private city: string;
    private address: string;
    private totQty: number;
    private availableQty: number;
    private availableSlot: Date[];

    constructor(hub: Hub) {
        this.name = hub.name;
        this.city = hub.city;
        this.address = hub.address;
        this.totQty = hub.totQty;
        this.availableQty = hub.availableQty;
        this.availableSlot = hub.availableSlot;
    }

    public getName(): string {
        return this.name;
    }
    public getCity(): string {
        return this.city;
    }
    public getAddress(): string {
        return this.address;
    }
    public getTotQty(): number {
        return this.totQty;
    }
    public getAvailableQty(): number {
        return this.availableQty;
    }
    public getAvailableSlot(): Date[] {
        return this.availableSlot;
    }

    public setName(input: string): void {
        this.name = input;
    }
    public setCity(input: string): void {
        this.city = input;
    }
    public setAddress(input: string): void {
        this.address = input;
    }
    public setTotQty(input: number): void {
        this.totQty = input;
    }
    public setAvailableQty(input: number): void {
        this.availableQty = input;
    }
    public setAvailableSlot(input: Date[]): void {
        this.availableSlot = input;
    }

}