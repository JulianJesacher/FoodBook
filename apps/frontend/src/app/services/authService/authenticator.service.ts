import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, Observable, of, tap } from 'rxjs';
import { CStorageKeys, IAuthResponse, IUserData } from '@food-book/api-interface';

export abstract class AuthenticatorServiceInterface {
    abstract accessToken$: BehaviorSubject<string | null>;
    abstract accessTokenChanges(): Observable<string>;

    abstract login(form: { email: string; password: string }): Observable<IAuthResponse>;

    abstract signUp(form: { email: string; username: string; password: string }): Observable<IAuthResponse>;

    abstract logout(): void;

    abstract refreshToken(): Observable<{ accessToken: string; refreshToken: string }>;

    abstract resetPassword(email: string): Observable<void>;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService extends AuthenticatorServiceInterface {
    constructor(private http: HttpClient) {
        super();
    }

    user$ = new BehaviorSubject<IUserData | null>(null);
    personalPrivateKey$ = new BehaviorSubject<string | null>(null);

    accessToken$ = new BehaviorSubject<string | null>(null);
    get accessToken() {
        return this.accessToken$.value;
    }
    accessTokenChanges(): Observable<string> {
        return this.accessToken$.asObservable();
    }

    login(form: { email: string; password: string }): Observable<IAuthResponse> {
        return this.http.post<IAuthResponse>('/api/auth/login', form).pipe(
            tap((response) => {
                this.handleResponse(response);
            })
        );
    }

    signUp(form: { email: string; username: string; password: string }): Observable<IAuthResponse> {
        return this.http.post<IAuthResponse>('/api/auth/signup', form).pipe(
            tap((response) => {
                this.handleResponse(response);
            })
        );
    }

    logout(): void {
        for (const storageKey in CStorageKeys) {
            localStorage.removeItem(CStorageKeys[storageKey]);
        }
        this.user$.next(null);
        this.accessToken$.next(null);
        this.personalPrivateKey$.next(null);
    }

    refreshToken(): Observable<{ accessToken: string; refreshToken: string }> {
        const refreshToken: string = localStorage.getItem(CStorageKeys.REFRESH_TOKEN);

        return this.http.post<{ accessToken: string; refreshToken: string }>('/api/auth/refresh-token', { refreshToken }).pipe(
            tap((response) => {
                localStorage.setItem(CStorageKeys.ACCESS_TOKEN, response.accessToken);
                localStorage.setItem(CStorageKeys.REFRESH_TOKEN, response.refreshToken);
                this.accessToken$.next(response.accessToken);
            })
        );
    }

    resetPassword(email: string): Observable<void> {
        return this.http.put<void>(`/api/auth/${email}/requestPasswordReset`, null);
    }

    private handleResponse(response: IAuthResponse): void {
        localStorage.setItem(CStorageKeys.ACCESS_TOKEN, response.accessToken);
        localStorage.setItem(CStorageKeys.REFRESH_TOKEN, response.refreshToken);

        this.user$.next(response.user);
        this.accessToken$.next(response.accessToken);
        this.personalPrivateKey$.next(response.personalPrivateKey);
    }
}

@Injectable({
    providedIn: 'root',
})
export class TestAuthService extends AuthenticatorServiceInterface {
    loginCount = 0;

    user$ = new BehaviorSubject<IUserData | null>(null);
    personalPrivateKey$ = new BehaviorSubject<string | null>(null);

    accessToken$ = new BehaviorSubject<string | null>(null);
    get accessToken() {
        return this.accessToken$.value;
    }
    accessTokenChanges(): Observable<string> {
        return this.accessToken$.asObservable();
    }

    login(form: { email: string; password: string }): Observable<IAuthResponse> {
        this.loginCount++;
        return of({
            accessToken: 'my-access-token',
            refreshToken: 'my-refresh-token',
            personalPrivateKey: 'privatedontshare',
            user: {
                userId: 'my-user-id',
                email: form.email,
                username: 'me',
                profilePicture: 'https://google.com',
            },
        });
    }

    signUp(form: { email: string; username: string; password: string }): Observable<IAuthResponse> {
        return of({
            accessToken: 'my-access-token',
            refreshToken: 'my-refresh-token',
            personalPrivateKey: 'privatedontshare',
            user: {
                userId: 'my-user-id',
                email: form.email,
                username: 'me',
                profilePicture: 'https://google.com',
            },
        });
    }

    logout(): void {
        for (const storageKey in CStorageKeys) {
            localStorage.removeItem(CStorageKeys[storageKey]);
        }
        this.user$.next(null);
        this.accessToken$.next(null);
        this.personalPrivateKey$.next(null);
    }

    resetPassword(email: string): Observable<void> {
        return new Observable();
    }

    refreshToken(): Observable<{ accessToken: string; refreshToken: string }> {
        return of({
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token',
        }).pipe(
            tap((response) => {
                this.accessToken$.next(response.accessToken);
            })
        );
    }
}
