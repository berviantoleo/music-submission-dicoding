import Joi from 'joi';

const ExportNotesPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: { allow: true } }).required(),
});

export default ExportNotesPayloadSchema;
