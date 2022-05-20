import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IProfile, IProfileUpdate } from '@food-book/api-interface';
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    constructor(private http: HttpClient) {}

    requestedProfile$: Subject<IProfile> = new Subject();

    postImage(input: File, userId: string): Observable<string> {
        const formData: FormData = new FormData();
        formData.append('file', input, input.name);
        return this.http.post<string>(`${environment.serverHost}/profile/${userId}/image`, formData);
    }

    getProfile(userId: string): Observable<IProfile> {
        return this.http.get<IProfile>(`${environment.serverHost}/profile/${userId}`).pipe(tap((profile) => this.requestedProfile$.next(profile)));
    }

    updateUser(user: IProfileUpdate, userId: string): Observable<IProfile> {
        return this.http.put<IProfile>(`${environment.serverHost}/profile/${userId}`, user);
    }
}
