import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsStringOrArrayConstant implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    // Use a regex pattern for basic validation or a third-party library for accurate validation

    return (
      !!value &&
      (typeof value === 'string' || (Array.isArray(value) && value.length > 0))
    );
  }

  defaultMessage(): string {
    return 'Must be a string or an array with at least one element';
  }
}

// Custom decorator function
export function IsStringOrArray(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStringOrArrayConstant,
    });
  };
}
