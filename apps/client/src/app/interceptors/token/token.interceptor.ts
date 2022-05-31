import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, throwError, switchMap, filter, take } from 'rxjs';
import { AuthenticatorServiceInterface } from '../../services/authService/authenticator.service';
import { Router } from '@angular/router';
import { CStorageKeys } from '@food-book/api-interface';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private refreshingInProgress: boolean | undefined;
  private accessTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthenticatorServiceInterface,
    private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken: string = localStorage.getItem(CStorageKeys.ACCESS_TOKEN);

    return next.handle(this.addAuthorizationHeader(req, accessToken))
      .pipe(
        catchError(err => {

          if (err instanceof HttpErrorResponse && err.status === 401) {
            const refreshToken: string = localStorage.getItem(CStorageKeys.REFRESH_TOKEN);
       
            if (refreshToken && accessToken) {
              return this.refreshToken(req, next);
            }

            return this.logoutAndRedirect(err);
          }

          //Error 403 => refresh Token failed
          if (err instanceof HttpErrorResponse && err.status === 403) {
            return this.logoutAndRedirect(err);
          }

          if (err.error.message !== undefined) {
            return throwError(() => new Error(err.error.message));
          }
          console.log(err.error)
          return throwError(() => new Error(err.error));
        })
      );
  }

  private addAuthorizationHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    if (token) {
      return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }
    return request;
  }

  private logoutAndRedirect(err: HttpErrorResponse): Observable<HttpEvent<any>> {
    this.authService.logout();
    this.router.navigateByUrl('/');

    return throwError(() => new Error(err.message));
  }

  private refreshToken(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.refreshingInProgress) {
      this.refreshingInProgress = true;
      this.accessTokenSubject.next(null);

      return this.authService.refreshToken()
        .pipe(
          switchMap(res => {
            this.refreshingInProgress = false;
            this.accessTokenSubject.next(res.accessToken);

            //repeat failed request with new token
            return next.handle(this.addAuthorizationHeader(req, res.accessToken));
          })
        );
    } else {
      return this.accessTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          //repeat failed request with new token
          if (token) {
            return next.handle(this.addAuthorizationHeader(req, token));
          } else {
            return next.handle(req);
          }
        })
      );
    }
  }
}