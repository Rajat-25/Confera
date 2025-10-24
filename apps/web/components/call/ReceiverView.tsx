'use client';
import { clearCallSliceState, RootState } from '@/store';
import { CALL_CONST, urlPath } from '@repo/lib';
import { Button } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { MdCallEnd } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

const ReceiverView = ({ phone }: { phone: string }) => {
  const { ADD_ICE_CANDIDATE, CREATE_ANSWER, CALL_ENDED } = CALL_CONST;
  const dispatch = useDispatch();
  const route = useRouter();

  const pcRef = useRef<RTCPeerConnection>(null);
  const localIceCandidates = useRef<RTCIceCandidate[]>([]);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const { remoteOfferState, iceCandidateState, callState } = useSelector(
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

    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];
      if (remoteVideoRef.current && remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };
  };

  const answerHandler = async () => {
    const pc = pcRef.current;
    if (!pc || !remoteOfferState) return;
    try {
      await pc.setRemoteDescription(remoteOfferState);


      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      dispatch({
        type: CREATE_ANSWER,
        payload: {
          sdp: pc.localDescription,
          receiver: phone,
        },
      });

    } catch (err) {
    }
  };

  const iceCandidateHandler = async () => {
    const pc = pcRef.current;
    if (!pc || !iceCandidateState) return;

    try {
      for (const candidate of iceCandidateState) {
        await pc.addIceCandidate(candidate);
      }
    } catch (err) {
  
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

    [remoteVideoRef].forEach((ref) => {
      if (ref.current?.srcObject) {
        const stream = ref.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        ref.current.srcObject = null;
      }
    });
  };

  useEffect(() => {
    if (!pcRef.current) initializeConnection();

    return () => {
      connectionCleanUp();
      dispatch(clearCallSliceState());
    };
  }, []);

  useEffect(() => {
    answerHandler();
  }, [remoteOfferState]);

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
        <div className='font-semibold text-xl text-tertiary-text'>You !!</div>

        <div className='flex justify-center gap-x-2 '>
          <Button
            onClick={() => endCallHandler()}
            className='p-3 rounded-full bg-red-600 hover:bg-red-700 transition'
          >
            <MdCallEnd size={20} />
          </Button>
        </div>
      </div>
      <div className='bg-tertiary-bg text-tertiary-text col-span-6 rounded-xl p-2 flex flex-col items-center justify-center gap-y-2 '>
        <div className='font-semibold text-xl text-tertiary-text'>
          {phone} !!
        </div>
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

export default ReceiverView;
