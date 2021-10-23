import { Plugin, Server } from '@hapi/hapi';
import UsersService from '../../services/db/UsersService';
import { UserValidator } from '../../validator/users';
import UsersHandler from './handler';
import routes from './routes';

export interface UserPluginOptions {
  service: UsersService;
  validator: UserValidator;
}

const userPlugin: Plugin<UserPluginOptions> = {
  name: 'users',
  version: '1.0.0',
  register: async (server: Server, { service, validator }: UserPluginOptions) => {
    const usersHandler = new UsersHandler(service, validator);
    server.route(routes(usersHandler));
  },
};

export default userPlugin;