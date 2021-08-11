
export class Hub {
    private name: string;
    private city: string;
    private address: string;
    private totQty: number;
    private availableQty: number;
    private availableSlot: Date[];

    constructor(hub: Hub){
        this.name = hub.name;
        this.city = hub.city;
        this.address = hub.address;
        this.totQty = hub.totQty;
        this.availableQty = hub.availableQty;
        this.availableSlot = hub.availableSlot;
    }

    public getName() {
        return this.name;
    }
    public getCity() {
        return this.city;
    }
    public getAddress() {
        return this.address;
    }
    public getTotQty() {
        return this.totQty;
    }
    public getAvailableQty() {
        return this.availableQty;
    }
    public getAvailableSlot() {
        return this.availableSlot;
    }

    public setName(string) {
        this.name = string;
    }
    public setCity(string) {
        this.city = string;
    }
    public setAddress(string) {
        this.address = string;
    }
    public setTotQty(string) {
        this.totQty = string;
    }
    public setAvailableQty(string) {
        this.availableQty = string;
    }
    public setAvailableSlot(string) {
        this.availableSlot = string;
    }

}