exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    userId: {
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
};

exports.down = (pgm) => {
  pgm.dropTable('collaborations');
};