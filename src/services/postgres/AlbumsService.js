const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const {mapAlbumsToModel} = require('../../dtos/AlbumDto');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const {mapSongToList} = require("../../dtos/SongDto");

class AlbumsService {
    constructor() {
        this._pool = new Pool();
    }

    async addAlbum({ name, year }) {
        const id = nanoid(16);
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
            values: [id, name, year, createdAt, updatedAt],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Album gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getAlbums() {
        const result = await this._pool.query('SELECT * FROM albums');
        for (const res of result.rows) {
            const query = {
                text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
                values: [res.id],
            };
            const songs = await this._pool.query(query);
            if (songs.rows.length) {
                res.songs = songs.rows.map(mapSongToList);
            }
        };
        return result.rows.map(mapAlbumsToModel);
    }

    async getAlbumById(id) {
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Album tidak ditemukan');
        }

        const query2 = {
            text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
            values: [result.rows[0].id],
        };
        const songs = await this._pool.query(query2);

        if (result.rows.length) {
            result.rows[0].songs = songs.rows.map(mapSongToList);
        }

        return result.rows.map(mapAlbumsToModel)[0];
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
}

module.exports = AlbumsService;




