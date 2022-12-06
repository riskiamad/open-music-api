class ExportHandler {
    constructor(exportsService, playlistsService, validator) {
        this._exportsService = exportsService;
        this._playlistsService = playlistsService;
        this._validator = validator;
    }

    async postExportPlaylistsHandler(request, h) {
        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;
        this._validator.validateExportPlaylistsPayload(request.payload);

        await this._playlistsService.verifyPlaylistOwner(id, credentialId);
        const playlist = await this._playlistsService.getPlaylistById(id);
        delete playlist.username;
        const message = {
            playlist: playlist,
            targetEmail: request.payload.targetEmail,
        };

        await this._exportsService.sendMessage('export:playlists', JSON.stringify(message));

        return h.response({
            status: 'success',
            message: 'Permintaan anda dalam antrean'
        }).code(201);
    }
}

module.exports = ExportHandler;
