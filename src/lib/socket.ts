import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (userId: string): Socket => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;    

    if (!socket) {
        socket = io(`${baseUrl}`, {
            transports: ['websocket', 'polling'],
            auth: {
                userId: userId
            },
            timeout: 20000,
            forceNew: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on('connect', () => {
            console.log('WebSocket connected successfully');
        });

        socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
        });

        socket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason);
        });
    }
    return socket;
};
