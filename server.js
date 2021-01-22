const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');
const formatMessage = require('./utils/message');

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
    // 一对一发送消息
    socket.emit('message', formatMessage(botName, '欢迎加入聊天室'));
    
    // 广播消息(除了自己其他人都能收到)
    socket.broadcast.emit('message', '有人正在偷听');
    
    // 监听客户端消息
    socket.on('chatMessage', (msg) => {
        io.emit('message', msg);
    });
    
    // 监听客户端是否断开连接
    socket.on('disconnect', () => {
        // 所有人能收到消息(包括自己)
        io.emit('message', '某某某已下线');
    });
});

server.listen(PORT, () => {
    console.log(`正在监听端口${PORT}...`);
});