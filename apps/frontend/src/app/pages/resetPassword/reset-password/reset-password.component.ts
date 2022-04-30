import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
    resetCode: string;
    userId: string;

    inputForm : FormGroup;

    constructor(private activeRoute: ActivatedRoute, private fb: FormBuilder) {}

    ngOnInit(): void {
        this.activeRoute.queryParams.subscribe((params) => {
            this.resetCode = params['code'];
            this.userId = params['userId'];
        });

        this.inputForm = this.fb.group({
            newPassword: this.fb.control(null, []),
            repeatPassword: this.fb.control(null, []),
        });
    }
}
