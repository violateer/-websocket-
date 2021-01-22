const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

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
                <p class="meta">Summer<span>10:11pm</span></p>
                <p class="text">
                    ${msg}
                </p>
            </div>`;
    chatMessages.appendChild(div);
}
