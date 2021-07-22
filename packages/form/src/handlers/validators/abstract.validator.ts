import { Log, Validator } from '@leanup/lib';

export abstract class AbstractValidator {
  private readonly state = {
    message: `An unknown validation error occurred.`,
  };

  constructor(message: string) {
    this.message = message;
  }

  set message(message: string) {
    if (Validator.isString(message, 1)) {
      this.state.message = message;
    } else {
      Log.error(`The message of the validator should be type of string with a min-length of 1.`);
    }
  }
  get message(): string {
    return this.state.message;
  }

  abstract valid(value: any): boolean;
}
