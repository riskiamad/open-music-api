/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('playlists', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'VARCHAR(150)',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            references: 'users',
            notNull: true,
            foreignKeys: true,
            onDelete: 'cascade',
        },
    });
    pgm.createTable('playlist_songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            references: 'playlists',
            notNull: true,
            foreignKeys: true,
            onDelete: 'cascade',
        },
        song_id: {
            type: 'VARCHAR(50)',
            references: 'songs',
            notNull: true,
            foreignKeys: true,
            onDelete: 'cascade',
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('playlist_songs');
    pgm.dropTable('playlists');
};
