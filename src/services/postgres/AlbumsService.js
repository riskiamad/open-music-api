const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const {mapAlbumToModel} = require("../../dtos/AlbumDto");

class AlbumsService {
    constructor() {
        this._pool = new Pool();
    }

    async addAlbum({ name, year }) {
        const id = `album-${nanoid(16)}`;
        const createdAt = new Date().toISOString();

        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $4) RETURNING id',
            values: [id, name, year, createdAt],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Album gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getAlbums() {
        const result = await this._pool.query('SELECT id, name, year FROM albums');
        for (const res of result.rows) {
            const query = {
                text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
                values: [res.id],
            };
            const songs = await this._pool.query(query);
            if (songs.rowCount) {
                res.songs = songs.rows;
            }
        }
        return result.rows;
    }

    async getAlbumById(id) {
        const query = {
            text: 'SELECT id, name, year, cover_url as coverUrl FROM albums WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        const query2 = {
            text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
            values: [result.rows[0].id],
        };
        const songs = await this._pool.query(query2);

        if (result.rowCount) {
            result.rows[0].songs = songs.rows;
        }

        return result.rows.map(mapAlbumToModel)[0];
    }

    async editAlbumById(id, { name, year }) {
        const updatedAt = new Date().toISOString();
        const query = {
            text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
            values: [name, year, updatedAt, id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Gagal memperbarui album');
        }
    }

    async deleteAlbumById(id) {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Album gagal dihapus');
        }
    }

    async postAlbumLikes(albumId, userId) {
        const query = {
            text: `SELECT id FROM user_album_likes WHERE album_id = $1
                   AND user_id = $2`,
            values: [albumId, userId],
        }

        const result = await this._pool.query(query);

        if (result.rowCount) {
            const query2 = {
                text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
                values: [userId, albumId],
            };

            await this._pool.query(query2);

            return 'Anda telah membatalkan untuk menyukai album ini';
        } else {
            const id = `likes-${nanoid(16)}`;
            const query3 = {
                text: 'INSERT INTO user_album_likes values($1, $2, $3)',
                values: [id, userId, albumId],
            };

            await this._pool.query(query3);

            return 'Anda berhasil menyukai album ini';

        }
    }

    async getAlbumLikes(id) {
        const query = {
            text: 'SELECT count(id) as likes FROM user_album_likes WHERE album_id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);
        const albumLikes = result.rows[0];
        albumLikes.likes = parseInt(albumLikes.likes, 10);
        return albumLikes;
    }

    async addAlbumCover(id, filepath) {
        console.log(filepath);
        const query = {
            text: 'UPDATE albums SET cover_url = $1 WHERE id = $2',
            values: [filepath, id],
        };

        await this._pool.query(query);
    }
}

module.exports = AlbumsService;
