const socket = io.connect();

function divSystemContentElement (message) {
    return $('<div></div>').html(`<i>${message}</i>`)
}

function divEscapedContentElement (message) {
    return $('<div></div>').text(message);
}

function processUserInput(chatApp, socket) {
    const message = $('#send-message').val();
    let systemMessage;

    if(message.startsWith('/')) {
        systemMessage = chatApp.processCommand(message);
        if(systemMessage) {
            $('#messages').append(divSystemContentElement(systemMessage));
        }
    } else {
        chatApp.sendMessage($('#room').text(), message);
        $('#messages').append(divEscapedContentElement(message));
    }

    $('#send-message').val('');
}

$(document).ready(function() {
    const chatApp = new Chat(socket);

    socket.on('nameResult', ({ success, name, message: _message }) => {
        let message = '';
        if(success) {
            message = `You are now known as ${name}.`
        } else {
            message = _message;
        }

        $('#messages').append(divSystemContentElement(message));
    });

    socket.on('joinResult', ({ room }) => {
        $('#room').text(room);
        $('#messages').append(divSystemContentElement('Room Changed'));
    });

    socket.on('message', ({ text }) => {
        $('#messages').append(divEscapedContentElement(text));
    });

    socket.on('rooms', (rooms) => {
        $('#room-list').empty();

        rooms.forEach((room) => {
            $('#room-list').append(divEscapedContentElement(room));
        });

        $('#room-list div').click(function() {
            chatApp.processCommand(`/join ${$(this).text()}`);
            $('#send-message').focus();
        })
    });

    setInterval(() => {
        socket.emit('rooms');
    }, 1000);

    $('#send-message').focus();

    $('#send-form').submit(function(e) {
        e.preventDefault();
        processUserInput(chatApp, socket);
        return false;
    })
})