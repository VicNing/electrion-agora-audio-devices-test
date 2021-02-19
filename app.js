document.querySelector('.join').addEventListener('click', async () => {
  debugger
  let appId = document.querySelector('#appId').value;
  let channel = document.querySelector('#channel').value;
  let token = document.querySelector('#token').value;

  if (!appId.trim()) {
    window.alert('Please provide appId');
    return;
  }

  if (!channel.trim()) {
    window.alert('Please provide channel');
    return;
  }

  document.querySelector('.local').style.display = 'block';
  const client = AgoraRTC.createClient({ mode: "rtc", codec: 'h264' });
  await client.join(appId.trim(), channel.trim(), token ? token.trim() : undefined, null);

  const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  const localVideoTrack = await AgoraRTC.createCameraVideoTrack();

  await client.publish([localVideoTrack, localAudioTrack]);
  localVideoTrack.play(document.querySelector('.local-video'));
  localAudioTrack.play();

  async function enumPlaybackDevices() {
    document.querySelector('#local-speakers').innerHTML = '';

    //get all devices
    const devices = await AgoraRTC.getDevices();

    //filter audio output devices
    const audioOutputs = devices.filter(device => device.kind === 'audiooutput');

    audioOutputs.forEach((device, index) => {
      const option = document.createElement('option');
      option.value = device.deviceId;
      option.innerText = device.label;
      document.querySelector('#local-speakers').appendChild(option);
    });

  }

  await enumPlaybackDevices();

  //set playbackDevice
  document.querySelector('#local-speakers').addEventListener('change', e => {
    const deviceId = e.currentTarget.value;
    localAudioTrack.setPlaybackDevice(deviceId);
  });


  AgoraRTC.onPlaybackDeviceChanged = function (info) {
    alert(`${info.label} changed!`)
    enumPlaybackDevices();
  }
});