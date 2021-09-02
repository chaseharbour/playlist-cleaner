const { default: axios } = require("axios");
const passport = require("passport");

const router = require("express").Router();

const getSpotifyPlaylists = async (req, res, next) => {
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: {
          Authorization: `token ${req.session.passport?.user?.accessToken}`,
        },
      }
    );
    console.log(response);
    return res.json(response);
  } catch (err) {
    console.error(err);
  }
};

router.get(
  "/playlists",
  passport.authenticate("spotify", { failureRedirect: "/login" }),
  (req, res) => {
    getSpotifyPlaylists(req, res);
  }
);

module.exports = router;
