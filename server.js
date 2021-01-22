const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
// 设置静态文件
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`正在监听端口${PORT}...`);
});