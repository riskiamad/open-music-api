/* eslint-disable camelcase */
const mapAlbumToModel = ({
    id,
    name,
    year,
    coverurl,
    songs,
}) => ({
    id,
    name,
    year,
    coverUrl: coverurl,
    songs,
});

module.exports = { mapAlbumToModel };
