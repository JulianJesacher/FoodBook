import {Injectable} from '@angular/core';
import {AuthenticatorServiceInterface} from '../authService/authenticator.service';
import {BehaviorSubject, Observable, tap, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CStorageKeys, IUserData} from '@food-book/api-interface';
import {AppConfigurationService} from "../configurationService/app-configuration.service";

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private authService: AuthenticatorServiceInterface,
              private http: HttpClient, private configService: AppConfigurationService) {
  }

  private _user = new BehaviorSubject<IUserData | null>(null);
  get user(): IUserData | null {
    return this._user.value;
  }

  set user(user: IUserData | null) {
    this._user.next(user);
  }

  get userChanges(): Observable<IUserData | null> {
    return this._user.asObservable();
  }

  fetchCurrentUser(): Observable<IUserData | null> {
    const token: string = localStorage.getItem(CStorageKeys.ACCESS_TOKEN);
    this.authService.accessToken$.next(token);
    if (!token) {
      return of(null);
    }

    return this.http.get<IUserData>(`${this.configService.config.serverHost}/auth/current-user`);
  }

  private initialize(): Observable<IUserData | null> {
    this.authService.user$.subscribe((newUser) => this.user = newUser);
    return this.fetchCurrentUser().pipe(
      tap(user => {
        this.user = user;
      })
    );
  }
}
