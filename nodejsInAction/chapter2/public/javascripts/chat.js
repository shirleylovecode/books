function Chat (socket) {
    this.socket = socket;
}

Chat.prototype.sendMessage = function (room, text) {
    this.socket.emit('message', {
        room,
        text,
    });
};

Chat.prototype.joinRoom = function (room) {
    this.socket.emit('join', {
        newRoom: room,
    });
}

Chat.prototype.processCommand = function (command) {
    const words = command.split(' ');
    const commandWord = words[0].substring(1).toLowerCase();
    words.shift();
    let message = false;

    switch (commandWord) {
        case 'join': 
            const room = words.join(' ');
            this.joinRoom(room);
            break;
        case 'nick':
            const name = words.join(' ');
            this.socket.emit('nameResult', name);
            break;
        default:
            message = 'Unrecognized Command';
            break;
    }

    return message;

}