const knex = require("./knex");

module.exports = {
  async addPlaylist(user_id, spotifyId, name, description, ownerId, ownerName) {
    try {
      const res = await knex
        .select("playlist_spotifyId")
        .from("playlists")
        .where("playlist_spotifyId", spotifyId)
        .then((playlist) => {
          if (playlist.length === 0) {
            return knex("playlists")
              .returning([
                "user_id",
                "playlist_spotifyId",
                "playlist_name",
                "description",
                "ownerId",
                "ownerName",
              ])
              .insert({
                user_id,
                playlist_spotifyId: spotifyId,
                playlist_name: name,
                description,
                ownerId,
                ownerName,
              })
              .then((playlists) => {
                console.log(playlists);
                return playlists;
              });
          }

          console.log(`Playlist already added ${playlist}`);
          return {
            playlist: playlist[0].playlist_spotifyId,
            note: "Playlist already added",
          };
        });

      return res;
    } catch (err) {
      console.log("Something went wrong.");
      console.error(err);
      process.exit(1);
    }
  },
  async addSong(user_id, playlist_id, spotifyId, name, artists) {
    try {
      const res = await knex
        .select("track_spotifyId")
        .from("songs")
        .where("track_spotifyId", spotifyId)
        .then((song) => {
          if (song.length === 0) {
            return knex("songs")
              .returning([
                "user_id",
                "playlist_id",
                "track_spotifyId",
                "track_name",
                "artists",
              ])
              .insert({
                user_id,
                playlist_id,
                track_spotifyId: spotifyId,
                track_name: name,
                artists,
              })
              .then((songs) => {
                console.log(songs);
                return songs;
              });
          }

          console.log(song);
          console.log(`Song already added ${song}`);
          return {
            song: song[0].track_spotifyId,
            note: "Song already added",
          };
        });

      return res;
    } catch (err) {
      console.log("Something went wrong.");
      console.error(err);
      process.exit(1);
    }
  },
};
