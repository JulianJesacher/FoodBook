import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { DishComponent } from './pages/dish/dish.component';
import { UploadComponent } from './pages/upload/upload.component';
import { MainComponent } from './pages/main/main.component';
import { InputWithErrorComponent } from './tools/inputError/input-with-error/input-with-error.component';
import { ResetPasswordComponent } from './pages/resetPassword/reset-password/reset-password.component';

const routes: Routes = [
    { path: '', component: AuthComponent },
    { path: 'profile/:id', component: ProfileComponent },
    { path: 'dish/:id', component: DishComponent },
    { path: 'upload/:id', component: UploadComponent },
    { path: 'home', component: MainComponent },
    { path: 'test', component: InputWithErrorComponent },
    { path: 'resetPassword', component: ResetPasswordComponent },
    { path: '**', component: AuthComponent, data: { navBar: true } },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
