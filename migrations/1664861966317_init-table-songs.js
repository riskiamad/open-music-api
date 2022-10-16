/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('songs',{
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        title: {
            type: 'TEXT',
            notNull: true,
        },
        year: {
            type: 'SMALLINT',
            notNull: true,
        },
        genre: {
            type: 'TEXT',
            notNull: true,
        },
        performer: {
            type: 'TEXT',
            notNull: true,
        },
        duration: {
            type: 'INTEGER',
            notNull: false,
        },
        album_id: {
            type: 'VARCHAR(50)',
            notNull: false,
            references: '"albums"',
            foreignKeys: true,
            onDelete: 'cascade',
        },
        created_at: {
            type: 'TEXT',
            notNull: true,
        },
        updated_at: {
            type: 'TEXT',
            notNull: true,
        },
    });
    pgm.createIndex('songs', ['title', 'performer', 'album_id']);
};

exports.down = pgm => {
    pgm.dropIndex('songs', ['title', 'performer', 'album_id']);
    pgm.dropTable('songs');
};
