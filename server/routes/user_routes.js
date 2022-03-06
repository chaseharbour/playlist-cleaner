const router = require("express").Router();
const queries = require("../db/dbqueries");

router.get("/", async (req, res) => {
  const userData = await queries.join("playlists", "users", "user_id", "id");

  res.send(userData);
});

module.exports = router;
