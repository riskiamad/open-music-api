/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('songs',{
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        title: {
            type: 'VARCHAR(150)',
            notNull: true,
        },
        year: {
            type: 'SMALLINT',
            notNull: true,
        },
        genre: {
            type: 'VARCHAR(100)',
            notNull: true,
        },
        performer: {
            type: 'VARCHAR(150)',
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
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
    });
    pgm.createIndex('songs', ['title', 'performer', 'album_id']);
};

exports.down = pgm => {
    pgm.dropIndex('songs', ['title', 'performer', 'album_id']);
    pgm.dropTable('songs');
};
