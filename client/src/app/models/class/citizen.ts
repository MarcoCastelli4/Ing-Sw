import { User } from "../abstract/user";

export class Citizen implements User{

    login(): boolean{
        return false;
    }
}