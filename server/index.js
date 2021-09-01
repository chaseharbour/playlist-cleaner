const express = require("express");
const app = express();

const session = require("express-session");
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;

const redis = require("redis");
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});
const RedisStore = require("connect-redis")(session);

const dotenv = require("dotenv").config();

const ONE_HOUR = 1000 * 60 * 60 * 1;

const {
  CLIENT_ID,
  CLIENT_SECRET,
  CLIENT_HOST_ADDRESS = "localhost",
  SERVER_PORT = 8080,
  CLIENT_PORT = 3000,
  SERVER_ADDRESS,
  CALLBACK_URL,
  NODE_ENV = "development",
  SESS_LIFETIME = ONE_HOUR,
  SESS_NAME = "sid",
  SESS_SECRET = "somesupersecretstring",
} = process.env;

const IN_PROD = NODE_ENV === "production";

const CLIENT_HOME_PAGE =
  NODE_ENV === "development"
    ? `http://${CLIENT_HOST_ADDRESS}:${CLIENT_PORT}`
    : CLIENT_HOST_ADDRESS;

redisClient.on("error", (err) => console.log(`Redis error: ${err}`));
redisClient.on("ready", () => console.log("Redis connection established."));

//Set up passport-spotify
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

//Create session object with cookie
app.use(
  session({
    name: SESS_NAME,
    store: new RedisStore({ client: redisClient }),
    resave: true,
    saveUninitialized: true,
    secret: SESS_SECRET,
    cookie: {
      maxAge: SESS_LIFETIME,
      sameSite: IN_PROD ? "none" : false,
      secure: IN_PROD,
    },
  })
);

const authCheck = (req, res, next) => {
  if (!req.session.userName) {
    res.status(401).json({
      authenticated: false,
      message: "User has not been authenticated.",
    });
  } else {
    next();
  }
};

app.get("/", authCheck, (req, res) => {
  res.send("Hello World!");
});

app.get("/ping", (req, res) => {
  res.send("PONG DONG");
  console.log("PONG");
});

app.get("/auth/spotify", passport.authenticate("spotify"));

app.get(
  "/auth/spotify/callback",
  passport.authenticate("spotify", { failureRedirect: "/login" }),
  (req, res) => {
    console.log(req.user);
  }
);

app.get("/login", (req, res) => {
  res.send("Please log in.");
});

app.listen(SERVER_PORT, () => {
  console.log(`Example app listening at ${SERVER_ADDRESS}`);
});
