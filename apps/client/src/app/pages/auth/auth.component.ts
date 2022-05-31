import { Component, OnDestroy } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthenticatorComponent } from '../../tools/authenticator/authenticator.component';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnDestroy {
    constructor(private loginSheet: MatBottomSheet) {}

    onGetStartedClick() {
        this.loginSheet.open(AuthenticatorComponent);
    }

    ngOnDestroy(): void {
        this.loginSheet.dismiss();
    }
}
