import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors} from "@angular/forms";
import {map, Observable} from "rxjs";
import {AuthService} from "../services/authService/authenticator.service";

export class ExistValidators {

  constructor(private authService: AuthService) {
  }

  public usernameExists(control: AbstractControl): Observable<ValidationErrors | null> {
    if(control instanceof FormControl) {
      return this.authService.userExists(control.value).pipe(
        map(x => x === true ? null : {usernameExists: {username: control.value}})
      );
    }

    return null;
  }

  public emailExists(control: AbstractControl): Observable<ValidationErrors | null> {
    if(control instanceof FormControl) {
      return this.authService.emailExists(control.value).pipe(
        map(x => x === true ? null : {emailExists: {email: control.value}})
      );
    }

    return null;
  }
}
