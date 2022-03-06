const userModel = require("../models/user_model");

module.exports = {
  authCallback(req, res) {
    const response = await userModel.findOrCreateUser(
      req.user.name,
      req.user.spotifyId
    );

    req.session.user_id = response.id;
    res.redirect("/");
  },
};
