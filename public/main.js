let connected = false;
let localMediaEl = document.getElementById('local-media');
let remoteMediaEl = document.getElementById('remote-media');
let buttonEl = document.querySelector('button');
let localNameEl = document.getElementById('local-name');
let remoteNameEl = document.getElementById('remote-name');

function connectToRoom() {
  if (connected) {
    return;
  }

  fetch('/token')
    .then(resp => resp.json())
    .then(({ token, room }) => {
      Twilio.Video.connect(token, {
        audio: false,
        video: true,
        name: room,
      }).then(room => {
        connected = true;
        localNameEl.innerText = room.localParticipant.identity;
        room.localParticipant.tracks.forEach(track => {
          localMediaEl.appendChild(track.attach());
        });

        room.participants.forEach(participant => {
          remoteNameEl.innerText = participant.identity;
          participant.tracks.forEach(track => {
            remoteMediaEl.appendChild(track.attach());
          });
        });

        room.on('participantAdded', participant => {
          remoteNameEl.innerText = participant.identity;
        });

        room.on('trackAdded', track => {
          remoteMediaEl.appendChild(track.attach());
        });
      });
    });
}

buttonEl.addEventListener('click', connectToRoom);
