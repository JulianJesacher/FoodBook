import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticatorServiceInterface } from '../../services/authService/authenticator.service';
import { emailExists, usernameExists } from '../../Validators/existsValidators';
import { equalValues } from '../../Validators/equalValue';

@Component({
    selector: 'app-authenticator',
    templateUrl: './authenticator.component.html',
    styleUrls: ['./authenticator.component.scss'],
})
export class AuthenticatorComponent implements OnInit {
    state: string = AuthentificatorCompState.LOGIN;
    AuthentificatorCompState = AuthentificatorCompState;

    loginForm?: FormGroup;
    signUpForm?: FormGroup;
    forgotPasswordForm?: FormGroup;

    constructor(private authService: AuthenticatorServiceInterface, private fb: FormBuilder, private router: Router) {}

    ngOnInit(): void {
        this.forgotPasswordForm = this.fb.group({
            email: this.fb.control(null, [Validators.required]),
        });

        this.loginForm = this.fb.group({
            email: this.fb.control(null, [Validators.required]),
            password: this.fb.control(null, [Validators.required]),
        });

        this.signUpForm = this.fb.group(
            {
                email: this.fb.control(null, [Validators.required, Validators.email], [emailExists(this.authService)]),
                username: this.fb.control(null, [Validators.required], [usernameExists(this.authService)]),
                password: this.fb.control(null, [Validators.required, Validators.minLength(8)]),
                passwordRepeat: this.fb.control(null, [Validators.required, Validators.minLength(8)]),
            },
            { validators: [equalValues(['password', 'passwordRepeat'])], updateOn: 'submit' }
        );
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

    onCreateAccountClick() {
        if (this.signUpForm.invalid) {
            return;
        }

        this.authService.signUp(this.signUpForm.value).subscribe({
            next: () => {
                this.router.navigateByUrl('/home');
            },
            error: (error) => {
                console.log(error.message);
            },
        });
    }

    onLoginClick() {
        if (!this.loginForm.valid) {
            console.log('Error');
        }

        this.authService.login(this.loginForm.value).subscribe({
            next: () => {
                this.router.navigateByUrl('/home');
            },
            error: (error) => {
                this.loginForm.setErrors({ invalidCredentials: true });
            },
        });
    }

    onForgotPasswordClick() {
        this.authService.requestResetPassword(this.forgotPasswordForm.value.email).subscribe({
            error: (error) => {
                this.forgotPasswordForm.get('email').setErrors({ notRegistered: true });
            },
        });
    }
}

const AuthentificatorCompState = {
    LOGIN: 'Login',
    SIGN_UP: 'Sign up',
    FORGOT_PASSWORD: 'Reset Password',
};
