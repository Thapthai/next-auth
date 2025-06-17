
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (userId: string): Socket => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!socket) {
        socket = io(`${baseUrl}`, {
            transports: ['websocket'],
            auth: {
                userId: userId
            }
        });
    }
    return socket;
};
