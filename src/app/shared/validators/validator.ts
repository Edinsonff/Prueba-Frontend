import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {

  static numeric(control: AbstractControl): { [key: string]: boolean } | null {
    if (
      control.value !== null &&
      control.value !== undefined &&
      isNaN(control.value)
    ) {
      return { numeric: true };
    }

    return null;
  }

  static MatchValidator(source: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceControl = control.get(source);
      const targetControl = control.get(target);

      if (!sourceControl || !targetControl) {
        return null;
      }

      if (sourceControl.value !== targetControl.value) {
        return { mismatch: true };
      } else {
        return null;
      }
    };
  }

  static validRegExp(control: AbstractControl): ValidationErrors | null {
    const resp: any = {};
    const lenMaxMin = control.value.length;
    const hasNumber = /(?=\d)/.test(control.value);
    const hasLower = /(?=[^a-z]*[a-z])/.test(control.value);
    const hasUpper = /(?=[^A-Z]*[A-Z])/.test(control.value);
    const hasSpecial = /.*[|!"#$%&@/()=?¡'*+:;,.-]/.test(control.value);

    if (lenMaxMin < 8 || lenMaxMin > 16) {
      resp['lenMaxMin'] = true;
    }
    if (!hasNumber) {
      resp['hasNumber'] = true;
    }
    if (!hasLower) {
      resp['hasLower'] = true;
    }
    if (!hasUpper) {
      resp['hasUpper'] = true;
    }
    if (!hasSpecial) {
      resp['hasSpecial'] = true;
    }

    return Object.keys(resp).length ? resp : null;
  }

  static noLeadingOrTrailingWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && typeof value === 'string') {
      const trimmedValue = value.trim();
      if (value !== trimmedValue) {
        return { leadingOrTrailingWhitespace: true };
      }
    }
    return null;
  }

  static noWhitespaceValidator(control: AbstractControl): { required: boolean } | null {
    if (control.value && control.value.trim().length === 0) {
      return { required: true };
    }
    return null;
  }
}
