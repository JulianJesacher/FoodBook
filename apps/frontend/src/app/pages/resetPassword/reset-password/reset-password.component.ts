import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from "../../../services/authService/authenticator.service";
import {equalValues} from "../../../Validators/equalValue";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetCode: string;
  userId: string;

  inputForm: FormGroup;

  constructor(private activeRoute: ActivatedRoute, private fb: FormBuilder, private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((params) => {
      this.resetCode = params['code'];
      this.userId = params['userId'];
    });

    this.inputForm = this.fb.group({
      newPassword: this.fb.control(null, [Validators.required, Validators.minLength(8)]),
      repeatPassword: this.fb.control(null, [Validators.required]),
    }, {validators: [equalValues(['newPassword', 'repeatPassword'])], updateOn: "submit"});
  }

  resetPassword(): void {
    if (!this.inputForm.valid) {
      return;
    }
    this.authService.resetPassword(this.userId, this.resetCode, this.inputForm.value.newPassword).subscribe({
      complete: () => this.router.navigateByUrl('/'),
    });
  }

  get newPasswordControl(): FormControl {
    return this.inputForm.get('newPassword') as FormControl;
  }

  get repeatPasswordControl(): FormControl {
    return this.inputForm.get('repeatPassword') as FormControl;
  }
}
