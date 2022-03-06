/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("songs", (table) => {
    table.increments();
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("cascade");
    table
      .integer("playlist_id")
      .notNullable()
      .references("id")
      .inTable("playlists")
      .onDelete("cascade");
    table.string("track_spotifyId");
    table.string("track_name");
    table.json("artists");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("songs");
};
