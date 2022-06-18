import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProfileService } from '../../services/profileService/profile.service';
import { AuthenticatorServiceInterface } from '../../services/authService/authenticator.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDataService } from '../../services/userDataService/userData.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Location} from "@angular/common";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    constructor(
        private profileService: ProfileService,
        private authService: AuthenticatorServiceInterface,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private fb: FormBuilder,
        private userData: UserDataService,
        public location: Location
    ) {
        this.activeRoute.paramMap.subscribe((params) => {
            this.requestedUserId = params.get('id');
        });
    }

    @ViewChild('imageInput') imageInput: ElementRef<HTMLInputElement>;
    @ViewChild('usernameInput') usernameInput: ElementRef<HTMLInputElement>;
    @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement>;

    inputForm?: FormGroup;

    requestedUserId: string;
    ownProfile = false;

    editMode = false;
    errorMsg = '';

    ngOnInit(): void {
        this.setInputForm();
        this.profileService.requestedProfile$.subscribe({
            next: (user) => {
                this.ownProfile = this.userData.user.userId === this.requestedUserId;
                this.setInputForm(user.username, user.email, user.profilePicture);
                this.disableInputs();
            },
            error: (error) => {
                this.inputForm.get('profilePicture').setValue('https://i.stack.imgur.com/l60Hf.png');
            },
        });

        this.profileService.getProfile(this.requestedUserId).subscribe();
    }

    private setInputForm(username: string | null = null, email: string | null = null, profilePicture: string | null = null) {
        this.inputForm = this.fb.group({
            username: this.fb.control(username, [Validators.required]),
            email: this.fb.control(email, [Validators.required, Validators.email]),
            password: this.fb.control(null, [Validators.required]),
            profilePicture: this.fb.control(profilePicture, []),
        });
    }

    private disableInputs() {
        this.usernameInput.nativeElement.disabled = true;
        this.emailInput.nativeElement.disabled = true;
    }

    private enableInputs() {
        this.usernameInput.nativeElement.disabled = false;
        this.emailInput.nativeElement.disabled = false;
    }

    enterEditMode() {
        this.editMode = true;
        this.errorMsg = '';
        this.enableInputs();
    }

    leaveEditMode() {
        this.editMode = false;
        this.errorMsg = '';
        this.disableInputs();
    }

    logout(): void {
        this.authService.logout();
        this.router.navigateByUrl('/');
    }

    imageUpload(): void {
        console.log("now")
        const files: FileList = this.imageInput.nativeElement.files;
        if (!files) {
            return;
        }
        this.profileService.postImage(files[0], this.userData.user.userId).subscribe((userData) => {
            this.inputForm.get('profilePicture').setValue(userData.profilePicture);
        });
    }

    saveChanges() {
        if (!this.inputForm.valid) {
            this.errorMsg = this.getInputErros(this.inputForm).join(', ');
            this.inputForm.get('password').setValue(null);
            return;
        }

        this.errorMsg = '';

        this.profileService.updateUser(this.inputForm.value, this.requestedUserId).subscribe({
            next: (user) => {
                this.disableInputs();
                this.editMode = false;
                this.profileService.getProfile(this.requestedUserId).subscribe();
            },
            error: (error) => {
                this.errorMsg = error.message;
                this.inputForm.get('password').setValue(null);
                this.profileService.getProfile(this.requestedUserId).subscribe();
            },
        });
    }

    private getInputErros(form: FormGroup): string[] {
        const errors: string[] = [];
        for (const [singleFormControlName, singleFormControl] of Object.entries(form.controls)) {
            errors.push(...this.getErrorMessagesForControl(singleFormControl, singleFormControlName));
        }
        return errors;
    }

    private getErrorMessagesForControl(control: AbstractControl, controlName: string): string[] {
        const controlErrors = control.errors;
        const errors = [];

        for (const [errorName, errorObject] of Object.entries(controlErrors ?? {})) {
            errors.push(this.convertErrorToMessage(controlName, errorName, errorObject));
        }
        return errors;
    }

    private convertErrorToMessage(controlName: string, errorName: string, errorValue: any): string {
        let message: string;
        switch (errorName) {
            case 'required':
                message = `${controlName} is required`;
                break;
            case 'email':
                message = `${controlName} has wrong email format`;
                break;
            case 'areEqual':
                message = `${controlName} must be equal`;
                break;
            default:
                message = `${controlName}: ${errorName}: ${errorValue}`;
        }
        return message;
    }
}
