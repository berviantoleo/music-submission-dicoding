import { Plugin, Server } from "@hapi/hapi";
import PlaylistsService from "../../services/db/PlaylistsService";
import { ProducerService } from "../../services/rabbitmq/ProducerService";
import { ExportsValidator } from "../../validator/exports";

import ExportsHandler from './handler';
import routes from './routes';

export interface ExportsPluginOptions {
  service: ProducerService;
  playlistsService: PlaylistsService;
  validator: ExportsValidator;
}

const exportsPlugin: Plugin<ExportsPluginOptions> = {
  name: 'exports',
  version: '1.0.0',
  register: async (server: Server, { service, playlistsService, validator }: ExportsPluginOptions) => {
    const exportsHandler = new ExportsHandler(service, playlistsService, validator);
    server.route(routes(exportsHandler));
  },
}

export default exportsPlugin;
