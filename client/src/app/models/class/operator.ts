import { User } from "../abstract/user";

export class Operator implements User{

    private id: string;

    constructor(input: Operator){
        this.id = input.id;
    }

    public getId(): string{
        return this.id;
    }

    public setId(input: string): void{
        this.id = input;
    }
    
    public login(): boolean{
        return false;
    }
}