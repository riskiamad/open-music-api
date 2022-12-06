const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums',
        handler: (request, h) => handler.postAlbumHandler(request, h),
    },
    {
        method: 'GET',
        path: '/albums',
        handler: () => handler.getAllAlbumsHandler(),
    },
    {
        method: 'GET',
        path: '/albums/{id}',
        handler: (request) => handler.getAlbumByIdHandler(request),
    },
    {
        method: 'PUT',
        path: '/albums/{id}',
        handler: (request) => handler.putAlbumByIdHandler(request),
    },
    {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: (request) => handler.deleteAlbumByIdHandler(request),
    },
    {
        method: 'POST',
        path: '/albums/{id}/covers',
        handler: (request, h) => handler.postAlbumCoverHandler(request, h),
        options: {
            payload: {
                maxBytes: 512 * 1000,
                allow: 'multipart/form-data',
                multipart: true,
                output: 'stream',
            },
        },
    },
    {
        method: 'POST',
        path: '/albums/{id}/likes',
        handler: (request, h) => handler.postAlbumLikesHandler(request, h),
        options: {
            auth: 'open_music_jwt',
        },
    },
    {
        method: 'GET',
        path: '/albums/{id}/likes',
        handler: (request, h) => handler.getAlbumLikesHandler(request, h),
    },
];

module.exports = routes;
