import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticatorServiceInterface } from '../../services/authService/authenticator.service';

@Component({
    selector: 'app-authenticator',
    templateUrl: './authenticator.component.html',
    styleUrls: ['./authenticator.component.scss'],
})
export class AuthenticatorComponent implements OnInit {
    state: AuthentificatorCompState = AuthentificatorCompState.LOGIN;

    loginForm?: FormGroup;
    signUpForm?: FormGroup;
    forgotPasswordForm?: FormGroup;

    x : FormGroup;

    constructor(private authService: AuthenticatorServiceInterface, private fb: FormBuilder, private router: Router) {}

    ngOnInit(): void {
        this.forgotPasswordForm = this.fb.group({
            email: this.fb.control(null, [Validators.required]),
        });

        this.loginForm = this.fb.group({
            email: this.fb.control(null, [Validators.required]),
            password: this.fb.control(null, [Validators.required]),
        });

        this.signUpForm = this.fb.group({
            email: this.fb.control(null, [Validators.required]),
            username: this.fb.control(null, [Validators.required]),
            password: this.fb.control(null, [Validators.required]),
            passwordRepeat: this.fb.control(null, [Validators.required]),
        });

        this.x = this.fb.group({test: this.fb.control("x", [Validators.required])});
        this.x.get('s')
        this.x.valueChanges.subscribe(console.log);
    }

    getXTest(){
        return this.x.get('test') as FormControl;
    }

    onForgotPasswordChange(): void {
        this.loginForm.reset();
        this.state = AuthentificatorCompState.FORGOT_PASSWORD;
    }

    onLoginChange(): void {
        this.loginForm.reset();
        this.state = AuthentificatorCompState.LOGIN;
    }

    onSignUpChange(): void {
        this.signUpForm.reset();
        this.state = AuthentificatorCompState.SIGN_UP;
    }

    isLoginState(): boolean {
        return this.state == AuthentificatorCompState.LOGIN;
    }

    isSignUpState(): boolean {
        return this.state == AuthentificatorCompState.SIGN_UP;
    }

    isForgotPasswordState(): boolean {
        return this.state == AuthentificatorCompState.FORGOT_PASSWORD;
    }

    getStateText(): string {
        return this.state;
    }

    onCreateAccountClick() {
        const currentForm: FormGroup = this.getCurrentForm();
        if (!currentForm.valid) {
            console.log('Error');
        }

        this.authService.signUp(currentForm.value).subscribe({
            next: () => {
                this.router.navigateByUrl('/home');
            },
            error: (error) => {
                console.log(error.message);
            },
        });
    }

    onLoginClick() {
        const currentForm: FormGroup = this.getCurrentForm();
        if (!currentForm.valid) {
            console.log('Error');
        }

        this.authService.login(currentForm.value).subscribe({
            next: () => {
                this.router.navigateByUrl('/home');
            },
            error: (error) => {
                console.log(error.message);
            },
        });
    }

    onForgotPasswordClick() {
        const currentForm: FormGroup = this.getCurrentForm();
        this.authService.resetPassword(currentForm.value.email).subscribe();
    }

    private getCurrentForm(): FormGroup {
        switch (this.state) {
            case AuthentificatorCompState.LOGIN:
                return this.loginForm;
            case AuthentificatorCompState.FORGOT_PASSWORD:
                return this.forgotPasswordForm;
            default:
                return this.signUpForm;
        }
    }
}

enum AuthentificatorCompState {
    LOGIN = 'Login',
    SIGN_UP = 'Sign up',
    FORGOT_PASSWORD = 'Reset Password',
}
