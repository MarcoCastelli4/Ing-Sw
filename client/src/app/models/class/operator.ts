export class Operator{

    private _id: string;

    constructor(input: Operator){
        this.id = input.id;
    }
    
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }

}