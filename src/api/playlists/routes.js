const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists',
        handler: (request, h) => handler.postPlaylistHandler(request, h),
        options: {
            auth: 'open_music_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists',
        handler: (request) => handler.getAllOwnedPlaylistsHandler(request),
        options: {
            auth: 'open_music_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}',
        handler: (request) => handler.deletePlaylistByIdHandler(request),
        options: {
            auth: 'open_music_jwt',
        },
    },
    {
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: (request, h) => handler.postSongToPlaylistHandler(request, h),
        options: {
            auth: 'open_music_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists/{id}/songs',
        handler: (request) => handler.getSongsInPlaylistHandler(request),
        options: {
            auth: 'open_music_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}/songs',
        handler: (request) => handler.removeSongFromPlaylistHandler(request),
        options: {
            auth: 'open_music_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists/{id}/activities',
        handler: (request) => handler.getPlaylistActivitiesHandler(request),
        options: {
            auth: 'open_music_jwt',
        },
    },
];

module.exports = routes;
