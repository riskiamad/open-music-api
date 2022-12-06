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

        return h.response({
            status: 'success',
            data: {
                playlistId,
            },
        }).code(201);
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

        await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
        await this._songsService.getSongById(songId);
        await this._playlistsService.addSongToPlaylist(playlistId, songId);
        await this._playlistsService.savePlaylistActivity(playlistId, songId, credentialId, "add");

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

        await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
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

        await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
        await this._playlistsService.removeSongFromPlaylist(playlistId, songId);
        await this._playlistsService.savePlaylistActivity(playlistId, songId, credentialId, "delete");

        return {
            status: 'success',
            message: 'Lagu berhasil dihapus dari playlist',
        };
    }

    async getPlaylistActivitiesHandler(request) {
        const { id: credentialId } = request.auth.credentials;
        const { id: playlistId } = request.params;

        await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
        const activities = await this._playlistsService.getPlaylistActivities(playlistId);

        return {
            status:'success',
            data: {
                playlistId,
                activities,
            },
        };
    }
}

module.exports = PlaylistsHandler;
