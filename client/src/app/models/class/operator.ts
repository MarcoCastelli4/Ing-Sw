import { User } from "../abstract/user";

export class Operator implements User{
    login(): boolean{
        return false;
    }
}