import { ServerRoute } from "@hapi/hapi";
import UploadsHandler from "./handler";
const routes = (handler: UploadsHandler): ServerRoute[] => [
  {
    method: 'POST',
    path: '/upload/pictures',
    handler: handler.uploadPictures,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true, // TODO: need to fix this definition
        output: 'stream',
        maxBytes: 500000, // 500KB
      },
    },
  },
];

export default routes;
