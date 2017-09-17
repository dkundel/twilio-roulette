let connected = false;
let $localMedia = document.getElementById('local-media');
let $remoteMedia = document.getElementById('remote-media');
let $buttonConnect = document.getElementById('button-connect');

function connectToRoom() {
  if (connected) {
    return;
  }

  fetch('/token')
    .then(resp => resp.json())
    .then(({ token, room }) => {
      Twilio.Video
        .connect(token, { audio: false, video: true, name: room })
        .then(room => {
          connected = true;
          room.localParticipant.tracks.forEach(track => {
            $localMedia.appendChild(track.attach());
          });

          room.participants.forEach(partcipant => {
            partcipant.tracks.forEach(track => {
              $remoteMedia.appendChild(track.attach());
            });
          });

          room.on('trackAdded', track => {
            $remoteMedia.appendChild(track.attach);
          });
        });
    });
}

$buttonConnect.addEventListener('click', connectToRoom);
