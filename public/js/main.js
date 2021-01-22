const socket = io();

// 获得从服务器发送的消息
socket.on('message', (msg) => {
    console.log(msg);
});
