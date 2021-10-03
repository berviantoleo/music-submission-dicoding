import { Request } from "@hapi/hapi";
import InvariantError from '../../exceptions/InvariantError';
import { ImageHeadersSchema } from './schema';

export interface UploadsValidator {
  validateImageHeaders(headers: Request): void;
}

const uploadsValidator : UploadsValidator = {
  validateImageHeaders: (headers: Request) => {
    const validationResult = ImageHeadersSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default uploadsValidator;
