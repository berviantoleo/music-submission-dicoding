import { Server, Plugin } from "@hapi/hapi";
import PlaylistsService from "../../services/db/PlaylistsService";
import { PlaylistsValidator } from "../../validator/playlists";
import PlaylistsHandler from './handler';
import routes from './routes';

export interface PlaylistsPluginOptions {
  playlistsService: PlaylistsService;
  validator: PlaylistsValidator;
}

const playlistPlugin: Plugin<PlaylistsPluginOptions> = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server: Server, { playlistsService, validator }: PlaylistsPluginOptions) => {
    const playlistsHandler = new PlaylistsHandler(
      playlistsService, validator,
    );
    server.route(routes(playlistsHandler));
  },
};

export default playlistPlugin;
