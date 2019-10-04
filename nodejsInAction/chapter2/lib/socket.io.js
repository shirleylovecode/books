const socketio = require('socket.io');
let io;
let guestNumber = 1;
const nickNames = {};
const namesUsed = [];
const currentRoom = {};

function assignGuestName (socket, guestNumber, nickNames, namesUsed) {
    const name = `Guest${guestNumber}`;
    nickNames[socket.id] = name;
    socket.emit('nameResult', {
        success: true,
        name,
    })
    namesUsed.push(name);

    return guestNumber + 1;
}

function joinRoom(socket, room) {
    // 用户进入房间
    socket.join(room);
    //记录当前用户的房间
    currentRoom[socket.id] = room;
    //通知用户进入了房间
    socket.emit('joinResult', { room });
    //通知房间里的其他用户，有新的用户进入了房间
    socket.broadcast.to(room).emit('message', {
        text: `${nickNames[socket.id]} has joined ${room}.`,
    });

    //确定有哪些用户在这个房间
    const usersInRoom = io.sockets.in(room).clients((error, clients) => {
        if(clients.length > 1) {
            let usersInRoomSummary = `Users currently in ${room}: `;
            clients.forEach((id, index) => {
                if(id !== socket.id) {
                    if(index > 0) {
                        usersInRoomSummary += ', ';
                    }
                    usersInRoomSummary += nickNames[id];
                }
            });
            //通知用户房间里的用户列表
            socket.emit('message', {
                text: usersInRoomSummary,
            })
        }
    })


}

function handleMessageBroadcasting(socket, nickNames) {
    socket.on('message', ({ room, text }) => {
        socket.broadcast.to(room).emit('message', {
            text: `${nickNames[socket.id]}: ${text}`,
        })
    })

}

function handleNameChangeAttempts(socket, nickNames, namesUsed) {
    socket.on('nameResult', (name) => {
        if(name.startsWith('Guest')) {
            socket.emit('nameResult', {
                success: false,
                message: 'Name cannot start with Guest.',
            });
        } else {
            if(namesUsed.indexOf(name) == -1) {
                const previousName = nickNames[socket.id];
                nickNames[socket.id] = name;
                const previouseIndex = namesUsed.indexOf(previousName);
                namesUsed.push(name);
                delete namesUsed[previouseIndex];
                socket.emit('nameResult', {
                    success: true,
                    name,
                })

            } else {
                socket.emit('nameResult', {
                    success: false,
                    message: `${name} has been used.`,
                })
            }
        }
    })

}

function handleRoomJoining(socket) {
    socket.on('join', ({ newRoom }) => {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, newRoom);
    })
}

function handleClientDisconnection(socket, nickNames, namesUsed) {
    socket.on('disconnect', () => {
        const index = namesUsed.indexOf(nickNames[socket.id]);
        delete namesUsed[index];
        delete nickNames[socket.id];
    })

}

exports.listen = function (server) {
    io = socketio.listen(server);
    io.set('log level', 1);

    io.sockets.on('connection', (socket) => {
        //每次有用户连接上来的时候，给用户一个用户名
        guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);

        //然后将其放入Lobby聊天室中
        joinRoom(socket, 'Lobby');

        //处理用户发送的消息，用户名变更和聊天室的变更和创建
        handleMessageBroadcasting(socket, nickNames);

        handleNameChangeAttempts(socket, nickNames, namesUsed);

        handleRoomJoining(socket);

        // 用户发出请求时，向其提供已经被占用的聊天室的列表
        socket.on('rooms', function () {
            let validRooms = [];
            const rooms = io.sockets.adapter.rooms || {};
            for(let room in rooms) {
                if(!rooms[room].sockets.hasOwnProperty(room)) {
                    validRooms.push(room);
                }
            }
            socket.emit('rooms', validRooms);
        });

        // 处理用户断开的逻辑
        handleClientDisconnection(socket, nickNames, namesUsed);
    });


}