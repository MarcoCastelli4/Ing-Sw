import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent } from "@angular/common/http"
import { throwError, BehaviorSubject, Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Injectable } from "@angular/core";
import { ApiService } from "../services/api.service";
import { Tokens } from "../models/class/auth";
import { catchError, filter, take, switchMap } from "rxjs/operators";

@Injectable()
export class Interceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private apiService: ApiService
    ) { }

    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        let customReq: HttpRequest<any>;
        if (request.headers.get("Authorization") && this.authService.getAccessToken !== null) {
            let token = this.authService.getAccessToken;
            customReq = this.addToken(request, token);
        } else {
            customReq = request;
        }
        return next.handle(customReq).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    console.log("401 ERROR");
                    this.handle401Error(request, next);
                } else {
                    console.log(error);
                    return throwError(error);
                }
            })
        );

    }

    private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        let refreshToken = localStorage.getItem("refreshToken")
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            console.log(
                this.authService.getRefreshToken,
                refreshToken
            );
            this.apiService.refreshToken(refreshToken).pipe();
            return this.apiService
                .refreshToken(refreshToken)
                .pipe(
                    switchMap((tokens: Tokens) => {
                        console.log("Token refreshed");
                        console.log(tokens);
                        this.isRefreshing = false;
                        this.authService.setAccessToken(tokens.accessToken);
                        this.authService.setRefreshToken(tokens.refreshToken);
                        this.refreshTokenSubject.next(tokens.accessToken);
                        return next.handle(this.addToken(request, tokens.accessToken));
                    }),
                    catchError((error) => {
                        if (error instanceof HttpErrorResponse && error.status === 400) {
                            this.authService.logout();
                            return;
                        } else {
                            console.log(error);
                            return throwError(error);
                        }
                    })
                );

            //return this.apiService.refreshToken(refreshToken).subscribe(
            //    (res) => {
            //        console.log("Token refreshed");
            //        console.log(res);
            //        this.isRefreshing = false;
            //        this.authService.setAccessToken(res.accessToken);
            //        this.authService.setRefreshToken(res.refreshToken);
            //        this.refreshTokenSubject.next(res.accessToken);
            //        console.log(next)
            //        return next.handle(this.addToken(request, res.accessToken));
            //    },
            //    (err) => {
            //        if (err instanceof HttpErrorResponse && err.status === 400) {
            //            this.authService.logout();
            //            return;
            //        } else {
            //            console.log(err);
            //            return throwError(err);
            //        }
            //    },
            //)
        } else {
            return this.refreshTokenSubject.pipe(
                filter((token) => token != null),
                take(1),
                switchMap((jwt) => {
                    console.log(jwt);
                    return next.handle(this.addToken(request, jwt));
                })
            );
        }
    }
}