import { User } from "../abstract/user";
import { CampaignEnum } from "../enumerations/campaign";

export class Citizen implements User{

    private _id: string;
    private fcCode: string;
    private name: string;
    private surname: string;
    private type: CampaignEnum;
    private email: string;
    private birthplace: string;
    private birthday: number;

    constructor(input: Citizen){
        this._id = input._id;
        this.fcCode = input.fcCode;
        this.name = input.name;
        this.surname = input.surname;
        this.type = input.type;
        this.email = input.email;
        this.birthplace = input.birthplace;
        this.birthday = input.birthday;
    }

    public getID(): string{
        return this._id;
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
    public getBirthplace(): string{
        return this.birthplace;
    }
    public getBirthday(): number{
        return this.birthday;
    }

    public setID(input: string): void{
        this._id = input;
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
    public setBirthplace(input: string): void{
        this.birthplace = input;
    }
    public setBirthday(input: number): void{
        this.birthday = input;
    }

    public login(): boolean{
        return false;
    }
}