const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// 依据url设置登录用户及登录的房间
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// 加入房间
socket.emit('joinRoom', { username, room });

// 获得从服务器发送的消息
socket.on('message', (msg) => {
    // 发送消息
    outputMessage(msg);
    // 将滚动条保持在底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// 监听消息提交submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // 获取提交的消息
    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage', msg);
    
    // 清空input输入框，获取焦点
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// outputMessage函数,输出消息到DOM节点
function outputMessage (msg) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<div class="message">
                <p class="meta">${msg.username}&nbsp;<span>${msg.time}</span></p>
                <p class="text">
                    ${msg.text}
                </p>
            </div>`;
    chatMessages.appendChild(div);
}
