const path = require('path');
const express = require('express');
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const randomUsername = require('./randos');

// Substitute your Twilio AccountSid and ApiKey details
const { TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET } = process.env;
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/token', (req, res) => {
  // Create an Access Token
  const accessToken = new AccessToken(
    TWILIO_ACCOUNT_SID,
    TWILIO_API_KEY,
    TWILIO_API_SECRET
  );
  const identity = randomUsername();
  const room = getRoomId();

  // Set the Identity of this token
  accessToken.identity = identity;

  // Grant access to Video
  const grant = new VideoGrant();
  grant.room = room;
  accessToken.addGrant(grant);

  // Serialize the token as a JWT
  const token = accessToken.toJwt();

  res.send({ identity, token, room });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

let queue = [];
function getRoomId() {
  if (queue.length > 0) {
    let [id] = queue.splice(0, 1);
    return id;
  } else {
    let id = Math.random()
      .toString(36)
      .substr(2);
    queue.push(id);
    return id;
  }
}
