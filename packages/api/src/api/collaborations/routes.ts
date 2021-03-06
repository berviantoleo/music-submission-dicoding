import { ServerRoute } from "@hapi/hapi";
import CollaborationsHandler from "./handler";

const routes = (handler: CollaborationsHandler): ServerRoute[] => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postCollaborationHandler,
    options: {
      auth: 'songsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollaborationHandler,
    options: {
      auth: 'songsapp_jwt',
    },
  },
];

export default routes;
