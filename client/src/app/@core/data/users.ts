import { Observable } from 'rxjs';

export interface User {
  email: string;
}


export abstract class UserData {
  abstract getUsers(): Observable<User[]>;
  
}
