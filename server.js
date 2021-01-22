const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');
const formatMessage = require('./utils/message');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

// 初始化
const app = express();
const server = http.createServer(app);
const io = socketio(server);
// 端口号
const PORT = process.env.PORT || 5000;
// 机器人
const botName = '聊天小助手';
// 设置静态文件
app.use(express.static(path.join(__dirname, 'public')));
// 监听客户端是否触发连接
io.on('connection', (socket) => {
    // 监听加入房间事件
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        // 一对一发送消息
        socket.emit('message', formatMessage(botName, '欢迎加入聊天室'));
        // 广播消息(除了自己其他人都能收到)
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `欢迎${user.username}进入房间`));
        // 发送用户和房间信息给用户端
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });
    
    // 监听客户端消息
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
    
    // 监听客户端是否断开连接
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            // 所有人能收到消息(包括自己)
            io.to(user.room).emit('message', formatMessage(botName, `${user.username}已下线`));
            // 发送用户和房间信息给用户端
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

server.listen(PORT, () => {
    console.log(`正在监听端口${PORT}...`);
});