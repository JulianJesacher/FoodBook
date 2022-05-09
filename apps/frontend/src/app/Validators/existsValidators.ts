import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  ValidationErrors
} from "@angular/forms";
import {map, Observable, tap} from "rxjs";
import {AuthenticatorServiceInterface, AuthService} from "../services/authService/authenticator.service";

export function usernameExists(authService: AuthenticatorServiceInterface): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    if (control instanceof FormControl) {
      return authService.userExists(control.value).pipe(
        tap(console.log),
        map(exists => exists === false ? null : {emailExists: {email: control.value}})
      );
    }

    return null;
  }
}


export class EmailExistsValidator {

  constructor(private authService: AuthService) {
  }

  public emailExists(control: AbstractControl): Observable<ValidationErrors | null> {
    if (control instanceof FormControl) {
      return this.authService.emailExists(control.value).pipe(
        map(x => x === true ? null : {emailExists: {email: control.value}})
      );
    }

    return null;
  }
}
