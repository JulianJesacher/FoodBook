import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IProfile, IProfileUpdate } from '@food-book/api-interface';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    constructor(private http: HttpClient) {}

    requestedProfile$: Subject<IProfile> = new Subject();

    postImage(input: File, userId: string): Observable<string> {
        const formData: FormData = new FormData();
        formData.append('file', input, input.name);
        return this.http.post<string>(`/api/profile/${userId}/image`, formData);
    }

    getProfile(userId: string): Observable<IProfile> {
        return this.http.get<IProfile>(`/api/profile/${userId}`).pipe(tap((profile) => this.requestedProfile$.next(profile)));
    }

    updateUser(user: IProfileUpdate, userId: string): Observable<IProfile> {
        return this.http.put<IProfile>(`/api/profile/${userId}`, user);
    }
}
