const users = [];

// 用户加入聊天
function userJoin (id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
}

// 获取当前user
function getCurrentUser (id) {
    return users.find(user => user.id === id);
}

module.exports = {
    userJoin, getCurrentUser
};