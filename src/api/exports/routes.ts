import { ServerRoute } from "@hapi/hapi";
import ExportsHandler from "./handler";

const routes = (handler: ExportsHandler): ServerRoute[] => [
  {
    method: 'POST',
    path: '/exports/playlists/{id}',
    handler: handler.exportPlaylist,
    options: {
      auth: 'songsapp_jwt',
    },
  },
];

export default routes;
