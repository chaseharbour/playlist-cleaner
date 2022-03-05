const knex = require("./knex");

module.exports = {
  getAll(table) {
    return knex(table);
  },
  async findOrCreateUser(username, spotifyId) {
    try {
      const res = await knex
        .select("spotifyId")
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
          return userList[0].spotifyId;
        });

      return res;
    } catch (err) {
      console.log("Something went wrong.");
      console.error(err);
      process.exit(1);
    }
  },
  async addPlaylist(id, spotifyId, name, description, ownerId, ownerName) {
    try {
      const res = await knex
        .select("id")
        .from("users")
        .where("id", id)
        .then((userList) => {
          if (userList > 0) {
            knex
              .select("spotifyId")
              .from("playlists")
              .where("spotifyId", spotifyId)
              .then((playlist) => {
                if (playlist.length === 0) {
                  return knex("playlists")
                    .returning([
                      "spotifyId",
                      "name",
                      "description",
                      "ownerId",
                      "ownerName",
                    ])
                    .insert({
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
              });
          }
          return userList;
        });
      return res;
    } catch (err) {
      console.log("Something went wrong.");
      console.error(err);
      process.exit(1);
    }
  },
};
