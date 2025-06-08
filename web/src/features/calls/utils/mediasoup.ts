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

export { getUserMediaStream };
