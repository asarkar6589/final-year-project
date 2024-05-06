import { useSocket } from "@/context/socket";
import { useRouter } from "next/router";

const { useState, useEffect, useRef } = require("react");

const usePeer = () => {
    const socket = useSocket();
    const roomId = useRouter().query.roomId;
    /*
    
        So whenever we join a peerjs server, we get a unique id which we have to keep a track of.

        So there is one problem with peerjs. There are some of the libraries which are mainly created to be used in the client side and peerjs is one of them. Now we know that nextjs renders everything in the server and servers donot have any web API (navigator), so for that case, we have to import the peerjs inside the useEffect(). if we import something inside the useEffect() hook, then that means we are doing the import on the client side.

        Peerjs is a library or we can say a server which is used to handel all the webrtc calls and requests. For that, we have to run a server and the command for that is "peerjs --port 3001"
    
    */
    const [peer, setPeer] = useState(null);
    const [myId, setMyId] = useState('');
    const isPeerSet = useRef(false);

    useEffect(() => {
        if (isPeerSet.current || !roomId || !socket) {
            return;
        }
        isPeerSet.current = true;

        // just a syntax to import a library inside useEffect() hook.
        (async function initPeer() {
            const myPeer = new (await import('peerjs')).default();
            setPeer(myPeer);

            myPeer.on('open', (id) => {
                console.log("Your Peer id is " + id);
                setMyId(id);
                socket?.emit('join-room', roomId, id);
            })
        })()
    }, [roomId, socket]);

    return {
        peer,
        myId
    }
}

export default usePeer;
