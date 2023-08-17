import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import UploadService from "../../services/aws/UploadService";
import { UploadsValidator } from "../../validator/uploads";

class UploadsHandler {
  private validator: UploadsValidator;
  private service: UploadService;

  constructor(service: UploadService, validator: UploadsValidator) {
    this.service = service;
    this.validator = validator;

    this.uploadPictures = this.uploadPictures.bind(this);
  }

  async uploadPictures(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = request.payload as Record<string, any>;
    this.validator.validateImageHeaders(data.hapi.headers);
    const pictureUrl = await this.service.writeFile(data, data.hapi);
    const response = h.response({
      status: 'success',
      data: {
        pictureUrl,
      },
    });
    response.code(201);
    return response;
  }
}

export default UploadsHandler;
