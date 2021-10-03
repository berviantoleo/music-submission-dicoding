import Joi from 'joi';
import { UserCreationRequest } from '../../models/requests/UserCreationRequest';

const UserPayloadSchema = Joi.object<UserCreationRequest, true>({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
});

export { UserPayloadSchema };
