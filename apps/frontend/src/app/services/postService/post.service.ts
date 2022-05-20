import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap, map, BehaviorSubject } from 'rxjs';
import { IPost, QueryParameters } from '@food-book/api-interface';
import * as qs from 'qs';
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class PostService {
    constructor(private http: HttpClient) {}

    newPosts$ = new Subject<IPost[]>();
    searchQuery$ : BehaviorSubject<string | null> = new BehaviorSubject(null);

    getNextPosts(parameters: QueryParameters): Observable<IPost[]> {
        const queryParametersAsString = qs.stringify(parameters);

        return this.http.get<IPost[]>(`${environment.serverHost}/post?${queryParametersAsString}`).pipe(
            tap((posts) => {
                this.newPosts$.next(posts);
            })
        );
    }

    getNextSavedPosts(parameters: QueryParameters, userId: string, random?: boolean): Observable<IPost[]> {
        console.log("XX");
        const queryParametersAsString = qs.stringify(parameters);
        return this.http
            .get<IPost[]>(
                `${environment.serverHost}/post/saved?${queryParametersAsString}&random=${random ?? false}`
            )
            .pipe(
                tap((posts) => {
                    this.newPosts$.next(posts);
                })
            );
    }

    getSearchSuggestions(searchString: string): Observable<string[]> {
        const queryParameters: QueryParameters = {
            limit: 10,
            filter: [{ field: 'title', op: 'LIKE', value: searchString + '%' }],
        };
        const queryParametersAsString = qs.stringify(queryParameters);

        return this.http.get(`${environment.serverHost}/post?${queryParametersAsString}`).pipe(
            map((posts: IPost[]) => {
                const output: string[] = [];
                posts.forEach((post) => output.push(post.title));
                return output;
            })
        );
    }
}
