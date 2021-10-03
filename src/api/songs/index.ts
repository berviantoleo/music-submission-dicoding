import { Server, Plugin } from '@hapi/hapi';
import SongService from '../../services/db/SongService';
import { SongValidator } from '../../validator/songs';
import SongsHandler from './handler';
import routes from './routes';

export interface SongPluginOptions {
  service: SongService;
  validator: SongValidator;
}

const userPlugin: Plugin<SongPluginOptions> = {
  name: 'songs',
  version: '1.0.0',
  register: async (server: Server, { service, validator }: SongPluginOptions) => {
    const songsHandler = new SongsHandler(service, validator);
    server.route(routes(songsHandler));
  },
};

export default userPlugin;
