'use client';
import { clearCallSliceState, RootState } from '@/store';
import { CALL_CONST, urlPath } from '@repo/lib';
import { StartLocalStreamProps } from '@repo/types';
import { Button } from '@repo/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from 'react-icons/fa';
import { MdCallEnd } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

const CallerView = ({ phone }: { phone: string }) => {
  const { ADD_ICE_CANDIDATE, CREATE_OFFER, CALL_ENDED } = CALL_CONST;
  const dispatch = useDispatch();
  const route = useRouter();

  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localIceCandidates = useRef<RTCIceCandidate[]>([]);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const { remoteAnswerState, iceCandidateState, callState } = useSelector(
    (state: RootState) => state.call_slice
  );

  const initializeConnection = () => {
    pcRef.current = new RTCPeerConnection();
    const pc = pcRef.current;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        localIceCandidates.current.push(event.candidate);
      }
    };

    pc.onnegotiationneeded = () => {
      offerHandler();
    };

    pc.onicegatheringstatechange = () => {
      if (pc.iceGatheringState === 'complete') {
        dispatch({
          type: ADD_ICE_CANDIDATE,
          payload: {
            candidates: localIceCandidates.current,
            receiver: phone,
          },
        });
        localIceCandidates.current = [];
      }
    };
  };

  const offerHandler = async () => {
    const pc = pcRef.current;
    if (!pc) return;

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      dispatch({
        type: CREATE_OFFER,
        payload: { sdp: pc.localDescription, receiver: phone },
      });

      console.log('offer \n', offer);
    } catch (err) {
      console.log('err in creating offer \n', err);
    }
  };

  const addRemoteAnswer = async () => {
    const pc = pcRef.current;
    if (!pc || !remoteAnswerState) return;

    try {
      await pc.setRemoteDescription(remoteAnswerState);
      console.log('remoteAnswer \n', remoteAnswerState);
    } catch (err) {
      console.log('err is here \n', err);
    }
  };

  const iceCandidateHandler = async () => {
    const pc = pcRef.current;
    if (!pc || !iceCandidateState || !pc.remoteDescription) return;
    console.log('icecandidate \n', iceCandidateState);

    try {
      for (const candidate of iceCandidateState) {
        await pc.addIceCandidate(candidate);
      }
    } catch (err) {
      console.log('err in adding ice candidate \n', err);
    }
  };

  const startLocalStream = async ({
    enableAudio,
    enableVideo,
  }: StartLocalStreamProps) => {
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
    }
  };

  const handleMicClick = async () => {
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
      }
      return;
    }
    const audioTracks = localStreamRef.current.getAudioTracks();
    if (audioTracks.length === 0) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        console.log('1');
        const newAudioTrack = stream.getAudioTracks()[0];
        if (newAudioTrack) {
          localStreamRef.current.addTrack(newAudioTrack);
          pc.addTrack(newAudioTrack, localStreamRef.current);
        }
        setMicOn(true);
      } catch (err) {
        alert('Please allow Microphone Permisssion !!!!');
      }
    } else {
      audioTracks.forEach((t) => (t.enabled = !micOn));
      setMicOn(!micOn);
    }
  };

  const handleCamClick = async () => {
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
      } catch (err) {
        alert('Please allow Camera Permisssion !!!!');
      }
    } else {
      videoTracks.forEach((t) => (t.enabled = !camOn));
      setCamOn(!camOn);
    }
  };

  const endCallHandler = () => {
    dispatch({
      type: CALL_ENDED,
      payload: {
        receiverPhoneNo: phone,
      },
    });
    route.push(urlPath.dashboard);
  };

  const connectionCleanUp = () => {
    if (pcRef.current) {
      pcRef.current.onicecandidate = null;
      pcRef.current.ontrack = null;
      pcRef.current.getSenders().forEach((sender) => sender.track?.stop());
      pcRef.current.close();
      pcRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      localStreamRef.current = null;
    }

    [localVideoRef].forEach((ref) => {
      if (ref.current?.srcObject) {
        const stream = ref.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        ref.current.srcObject = null;
      }
    });

    setMicOn(false);
    setCamOn(false);
  };

  useEffect(() => {
    if (!pcRef.current) initializeConnection();

    return () => {
      connectionCleanUp();
      dispatch(clearCallSliceState());
    };
  }, []);

  useEffect(() => {
    addRemoteAnswer();
  }, [remoteAnswerState]);

  useEffect(() => {
    iceCandidateHandler();
  }, [iceCandidateState]);

  useEffect(() => {
    if (callState === 'ended') {
      connectionCleanUp();
      dispatch(clearCallSliceState());
    }
  }, [callState]);

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
        {phone}
      </div>
    </div>
  );
};

export default CallerView;
