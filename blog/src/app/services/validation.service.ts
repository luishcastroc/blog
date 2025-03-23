import { Injectable } from '@angular/core';
import { FieldValidateFn } from '@tanstack/angular-form';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  /**
   * Creates a validator that ensures a field is not empty
   * @param fieldName The name of the field for the error message
   */
  createRequiredValidator(
    fieldName: string
  ): FieldValidateFn<unknown, string, string> {
    return ({ value }) => (!value ? `${fieldName} is required` : undefined);
  }

  /**
   * Creates a validator for email format validation
   */
  createEmailValidator(): FieldValidateFn<unknown, string, string> {
    return ({ value }) => {
      if (!value) return 'An email is required';

      const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !EMAIL_REGEX.test(value as string)
        ? 'Please enter a valid email address'
        : undefined;
    };
  }
}
