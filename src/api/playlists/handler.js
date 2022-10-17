class PlaylistsHandler {
    constructor(playlistsService, songsService, validator) {
        this._playlistsService = playlistsService;
        this._songsService = songsService;
        this._validator = validator;
    }

    async postPlaylistHandler(request, h) {
        this._validator.validatePostPlaylistPayload(request.payload);
        const { name } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        const playlistId = await this._playlistsService.addPlaylist( name, credentialId );

        const response = h.response({
            status: 'success',
            data: {
                playlistId,
            },
        });
        response.code(201);
        return response;
    }

    async getAllOwnedPlaylistsHandler(request) {
        const { id: credentialId } = request.auth.credentials;
        const playlists = await this._playlistsService.getPlaylists(credentialId);
        return {
            status: 'success',
            data: {
                playlists,
            },
        };
    }

    async deletePlaylistByIdHandler(request) {
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;
        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
        await this._playlistsService.deletePlaylistById(playlistId);
        return {
            status: 'success',
            message: 'Playlist berhasil dihapus',
        };
    }

    async postSongToPlaylistHandler(request, h) {
        this._validator.validatePostSongToPlaylistPayload(request.payload);
        const { id: playlistId } = request.params;
        const { songId } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
        await this._songsService.getSongById(songId);
        await this._playlistsService.addSongToPlaylist(playlistId, songId);

        const response = h.response({
            status: 'success',
            message: "Lagu berhasil ditambahkan ke playlist",
        });
        response.code(201);
        return response;
    }

    async getSongsInPlaylistHandler(request) {
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
        const playlist = await this._playlistsService.getPlaylistById(playlistId);

        return {
            status: 'success',
            data: {
                playlist,
            },
        };
    }

    async removeSongFromPlaylistHandler(request) {
        this._validator.validateDeleteSongFromPlaylistPayload(request.payload);
        const { songId } = request.payload;
        const { id: playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
        await this._playlistsService.removeSongFromPlaylist(playlistId, songId);

        return {
            status: 'success',
            message: 'Lagu berhasil dihapus dari playlist',
        };
    }
}

module.exports = PlaylistsHandler;
