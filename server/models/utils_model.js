const knex = require("./knex");

module.exports = {
  getAll(table) {
    return knex(table);
  },
  getOne(table, id) {
    return knex(table).where("id", id).first();
  },
  getOneSpotifyId(table, type, id) {
    return knex(table).where(`${type}_spotifyId`, id).first();
  },
};
