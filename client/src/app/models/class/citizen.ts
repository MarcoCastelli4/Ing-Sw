import { CampaignEnum } from "../enumerations/campaign";

export class Citizen {
    private _id: string;
    private _fcCode: string;
    private _name: string;
    private _surname: string;
    private _type: CampaignEnum;
    private _email: string;
    private _birthplace: string;
    private _birthday: number;
    /**
     * Array di oggetti con:
     * campaing_id
     * hub_id
     * reservations (array di stringhe, ovvero gli id delgi ) 
     */
    private _reservations: [];

    constructor(input: Citizen) {
        this._id = input._id;
        this.fcCode = input.fcCode;
        this.name = input.name;
        this.surname = input.surname;
        this.type = input.type;
        this.email = input.email;
        this.birthplace = input.birthplace;
        this.birthday = input.birthday;
    }
    public get fcCode(): string {
        return this._fcCode;
    }
    public set fcCode(value: string) {
        this._fcCode = value;
    }
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    public get surname(): string {
        return this._surname;
    }
    public set surname(value: string) {
        this._surname = value;
    }
    public get type(): CampaignEnum {
        return this._type;
    }
    public set type(value: CampaignEnum) {
        this._type = value;
    }
    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }
    public get birthplace(): string {
        return this._birthplace;
    }
    public set birthplace(value: string) {
        this._birthplace = value;
    }
    public get birthday(): number {
        return this._birthday;
    }
    public set birthday(value: number) {
        this._birthday = value;
    }
    public get reservations(): [] {
        return this._reservations;
    }
    public set reservations(value: []) {
        this._reservations = value;
    }
}