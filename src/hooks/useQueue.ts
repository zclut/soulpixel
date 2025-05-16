import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
const PUBLIC_WS_QUEUE_URL = import.meta.env.PUBLIC_WS_QUEUE_URL || "ws://localhost:3000";

export const useQueue = (user_id: string | null) => {
    const [inQueue, setInQueue] = useState(false);
    const [position, setPosition] = useState<number | null>(null);
    const [connected, setConnected] = useState(0);
    const [queued, setQueued] = useState(0);
    const [reason, setReason] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [connectionFailed, setConnectionFailed] = useState(false);

    useEffect(() => {
        if (!user_id) return;

        socket = io(PUBLIC_WS_QUEUE_URL);

        socket.emit("join", user_id);

        socket.on("joined", ({ inQueue, position, reason }) => {
            if (reason) {
                setReason(reason);
                setIsReady(true);
                return;
            }

            setInQueue(inQueue);
            setPosition(position ?? null);
            setReason(null);
            setIsReady(true);
        });

        socket.on("user_count", ({ connected, queued }) => {
            setConnected(connected);
            setQueued(queued);
        });

        socket.on("connect_error", () => {
            setConnectionFailed(true);
        });

        socket.on("disconnect", () => {
            setConnectionFailed(true);
        });

        return () => {
            socket?.disconnect();
            socket = null;
        };
    }, [user_id]);

    return { inQueue, position, connected, queued, reason, isReady, connectionFailed };
};