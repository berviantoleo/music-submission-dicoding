const routes = (handler) => [
  {
    method: 'POST',
    path: '/upload/pictures',
    handler: handler.uploadPictures,
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 500000, // 500KB
      },
    },
  },
];

module.exports = routes;
