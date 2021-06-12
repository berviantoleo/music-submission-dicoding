exports.up = (pgm) => {
  pgm.createTable('playlistsongs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlistId: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'playlists',
      onDelete: 'cascade'
    },
    songId: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'songs',
      onDelete: 'cascade'
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlistsongs');
};