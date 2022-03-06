const knex = require("./knex");

module.exports = {
  async findOrCreateUser(username, spotifyId) {
    try {
      const res = await knex
        .select("id", "user_spotifyId")
        .from("users")
        .where("user_spotifyId", spotifyId)
        .then((userList) => {
          if (userList.length === 0) {
            return knex("users")
              .returning(["username", "user_spotifyId"])
              .insert({ username, user_spotifyId: spotifyId })
              .then((newUser) => {
                console.log(`Inserted new user: ${newUser[0].user_spotifyId}`);
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
};
