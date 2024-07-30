import ErrorResponse from './error-response';

export default class BadRequestResponse extends ErrorResponse {
  constructor(errors: any) {
    super(errors, 400, 'Bad request');
  }
}
