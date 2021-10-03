import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { ProducerService } from "../../services/rabbitmq/ProducerService";
import PlaylistsService from '../../services/db/PlaylistsService';
import { ExportsValidator } from "../../validator/exports";
import { ExportRequest } from "../../models/requests/ExportRequest";

class ExportsHandler {
  private service: ProducerService;
  private playlistService: PlaylistsService;
  private validator: ExportsValidator;

  constructor(service: ProducerService, playlistService: PlaylistsService, validator: ExportsValidator) {
    this.service = service;
    this.playlistService = playlistService;
    this.validator = validator;

    this.exportPlaylist = this.exportPlaylist.bind(this);
  }

  async exportPlaylist(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    this.validator.validateExportNotesPayload(request.payload as ExportRequest);
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this.playlistService.verifyPlaylistOwner(playlistId, credentialId as string);
    const { targetEmail } = request.payload as { targetEmail: string };
    const message = {
      playlistId,
      targetEmail: targetEmail,
    };
    await this.service.sendMessage('export:playlist', JSON.stringify(message));
    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}

export default ExportsHandler;
