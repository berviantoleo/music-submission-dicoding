import ExportNotesPayloadSchema from './schema';
import InvariantError from '../../exceptions/InvariantError';
import { ExportRequest } from '../../models/requests/ExportRequest';

export interface ExportsValidator {
  validateExportNotesPayload(payload: ExportRequest): void;
}

const exportsValidator: ExportsValidator = {
  validateExportNotesPayload: (payload: ExportRequest) => {
    const validationResult = ExportNotesPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default exportsValidator;
