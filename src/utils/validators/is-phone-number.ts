import { isValidPhoneNumber } from 'libphonenumber-js';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(phoneNumber: string): boolean {
    // Use a regex pattern for basic validation or a third-party library for accurate validation

    return !!phoneNumber && isValidPhoneNumber(phoneNumber, 'VN');
  }

  defaultMessage(): string {
    return 'Invalid phone number format';
  }
}

// Custom decorator function
export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneNumberConstraint,
    });
  };
}
