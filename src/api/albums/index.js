const AlbumsHandler = require('./handler');
const routes = require('./routes');

const albumsPlugin = {
    name: 'albums',
    version: '1.0.0',
    register: async (server, {
        albumsService,
        validator,
        cacheService,
        storageService,
    }) => {
        const albumsHandler = new AlbumsHandler(
            albumsService,
            validator,
            cacheService,
            storageService,
        );
        server.route(routes(albumsHandler));
    },
};

module.exports = albumsPlugin;
