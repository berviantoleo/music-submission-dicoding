const routes = (handler) => [
  {
    method: 'POST',
    path: '/exports/playlist/{id}',
    handler: handler.exportPlaylist,
    options: {
      auth: 'songsapp_jwt',
    },
  },
];

module.exports = routes;
