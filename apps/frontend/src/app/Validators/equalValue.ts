import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors} from "@angular/forms";

export const equalValues = (controlsToBeEqual: string[]) => (control: AbstractControl): ValidationErrors | null => {
  console.log(controlsToBeEqual, controlsToBeEqual.length);
  if (control instanceof FormControl) {
    throw new Error('The equalValues validator cannot be applied to a FormControl.');
  }

  if (controlsToBeEqual.length < 2) {
    console.warn('The equalValues validator does not perform any validation when less then two control names are given.');
    return null;
  }

  if (control instanceof FormGroup || control instanceof FormArray) {
    const firstControlName = controlsToBeEqual[0];
    const firstValue = control.get(firstControlName).value;

    for (const singleControlName of controlsToBeEqual) {
      if (firstValue !== control.get(singleControlName).value) return {
        equalValues: {
          controlNames: [firstControlName, ...controlsToBeEqual],
        }
      }
    }
    return null;
  }
  throw new Error('Unknown type of AbstractControl.');
}
