// import { io, Socket } from 'socket.io-client';

// let socket: Socket | null = null;

// export const initSocket = (): Socket => {

//     if (!socket) {
//         socket = io('http://localhost:3000', {
//             transports: ['websocket'],
//             auth: {
//                 userId: 'user-123' // ส่ง userId ไปตอน connect
//             }
//         });
//     }
//     return socket;
// };



import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (userId: string): Socket => {
    if (!socket) {
        socket = io('http://localhost:3000', {
            transports: ['websocket'],
            auth: {
                userId: userId
            }
        });
    }
    return socket;
};
