async function getUserMediaStream() {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  const audioTrack = stream.getAudioTracks()[0];
  const videoTrack = stream.getVideoTracks()[0];

  if (!audioTrack || !videoTrack)
    throw new Error("Missing audio or video track");

  return { stream, audioTrack, videoTrack };
}

async function getUserAudioStream() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const audioTrack = stream.getAudioTracks()[0];

  if (!audioTrack) throw new Error("No audio track found");

  return { stream, audioTrack };
}

async function getUserDisplayStream() {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true,
  });

  const screenTrack = stream.getVideoTracks()[0];

  if (!screenTrack) throw new Error("No screen track found");

  return { stream, screenTrack };
}

export { getUserMediaStream, getUserAudioStream, getUserDisplayStream };
