#!/bin/bash

echo "🚀 启动智伴AI陪伴机器人 - 老人端应用"
echo "========================================"
echo ""
echo "📦 正在安装依赖..."
npm install

echo ""
echo "🔧 启动开发服务器..."
npm run dev

echo ""
echo "✅ 应用已启动！"
echo "📱 请访问 http://localhost:5173 查看应用"
echo ""
echo "💡 提示："
echo "- 按 Ctrl+C 停止服务器"
echo "- 修改代码后会自动热更新"
echo "- 打开浏览器的开发者工具查看控制台日志"