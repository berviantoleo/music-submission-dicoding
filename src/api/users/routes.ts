import { ServerRoute } from "@hapi/hapi";
import UsersHandler from "./handler";

const routes = (handler: UsersHandler): ServerRoute[] => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.getUserByIdHandler,
  },
];

export default routes;
