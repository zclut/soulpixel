const io = require("socket.io")(3000, {
    cors: {
        origin: "*",
    },
});

const MAX_USERS = 1;
const connectedUsers = new Map();
const waitingQueue = [];

io.on("connection", (socket) => {
    socket.on("join", (user_id) => {
        if (connectedUsers.has(user_id) || waitingQueue.some((entry) => entry.user_id === user_id)) {
            socket.emit("joined", {
                inQueue: true,
                position: null,
                reason: "already_connected",
            });
            socket.disconnect(); 
            return;
        }

        if (connectedUsers.size < MAX_USERS) {
            connectedUsers.set(user_id, socket.id);
            socket.user_id = user_id;
            socket.join("realtime");

            socket.emit("joined", { inQueue: false });

            io.emit("user_count", {
                connected: connectedUsers.size,
                queued: waitingQueue.length,
            });
        } else {
            waitingQueue.push({ socket, user_id });
            socket.emit("joined", {
                inQueue: true,
                position: waitingQueue.length,
            });

            io.emit("user_count", {
                connected: connectedUsers.size,
                queued: waitingQueue.length,
            });
        }
        console.log(`Nueva conexión: ${socket.id}, conectados: ${connectedUsers.size}, en cola: ${waitingQueue.length}`);
    });

    socket.on("disconnect", () => {
        const user_id = socket.user_id;

        const queueIndex = waitingQueue.findIndex((entry) => entry.socket.id === socket.id);
        if (queueIndex !== -1) {
            waitingQueue.splice(queueIndex, 1);
        }

        if (user_id && connectedUsers.get(user_id) === socket.id) {
            connectedUsers.delete(user_id);

            if (waitingQueue.length > 0) {
                const next = waitingQueue.shift();
                connectedUsers.set(next.user_id, next.socket.id);
                next.socket.user_id = next.user_id;
                next.socket.join("realtime");

                next.socket.emit("joined", { inQueue: false });
            }
        }

        io.emit("user_count", {
            connected: connectedUsers.size,
            queued: waitingQueue.length,
        });
        console.log(`Desconexión: ${socket.id}, conectados: ${connectedUsers.size}, en cola: ${waitingQueue.length}`);
    });
});
