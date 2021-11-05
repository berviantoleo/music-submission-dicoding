import Hapi from '@hapi/hapi';
import { plugin as Jwt } from '@hapi/jwt';

import sequelize from './sequelize';

import ClientError from './exceptions/ClientError';

// songs
import songs, { SongPluginOptions } from './api/songs';
import SongService from './services/db/SongService';
import SongsValidator from './validator/songs';

// users
import users, { UserPluginOptions } from './api/users';
import UsersService from './services/db/UsersService';
import UsersValidator from './validator/users';

// authentications
import authentications from './api/authentications';
import tokenManager from './tokenize/TokenManager';
import AuthenticationsService from './services/db/AuthenticationsService';
import AuthenticationsValidator from './validator/authentications';
import { AuthenticationPluginOptions } from './api/authentications';

// playlists
import playlists from './api/playlists';
import PlaylistsService from './services/db/PlaylistsService';
import PlaylistsValidator from './validator/playlists';
import { PlaylistsPluginOptions } from './api/playlists';

// collaborations
import collaborations from './api/collaborations';
import CollaborationsService from './services/db/CollaborationsService';
import CollaborationsValidator from './validator/collaborations';
import { CollaborationPluginOptions } from './api/collaborations';

// uploads
import uploads from './api/uploads';
import UploadService from './services/aws/UploadService';
import UploadsValidator from './validator/uploads';
import { UploadPluginOptions } from './api/uploads';

// exports
// eslint-disable-next-line no-underscore-dangle
import _exports from './api/exports';
import ProducerService from './services/rabbitmq/ProducerService';
import ExportsValidator from './validator/exports';
import { ExportsPluginOptions } from './api/exports';

// cache
import CacheService from './services/redis/CacheService';

const init = async () => {
  const cacheService = new CacheService();
  const songService = new SongService(cacheService, sequelize);
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService, songService, cacheService);
  const uploadService = new UploadService();

  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || "localhost",
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('songsapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts: { decoded: { payload: { id: string } } }) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // plugins
  const authenticationPlugin: Hapi.ServerRegisterPluginObject<AuthenticationPluginOptions> = {
    plugin: authentications,
    options: {
      usersService: usersService,
      authenticationsService: authenticationsService,
      tokenManager: tokenManager,
      validator: AuthenticationsValidator
    }
  };

  const collaborationPlugin: Hapi.ServerRegisterPluginObject<CollaborationPluginOptions> = {
    plugin: collaborations,
    options: {
      collaborationsService: collaborationsService,
      playlistsService: playlistsService,
      validator: CollaborationsValidator
    }
  };

  const exportsPlugin: Hapi.ServerRegisterPluginObject<ExportsPluginOptions> = {
    plugin: _exports,
    options: {
      service: ProducerService,
      playlistsService: playlistsService,
      validator: ExportsValidator
    }
  }

  const playlistPlugin: Hapi.ServerRegisterPluginObject<PlaylistsPluginOptions> = {
    plugin: playlists,
    options: {
      playlistsService: playlistsService,
      validator: PlaylistsValidator
    }
  }

  const songPlugin: Hapi.ServerRegisterPluginObject<SongPluginOptions> = {
    plugin: songs,
    options: {
      service: songService,
      validator: SongsValidator,
    },
  };

  const uploadPlugin: Hapi.ServerRegisterPluginObject<UploadPluginOptions> = {
    plugin: uploads,
    options: {
      service: uploadService,
      validator: UploadsValidator
    }
  };

  const userPlugin: Hapi.ServerRegisterPluginObject<UserPluginOptions> = {
    plugin: users,
    options: {
      service: usersService,
      validator: UsersValidator
    }
  };

  await server.register([
    authenticationPlugin,
    collaborationPlugin,
    exportsPlugin,
    playlistPlugin,
    songPlugin,
    uploadPlugin,
    userPlugin,
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    if (response instanceof ClientError) {
      // membuat response baru dari response toolkit sesuai kebutuhan error handling
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code((response as ClientError).statusCode);
      return newResponse;
    }
    // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue || response;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
