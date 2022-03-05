const knex = require("./knex");

module.exports = {
  getAll(table) {
    return knex(table);
  },
  getOne(table, id) {
    return knex(table).where("id", id).first();
  },
  async findOrCreateUser(username, spotifyId) {
    try {
      const res = await knex
        .select("id", "spotifyId")
        .from("users")
        .where("spotifyId", spotifyId)
        .then((userList) => {
          if (userList.length === 0) {
            return knex("users")
              .returning(["username", "spotifyId"])
              .insert({ username, spotifyId })
              .then((newUser) => {
                console.log(`Inserted new user: ${newUser[0].spotifyId}`);
                return newUser;
              });
          }
          console.log("User already exists");
          return userList[0];
        });

      return res;
    } catch (err) {
      console.log("Something went wrong.");
      console.error(err);
      process.exit(1);
    }
  },
  async addPlaylist(user_id, spotifyId, name, description, ownerId, ownerName) {
    try {
      const res = await knex
        .select("spotifyId")
        .from("playlists")
        .where("spotifyId", spotifyId)
        .then((playlist) => {
          if (playlist.length === 0) {
            return knex("playlists")
              .returning([
                "user_id",
                "spotifyId",
                "name",
                "description",
                "ownerId",
                "ownerName",
              ])
              .insert({
                user_id,
                spotifyId,
                name,
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
          return playlist;
        });

      return res;
    } catch (err) {
      console.log("Something went wrong.");
      console.error(err);
      process.exit(1);
    }
  },
};
