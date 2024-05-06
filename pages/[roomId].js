import Player from "@/components/Player";
import { useSocket } from "@/context/socket";
import useMediaStream from "@/hooks/useMediaStream";
import usePeer from "@/hooks/usePeer";
import usePlayer from "@/hooks/usePlayer";
import { useEffect } from "react";

const Room = () => {
    const socket = useSocket();
    const { peer, myId } = usePeer();
    // we are getting the stream, but we have to use it inside of a player to see our video.
    const { stream } = useMediaStream();
    const { players, setPlayers } = usePlayer();

    useEffect(() => {
        if (!socket || !peer || !stream) {
            return;
        }

        const handelUserConnected = (newUser) => {
            console.log("User connected in room with userId", newUser);

            // Here i am making a call and sending my stream (video)
            const call = peer.call(newUser, stream);

            call.on('stream', (incomingStream) => {
                console.log(`Incoming stream from ${newUser}`);

                setPlayers((prev) => ({
                    ...prev,
                    [newUser]: {
                        url: incomingStream,
                        muted: true,
                        playing: true
                    }
                }));
            })
        }

        socket.on('user-connected', handelUserConnected);

        return () => {
            socket.off('user-connected', handelUserConnected);
        }
    }, [peer, setPlayers, socket, stream]);

    useEffect(() => {
        if (!peer || !stream) {
            return;
        }

        // Here i am answering to the call.
        peer.on('call', (call) => {
            const { peer: callerId } = call;
            call.answer(stream);

            call.on('stream', (incomingStream) => {
                console.log(`Incoming stream from ${callerId}`);

                setPlayers((prev) => ({
                    ...prev,
                    [callerId]: {
                        url: incomingStream,
                        muted: false,
                        playing: true
                    }
                }));
            })
        })
    }, [peer, stream, setPlayers]);

    useEffect(() => {
        if (!stream || !myId) {
            return;
        }

        console.log(`Setting my stream ${myId}`);

        setPlayers((prev) => ({
            ...prev,
            [myId]: {
                url: stream,
                muted: true,
                playing: true
            }
        }));
    }, [myId, setPlayers, stream]);

    console.log(players);

    return (
        <div>
            {
                Object.keys(players).map((playerId) => {
                    const { url, muted, playing } = players[playerId];

                    return (
                        <Player
                            key={playerId}
                            url={url}
                            muted={muted}
                            playing={playing}
                        />
                    )
                })
            }
        </div>
    )
}

export default Room;
