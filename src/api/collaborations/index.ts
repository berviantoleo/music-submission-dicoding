import { Server, Plugin } from "@hapi/hapi";
import CollaborationsService from "../../services/db/CollaborationsService";
import PlaylistsService from "../../services/db/PlaylistsService";
import { CollaborationsValidator } from "../../validator/collaborations";

import CollaborationsHandler from './handler';
import routes from './routes';

export interface CollaborationPluginOptions {
  collaborationsService: CollaborationsService;
  playlistsService: PlaylistsService;
  validator: CollaborationsValidator;
}

const collaborationPlugin: Plugin<CollaborationPluginOptions> = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server: Server, { collaborationsService, playlistsService, validator }: CollaborationPluginOptions) => {
    const collaborationsHandler = new CollaborationsHandler(
      collaborationsService, playlistsService, validator,
    );
    server.route(routes(collaborationsHandler));
  },
};

export default collaborationPlugin;
