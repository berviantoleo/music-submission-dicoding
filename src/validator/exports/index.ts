import ExportNotesPayloadSchema from './schema';
import InvariantError from '../../exceptions/InvariantError';

export interface ExportsValidator {
  validateExportNotesPayload(payload: any): void;
}

const exportsValidator: ExportsValidator = {
  validateExportNotesPayload: (payload: any) => {
    const validationResult = ExportNotesPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default exportsValidator;
