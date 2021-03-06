exports.up = (pgm) => {
  pgm.createTable('collaborations', {
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
    userId: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users',
      onDelete: 'cascade'
    },
  });

  pgm.addConstraint('collaborations', 'collaborations_unique', {
    unique: ["playlistId", "userId"]
  });
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};