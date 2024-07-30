import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsPriorityConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    // Use a regex pattern for basic validation or a third-party library for accurate validation
    if (!value) return false;
    const number = Number(value);
    return !Number.isNaN(number) && 0 <= number && number <= 4;
  }

  defaultMessage(): string {
    return 'Invalid phone number format';
  }
}

// Custom decorator function
export function IsPriority(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPriorityConstraint,
    });
  };
}
