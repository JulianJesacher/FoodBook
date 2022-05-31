import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { DishComponent } from './pages/dish/dish.component';
import { UploadComponent } from './pages/upload/upload.component';
import { MainComponent } from './pages/main/main.component';
import { ResetPasswordComponent } from './pages/resetPassword/reset-password/reset-password.component';
import {AuthGuard} from "./services/authGuardService/auth.guard";

const routes: Routes = [
    { path: '', component: AuthComponent },
    { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'dish/:id', component: DishComponent, canActivate: [AuthGuard] },
    { path: 'upload/:id', component: UploadComponent, canActivate: [AuthGuard] },
    { path: 'home', component: MainComponent, canActivate: [AuthGuard] },
    { path: 'resetPassword', component: ResetPasswordComponent },
    { path: '**', component: AuthComponent, data: { navBar: true } },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
