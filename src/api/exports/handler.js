const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(service, playlistService, validator) {
    this.service = service;
    this.playlistService = playlistService;
    this.validator = validator;

    this.exportPlaylist = this.exportPlaylist.bind(this);
  }

  async exportPlaylist(request, h) {
    try {
      this.validator.validateExportNotesPayload(request.payload);
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this.playlistService.verifyPlaylistOwner(playlistId, credentialId);
      const message = {
        playlistId,
        targetEmail: request.payload.targetEmail,
      };
      await this.service.sendMessage('export:playlist', JSON.stringify(message));
      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
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

module.exports = ExportsHandler;
