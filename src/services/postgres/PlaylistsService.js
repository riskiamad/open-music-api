const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class PlaylistsService {
    constructor(collaborationsService) {
        this._pool = new Pool();
        this._collaborationsService = collaborationsService;
    }

    async addPlaylist( name, owner ) {
        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getPlaylists(owner) {
        const query = {
            text: `SELECT p.id, p.name, u.username FROM playlists p
                   LEFT JOIN collaborations c ON p.id = c.playlist_id
                   LEFT JOIN users u ON u.id = p.owner   
                   WHERE p.owner = $1 OR c.user_id = $1`,
            values: [owner],
        };

        const { rows } = await this._pool.query(query);
        return rows;
    }

    async deletePlaylistById(id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Playlist gagal dihapus');
        }
    }

    async addSongToPlaylist(playlistId, songId) {
        const id = `playlist-songs-${nanoid(16)}`;
        const query = {
            text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Lagu gagal di tambahkan kedalam playlist');
        }
    }

    async getPlaylistById(id) {
        const query = {
            text: `SELECT p.id, p.name, u.username FROM playlists p
                   JOIN users u ON u.id = p.owner
                   WHERE p.id = $1`,
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        const query2 = {
            text: `SELECT s.id, s.title, s.performer FROM playlists p
                   LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
                   LEFT JOIN songs s ON s.id = ps.song_id
                   WHERE p.id = $1`,
            values: [result.rows[0].id],
        };

        const songs = await this._pool.query(query2);

        if (result.rowCount) {
            result.rows[0].songs = songs.rows;
        }

        return result.rows[0];
    }

    async removeSongFromPlaylist(playlistId, songId) {
        const query = {
            text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Lagu gagal dihapus dari playlist')
        }
    }

    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        const playlist = result.rows[0];

        if (playlist.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async verifyPlaylistAccess(playlistId, userId) {
        try {
            await this.verifyPlaylistOwner(playlistId, userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            try {
                await this._collaborationsService.verifyCollaborator(playlistId, userId);
            } catch {
                throw error;
            }
        }
    }

    async savePlaylistActivity(playlistId, songId, userId, action) {
        const id = `playlist-act${nanoid(16)}`;
        const time = new Date().toISOString();

        const query = {
            text: 'INSERT INTO playlist_activities VALUES($1, $2, $3, $4, $5, $6)',
            values: [id, playlistId, songId, userId, action, time],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Gagal menyimpan aktifitas playlist');
        }
    }

    async getPlaylistActivities(id) {
        console.log(id);
        const query = {
            text: `SELECT u.username, s.title, pa.action, pa.time FROM playlist_activities pa
                   JOIN users u ON u.id = pa.user_id
                   JOIN songs s ON s.id = pa.song_id
                   WHERE pa.playlist_id = $1
                   ORDER BY pa.time ASC`,
            values: [id],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }
}

module.exports = PlaylistsService;
