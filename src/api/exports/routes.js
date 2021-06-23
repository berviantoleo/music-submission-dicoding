const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlist/{id}',
    handler: handler.exportPlaylist,
    options: {
      auth: 'songsapp_jwt',
    },
  },
];

module.exports = routes;
