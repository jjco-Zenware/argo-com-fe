import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[emailValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: EmailValidatorDirective, multi: true }]
})
export class EmailValidatorDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailRegex.test(control.value)) {
      return { invalidEmail: true };
    }

    return null;
  }

}
