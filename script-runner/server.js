const express = require('express');
const app = express();
const PORT = 3000; // 设置端口号

// 托管静态文件，假设 JSON 文件位于项目根目录下的 'public' 文件夹
app.use(express.static('public'));

// 创建一个路由来直接访问 JSON 文件
app.get('/data', (req, res) => {
  res.sendFile(__dirname + '/output.json'); // 确保路径正确
});

// 服务器开始监听指定端口
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
