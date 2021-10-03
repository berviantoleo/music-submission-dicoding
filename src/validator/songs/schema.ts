import Joi from 'joi';
import { SongRequest } from '../../models/requests/SongRequest';

const SongPayloadSchema = Joi.object<SongRequest>({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(2021)
    .required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number().required(),
});

export { SongPayloadSchema };
