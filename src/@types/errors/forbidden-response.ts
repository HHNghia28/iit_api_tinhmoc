import ErrorResponse from './error-response';

export default class ForbiddenResponse extends ErrorResponse {
  constructor(errors: any, message?: string) {
    super(errors, 403, message || 'Forbidden');
  }
}
