/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("playlists", (table) => {
    table.increments();
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("cascade");
    table.string("playlist_spotifyId");
    table.string("playlist_name");
    table.string("description");
    table.string("ownerId");
    table.string("ownerName");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("playlists");
};
