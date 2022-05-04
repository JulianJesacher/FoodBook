import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors} from "@angular/forms";
import {map, Observable} from "rxjs";
import {AuthService} from "../services/authService/authenticator.service";

class ExistValidators {

  constructor(private authService: AuthService) {
  }

  usernameExists(control: AbstractControl): Observable<ValidationErrors | null> {
    if(control instanceof FormControl) {
      return this.authService.userExists(control.value).pipe(
        map(x => x === true ? null : {usernameExists: {username: control.value}})
      );
    }

    return null;
  }
}
