import { User } from "../abstract/user";
import { CampaignEnum } from "../enumerations/campaign";

export class Citizen implements User{

    private fcCode: string;
    private name: string;
    private surname: string;
    private type: CampaignEnum;
    private email: string;

    constructor(input: Citizen){
        this.fcCode = input.fcCode;
        this.name = input.name;
        this.surname = input.surname;
        this.type = input.type;
        this.email = input.email;
    }

    public getFcCode(): string{
        return this.fcCode;
    }
    public getName(): string{
        return this.name;
    }
    public getSurname(): string{
        return this.surname;
    }
    public getType(): CampaignEnum{
        return this.type;
    }
    public getEmail(): string{
        return this.email;
    }

    public setFcCode(input: string): void{
        this.fcCode = input;
    }
    public setName(input: string): void{
        this.name = input;
    }
    public setSurname(input: string): void{
        this.surname = input;
    }
    public setType(input: CampaignEnum): void{
        this.type = input;
    }
    public setEmail(input: string): void{
        this.email = input;
    }

    public login(): boolean{
        return false;
    }
}