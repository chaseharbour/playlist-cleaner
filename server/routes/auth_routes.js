const router = require("express").Router();
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;

const {
  CLIENT_ID,
  CLIENT_SECRET,
  CLIENT_HOST_ADDRESS = "localhost",
  SERVER_PORT = 8080,
  CLIENT_PORT = 3000,
  SERVER_ADDRESS,
  CALLBACK_URL,
  NODE_ENV = "development",
} = process.env;

passport.use(
  new SpotifyStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
    },
    async (accessToken, refreshToken, expires_in, profile, done) => {
      const spotifyId = profile.id;
      const name = profile.displayName;
      // const email = profile?.emails[0]?.value;

      const user = { spotifyId, name, accessToken, refreshToken, expires_in };

      return done(null, user);
    }
  )
);

router.get(
  "/spotify",
  passport.authenticate("spotify", { scope: ["user-read-private"] })
);

router.get(
  "/spotify/callback",
  passport.authenticate("spotify", { failureRedirect: "/login" }),
  (req, res) => {
    // console.log(req.user);
    // console.log(req.session);
    res.redirect("/");
  }
);

router.get("/login", (req, res) => {
  res.send("Please log in.");
});

module.exports = router;
