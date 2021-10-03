import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { CollaborationRequest } from "../../models/requests/CollaborationRequest";
import { MessageResponse } from "../../models/response/MessageResponse";
import CollaborationsService from "../../services/db/CollaborationsService";
import PlaylistsService from "../../services/db/PlaylistsService";
import { CollaborationsValidator } from "../../validator/collaborations";

class CollaborationsHandler {
  private collaborationsService: CollaborationsService;
  private playlistsService: PlaylistsService;
  private validator: CollaborationsValidator;

  constructor(collaborationsService: CollaborationsService, playlistsService: PlaylistsService, validator: CollaborationsValidator) {
    this.collaborationsService = collaborationsService;
    this.playlistsService = playlistsService;
    this.validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    this.validator.validateCollaborationPayload(request.payload as CollaborationRequest);
    const { id: credentialId } = request.auth.credentials as { id: string };
    const { playlistId, userId } = request.payload as { playlistId: string, userId: string };
    await this.playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const collaborationId = await this.collaborationsService.addCollaboration(playlistId, userId);
    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request: Request): Promise<MessageResponse> {
    this.validator.validateCollaborationPayload(request.payload as CollaborationRequest);
    const { id: credentialId } = request.auth.credentials as { id: string };
    const { playlistId, userId } = request.payload as { playlistId: string, userId: string };

    await this.playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this.collaborationsService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

export default CollaborationsHandler;
