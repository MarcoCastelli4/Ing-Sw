//
// ───────────────────────────────────────────────── DEPENDENCIES AND COSTANT ─────
//
import { Injectable, Injector } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

let localhost = !environment.production;
let apiUrl = environment.apiUrl;

import {
  Tokens,
  SignUpRequest,
  LoginRequest
} from "../models/class/auth";
import { Observable } from "rxjs";

const authApi = function (bool: boolean) {
  let headers = {
    Authless: "" + !bool,
    "Content-Type": "application/json",
    Authorization: `Bearer`,
  };
  const options = { params: {}, headers: headers };
  return options;
};
export const getUrl = function (path: string) {
  if (localhost) {
    return "http://localhost:3000" + "/" + path;
  } else {
    return apiUrl + "/" + path;
  }
};

@Injectable({
  providedIn: "root",
})
export class ApiService {

  static injector: Injector;

  constructor(
    private http: HttpClient
  ) { }
  //
  //───────────────────────────────────────────────────── DATA REQUESTS ────────────────────────────────────────────
  //

//public postApp(obj: App): Observable<any> {
//  return this.http.post<any>(
//    getUrl("app"),
//    obj,
//    authApi(true)
//  );
//}
//
//  public getAllData(id: string): Observable<any> {
//    return this.http.get<any>(
//      getUrl("all-data") + "?_id=" + id,
//      authApi(true)
//    );
//  }
//
//  public getData(id: string): Observable<any> {
//    return this.http.get<any>(
//      getUrl("data") + "?_id=" + id,
//      authApi(true)
//    );
//  }
//  public deleteData(_id: string): Observable<any> {
//    return this.http.delete<any>(
//      getUrl("data") + "?_id=" + _id,
//      authApi(true)
//    );
//  }
//
//  // Save the whole desk, all the sections
//  public saveAllData(obj: any): Observable<any> {
//    return this.http.post<any>(
//      getUrl("data"),
//      obj,
//      authApi(true)
//    );
//  }
//
  //
  //───────────────────────────────────────────────────── MODULE REQUESTS ────────────────────────────────────────────
  //

//  public putModule(obj: Module): Observable<any> {
//    return this.http.put<any>(
//      getUrl("module"),
//      obj,
//      authApi(true)
//    );
//  }


  //
  //───────────────────────────────────────────────────── CONTRIBUTORS REQUESTS ────────────────────────────────────────────
  //

//  public getContributors(id: string): Observable<any> {
//    return this.http.get<any>(
//      getUrl("contributors") + "?_id=" + id,
//      authApi(true)
//    );
//  }
//
//  public putContributor(obj: ContributorRequest): Observable<any> {
//    return this.http.put<any>(
//      getUrl("contributor"),
//      obj,
//      authApi(true)
//    )
//  }
//
//  public removeContributor(user_id: string, data_id: string, type: string): Observable<any> {
//    return this.http.delete<any>(
//      getUrl("contributor") + "?user_id=" + user_id + "&data_id=" + data_id + "&type=" + type,
//      authApi(true)
//    );
//  }
//
//  public postInvitationLink(data_id: string, permission: string): Observable<any> {
//    return this.http.post<any>(
//      getUrl("invite"),
//      { data_id: data_id, permission: permission },
//      authApi(true)
//    );
//  }

  //
  //───────────────────────────────────────────────────── USER REQUESTS ────────────────────────────────────────────
  //

  public signUp(obj: SignUpRequest): Observable<any> {
    return this.http.post<Tokens>(getUrl("signup"), obj);
  }

  public login(obj: LoginRequest): Observable<any> {
    return this.http.post<LoginRequest>(getUrl("login"), obj);
  }

  public refreshToken(token: string): Observable<Tokens> {
    return this.http.post<Tokens>(
      getUrl("token"),
      { refreshToken: token },
      authApi(false)
    );
  }
//
//  public confirmEmail(id: string): Observable<any> {
//    return this.http.put<any>(
//      getUrl("verify-mail"),
//      { _id: id },
//      authApi(false)
//    );
//  }
//
//  public sendResetCode(obj: any): Observable<any> {
//    return this.http.post<Tokens>(
//      getUrl("gen-reset-code"),
//      obj,
//      authApi(false)
//    );
//  }
//
//  public resetPassword(obj: any): Observable<any> {
//    return this.http.post<Tokens>(
//      getUrl("reset-password"),
//      obj,
//      authApi(false)
//    );
//  }
//
//  public linkInvitation(obj): Observable<any> {
//    return this.http.put<Tokens>(
//      getUrl("link-invitation-user"),
//      obj,
//      authApi(false)
//    );
//  }
//
//  public getUser(id: string): Observable<any> {
//    return this.http.get<any>(
//      getUrl("user") + "?_id=" + id,
//      authApi(true)
//    );
//  }
//
//  public editUser(obj: UserPut): Observable<any> {
//    return this.http.put<Tokens>(
//      getUrl("user"),
//      obj,
//      authApi(true)
//    );
//  }

}
