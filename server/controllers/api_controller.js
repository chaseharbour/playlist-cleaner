const axios = require("axios");

const apiModel = require("../models/api_model");
const utilsModel = require("../models/utils_model");

module.exports = {
  async getSpotifyPlaylists(req, res, next) {
    try {
      console.log(req.session);
      const response = await axios.get(
        "https://api.spotify.com/v1/me/playlists",
        {
          headers: {
            Authorization: `Bearer ${req.session.passport?.user?.accessToken}`,
          },
        }
      );

      const data = await Promise.all(
        response.data.items.map(async (p) => {
          const query = await apiModel.addPlaylist(
            req.session.user_id,
            p.id,
            p.name,
            p.description,
            p.owner.id,
            p.owner.display_name
          );

          // console.log(query);

          return;
        })
      );

      return data;
    } catch (err) {
      console.error(err);
    }
  },

  async getPlaylistTracks(req, res, next) {
    try {
      const { playlistId } = req.params;
      const playlist_id = await utilsModel.getOneSpotifyId(
        "playlists",
        "playlist",
        playlistId
      );

      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${req.session.passport?.user?.accessToken}`,
          },
        }
      );

      const data = await Promise.all(
        response.data.items.map(async (s) => {
          const query = await apiModel.addSong(
            req.session.user_id,
            playlist_id.id,
            s.track.id,
            s.track.name,
            JSON.stringify(
              s.track.artists.map((a) => {
                return {
                  id: a.id,
                  name: a.name,
                };
              })
            )
          );

          return query;
        })
      );

      res.send(data);
    } catch (err) {
      console.error(err);
    }
  },

  async getRandomPlaylistId(req, res) {
    try {
      const randomPlaylist = await utilsModel
        .getAll("playlists")
        .then((output) => output[Math.floor(Math.random() * output.length)]);

      console.log(randomPlaylist);

      return randomPlaylist.playlist_spotifyId;
    } catch (err) {
      console.error(err);
    }
  },

  async getSpotifyTrack(req, res, next) {
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
  },
};
