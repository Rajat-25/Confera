'use client';
import { clearCallSliceState, RootState } from '@/store';
import { CALL_CONST } from '@repo/lib';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CallWindow from './CallWindow';
import {
  CreateAnswerPayloadType,
  CreateOfferPayloadType,
  IceCandidatePayloadType,
} from '@repo/types';

const CallView = ({ phone }: { phone: string }) => {
  const { ADD_ICE_CANDIDATE, CREATE_OFFER, CREATE_ANSWER } = CALL_CONST;
  const { remoteOfferState, remoteAnswerState, iceCandidateState, callState } =
    useSelector((state: RootState) => state.call_slice);

  const dispatch = useDispatch();

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const localIceCandidates = useRef<RTCIceCandidate[]>([]);

  const makingOffer = useRef(false);
  const processingRemoteOffer = useRef(false);

  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);

  const initiateConnection = () => {
    console.log('inside initializeConnection  func ....');

    pcRef.current = new RTCPeerConnection();
    const pc = pcRef.current;

    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];
      if (remoteVideoRef.current && remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        localIceCandidates.current.push(event.candidate);
      }
    };

    pc.onicegatheringstatechange = () => {
      if (
        pc.iceGatheringState === 'complete' &&
        localIceCandidates.current.length
      ) {
        console.log('local iceCandidate gathering COMPLETED ....');

        const iceCandidatePayload: IceCandidatePayloadType = {
          candidates: localIceCandidates.current,
          receiver: phone,
        };

        dispatch({
          type: ADD_ICE_CANDIDATE,
          payload: iceCandidatePayload,
        });

        localIceCandidates.current = [];
      }
    };
  };

  const createAndSendOffer = async () => {
    console.log('inside offerHandler func ....');

    const pc = pcRef.current;
    if (!pc || makingOffer.current || pc.signalingState !== 'stable') return;

    try {
      makingOffer.current = true;
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const createOfferPayload: CreateOfferPayloadType = {
        sdp: pc.localDescription,
        receiver: phone,
      };

      dispatch({
        type: CREATE_OFFER,
        payload: createOfferPayload,
      });

      console.log('sending offer  ....');
    } catch (err) {
      console.log('Error in offerHandler ....', err);
    } finally {
      makingOffer.current = false;
    }
  };

  const remoteOfferHandler = async () => {
    console.log('inside remoteOfferHandler func ....');

    const pc = pcRef.current;
    if (!pc || !remoteOfferState) return;

    const offerCollision =
      makingOffer.current || pc.signalingState !== 'stable';

    if (offerCollision) {
      console.log('Offer collision detected, ignoring offer ....');
      return;
    }

    try {
      console.log('remoteOffer is here ....');

      processingRemoteOffer.current = true;
      await pc.setRemoteDescription(remoteOfferState);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      console.log('sending answer ....');

      const answerPayload: CreateAnswerPayloadType = {
        sdp: pc.localDescription,
        receiver: phone,
      };

      dispatch({
        type: CREATE_ANSWER,
        payload: answerPayload,
      });
    } catch (err) {
      console.log('Error in answerHandler ', err);
    } finally {
      processingRemoteOffer.current = false;
    }
  };

  const remoteAnswerHandler = async () => {
    console.log('inside remoteAnswerHandler func ....');

    const pc = pcRef.current;
    if (!pc || !remoteAnswerState) return;

    console.log('remoteAnswer is here ....');
    if (pc.currentRemoteDescription?.sdp === remoteAnswerState.sdp) return;

    try {
      await pc.setRemoteDescription(remoteAnswerState);
    } catch (err) {
      console.log('Error in remoteAnswerHandler ....', err);
    }
  };

  const iceCandidateHandler = async () => {
    console.log('inside iceCandidateHandler func ....');

    const pc = pcRef.current;
    if (!pc || !iceCandidateState || !pc.remoteDescription) {
      return;
    }

    console.log('remote iceCandidate is here ....');

    try {
      for (const candidate of iceCandidateState) {
        await pc.addIceCandidate(candidate);
      }
    } catch (err) {
      console.log('Error in iceCandidateHandler ....', err);
    }
  };

  const connectionCleanUp = () => {
    console.log('inside connectionCleanUp func ....');

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

    if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((t) => t.stop());
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current?.srcObject) {
      (remoteVideoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((t) => t.stop());
      remoteVideoRef.current.srcObject = null;
    }

    setMicOn(false);
    setCamOn(false);
  };

  useEffect(() => {
    let camPerm: PermissionStatus | null = null;
    let micPerm: PermissionStatus | null = null;

    const handlePermissionChange = () => {
      console.log('Permission change detected — setting reload flag');
      sessionStorage.setItem('permissionReload', 'true');
    };

    const setupPermissionListeners = async () => {
      try {
        camPerm = await navigator.permissions.query({
          name: 'camera' as PermissionName,
        });
        micPerm = await navigator.permissions.query({
          name: 'microphone' as PermissionName,
        });

        camPerm.onchange = handlePermissionChange;
        micPerm.onchange = handlePermissionChange;
      } catch (err) {
        console.log('Permissions API not supported', err);
      }
    };

    setupPermissionListeners();

   
    return () => {
      if (camPerm) camPerm.onchange = null;
      if (micPerm) micPerm.onchange = null;
    };
  }, []);

  useEffect(() => {
    console.log('initiateConnection effect running ...');
    const isPermissionReload = sessionStorage.getItem('permissionReload');
    if (isPermissionReload) {
      sessionStorage.removeItem('permissionReload'); 
    }

    if (!pcRef.current) {
      initiateConnection();
    }
    return () => {
      if (!isPermissionReload) {
        connectionCleanUp();
        dispatch(clearCallSliceState());
      } else {
        console.log('Skipping cleanup due to permission reload...');
      }
    };
  }, []);

  useEffect(() => {
    console.log('remoteAnswer effect running ....');

    remoteAnswerHandler();
  }, [remoteAnswerState]);

  useEffect(() => {
    console.log('answerhandler effect running ....');

    remoteOfferHandler();
  }, [remoteOfferState]);

  useEffect(() => {
    console.log('iceCandidate effect running ....');

    iceCandidateHandler();
  }, [iceCandidateState]);

  useEffect(() => {
    console.log('cleanUp effect running ....');

    if (callState === 'ended') {
      console.log('clean up Done...');

      connectionCleanUp();
      dispatch(clearCallSliceState());
    }
  }, [callState]);

  return (
    <CallWindow
      phone={phone}
      pcRef={pcRef}
      remoteVideoRef={remoteVideoRef}
      localVideoRef={localVideoRef}
      localStreamRef={localStreamRef}
      micOn={micOn}
      camOn={camOn}
      setMicOn={setMicOn}
      setCamOn={setCamOn}
      offerHandler={createAndSendOffer}
    />
  );
};

export default CallView;
