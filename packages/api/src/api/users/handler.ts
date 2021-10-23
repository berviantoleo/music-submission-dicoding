import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { StatusDataResponse } from '../../models/response/DataResponse';
import { User } from '../../models/User';
import { UserCreationRequest } from '../../models/requests/UserCreationRequest';
import UsersService from '../../services/db/UsersService';
import { UserValidator } from '../../validator/users';

class UsersHandler {
  private service: UsersService;
  private validator: UserValidator;

  constructor(service: UsersService, validator: UserValidator) {
    this.service = service;
    this.validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async postUserHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    const payload = request.payload as UserCreationRequest;
    this.validator.validateUserPayload(payload);
    const { username, password, fullname } = payload;
    const userId = await this.service.addUser({ username, password, fullname });
    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async getUserByIdHandler(request: Request): Promise<StatusDataResponse<User>> {
    const { id } = request.params;
    const user = await this.service.getUserById(id);
    return {
      status: 'success',
      data: {
        user,
      },
    };
  }
}

export default UsersHandler;
