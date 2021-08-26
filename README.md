# Clean up your spotify playlists

---

A simple app for flagging songs within a spotify playlist that contain user defined "blacklist" words.

## The idea

- User logs in through Spotify auth flow
- User selects playlist to be filtered given all playlists associated with account
- Server gets each song and lyrics from Genius api
- Server filters through the lyrics against the "blacklist" words
- Server sends flagged songs to client to be rendered
