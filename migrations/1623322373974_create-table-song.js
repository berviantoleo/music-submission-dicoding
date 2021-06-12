exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'integer',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    genre: {
      type: 'TEXT',
      notNull: true,
    },
    duration: {
      type: 'integer',
      notNull: true,
    },
    insertedAt: {
      type: 'timestamptz',
      notNull: true,
    },
    updatedAt: {
      type: 'timestamptz',
      notNull: true,
    },
  })
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
