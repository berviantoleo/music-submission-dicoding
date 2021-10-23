import { Plugin, Server } from '@hapi/hapi';
import AuthenticationsService from '../../services/db/AuthenticationsService';
import UsersService from '../../services/db/UsersService';
import { TokenManager } from '../../tokenize/TokenManager';
import { AuthenticationsValidator } from '../../validator/authentications';
import AuthenticationsHandler from './handler';
import routes from './routes';

export interface AuthenticationPluginOptions {
  authenticationsService: AuthenticationsService;
  usersService: UsersService;
  tokenManager: TokenManager;
  validator: AuthenticationsValidator;
}

const authenticationPlugin: Plugin<AuthenticationPluginOptions> = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server: Server, {
    authenticationsService,
    usersService,
    tokenManager,
    validator,
  }: AuthenticationPluginOptions) => {
    const authenticationsHandler = new AuthenticationsHandler(
      authenticationsService,
      usersService,
      tokenManager,
      validator,
    );
    server.route(routes(authenticationsHandler));
  },
}

export default authenticationPlugin;
