const axios = require("axios");
const passport = require("passport");

const router = require("express").Router();

const trackName = "Devil in a new dress";
const resLimit = 5;
const artist = "";
const filterType = "track";

const getSpotifyPlaylists = async (req, res, next) => {
  try {
    // console.log(req.session);
    const response = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: {
          Authorization: `Bearer ${req.session.passport?.user?.accessToken}`,
        },
      }
    );
    console.log(response);
    return res.json(response.data.items.map((p) => p));
  } catch (err) {
    console.error(err);
  }
};

const getSpotifyTrack = async (req, res, next) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${trackName}&type=track&limit=${resLimit}`,
      {
        headers: {
          Authorization: `Bearer ${req.session.passport?.user?.accessToken}`,
        },
      }
    );

    const artists = response.data.tracks.items.map((t) =>
      t.artists.map((a) => a.name)
    );
    const trackID = response.data.tracks.items.map((t) => t.id);
    const trackNames = response.data.tracks.items.map((t) => t.name);

    return res.json({ ids: trackID, trackNames, artists });
  } catch (err) {
    console.error(err);
  }
};

router.get(
  "/playlists",
  // passport.authenticate("spotify", { failureRedirect: "/auth/login" }),
  (req, res) => {
    getSpotifyPlaylists(req, res);
    // res.json(response.data.items);
  }
);

router.get("/search", (req, res) => {
  getSpotifyTrack(req, res);
});

module.exports = router;
