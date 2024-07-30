import ErrorResponse from './error-response';

export default class UnauthorizedReponse extends ErrorResponse {
  constructor(errors: any, message?: string) {
    super(errors, 401, message || 'Unauthorized');
  }
}
