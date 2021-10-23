import { Server, Plugin } from "@hapi/hapi";
import UploadService from "../../services/aws/UploadService";
import { UploadsValidator } from "../../validator/uploads";

import UploadsHandler from './handler';
import routes from './routes';

export interface UploadPluginOptions {
  service: UploadService;
  validator: UploadsValidator;
}

const uploadPlugin: Plugin<UploadPluginOptions> = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server: Server, { service, validator }: UploadPluginOptions) => {
    const uploadsHandler = new UploadsHandler(service, validator);
    server.route(routes(uploadsHandler));
  },
}

export default uploadPlugin;
