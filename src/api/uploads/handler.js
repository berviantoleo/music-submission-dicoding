const ClientError = require('../../exceptions/ClientError');

class UploadsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.uploadPictures = this.uploadPictures.bind(this);
  }

  async uploadPictures(request, h) {
    try {
      const { data } = request.payload;
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
    } catch (error) {
      if (!(error instanceof ClientError)) {
        const response = h.response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami.',
        });
        response.code(500);
        console.error(error);
        return response;
      }

      throw error;
    }
  }
}

module.exports = UploadsHandler;
