import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { LoginRequest } from '../../models/requests/LoginRequest';
import { RefreshTokenRequest } from '../../models/requests/RefreshTokenRequest';
import { MessageDataResponse } from '../../models/response/MessageDataResponse';
import { MessageResponse } from '../../models/response/MessageResponse';
import AuthenticationsService from "../../services/db/AuthenticationsService";
import UsersService from "../../services/db/UsersService";
import { TokenManager } from '../../tokenize/TokenManager';
import { AuthenticationsValidator } from '../../validator/authentications';

class AuthenticationsHandler {
  private authenticationsService: AuthenticationsService;
  private usersService: UsersService;
  private tokenManager: TokenManager;
  private validator: AuthenticationsValidator;
  constructor(authenticationsService: AuthenticationsService,
    usersService: UsersService,
    tokenManager: TokenManager,
    validator: AuthenticationsValidator) {
    this.authenticationsService = authenticationsService;
    this.usersService = usersService;
    this.tokenManager = tokenManager;
    this.validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    this.validator.validatePostAuthenticationPayload(request.payload as LoginRequest);
    const { username, password } = request.payload as { username: string, password: string };
    const id = await this.usersService.verifyUserCredential(username, password);

    const accessToken = this.tokenManager.generateAccessToken({ id });
    const refreshToken = this.tokenManager.generateRefreshToken({ id });

    await this.authenticationsService.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request: Request): Promise<MessageDataResponse<string>> {
    this.validator.validatePutAuthenticationPayload(request.payload as RefreshTokenRequest);
    const { refreshToken } = request.payload as { refreshToken: string };
    await this.authenticationsService.verifyRefreshToken(refreshToken);
    const { id } = this.tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = this.tokenManager.generateAccessToken({ id });
    return {
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request: Request): Promise<MessageResponse> {
    this.validator.validateDeleteAuthenticationPayload(request.payload as RefreshTokenRequest);
    const { refreshToken } = request.payload as { refreshToken: string };
    await this.authenticationsService.verifyRefreshToken(refreshToken);
    await this.authenticationsService.deleteRefreshToken(refreshToken);
    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    };
  }
}

export default AuthenticationsHandler;
