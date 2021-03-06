/* eslint-disable @typescript-eslint/member-ordering */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap, BehaviorSubject} from 'rxjs';
import {
  IDish,
  IDishUpload,
  IIngredient,
  IIngredientUpload,
  ISaveOperation,
  IStep,
  IStepUpload
} from '@food-book/api-interface';
import {IRatingData} from '../../tools/rating-input/rating-input.component';
import {AppConfigurationService} from "../configurationService/app-configuration.service";

@Injectable({
  providedIn: 'root',
})
export class DishService {
  constructor(private http: HttpClient, private configService: AppConfigurationService) {
    this.serverHost = this.configService.config.serverHost;
  }

  private serverHost: string;

  dish$: BehaviorSubject<IDish | null> = new BehaviorSubject(null);

  createDish(): Observable<IDish> {
    return this.http.post<IDish>(`${this.serverHost}/dish`, {});
  }

  updateDish(recipe: IDishUpload, dishId: string): Observable<IDish> {
    return this.http.put<IDish>(`${this.serverHost}/dish/${dishId}`, recipe);
  }

  deleteDish(dishId: string): Observable<void> {
    return this.http.delete<void>(`${this.serverHost}/dish/${dishId}`);
  }

  postImages(images: File[], dishId: string): Observable<string[]> {
    const formData: FormData = new FormData();

    Array.from(images).forEach((image) => {
      formData.append('files', image, image.name);
    });

    return this.http.post<string[]>(`${this.serverHost}/dish/${dishId}/images`, formData);
  }

  getDish(dishId: string): Observable<IDish> {
    return this.http.get<IDish>(`${this.serverHost}/dish/${dishId}`).pipe(tap((dish) => this.dish$.next(dish)));
  }

  changeSavedStatus(dishId: string, currentlySaved: boolean): Observable<unknown> {
    let op: ISaveOperation = 'add';
    if (currentlySaved) {
      op = 'remove';
    }
    return this.http.post(`${this.serverHost}/dish/${dishId}/save?op=${op}`, null, {responseType: 'text'});
  }

  private createCreateDishSubTypeMethod =
    <I, O>(subType: string) =>
      (dishId: string, inputSubType: I): Observable<O> =>
        this.http.post<O>(`${this.serverHost}/dish/${dishId}/${subType}`, inputSubType);

  private createUpdateDishSubTypeMethod =
    <T extends { id: string }>(subType: string) =>
      (dishId: string, inputSubType: T): Observable<T> =>
        this.http.put<T>(`${this.serverHost}/dish/${dishId}/${subType}/${inputSubType.id}`, inputSubType);

  private createDeleteDishSubTypeMethod =
    <T extends { id: string }>(subType: string) =>
      (dishId: string, inputSubType: T): Observable<void> =>
        this.http.delete<void>(`${this.serverHost}/dish/${dishId}/${subType}/${inputSubType.id}`);

  createStep = this.createCreateDishSubTypeMethod<IStepUpload, IStep>('step');

  createIngredient = this.createCreateDishSubTypeMethod<IIngredientUpload, IIngredient>('ingredient');

  updateStep = this.createUpdateDishSubTypeMethod<IStep>('step');

  updateIngredient = this.createUpdateDishSubTypeMethod<IIngredient>('ingredient');

  deleteStep = this.createDeleteDishSubTypeMethod<IStep>('step');

  deleteIngredient = this.createDeleteDishSubTypeMethod<IIngredient>('ingredient');

  deleteImage(dishId: string, imagePath: string): Observable<void> {
    const imageName: string = imagePath.split('/').pop();
    return this.http.delete<void>(`${this.serverHost}/dish/${dishId}/images/${imageName}`);
  }

  rateDish(dishId: string, rating: number): Observable<IRatingData> {
    return this.http.post<IRatingData>(`${this.serverHost}/dish/${dishId}/rate?rating=${rating}`, null);
  }

  setVisibility(dishId: string, newState: 'public' | 'private'): Observable<IDish> {
    return this.http.post<IDish>(`${this.serverHost}/dish/${dishId}/visibility?state=${newState}`, null);
  }
}
