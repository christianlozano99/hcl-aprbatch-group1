import {FormControl, ValidationErrors} from "@angular/forms";

export class Luv2ShopValidators {
  // white space validation
  static notOnlyWhitespace(control: FormControl): ValidationErrors {
    // check if string only contains whitespace
    if ((control.value != null) && (control.value.trim().length === 0)) {
      return {'notOnlyWhitespace': true};
    } else {
      // valid, return null
      // @ts-ignore
      return null;
    }
  }
}
