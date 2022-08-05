import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { AuthenticatorServiceInterface, AuthService } from '../../services/authService/authenticator.service';
import { AuthenticatorComponent } from '../authenticator/authenticator.component';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    constructor(
        private loginSheet: MatBottomSheet,
        public authService: AuthenticatorServiceInterface,
        private router: Router,
    ) {}

    ngOnInit(): void {}

    onLoginClick() {
        this.loginSheet.open(AuthenticatorComponent);
    }

    guestLogin() {
        this.authService.login({ email: 'Guest', password: 'guestAccountPassword' }).subscribe({
            next: () => {
                this.router.navigateByUrl('/home');
            },
        });
    }
}
