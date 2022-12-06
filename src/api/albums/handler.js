class AlbumsHandler {
    constructor(albumsService, validator, cacheService, storageService) {
        this._albumsService = albumsService;
        this._validator = validator;
        this._cacheService = cacheService;
        this._storageService = storageService;
    }

    async postAlbumHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload);
        const albumId = await this._albumsService.addAlbum(request.payload);

        const response = h.response({
            status: 'success',
            message: 'Album berhasil ditambahkan',
            data: {
                albumId,
            },
        });

        response.code(201);
        return response;
    }

    async getAllAlbumsHandler() {
        const albums = await this._albumsService.getAlbums();
        return {
            status: 'success',
            data: {
                albums,
            },
        };
    }

    async getAlbumByIdHandler(request) {
        const { id } = request.params;
        const album = await this._albumsService.getAlbumById(id);
        return {
            status: 'success',
            data: {
                album,
            },
        };
    }

    async putAlbumByIdHandler(request) {
        this._validator.validateAlbumPayload(request.payload);
        const { id } = request.params;

        await this._albumsService.editAlbumById(id, request.payload);

        return {
            status: 'success',
            message: 'Album berhasil diperbarui',
        };
    }

    async deleteAlbumByIdHandler(request) {
        const { id } = request.params;
        await this._albumsService.deleteAlbumById(id);
        return {
            status: 'success',
            message: 'Album berhasil ditambahkan',
        };
    }

    async postAlbumCoverHandler(request, h) {
        const { id } = request.params;
        const { cover } = request.payload;
        this._validator.validateImageHeaders(cover.hapi.headers);
        const filepath = await this._storageService.writeFile(cover, cover.hapi);

        await this._albumsService.addAlbumCover(id, filepath);

        return h.response({
            status: 'success',
            message: 'Sampul berhasil diunggah',
        }).code(201);
    }

    async postAlbumLikesHandler(request, h) {
        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;
        await this._albumsService.getAlbumById(id);
        const message = await this._albumsService.postAlbumLikes(id, credentialId);

        // delete cache
        await this._cacheService.delete(`albumLikes:${id}`);

        return h.response({
            status: 'success',
            message: message,
        }).code(201);
    }

    async getAlbumLikesHandler(request, h) {
        const { id } = request.params;
        try {
            const likes = await this._cacheService.get(`albumLikes:${id}`);

            return h.response({
                status: 'success',
                data: likes
            }).header('X-Data-Source', 'cache');
        } catch(error) {
            const likes = await this._albumsService.getAlbumLikes(id);

            // set cache
            await this._cacheService.set(`albumLikes:${id}`, JSON.stringify(likes), 1800);

            return h.response({
                status: 'success',
                data: likes,
            });
        }
    }
}

module.exports = AlbumsHandler;
