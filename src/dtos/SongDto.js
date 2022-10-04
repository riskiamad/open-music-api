const mapSongToModel = ({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    album_id,
    created_at,
    updated_at,
}) => ({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    albumId: album_id,
    createdAt: created_at,
    updatedAt: updated_at,
});

const mapSongToList = ({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    album_id,
    created_at,
    updated_at,
}) => ({
    id: id,
    title: title,
    performer: performer,
})

module.exports = { mapSongToModel, mapSongToList };