import { CALL_CONST, urlPath } from '@repo/lib';
import { Call_GeneralPayloadType, StartLocalStreamProps } from '@repo/types';
import { Button } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { Dispatch, RefObject, SetStateAction } from 'react';
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from 'react-icons/fa';
import { MdCallEnd } from 'react-icons/md';
import { useDispatch } from 'react-redux';

export type CallWindowPropsType = {
  phone: string;
  pcRef: RefObject<RTCPeerConnection | null>;
  remoteVideoRef: RefObject<HTMLVideoElement | null>;
  localVideoRef: RefObject<HTMLVideoElement | null>;
  localStreamRef: RefObject<MediaStream | null>;

  micOn: boolean;
  camOn: boolean;
  setMicOn: Dispatch<SetStateAction<boolean>>;
  setCamOn: Dispatch<SetStateAction<boolean>>;
  offerHandler: () => Promise<void> | void;
};

export const CallWindow = ({
  phone,
  pcRef,
  remoteVideoRef,
  localVideoRef,
  localStreamRef,
  micOn,
  camOn,
  setMicOn,
  setCamOn,
  offerHandler,
}: CallWindowPropsType) => {
  const { CALL_ENDED } = CALL_CONST;
  const dispatch = useDispatch();
  const route = useRouter();

  const startLocalStream = async ({
    enableAudio,
    enableVideo,
  }: StartLocalStreamProps) => {
    console.log('inside startLocalStream func ....');

    try {
      if (!localStreamRef.current) {
        localStreamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: enableAudio,
          video: enableVideo,
        });
        if (localVideoRef.current)
          localVideoRef.current.srcObject = localStreamRef.current;
      }
      return localStreamRef.current;
    } catch (err) {
      alert('Please allow mic/camera permissions in your browser.');
      console.log('Error in startLocalStream', err);
      return null;
    }
  };

  const handleMicClick = async () => {
    console.log('inside handleMicClick func ....');

    const pc = pcRef.current;
    if (!pc) return;

    if (!localStreamRef.current) {
      const stream = await startLocalStream({
        enableAudio: true,
        enableVideo: camOn,
      });
      if (stream) {
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        setMicOn(true);
        await offerHandler();
      }
      return;
    }

    const audioTracks = localStreamRef.current.getAudioTracks();
    if (audioTracks.length === 0) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const newAudioTrack = stream.getAudioTracks()[0];
        if (newAudioTrack) {
          localStreamRef.current.addTrack(newAudioTrack);
          pc.addTrack(newAudioTrack, localStreamRef.current);
        }
        setMicOn(true);
        await offerHandler();
      } catch (err) {
        alert('Please allow Microphone Permisssion !!!!');
        console.log('Error in handleMicClick', err);
      }
    } else {
      audioTracks.forEach((t) => (t.enabled = !micOn));
      setMicOn(!micOn);
    }
  };

  const handleCamClick = async () => {
    console.log('inside handleCamClick func ....');

    const pc = pcRef.current;

    if (!pc) return;

    if (!localStreamRef.current) {
      const stream = await startLocalStream({
        enableAudio: micOn,
        enableVideo: true,
      });
      if (stream) {
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        setCamOn(true);
        await offerHandler();
      }
      return;
    }

    const videoTracks = localStreamRef.current.getVideoTracks();
    if (videoTracks.length === 0) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const newVideoTrack = stream.getVideoTracks()[0];
        if (newVideoTrack) {
          localStreamRef.current.addTrack(newVideoTrack);
          pc.addTrack(newVideoTrack, localStreamRef.current);
        }
        setCamOn(true);
        await offerHandler();
      } catch (err) {
        alert('Please allow Camera Permisssion !!!!');
        console.log('Error in handleCamClick', err);
      }
    } else {
      videoTracks.forEach((t) => (t.enabled = !camOn));
      setCamOn(!camOn);
    }
  };

  const endCallHandler = () => {
    console.log('inside endCallHandler func ....');

    const endCallPayload: Call_GeneralPayloadType = {
      receiverPhoneNo: phone,
    };

    dispatch({
      type: CALL_ENDED,
      payload: endCallPayload,
    });
    route.push(urlPath.dashboard);
  };

  return (
    <div className=' h-full p-4 bg-primary-bg grid grid-cols-12 gap-x-4 '>
      <div className=' bg-tertiary-bg text-tertiary-text col-span-6 rounded-xl p-2 flex flex-col items-center justify-center gap-y-2  '>
        <div className='font-semibold text-xl text-tertiary-text'>You</div>
        <div className='w-full flex flex-col justify-center gap-y-4'>
          <video
            className='h-96  rounded-2xl object-cover'
            ref={localVideoRef}
            autoPlay
            muted
          />

          <div className='flex justify-center gap-x-2 '>
            <Button
              onClick={() => handleMicClick()}
              className='p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition'
            >
              {micOn ? (
                <FaMicrophone size={20} />
              ) : (
                <FaMicrophoneSlash size={20} />
              )}
            </Button>

            <Button
              onClick={() => handleCamClick()}
              className='p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition'
            >
              {camOn ? <FaVideo size={20} /> : <FaVideoSlash size={20} />}
            </Button>

            <Button
              onClick={() => endCallHandler()}
              className='p-3 rounded-full bg-red-600 hover:bg-red-700 transition'
            >
              <MdCallEnd size={20} />
            </Button>
          </div>
        </div>
      </div>
      <div className='bg-tertiary-bg text-tertiary-text col-span-6 rounded-xl p-2 flex flex-col items-center justify-center gap-y-2 '>
        <div className='font-semibold text-xl text-tertiary-text'>{phone}</div>
        <video
          className='w-full h-96 rounded-2xl object-cover'
          autoPlay
          playsInline
          ref={remoteVideoRef}
        />
      </div>
    </div>
  );
};

export default CallWindow;
