import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { TextFieldModule } from '@angular/cdk/text-field';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { HeaderComponent } from './tools/header/header.component';
import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { PostComponent } from './tools/post/post.component';
import { HeaderMainComponent } from './tools/header-main/header-main.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { DishComponent } from './pages/dish/dish.component';
import { UploadComponent } from './pages/upload/upload.component';
import { DeleteDialogComponent } from './tools/delete-dialog/delete-dialog.component';
import { RatingInputComponent } from './tools/rating-input/rating-input.component';
import { AuthComponent } from './pages/auth/auth.component';
import { MainComponent } from './pages/main/main.component';
import { TokenInterceptor } from './interceptors/token/token.interceptor';
import { UserDataService } from './services/userDataService/userData.service';
import { Observable, catchError, of } from 'rxjs';
import { AuthService, AuthenticatorServiceInterface } from './services/authService/authenticator.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ProtectedImageDirective } from './directives/protectedImage/protected-image.directive';
import { PostContainerComponent } from './tools/postContainer/post-container/post-container.component';
import { ImageSliderComponent } from './tools/image-slider/image-slider.component';
import { ShareDialogComponent } from './tools/share-dialog/share-dialog/share-dialog.component';
import { ResetPasswordComponent } from './pages/resetPassword/reset-password/reset-password.component';

function initializeUser(userDataService: UserDataService): () => Observable<any> {
    return () => userDataService['initialize']().pipe(catchError((err) => of()));
}

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        AuthenticatorComponent,
        PostComponent,
        ProfileComponent,
        DishComponent,
        UploadComponent,
        DeleteDialogComponent,
        RatingInputComponent,
        AuthComponent,
        HeaderMainComponent,
        MainComponent,
        ProtectedImageDirective,
        PostContainerComponent,
        ImageSliderComponent,
        ShareDialogComponent,
        ResetPasswordComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatBottomSheetModule,
        MatCardModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatInputModule,
        MatSelectModule,
        MatDialogModule,
        HttpClientModule,
        FormsModule,
        TextFieldModule,
        DragDropModule,
        ReactiveFormsModule,
        InfiniteScrollModule,
        MatAutocompleteModule,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: APP_INITIALIZER, useFactory: initializeUser, deps: [UserDataService, AuthService, HttpClient], multi: true },
        { provide: AuthenticatorServiceInterface, useClass: AuthService },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
