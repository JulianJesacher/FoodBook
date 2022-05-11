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
        map(exists => exists === false ? null : {usernameExists: {username: control.value}})
      );
    }
    return null;
  }
}

export function emailExists(authService: AuthenticatorServiceInterface): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    if (control instanceof FormControl) {
      return authService.emailExists(control.value).pipe(
        map(exists => exists === false ? null : {emailExists: {email: control.value}})
      );
    }
    return null;
  }
}
